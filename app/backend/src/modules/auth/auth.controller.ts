import { Controller, Get, UseGuards, Res } from "@nestjs/common";
import type { Response } from 'express';
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { UserDocument } from "../user/schemas/user.schema";
import { Public } from "src/common/decorators/public.decorator";

@Controller('auth')
export class AuthController {
     constructor(private readonly authService: AuthService) {}

     @Public()
     @UseGuards(GoogleAuthGuard)
     @Get('google')
     googleAuth() {}

     @Public()
     @UseGuards(GoogleAuthGuard)
     @Get('google/callback')
     googleAuthRedirect(@CurrentUser() user: UserDocument, @Res() res: Response) {
          this.authService.login(user, res);
          res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:5173');
     }

     @Public()
     @Get('logout')
     logout(@Res() res: Response) {
          this.authService.logout(res);
          res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/login`);
     }
}