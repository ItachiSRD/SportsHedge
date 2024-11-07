import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LedgerService } from '../../../services/ledger/ledger.service';
import { CreateRequest } from '../dto/mint.dto';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { User } from '../../users/entity/users.entity';
import { USER_REPOSITORY } from '../../../core/constant';
import { USER_UNAUTHORIZED } from '../../../core/constant/errors';

@Injectable()
export class AdminService {
  constructor(
    private readonly ledgerService: LedgerService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: typeof User,
  ) {}

  create = async (userToken: DecodedIdToken, userInput: CreateRequest) => {
    return;
    const user = await this.userRepository.findOne({
      where: {
        firebaseId: userToken.uid,
      },
    });

    if (user.parent != '1') {
      throw new UnauthorizedException(USER_UNAUTHORIZED);
    }

    return await this.ledgerService.create(
      {
        amount: userInput.quantity,
        name: userInput.asset,
      },
      userInput.bookId,
    );
  };
}
