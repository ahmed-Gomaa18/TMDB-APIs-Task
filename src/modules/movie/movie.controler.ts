import { Body, Controller, Delete, Get, Post, Query, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';
import { MovieService } from "./movie.service";
import { AuthValidationGuard } from "src/guards/auth-validation.guard";
import { AddToFavoriteValidationPipe, RemoveFromFavoriteValidationPipe } from "src/pipes/movie.pipe";
import { AddToFavoriteDto } from "src/dtos/movie.dto";

@Controller('movie')
export class MovieController{
    constructor(private readonly movieService: MovieService){};

    @Get()
    async getMovies(
        @Query('q') query: string, 
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 50,
        @Query('genre') genre: string,
        @Query('country') country: string,
        @Req() req: Request, 
        @Res() res: Response
        ){

            const filters: any = {};

            if(genre) filters.genre = {name: { equals: genre} };
            if(country) filters.country = {name: { equals: country} };

            const response = await this.movieService.getMovies(query, page, limit, filters);
            return res.status(200).json(response);
    }


    @Post('/addToFavorite')
    @UseGuards(AuthValidationGuard)
    @UsePipes(new AddToFavoriteValidationPipe)
    async addToFavorite(@Req() req: Request, @Res() res: Response, @Body() body: AddToFavoriteDto){
        try{
            const response = await this.movieService.addToFavorite(+body.userId, +body.movieId);

            return res.status(response.status).json({message: response.message})

        }catch(error){            
            return res.status(400).json({error: error.message});
        }
    };


    @Delete('/removeFromFavorite')
    @UseGuards(AuthValidationGuard)
    @UsePipes(new RemoveFromFavoriteValidationPipe)
    async removeFromFavorite(@Req() req: Request, @Res() res: Response, @Body() body: AddToFavoriteDto){
        try{
            const response = await this.movieService.removeFromFavorite(+body.userId, +body.movieId);

            return res.status(response.status).json({message: response.message})

        }catch(error){
            return res.status(400).json({error: error.message});
        }
    }

    @Get('favorite')
    @UseGuards(AuthValidationGuard)
    async getFavoriteMovies(@Req() req: Request, @Res() res: Response, @Body() body){
        try{
            const response = await this.movieService.getFavoriteMovies(+body.userId);

            return res.status(response.status).json({message: response.message, data: response.data})

        }catch(error){
            return res.status(400).json({error: error.message});
        }
    }

};