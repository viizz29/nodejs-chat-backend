import { Test, TestingModule } from '@nestjs/testing';
import { ChatHandlesService } from './chat-handles.service';

describe('ChatHandlesService', () => {
  let service: ChatHandlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatHandlesService],
    }).compile();

    service = module.get<ChatHandlesService>(ChatHandlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
