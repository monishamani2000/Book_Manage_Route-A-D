import express , {Request, Response, NextFunction } from "express";
const router = express.Router();
import { PrismaClient , User} from '@prisma/client';
const prisma = new PrismaClient();


router.get('/me', async (req : Request, res : Response, next : NextFunction) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: (req as any).User.id,
      },
      select: {
        name: true,
        email: true,
      },
    });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});



router.put('/me', async (req : Request, res : Response, next : NextFunction) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: (req as any).User.id,
      },
      data: {
        name: (req as any).body.name,
        email: (req as any).body.email,
      },
      select: {
        name: true,
        email: true,
      },
    });
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;


// user get and update page