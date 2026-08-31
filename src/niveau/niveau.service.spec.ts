import { Test, TestingModule } from '@nestjs/testing';
import { NiveauService } from './niveau.service';
import { DatabaseService } from '../database/database.service';

describe('NiveauService', () => {
  let service: NiveauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NiveauService,
        {
          provide: DatabaseService,
          useValue: {
            niveau: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NiveauService>(NiveauService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
