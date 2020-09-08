import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Headers
} from '@nestjs/common';

import { FakeBackendInterceptor } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly fakeBackendInterceptor: FakeBackendInterceptor) {}

  @Get()
  getAllCylinders() {
    return this.fakeBackendInterceptor.getUsers();
  }

  @Post('authenticate')
  addUser(
    @Body('username') username: string,
    @Body('password') password: string[],
    @Headers('Authorization') auth: string
  ) {
    return this.fakeBackendInterceptor.authenticate(username, password, auth);
  }
}
