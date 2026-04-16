import { Test, TestingModule } from '@nestjs/testing';
import { ChatHandlesController } from './chat-handles.controller';

describe('ChatHandlesController', () => {
  let controller: ChatHandlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatHandlesController],
    }).compile();

    controller = module.get<ChatHandlesController>(ChatHandlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
