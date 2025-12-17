import { Apierror } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/UserModel.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { type Multerfile } from "../Types/types.js";


const registerUser = asynchandler( async (req,res)=> {
    //get users details for fronted,
    //validation....not empty
    //check if user already exist,username or email
    //check for images,check for avatar
    //upload them to cloudniary,avatar sshoud upload howa he
    //create user object-create entry in db
    //remove password and refresh token field from response 
    //check for user creation
    //return res

    const {email,username,fullname,password} = req.body

    console.log("email : ",email);

    if (
        [fullname,email,username,password].some((field)=>field?.trim() === "" )
    ) {
        throw new Apierror(400,"all fields are required ")
        
    };

    //check existed User
   const existUser = await User.findOne({
        $or: [{username},{email}]
    });

    if(existUser){
        throw new Apierror(400,"user with email or username already existed")
    };

    //local multer path
    const files = req.files as Multerfile
  
const avatarlocalpath = files?.avatar?.[0]?.path;
const coverImagelocalpath = files?.coverImage?.[0]?.path ?? null;

    // let coverImagelocalpath;
    // if (files &&  Array.isArray(files.coverImage) && files.coverImage.length > 0) {
    //     coverImagelocalpath = files.coverImage[0]!.path
        
    // }

    if(!avatarlocalpath){
        throw new Apierror(400,"Avatar file is required")
    }

    //upload cloudddddddddinary



    const avatar = await uploadCloudinary(avatarlocalpath)
    const coverImage =  coverImagelocalpath ? await uploadCloudinary(coverImagelocalpath) : null;

    if(!avatar){
                throw new Apierror(400,"Avatar file is required")

    }
    //create user object-create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    //remove password(bin) or refreshtoekn user ko ni dena
    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createUser){
        throw new Apierror(500,"Something wrong while register User")
    };

    //return res
    return res.status(201).json(
        new Apiresponse(200,createUser,"User register successfully")
    )






    


    


   

});

export {registerUser}