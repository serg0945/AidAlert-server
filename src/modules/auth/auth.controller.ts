import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { CreateAuthDto } from 'modules/auth/dtos/createAuth.dto';
import { LoginDto } from 'modules/auth/dtos/loginDto.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async checkPass(): Promise<boolean> {
    return await this.authService.checkPass();
  }

  @Post()
  async create(@Body() dto: CreateAuthDto): Promise<void> {
    await this.authService.create(dto);
  }

  @Patch()
  async login(@Body() dto: LoginDto): Promise<void> {
    await this.authService.login(dto);
  }
}
