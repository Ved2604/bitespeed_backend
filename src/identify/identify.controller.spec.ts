import { Test, TestingModule } from '@nestjs/testing';
import { IdentifyController } from './identify.controller';
import { IdentifyService } from './identify.service';

describe('IdentifyController', () => {
  let controller: IdentifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentifyController],
      providers: [IdentifyService],
    }).compile();

    controller = module.get<IdentifyController>(IdentifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
