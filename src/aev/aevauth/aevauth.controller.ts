import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AevauthService } from './aevauth.service';
import { AevAuthGuard } from './aevauth.guard';

@Controller('aevauth')
export class AevauthController {
  constructor(private readonly aevauthService: AevauthService) {}
  @Get()
  getHello(): string {
    return 'Hola';
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.aevauthService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AevAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
