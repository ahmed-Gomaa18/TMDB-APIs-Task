import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService){};

    async register(email: string, name: string, password: string){
        // first check if this email exist or not 
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        });

        if (user){
            return{
                status: 400,
                isSuccess: false,
                message: `This ${email} email already exist`
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        return{
            status: 201,
            isSuccess: true,
            message: "Register Successfully... Please Login",
            data: {email}
        }

    };


    async login(email: string, password: string){
        const user = await this.prismaService.user.findUnique({ where: { email } });
        if (!user){
            return{
                status: 400,
                isSuccess: false,
                message: "Your email OR password Invalid"
            }
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid){
            return{
                status: 400,
                isSuccess: false,
                message: "Your email OR password Invalid"
            }
        }

        const payload = { email: user.email, userId: user.id };

        return{
            status: 200,
            isSuccess: true,
            message: "Login Successfully.",
            data: {
                access_token: this.jwtService.sign(payload)
            }
        }

    };
};