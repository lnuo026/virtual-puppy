import { Module } from "@nestjs/common";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { PassportModule } from "@nestjs/passport";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "../user/user.module";
import { GoogleStrategy } from "./strategies/google.strategy";

import type{ StringValue } from "ms";
import { AuthController } from "./auth.controller";

@Module({
     imports: [
          UserModule,
          PassportModule,
          JwtModule.registerAsync({
               imports: [ConfigModule],
               inject: [ConfigService],
               useFactory: (config: ConfigService) => ({
                    secret: config.getOrThrow<string>('JWT_SECRET'),
                    signOptions: {
                         expiresIn: config.get<string>('JWT_EXPIRES_IN') as StringValue },                    
               }),
          }),
     ],
     providers: [AuthService, JwtStrategy, GoogleStrategy, JwtGuard],
     controllers: [AuthController],
})

export class AuthModule {}