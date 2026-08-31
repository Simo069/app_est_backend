import { Test, TestingModule } from '@nestjs/testing';
import { NiveauController } from './niveau.controller';
import { NiveauService } from './niveau.service';

describe('NiveauController', () => {
  let controller: NiveauController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NiveauController],
      providers: [
        {
          provide: NiveauService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NiveauController>(NiveauController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
