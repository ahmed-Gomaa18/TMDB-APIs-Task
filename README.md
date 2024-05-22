# TMDB-APIs Project

This is a NestJS project built with TypeScript, using PostgreSQL as the database and Prisma as the ORM. The project is organized into three main modules:

1. **Upload Module**
2. **Auth Module**
3. **Movie Module**

## Project Setup



1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
2. **Make sure you have docker installed on your computer then run**:
   ```bash
   docker-compose up

## Modules

### Upload Module
>This module allows you to upload a CSV file and store its data in the database.

### Upload File:

**Endpoint**: **POST /upload/file**

***Description***: `Upload a CSV file and store the data in the database.`


### Movie Module
>This module provides functionality to retrieve movies, perform search, sorting, pagination, and manage favorite movies.

### Get Movies:
**Endpoint**: **GET /movies/**

***Description***: `Retrieve movies with options for search, sort, and pagination.`

### Add Favorite:
**Endpoint**: **POST /movies/addToFavorite**

***Description:*** `Add a movie to the favorite list. Fetches additional details from an external API (TMDB API) to ensure sufficient data is available.`

### Remove Favorite:
**Endpoint**: **DELETE /movies/removeFromFavorite**

***Description:*** `Remove a movie from the favorite list.`


### Auth Module
>This module handles user registration and authentication.

### Register:
**Endpoint**: **POST /auth/register**
***Description:*** `Register a new user.`

### Login:
**Endpoint**: 
**POST /auth/login**

***Description:*** `Authenticate a user and provide an access token.`

### Guarded Endpoints:
>add favorite and remove favorite endpoints are protected by guards to ensure only authenticated users can access them.

### validation Pipes:
>adding pipes for most endpoint to validate data before enter to controller or interact with DB
### Database
>Database: PostgreSQL
ORM: Prisma

Ensure your install docker in your computer
Kindly, Find attached `TMDB API.postman_collection.json` file 
