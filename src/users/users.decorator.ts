/* eslint-disable prettier/prettier */
import {SetMetadata} from '@nestjs/common';


export const ROLES_KEY = 'roles';
export enum Role{
    ADMIN = 'admin',
    USER = 'user',
    DELEGATE = 'DELEGATE'
}

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


export const Userapp = (...args: string[]) => SetMetadata('userapp', args);
