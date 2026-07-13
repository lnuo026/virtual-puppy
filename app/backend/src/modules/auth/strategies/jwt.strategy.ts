import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from 'express';
import { JWT_STRATEGY } from "../../../common/constants/auth.constants";
import { UserService } from "src/modules/user/user.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY){
     constructor(
          config: ConfigService,
          private readonly userService: UserService
     ){
          super({
               jwtFromRequest: ExtractJwt.fromExtractors([
                    (req: Request) => (req?.cookies as Record<string, string> | undefined) ?.['access_token'] ?? null,
               ]),
               secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
          });
     }
     async validate(payload: { userId: string}){
          return this.userService.findById(payload.userId);
     }
}