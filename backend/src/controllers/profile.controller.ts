import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import {AppError} from "../utils/AppError";

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

        const {password, ...userWithoutPassword} = updatedUser

        return res.json(userWithoutPassword)
    }
}

export {ProfileController}