import { Apierror } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/UserModel.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { type Multerfile } from "../Types/types.js";
import jwt from "jsonwebtoken"
import { type AccessTokenPayload } from "../Types/types.js";

const generateAcessandRefreshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken,
            //store refreshtoken in db
            await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
        


    } catch (error) {
        throw new Apierror(500, "Something went wrong while generating access and refresh tokens")


    }
};


const registerUser = asynchandler(async (req, res) => {
    //get users details for fronted,
    //validation....not empty
    //check if user already exist,username or email
    //check for images,check for avatar
    //upload them to cloudniary,avatar sshoud upload howa he
    //create user object-create entry in db
    //remove password and refresh token field from response 
    //check for user creation
    //return res

    const { email, username, fullname, password } = req.body

    console.log("email : ", email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new Apierror(400, "all fields are required ")

    };

    //check existed User
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existUser) {
        throw new Apierror(400, "user with email or username already existed")

    };
    //local multer path
    const files = req.files as Multerfile

    const avatarlocalpath = files?.avatar?.[0]?.path;
    const coverImagelocalpath = files?.coverImage?.[0]?.path ?? null;

    // let coverImagelocalpath;
    // if (files &&  Array.isArray(files.coverImage) && files.coverImage.length > 0) {
    //     coverImagelocalpath = files.coverImage[0]!.path

    // }

    if (!avatarlocalpath) {
        throw new Apierror(400, "Avatar file is required")
    }

    //upload cloudddddddddinary



    const avatar = await uploadCloudinary(avatarlocalpath)
    const coverImage = coverImagelocalpath ? await uploadCloudinary(coverImagelocalpath) : null;

    if (!avatar) {
        throw new Apierror(400, "Avatar file is required")

    }
    //create user object-create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    //remove password(bin) or refreshtoekn user ko ni dena
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createUser) {
        throw new Apierror(500, "Something wrong while register User")
    };

    //return res
    return res.status(201).json(
        new Apiresponse(200, createUser, "User register successfully")
    )














});

const loginUser = asynchandler(async (req, res) => {
    // todos for login 

    //get data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookies

    const { email, username, password } = req.body
    if (!(username || email)) {
        throw new Apierror(400, "username or password is required")

    };
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new Apierror(400, "user does not exist")

    };

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid user credentials")

    };
    const { accessToken, refreshToken } = await generateAcessandRefreshTokens(user._id)

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    };
    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new Apiresponse(
                200,
                {
                    user: logedInUser, accessToken, refreshToken

                },
                "user logged In successfully"
            )
        )






});

const logOutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set: {
                refreshToken: undefined

            }
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, {}, "User logged Out"))




});

const refreshAccessTokens = asynchandler(async (req, res) => {
    //acccess tokens
    const incomingRefreshTokenfromdb = req.cookies.refreshToken || req.body.refreshToken //body for mobile

    if (!incomingRefreshTokenfromdb) {
        throw new Apierror(401, "Unauthorized request")

    }
    //now verify tokens 
    try {
        const decodedToken = jwt.verify(
            incomingRefreshTokenfromdb,
            process.env.REFRESH_TOKEN_SECRET!
        ) as AccessTokenPayload;
        //find user who have token
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new Apierror(401, "Invalid refresh token")

        };
        if (incomingRefreshTokenfromdb !== user?.refreshToken) {
            throw new Apierror(401, "Refresh tokken is expired or used")


        };

        const options = {
            httpOnly: true,
            secure: true
        }

        //generate new tokens
        const { accessToken, newrefreshToken }: any = await generateAcessandRefreshTokens(user._id)
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new Apiresponse(
                    200,
                    {
                        accessToken, refreshToken: newrefreshToken
                    },
                    "Aceess token refreshed"
                )
            )

    } catch (error) {
        throw new Apierror(401, "Invalid refresh token")

    }





})


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessTokens
}
