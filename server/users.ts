import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";
import { logger } from "@lib/logger";
import { omit } from "lodash";
import { hashPassword } from "./lib/utils";

// POST /api/user/signup
export async function signup(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  try {
    await prisma.user.create({
      data: {
        ...req.body,
        password: hashPassword(req.body.password),
      },
    });
    res.status(200).json({
      status: "success",
      title: "Account created",
      message: "We've created your account for you",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: "error",
      title: "Account creation failed",
      message: "We were unable to create your account",
    });
  }
}

// POST /api/user
export async function validateCredential(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { email: req.body.username },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });
  if (user && user.password == hashPassword(req.body.password)) {
    logger.debug("password correct");
    return res.json(omit(user, "password"));
  } else {
    logger.debug("incorrect credentials");
    return res.status(400).end("Invalid credentials");
  }
}

// GET /api/user/:id
export async function getUserData(
  email: string,
  res: NextApiResponse,
) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      email: true,
    },
    // include: { id: true, name: true, email: true, image: true },
  });
  return res.status(200).json(user);
}

// GET /api/user/:id
export async function updateUserData(
  email: string,
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const user = await prisma.user.update({
    where: { id: email },
    data: { ...req.body },
  });
  return res.status(200).json(user);
}

// DELETE /api/user/:id
export async function deleteUserData(
  email: string,
  res: NextApiResponse,
): Promise<any> {
  const user = await prisma.user.delete({
    where: { email: email },
  });
  return res.status(200).json(user);
}
