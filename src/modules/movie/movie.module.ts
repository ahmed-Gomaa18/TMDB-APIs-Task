import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { MovieController } from "./movie.controler";
import { MovieService } from "./movie.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
      JwtModule.register({
        secret: process.env.JWTSECRETKEY,
        signOptions: {expiresIn: '24h'}
      })
    ],
    controllers: [MovieController],
    providers: [MovieService, PrismaService],
  })
export class MovieModule{}