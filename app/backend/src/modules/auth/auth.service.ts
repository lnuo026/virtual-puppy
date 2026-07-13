import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import  type{ Response } from "express";
import { UserDocument } from "../user/schemas/user.schema";

@Injectable()
export class AuthService {
     constructor(private readonly jwtService: JwtService) {}

     login(user: UserDocument, res: Response) {
          const token = this.jwtService.sign({
               userId: user._id.toString(),
          });
          res.cookie('access_token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: 'none',
               maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
     }

     logout(res: Response) {
          res.clearCookie('access_token');
     }
}

     
