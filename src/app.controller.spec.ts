import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API info', () => {
      expect(appController.getHello()).toEqual({
        name: 'My API',
        version: '1.0.0',
        status: 'running',
      });
    });
  });
});
