import { Router } from "express";
import { loginUser, logOutUser, registerUser,refreshAccessTokens } from "../controllers/User.Controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()
router.route("/register").post(
      upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1     

        },

    ]),registerUser);
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(
    verifyJWT, //auth middleware me next is lie likha tha taake
               //veriftJWT jb run hooga osske baad aagay nikal jaana or
                //logOutUser run krna

    logOutUser,
)
router.route("/refresh-token").post(refreshAccessTokens)



export default router