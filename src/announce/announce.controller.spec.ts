import { Test, TestingModule } from '@nestjs/testing';
import { AnnounceController } from './announce.controller';

describe('AnnounceController', () => {
  let controller: AnnounceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnounceController],
    }).compile();

    controller = module.get<AnnounceController>(AnnounceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
