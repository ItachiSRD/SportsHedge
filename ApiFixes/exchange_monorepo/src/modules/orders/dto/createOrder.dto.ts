import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ORDER_SIDE, ORDER_TYPE } from '../../../core/constant';

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsString()
  @IsIn(Object.values(ORDER_SIDE))
  side: string;

  @IsString()
  @IsIn(Object.values(ORDER_TYPE))
  type: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  instrument: string;
}

export class CancelOrderRequest {
  @IsNotEmpty()
  @IsString()
  orderId: string;
}

// export class CreateOrderResponse {
//   @IsNotEmpty()
//   @IsString()
//   firstName: string;

//   @IsNotEmpty()
//   @IsString()
//   lastName: string;

//   @IsNotEmpty()
//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(8)
//   password: string;
// }
