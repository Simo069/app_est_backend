import { Test, TestingModule } from '@nestjs/testing';
import { RessourcesService } from './ressources.service';

describe('RessourcesService', () => {
  let service: RessourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RessourcesService],
    }).compile();

    service = module.get<RessourcesService>(RessourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
