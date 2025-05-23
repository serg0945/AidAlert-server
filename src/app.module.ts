import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'modules/categories/categories.module';
import { TestsModule } from 'modules/tests/tests.module';
import { AuthModule } from 'modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/aid_alert'),
    PostsModule,
    AuthModule,
    CategoriesModule,
    TestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
