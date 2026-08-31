/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    IsInt,
    IsNotEmpty,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';


export class CreateSemestreDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    order: number;

    @IsUUID()
    @IsNotEmpty()
    filiereId: string;
}
