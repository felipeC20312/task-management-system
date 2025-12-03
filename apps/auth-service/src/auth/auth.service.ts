import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {User} from '../../../../packages/types/src/auth/entities/user.entity';
import {RefreshToken} from '../../../../packages/types/src/auth/entities/refresh-token.entity';
import {LoginDto} from '@monorepo/types/src/auth/dto/login.dto';
import {RegisterDto} from '@monorepo/types/src/auth/dto/register.dto';

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
    const {email, username, password} = registerDto;

    if (await this.userRepository.findOne({where: [{email}, {username}]})) {
      throw new ConflictException('Email or username already exists');
    }

    const user = this.userRepository.create({
      email,
      username,
      password: await bcrypt.hash(password, 10),
    });

    await this.userRepository.save(user);
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const {email, password} = loginDto;
    const user = await this.userRepository.findOne({where: {email}});

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: {token: refreshToken, revoked: false},
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (new Date() > tokenEntity.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

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
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({where: {id: userId}});
  }
}
