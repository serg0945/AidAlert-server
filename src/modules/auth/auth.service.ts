import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from 'modules/auth/dtos/createAuth.dto';
import { LoginDto } from 'modules/auth/dtos/loginDto.dto';
import { Auth, AuthDocument } from 'modules/auth/schemas/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  async checkPass(): Promise<boolean> {
    const user = await this.authModel.findOne();
    const dateLoginString = user?.dateLogin as string;
    const dateLogin = new Date(dateLoginString);
    const now = new Date();

    const differenceInMilliseconds = Math.abs(
      now.getTime() - dateLogin.getTime(),
    );
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return differenceInDays < 1;
  }

  async create(dto: CreateAuthDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const auth = new this.authModel({ ...dto, password: hashedPassword });
    await auth.save();
  }

  async login(dto: LoginDto): Promise<void> {
    const user = await this.authModel.findOne({ username: dto.username });

    if (!user) {
      throw new UnauthorizedException('В базе нет администратора');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (isPasswordValid) {
      await this.authModel.findByIdAndUpdate(user._id, {
        dateLogin: new Date(),
      });
    } else {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  }
}
