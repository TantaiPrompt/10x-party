import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";
import { Session } from "next-auth";

// POST /api/group
export const createGroup = async (
  name: string,
  limit: number,
  key: string,
  res: NextApiResponse,
  session: Session,
): Promise<any> => {
  if (!session) {
    return res.status(401).end("Unauthorized");
  }
  if (limit < 2) {
    return res.status(400).send({
      message: "Group limit must be greater than or equal to 2",
    });
  }

  if (!name) {
    return res
      .status(400)
      .send({ message: "Group name must be provided" });
  }

  const groupRes = await prisma.group.create({
    data: {
      name: name,
      master: { connect: { email: key } },
      membersLimit: limit,
    },
  });

  await prisma.groupMembers.create({
    data: {
      group: { connect: { id: groupRes.id } },
      members: { connect: { email: key } },
    },
  });
  return res.status(200).json({
    status: "success",
    title: "Party created",
    message: "Let's get this party started!",
  });
};

// POST /api/group/:id
export const joinGroup = async (
  key: string,
  groupId: string,
  res: NextApiResponse,
): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email: key },
  });
  const groupMembers = await prisma.groupMembers.findFirst({
    where: { groupId: Number(groupId) },
    include: { members: true, group: true },
  });

  if (groupMembers.members.length > groupMembers.group.membersLimit) {
    return res.status(400).send({ message: "Group is full" });
  }
  const checkJoined: boolean = groupMembers.members.some(
    (member) => member.id === user.id,
  );
  if (user.id === groupMembers.group.masterId || checkJoined) {
    return res.status(400).send({ message: "you have joined" });
  }
  ///connect is a parameter to push anoter user to the group
  ///disconnect is a parameter to remove anoter user to the group
  await prisma.groupMembers.update({
    where: { id: groupMembers.id },
    data: {
      members: { connect: { id: user.id } },
    },
  });
  return res.status(200).send({ message: "Joined" });
};

//get all groups by paginate
//GET /api/groups?page={index}
export const getGroups = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const page = Number(req.query.page);
  const totalPage = 20;

  if (page) {
    const groupsCount = await prisma.group.count();

    if (page < 1 || page > Math.ceil(groupsCount / totalPage)) {
      return res.status(400).send({ message: "Page not found" });
    }
    const groups = await prisma.groupMembers.findMany({
      orderBy: {
        id: "desc",
      },
      skip: page === 1 ? 0 : (page - 1) * totalPage,
      take: totalPage,
      include: {
        group: {
          include: {
            master: { select: { name: true } },
          },
        },
        members: { select: { name: true, id: true } },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    const body = {
      groups: groups,
      totalGroup: groupsCount,
      totalPage: Math.ceil(groupsCount / totalPage),
    };
    return res.status(200).json(body);
  } else {
    return res
      .status(400)
      .send({ message: "Invalid query parameter" });
  }
};

export const leaveGroup = async (
  key: string,
  groupId: string,
  res: NextApiResponse,
): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { email: key },
  });

  const groupMembers = await prisma.groupMembers.findFirst({
    where: {
      groupId: Number(groupId),
    },
    include: {
      members: true,
      group: true,
    },
  });

  const checkJoined: boolean = groupMembers.members.some(
    (member) => member.id === user.id,
  );

  if (checkJoined) {
    if (groupMembers.members.length === 1) {
      await prisma.groupMembers.delete({
        where: { id: groupMembers.id },
      });
      await prisma.group.delete({
        where: { id: groupMembers.group.id },
      });
      return res.status(200).send({ message: "Group deleted" });
    } else {
      await prisma.groupMembers.update({
        where: { id: groupMembers.id },
        data: {
          members: { disconnect: { id: user.id } },
        },
      });
      return res.status(200).send({ message: "Left the party" });
    }
  } else {
    return res
      .status(400)
      .send({ message: "You are not in the party" });
  }
};
