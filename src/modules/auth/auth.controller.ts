import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'modules/auth/auth.service';
import { CreateAuthDto } from 'modules/auth/dtos/createAuth.dto';
import { LoginDto } from 'modules/auth/dtos/loginDto.dto';
import { JwtAuthGuard } from 'modules/auth/jwt.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':token')
  async checkPass(@Param('token') token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateAuthDto): Promise<void> {
    await this.authService.create(dto);
  }

  @Patch()
  async login(@Body() dto: LoginDto): Promise<any> {
    return await this.authService.login(dto);
  }
}
