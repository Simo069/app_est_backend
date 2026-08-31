import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFiliereDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsNotEmpty()
  niveauId: string;
}
