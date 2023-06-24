import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from '../error/createerror';

import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(
      createError({
        message: 'Name, Email & password are required',
        statusCode: 400,
      })
    );
  }

  try {
    const existUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (existUser) {
      return res.status(400).send({ message: "You are already an existing user" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.status(201).send({ message: "User has been added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email || !req.body.password) {
    return next(
      createError({
        message: 'Email and password are required',
        statusCode: 400,
      })
    );
  }

  try {
    const existUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        name: true,
        password: true,
      },
    });

    if (!existUser) {
      return res.status(400).send({ message: "You are not a registered user. Please sign up to register." });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, existUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Incorrect password" });
    }

    const payload = {
      id: existUser.id,
      name: existUser.name,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: "1d" });
    res.send(token);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
