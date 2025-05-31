import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'modules/auth/auth.controller';
import { AuthService } from 'modules/auth/auth.service';
import { JwtStrategy } from 'modules/auth/jwt.strategy';
import { Auth, AuthSchema } from 'modules/auth/schemas/auth.schema';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      signOptions: { expiresIn: '86400s' },
      secret: process.env.SECRET as string,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
