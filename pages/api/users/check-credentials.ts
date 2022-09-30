import type { NextApiRequest, NextApiResponse } from "next";
import { validateCredential } from "server/users";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "POST":
        await validateCredential(req, res);
        break;
      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
