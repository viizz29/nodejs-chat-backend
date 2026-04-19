import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { RoomRepository } from './rooms.repository';

describe('RoomsService', () => {
  let service: RoomsService;
  let repo: RoomRepository;

  const mockRoomRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: RoomRepository,
          useValue: mockRoomRepository,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    repo = module.get<RoomRepository>(RoomRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
