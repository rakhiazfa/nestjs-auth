import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '@/user/user.service';
import { UserEntity } from '@/user/entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;

    const user = await this.userService.findByEmail(email);

    const isValidPassword: boolean = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isValidPassword)
      throw new BadRequestException(
        'The provided credentials do not match our records.',
      );

    const { accessToken, refreshToken } = await this.generateToken(
      user.id,
      user.name,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: new UserEntity(user),
    };
  }

  async signOut(userId: number): Promise<any> {
    await this.prisma.user.update({
      where: {
        id: userId,
        refreshToken: { not: null },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshToken(userId: number, refreshToken: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        refreshToken,
      },
    });

    if (!user) throw new UnauthorizedException('Invalid refresh token.');

    const { accessToken } = await this.generateToken(
      user.id,
      user.name,
      user.email,
    );

    return { accessToken };
  }

  async getUser(userId: number): Promise<any> {
    const user = await this.userService.findById(userId);

    return new UserEntity(user);
  }

  async generateToken(
    userId: number,
    name: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          name,
          email,
        },
        {
          expiresIn: 60 * 15,
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          name,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET_KEY'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }
}
