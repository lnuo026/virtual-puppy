import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { GOOGLE_STRATEGY } from "../../../common/constants/auth.constants";
import { ConfigService } from "@nestjs/config";
import { UserService } from "src/modules/user/user.service";
import { GoogleUser } from "../types/google-user.type";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, GOOGLE_STRATEGY){
     constructor(
          private readonly config: ConfigService,
          private readonly userService: UserService
     ){
          super({
               clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
               clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
               callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
               scope: ['email', 'profile'],
          });
     }

     async validate(
          _accessToken: string,
          _refreshToken: string,
          profile: { id: string; emails: { value: string }[]; displayName: string; photos: { value: string }[] },
          done: VerifyCallback
     ){
          const googleUser: GoogleUser = {
               googleId: profile.id,
               email: profile.emails[0].value,
               name: profile.displayName,
               picture: profile.photos?.[0]?.value,
          };

          const user = await this.userService.findOrCreate(googleUser);
          done(null, user);
     }
     
}
     