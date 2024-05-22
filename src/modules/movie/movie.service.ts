import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import {IMovie} from "src/interfaces/Models.interface"
import axios from "axios";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

@Injectable()
export class MovieService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly prismaService: PrismaService){};

    async getMovies(query: string, page: number, limit: number, filters: any): Promise<any>{ 
        
        const offset = (+page - 1) * +limit;
        
        // check if user enter query search return query search else return all movie
        if (query){
            
            const [data, total] = await Promise.all([

                this.prismaService.movie.findMany({
                    where: {
                        deleted: false,
                        AND: [
                        {
                            OR: [
                                {
                                    title: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    director: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    colour: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    country:{
                                        name:{
                                            contains: query,
                                            mode: "insensitive"
                                        }
                                    }
                                },
                                {
                                    genre: {
                                        name:{
                                            contains: query,
                                            mode: "insensitive"
                                        }
                                    }
                                }
            
                            ]
                        },
                        filters
                        ]
                    },
                    include: {
                        genre: true,
                        country: true
                    },
                    skip: offset,
                    take: limit
                }),

                this.prismaService.movie.count({
                    where: {
                        deleted: false,
                        AND: [
                        {
                            OR: [
                                {
                                    title: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    director: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    colour: {
                                        contains: query,
                                        mode: "insensitive"
                                    }
                                },
                                {
                                    country:{
                                        name:{
                                            contains: query,
                                            mode: "insensitive"
                                        }
                                    }
                                },
                                {
                                    genre: {
                                        name:{
                                            contains: query,
                                            mode: "insensitive"
                                        }
                                    }
                                }
            
                            ]
                        },
                        filters
                        ]
                    }
                })
            ]);
            
            return{
                page,
                data: data,
                totalData: data.length,
                totalPage: Math.ceil(total / limit),
            }

        }else{

            const [data, total] = await Promise.all([

                this.prismaService.movie.findMany({

                    where: {
                        deleted: false,
                        ...filters
                    },
                    include: {
                        genre: true,
                        country: true
                    },
                    skip: offset,
                    take: limit
                    
                }),
                this.prismaService.movie.count({
                    where: {
                        deleted: false,
                        ...filters
                    }
                })
            ]);
            return{
                page,
                data: data,
                totalData: data.length,
                totalPage: Math.ceil(total / limit),
            }

        }

    };

    async addToFavorite(userId: number, movieId: number){
        let tmdbMovieId: string;
        // Get Current movie
        const movie = await this.prismaService.movie.findUnique({
            where: {
                id: movieId
            }
        });

        // Check if this movie was added before or not
        const existMovie = await this.prismaService.favorite.findMany({
            where: {
                userId: userId,
                movieId: movieId
            }
        });
        if(existMovie.length >= 1){
            return{
                isSuccess: false,
                status: 400,
                message: `This ${movie.title} movie is already added to your favorites`
            }
        }

        

        
        // search for this movie by title to get Movie ID
        const searchResult = await axios.get(`${process.env.TMDB_SEARCH_MOVIE_URL}?query=${encodeURIComponent(movie.title)}&include_adult=false&language=en-US&page=1`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
            }
        });
        
        let continueWrap: boolean = true;
        
        for(let i=0; i < searchResult.data.results.length && continueWrap; i++){
            if(searchResult.data.results[i].title === movie.title){
                tmdbMovieId = searchResult.data.results[i].id;

                continueWrap = false
            };
        };

        // Get more details from TMDB API
        const movieDetails = await axios.get(`${process.env.TMDB_MOVIE_DETAILS_URL}/${tmdbMovieId}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
            }
        });

        await this.prismaService.favorite.create({
            data: {
                userId: userId,
                movieId: movieId,
                additionalDetails: movieDetails.data,
            }
        });

        // delete favorite movie for this user
        await this.cacheManager.del(`favoriteMovie-${userId.toString()}`)

        return{
            isSuccess: true,
            status: 201,
            message: `You have successfully added this ${movie.title} movie to your favorites`
        }

    };

    async removeFromFavorite(userId: number, movieId: number){
        const favoriteMovie = await this.prismaService.favorite.findMany({
            where: {
                userId,
                movieId
            }
        });

        if (favoriteMovie.length < 1){
            return{
                isSuccess: false,
                status: 400,
                message: "Oops...this movie isn't in your favorite"
            }
        };

        await this.prismaService.favorite.deleteMany({
            where: {
                userId,
                movieId
            }
        });

        // delete favorite movie for this user 
        await this.cacheManager.del(`favoriteMovie-${userId.toString()}`)
        
        return{
            isSuccess: true,
            status: 200,
            message: "This movie removed from your favorite successfully"
        }
        
                

    }

    async getFavoriteMovies(userId: number){

        // First look at cach
        const cachedFavoriteMovies = await this.cacheManager.get(`favoriteMovie-${userId.toString()}`);
        if(cachedFavoriteMovies){
            return{
                isSuccess: true,
                status: 200,
                message: 'Get favorite movies successfully',
                data: cachedFavoriteMovies
            }
        }
        const favoriteMoviesFormatted = [];
        const favoriteMovies =  await this.prismaService.favorite.findMany({
            where:{
                userId: userId
            },
            include: {
                movie: true
            }
        });

        for (const favoriteMovie of favoriteMovies){
            let genres = "|";
            let production_companies = "|";
            let production_countries = "|";
            for (let i=0; i < favoriteMovie.additionalDetails['genres'].length; i++){
                genres += ` ${favoriteMovie.additionalDetails['genres'][i]['name']} |`;
            };

            for (let i=0; i < favoriteMovie.additionalDetails['production_companies'].length; i++){
                production_companies += ` ${favoriteMovie.additionalDetails['production_companies'][i]['name']} |`;
            };

            for (let i=0; i < favoriteMovie.additionalDetails['production_countries'].length; i++){
                production_countries += ` ${favoriteMovie.additionalDetails['production_countries'][i]['name']} |`;
            };

            favoriteMoviesFormatted.push({
                id: favoriteMovie.movieId,
                title: favoriteMovie.additionalDetails['title'],
                tagline: favoriteMovie.additionalDetails['tagline'],
                overview: favoriteMovie.additionalDetails['overview'],
                director: favoriteMovie.movie.director,
                genres,
                production_companies,
                production_countries,
                budget: favoriteMovie.additionalDetails['budget'],
                status: favoriteMovie.additionalDetails['status'],
                revenue: favoriteMovie.additionalDetails['revenue'],
                runtime: favoriteMovie.additionalDetails['runtime'],
                popularity: favoriteMovie.additionalDetails['popularity'],
                vote_count: favoriteMovie.additionalDetails['vote_count'],
                vote_average: favoriteMovie.additionalDetails['vote_average'],
                release_date: favoriteMovie.additionalDetails['release_date'],
            });
        };

        // add to cach before return
        await this.cacheManager.set(`favoriteMovie-${userId.toString()}`, favoriteMoviesFormatted)

        return{
            isSuccess: true,
            status: 200,
            message: 'Get favorite movies successfully',
            data: favoriteMoviesFormatted
        }     
    }

};
