import { Controller, Get} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { UserDocument } from './schemas/user.schema';

@Controller('users')
export class UserController {
     @Get('profile')
     getProfile(@CurrentUser() user: UserDocument) {
          return { id: user._id, email: user.email, name: user.name, picture: user.picture };
     }
}
