import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { MessageRepository } from './messages.repository';
import { RoomRepository } from 'src/rooms/rooms.repository';
import { ChatGateway } from 'src/chat/chat.gateway';
describe('MessagesService', () => {
  let service: MessagesService;
  let messageRepo: MessageRepository;
  let roomRepo: RoomRepository;
  let chatGateway: ChatGateway;

  const mockMessageRepository = {
    findAll: jest.fn(),
  };

  const mockRoomRepository = {
    findAll: jest.fn(),
  };

  const mockChatGateway = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
        {
          provide: RoomRepository,
          useValue: mockRoomRepository,
        },
        {
          provide: ChatGateway,
          useValue: mockChatGateway,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messageRepo = module.get<MessageRepository>(MessageRepository);
    roomRepo = module.get<RoomRepository>(RoomRepository);
    chatGateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
