import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import {AppError} from "../utils/AppError";
import {z} from "zod";

class ProfileController {
    async updateAvatar(req: Request, res: Response) {

        const userId = req.user?.id;


        if(!userId) {
            throw new AppError("Usuário nao encontrado.", 404)
        }

        const avatarUrl = req.file?.filename



        if(!avatarUrl) {
            throw new AppError("Imagem nao encontrada.", 404)
        }

        console.log(req.file)


        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user) {
            throw new AppError("Usuário nao encontrado.", 404)
        }

        const updatedUser =await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarUrl
            }
        })

        console.log(req.file)

        const {password, ...userWithoutPassword} = updatedUser

        return res.json(userWithoutPassword)
    }

    async show(req: Request, res: Response) {
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError(
      "Usuário não encontrado.",
      404
    );
  }

  return res.json(user);
    }

    async update(req: Request, res: Response) {
  const userId = req.user?.id;

  const bodySchema = z.object({
    name: z.string().min(3),
  });

  const { name } =
    bodySchema.parse(req.body);

  const user =
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    });

  const { password, ...userData } =
    user;

  return res.json(userData);
}

}

export {ProfileController}