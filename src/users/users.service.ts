/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const SAFE_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  filiereId: true,
  delegateOfFiliereId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async create(user: CreateUserDto) {
    const existing = await this.databaseService.user.findUnique({
      where: { email: user.email },
    });
    if (existing) {
      throw new ConflictException('Un compte existe deja avec cet email');
    }

    if (user.role === 'DELEGATE' && !user.delegateOfFiliereId) {
      throw new BadRequestException(
        'delegateOfFiliereId requis pour créer un DELEGATE',
      );
    }
    if (user.role !== 'DELEGATE' && user.delegateOfFiliereId) {
      throw new BadRequestException(
        'delegateOfFiliereId ne peut être défini que pour un DELEGATE',
      );
    }
    // Si on crée un DELEGATE, vérifie que la filière n'a pas déjà un délégué
    if (user.delegateOfFiliereId) {
      await this.assertFiliereHasNoDelegate(user.delegateOfFiliereId);
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return this.databaseService.user.create({
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role ?? 'STUDENT',
        filiereId: user.delegateOfFiliereId ?? user.filiereId,
        password: hashedPassword,
      },
      select: SAFE_SELECT,
    });
  }

  // Promouvoir un user existant en délégué
  async assignDelegate(userId: string, filiereId: string) {
    const user = await this.findOne(userId);

    const filiere = await this.databaseService.filiere.findUnique({
      where: { id: filiereId },
    });

    if (!filiere) {
      throw new NotFoundException('Filiere intouvable');
    }
    await this.assertFiliereHasNoDelegate(filiereId, userId);

    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        role: 'DELEGATE',
        filiereId: filiereId,
        delegateOfFiliereId: filiereId,
      },
      select: SAFE_SELECT,
    });
  }

  // Révoquer un délégué → repasse STUDENT
  async revokeDelegate(userId: string) {
    const user = await this.findOne(userId);

    if (user.role !== 'DELEGATE') {
      throw new BadRequestException("Cet utilisateur n'est pas délégué");
    }

    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        role: 'STUDENT',
        delegateOfFiliereId: null,
      },
      select: SAFE_SELECT,
    });
  }

  private async assertFiliereHasNoDelegate(
    filiereId: string,
    excludedUserId?: string,
  ) {
    const existingDelegate = await this.databaseService.user.findFirst({
      where: {
        delegateOfFiliereId: filiereId,
        ...(excludedUserId ? { NOT: { id: excludedUserId } } : {}),
      },
    });

    if (existingDelegate) {
      throw new ConflictException(
        `Cette filière a déjà un délégué (${existingDelegate.firstName} ${existingDelegate.lastName}). Révoquez-le avant d'en assigner un nouveau.`,
      );
    }
  }

  async findAll() {
    return this.databaseService.user.findMany({ select: SAFE_SELECT });
  }

  async findAllByFiliere(filiereId: string) {
    return this.databaseService.user.findMany({
      where: { filiereId },
      select: SAFE_SELECT,
    });
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      select: SAFE_SELECT,
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserdto: UpdateUserDto) {
    await this.findOne(id);
    return this.databaseService.user.update({
      where: { id },
      data: {
        ...updateUserdto ,
      },
      select: SAFE_SELECT,
    });
  }

  async remove(id: string) {
    (await this, this.findOne(id));
    await this.databaseService.user.delete({ where: { id } });
    return { message: 'Utilisateur supprimé' };
  }

  async changeRole(id: string, role: 'STUDENT' | 'DELEGATE' | 'ADMIN') {
    await this.findOne(id);
    return this.databaseService.user.update({
      where: { id },
      data: { role },
      select: SAFE_SELECT,
    });
  }
}
