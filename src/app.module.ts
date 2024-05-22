import { Module } from '@nestjs/common';
import {CacheModule} from "@nestjs/cache-manager"
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './modules/upload/upload.module';
import { MovieModule } from './modules/movie/movie.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: './.env', isGlobal: true}),
    CacheModule.register({
      isGlobal: true,
      max: 200,
    }),
    UploadModule,
    MovieModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
