/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateModulesDto } from './create-modules.dto';



export class UpdateModulesDto extends PartialType(
  CreateModulesDto,
) {}