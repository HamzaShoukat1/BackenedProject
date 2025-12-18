import { User } from "../models/UserModel.js";
import { Apierror } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import {type  AccessTokenPayload } from "../Types/types.js";
export const  verifyJWT = asynchandler(async(req,_res,next)=> {

 try {
       const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
       if(!token){
           throw new Apierror(401,"Unauthorized request")
   
       };
     const decodingToken =   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload
   
    const user =  await User.findById(decodingToken?._id).select("-password -refreshToken")
   
    if (!user) {
       //todo didcuss abount fronted in next video
       throw new Apierror(401,"Invalid access Token")
       
    }
    req.user = user;
    next()
 } catch (error) {
    throw new Apierror(401, "Invalid access token")
    
 }



});