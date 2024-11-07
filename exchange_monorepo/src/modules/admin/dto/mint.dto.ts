import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MintRequest {
  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateRequest {
  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsString()
  @IsNotEmpty()
  bookId: string;
}
