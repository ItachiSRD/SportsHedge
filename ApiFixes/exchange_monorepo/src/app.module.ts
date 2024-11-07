import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './core/database/database.module';
import { AuthMiddleware } from './core/middlewares/auth.middleware';
import { RequestService } from './core/middlewares/request.service';
import { OrdersModule } from './modules/orders/src/orders.module';
import { PublicModule } from './modules/public/public.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { UpdateOrdersModule } from './modules/update-orders/update-orders.module';
import { UsersModule } from './modules/users/users.module';
import { AwsModule } from './services/aws/aws.module';
import { FirebaseModule } from './services/firebase/firebase.module';
import { LedgerModule } from './services/ledger/ledger.module';
import { PhonepeModule } from './services/phonepe/phonepe.module';
import { AdminModule } from './modules/admin/src/admin.module';
import { MatchOperationsModule } from './modules/match-operations/match-operations.module';
import { AuthLive } from './core/middlewares/auth-live';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'debug',
        redact: ['req.headers.authorization'],
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'yyyy-mm-dd HH:MM:ss',
          },
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FirebaseModule,
    UsersModule,
    OrdersModule,
    UpdateOrdersModule,
    AwsModule,
    LedgerModule,
    PublicModule,
    PhonepeModule,
    RewardsModule,
    AdminModule,
    MatchOperationsModule,
  ],
  controllers: [],
  providers: [RequestService],
})
export class AppModule {
  private readonly publicRoutes = [
    // { path: '/public/health', method: RequestMethod.GET },
    // { path: '/public/players', method: RequestMethod.GET },
    // { path: '/public/players/:public_id', method: RequestMethod.GET },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...this.publicRoutes)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(AuthLive)
      .forRoutes({ path: '/operations/*', method: RequestMethod.ALL });
  }
}
