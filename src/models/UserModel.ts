//MongoDB stores user data, like all other data records, as BSON documents within collections.binary json mongo automaticaly add id when user save
import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken" //jwt are bearer token 
import bcrypt from "bcryptjs";


const userSchema = new Schema(
    {

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true //optimized for searching field,optimize searching 

    },
    email: {
         type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullname: {
         type: String,
        required: true,
        lowercase: true,
        trim: true,
        index:true,
    },
    avatar: {
        type: String, //cloudary url
        required: true
    },
    coverImage: {
        type:String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },

    ],
    password: {
        type:String,
        required: [true,'password is required'],
    },
    refreshToken: {
        type: String,
    }


},

{
    timestamps: true
}
)

userSchema.pre("save",  async function(next):Promise<void>{
    if(!this.isModified("password")) return next(); //1️⃣ If the password is NOT modified skip hashing
    this.password = await bcrypt.hash(this.password, 10)
    next();
});
userSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean>{
    return await  bcrypt.compare(password,this.password)

};

userSchema.methods.generateAccessToken = function():string{
   return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
            
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY!

        } as jwt.SignOptions

    )
}
userSchema.methods.generateRefreshToken = function():string{ //✔ Why refresh token does NOT contain email/username?
//Because //its only job is to re-authenticate the user and issue new access tokens.
      return  jwt.sign(
        {
            _id: this._id,
         
            
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY!

        } as jwt.SignOptions

    )
}






//in monggggggggo db User is saved in plural and smallCase eg users
export const User =  mongoose.model("User",userSchema)