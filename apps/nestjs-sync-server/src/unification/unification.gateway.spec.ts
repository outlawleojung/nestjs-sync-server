import { Test, TestingModule } from '@nestjs/testing';
import { UnificationGateway } from './unification.gateway';
import { UnificationService } from './unification.service';

describe('UnificationGateway', () => {
  let gateway: UnificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnificationGateway, UnificationService],
    }).compile();

    gateway = module.get<UnificationGateway>(UnificationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
