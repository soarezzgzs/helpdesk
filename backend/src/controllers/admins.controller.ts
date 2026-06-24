import {Request, Response} from "express";
import { prisma } from "../database/prisma";
import { z } from "zod";
import {AppError} from "../utils/AppError";

class AdminsController {
    async index(req: Request, res: Response){
        const admins = await prisma.user.findMany({
            where: {
                role: "admin"
            }
        })

        if(admins.length === 0) {
            throw new AppError("Nenhum admin cadastrado.", 404)
        }

        const adminsWithoutPassword = admins.map(admin => {
            return {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        })

        return res.json(adminsWithoutPassword)
    }
}

export {AdminsController}