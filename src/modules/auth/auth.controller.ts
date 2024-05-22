import { Body, Controller, Get, Post, Req, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto, RegisterDto} from "src/dtos/auth.dto";
import { LoginValidationPipe, RegisterValidationPipe } from 'src/pipes/auth.pipe';
import { NextFunction, Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){};

    @Post('/register')
    @UsePipes(new RegisterValidationPipe())
    async register(@Req() req: Request, @Res() res: Response, @Body() body: RegisterDto){
        try{

            const response = await this.authService.register(body.email,body.name, body.password)
            if (response.isSuccess == true){
                return res.status(response.status).json({message: response.message, data: response.data})
            }

            return res.status(response.status).json({message: response.message})

        }catch(error){
            return res.status(200).json(error);
        }
    }

    @Post('/login')
    @UsePipes(new LoginValidationPipe())
    async login(@Req() req: Request, @Res() res: Response, @Body() body: LoginDto){
        try{

            const response = await this.authService.login(body.email, body.password)
            if (response.isSuccess == true){
                return res.status(response.status).json({message: response.message, data: response.data})
            }

            return res.status(response.status).json({message: response.message})

        }catch(error){
            return res.status(400).json({error: error.message});
        }
    }

};
