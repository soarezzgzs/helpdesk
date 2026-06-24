import {Request, Response, NextFunction} from "express"
import {AppError} from "../utils/AppError"

function verifyAuthorization(role: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !role.includes(req.user.role)){
            throw new AppError("Unauthorized.", 401)
        }

        return next()
    }
}

export {verifyAuthorization}