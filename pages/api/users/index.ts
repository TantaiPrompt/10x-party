import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import {
  getUserData,
  updateUserData,
  deleteUserData,
} from "server/users";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ message: "Bad Request" });
  }
  const session = await getSession({ req });
  try {
    if (session && session.user.email === email) {
      switch (req.method) {
        case "GET":
          await getUserData(email.toString(), res);
          break;
        case "PUT":
          await updateUserData(email.toString(), req, res);
          break;
        case "DELETE":
          await deleteUserData(email.toString(), res);
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
