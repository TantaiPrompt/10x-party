import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { leaveGroup } from "server/groups";

// DELETE /api/post/:id
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const groupId = req.query.id;
  const session = await getSession({ req });
  try {
    if (session) {
      switch (req.method) {
        case "POST":
          await leaveGroup(
            session.user.email,
            groupId.toString(),
            res,
          );
          break;
        default:
          throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
          );
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
