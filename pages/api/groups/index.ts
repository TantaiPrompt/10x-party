import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { createGroup, getGroups } from "server/groups";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, limit } = req.body;

  const session = await getSession({ req });
  // console.log(session);
  try {
    switch (req.method) {
      case "POST":
        await createGroup(
          name,
          limit,
          session.user.email,
          res,
          session,
        );
        break;
      case "GET":
        await getGroups(req, res);
        break;
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      title: "Group creation failed",
      message: "We were unable to create your group",
    });
  }
}
