import { User } from "../models/UserModel.js";
import { Apierror } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import {type  AccessTokenPayload } from "../Types/types.js";
//verify is user exist or not
export const  verifyJWT = asynchandler(async(req,_res,next)=> {
 try {
   //get token
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") //header for mobile appllications
       if(!token){
           throw new Apierror(401,"Unauthorized request")
   
       };
       //verify token
     const decodingToken =   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload
   
     //extract user
    const user =  await User.findById(decodingToken?._id).select("-password -refreshToken") //this _id comes from db 
   
    if (!user) {
       throw new Apierror(401,"Invalid access Token")
       
    }
    req.user = user;
    next()
 } catch (error) {
    throw new Apierror(401, "Invalid access token")
    
 }



});