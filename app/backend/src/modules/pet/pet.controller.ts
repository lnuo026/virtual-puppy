import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from "@nestjs/common";
import { PetService } from "./pet.service";
import { RenamePetDto } from "./dto/rename-pet.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { UserDocument } from "../user/schemas/user.schema";
import { dot } from "node:test/reporters";

@Controller('pet')
export class PetController {
     constructor(private readonly petService: PetService) {}

     @Get()
     async getPackedSettings(@CurrentUser() user: UserDocument) {
          return this.petService.getOrCreatePet(user._id.toString());
     }

     @Post('feed')
     feed(@CurrentUser() user: UserDocument) {
          return this.petService.feed(user._id.toString());
     }

     @Post('play')
     play(@CurrentUser() user: UserDocument) {
          return this.petService.play(user._id.toString());
     }

     @Post('sleep')
     sleep(@CurrentUser() user: UserDocument) {
          return this.petService.sleep(user._id.toString());
     }

     @Post('bath')
     bath(@CurrentUser() user: UserDocument) {
          return this.petService.bath(user._id.toString());
     }

     @Patch('rename')
     rename(@CurrentUser() user: UserDocument, @Body() dto: RenamePetDto) {
          return this.petService.rename(user._id.toString(), dto.name);
     }
}