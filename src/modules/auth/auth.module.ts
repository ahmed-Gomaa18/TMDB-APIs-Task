import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [
      JwtModule.register({
        secret: process.env.JWTSECRETKEY,
        signOptions: {expiresIn: '24h'}
      })
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService],
  })
export class AuthModule{};