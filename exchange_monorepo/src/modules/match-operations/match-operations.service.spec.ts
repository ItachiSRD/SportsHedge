import { Test, TestingModule } from '@nestjs/testing';
import { MatchOperationsService } from './match-operations.service';

describe('MatchOperationsService', () => {
  let service: MatchOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchOperationsService],
    }).compile();

    service = module.get<MatchOperationsService>(MatchOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
