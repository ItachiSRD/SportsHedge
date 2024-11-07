import { Body, Controller, Post } from '@nestjs/common';
import { CreateRequest } from '../dto/mint.dto';
import { AdminService } from './admin.service';
import { GetUser } from '../../users/decorator/get-user.decorator';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  async create(
    @Body() userInput: CreateRequest,
    @GetUser() userDetails: DecodedIdToken,
  ) {
    return await this.adminService.create(userDetails, userInput);
  }
}
