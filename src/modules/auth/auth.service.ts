import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from './dtos/createAuth.dto';
import { LoginDto } from './dtos/loginDto.dto';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateAuthDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const auth = new this.authModel({ ...dto, password: hashedPassword });
    await auth.save();
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authModel.findOne({ username: dto.username });

    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (isPasswordValid) {
      return {
        access_token: this.jwtService.sign(dto),
      };
    } else {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  }

  async getByName(dto: any): Promise<any> {
    return await this.authModel.findOne({ username: dto.username });
  }
}
