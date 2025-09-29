import { Test, TestingModule } from '@nestjs/testing';
import { BabytoyBatchController } from './babytoy-batch.controller';
import { BabytoyBatchService } from './babytoy-batch.service';

describe('BabytoyBatchController', () => {
  let babytoyBatchController: BabytoyBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BabytoyBatchController],
      providers: [BabytoyBatchService],
    }).compile();

    babytoyBatchController = app.get<BabytoyBatchController>(BabytoyBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(babytoyBatchController.getHello()).toBe('Hello World!');
    });
  });
});
