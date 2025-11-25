import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, revoked: false },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > tokenEntity.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Revoke old token
    tokenEntity.revoked = true;
    await this.refreshTokenRepository.save(tokenEntity);

    return this.generateTokens(tokenEntity.user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    // Save refresh token
    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
