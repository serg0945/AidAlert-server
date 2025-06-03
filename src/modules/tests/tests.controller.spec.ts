import { Test, TestingModule } from '@nestjs/testing';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';

describe('TestsController', () => {
  let controller: TestsController;
  let service: TestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsController],
      providers: [
        {
          provide: TestsService,
          useValue: { delete: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TestsController>(TestsController);
    service = module.get<TestsService>(TestsService);
  });

  describe('delete', () => {
    it('should delete a test successfully', async () => {
      const id = 'someId';
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});
