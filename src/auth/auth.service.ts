import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.databaseService.user.create({
      data: {
        name: signupDto.name,
        email: signupDto.email,
        authAccounts: {
          create: {
            provider: 'LOCAL',
            passwordHash: hashedPassword,
          },
        },
      },
    });
    return this.signupToken(user.id, user.email);
  }

  async login(loginDto: LoginDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: loginDto.email },
      include: { authAccounts: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const localAccount = user.authAccounts.find(
      (account) => account.provider === 'LOCAL',
    );

    if (!localAccount || !localAccount.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(
      loginDto.password,
      localAccount.passwordHash,
    );

    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signupToken(user.id, user.email);
  }

  private signupToken(userId: number, email: string) {
    const payload = { userId, email };

    return {
      accessToken: this.jwt.sign(payload),
    };
  }
}
