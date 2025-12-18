import type { JwtPayload } from "jsonwebtoken";

export type  Multerfile = {
    avatar:Express.Multer.File[];
    coverImage?:Express.Multer.File[];

};
export interface AccessTokenPayload extends JwtPayload {
    _id:string
}

