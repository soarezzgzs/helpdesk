import {Router} from "express"
import multer from "multer"

import {ProfileController} from "../controllers/profile.controller"
import {uploadConfig} from "../configs/multer"

const profileRoutes = Router()

const profileController = new ProfileController()

const upload = multer(uploadConfig)

profileRoutes.patch("/avatar", upload.single("avatar"), profileController.updateAvatar)
profileRoutes.get("/", profileController.show)
profileRoutes.patch("/", profileController.update)

export {profileRoutes}