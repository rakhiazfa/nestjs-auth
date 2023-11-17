import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard, JwtRefreshTokenGuard } from './guards';
import { User } from '@/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async signOut(@User() user) {
    return this.authService.signOut(user.id);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@User() user) {
    return this.authService.refreshToken(user.id, user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@User() user) {
    return this.authService.getUser(user.id);
  }
}
