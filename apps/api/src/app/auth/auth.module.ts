import { Module } from '@nestjs/common';

import { FakeBackendInterceptor } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [FakeBackendInterceptor]
})
export class AuthModule {}
