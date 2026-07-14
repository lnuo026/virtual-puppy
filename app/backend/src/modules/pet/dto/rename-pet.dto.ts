import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class RenamePetDto {
     @IsString()
     @IsNotEmpty()
     @MaxLength(30, )
     name!: string;
}


