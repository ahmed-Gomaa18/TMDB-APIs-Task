export interface ICountry{
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IMovie{
    id: number; 
    y2022: string; 
    y2023: string; 
    title: string; 
    director: string; 
    year: string; 
    length: number; 
    colour: string; 
    genreId: number; 
    countryId: number; 
    deleted: boolean; 
    createdAt: Date; 
    updatedAt: Date; 
    deleteAt: Date; 
}