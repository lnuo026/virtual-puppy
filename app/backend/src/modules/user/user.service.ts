import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument} from "./schemas/user.schema";

@Injectable()
export class UserService{
     constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

     findOrCreate(profile: {
           googleId: string; 
           email: string; 
           name: string; 
           picture?: string 
          }):Promise<UserDocument> {
               return this.userModel.findOneAndUpdate({
                    googleId: profile.googleId
               },{
                    $setOnInsert: profile
               },{
                    upsert: true,
                    new: true
               }    
          )
          .exec()
          }

          findById(id: string): Promise<UserDocument | null> {
               return this.userModel.findById(id).exec();
          }

}