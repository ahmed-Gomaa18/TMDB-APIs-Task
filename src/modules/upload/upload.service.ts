import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CsvReaderUtil } from 'src/utils/csv-reader.util';

@Injectable()
export class UploadService {
    constructor(private readonly csvReaderUtil: CsvReaderUtil, private readonly prismaService: PrismaService){}
    
    async file(filePath: string): Promise<string> {
        let fullFilePath  = __dirname.replace('dist/modules/upload', '');
        fullFilePath = fullFilePath + filePath

        
        const fileContent = await this.csvReaderUtil.readCsv(fullFilePath);
        
        let countries = [];
        let genres = [];
    
        for (const row of fileContent) {
          row['title'] = row['Title'];
          delete row['Title'];
    
          row['director'] = row['Director'];
          delete row['Director'];
    
          row['year'] = row['Year'] ;
          delete row['Year'];
    
          row['length'] = +row['Length'];
          delete row['Length'];
    
          row['colour'] = row['Colour'];
          delete row['Colour'];
    
          row['y2022'] = row['2022'];
          delete row['2022'];
    
          row['y2023'] = row['2023'];
          delete row['2023'];
    
          delete row['Pos'];
          countries.push({name: row['Country']})
          genres.push({name: row['Genre']})
        }
    
        countries = await countries.filter((obj, index, self) => index === self.findIndex((item) => item.name === obj.name))
        genres = await genres.filter((obj, index, self) => index === self.findIndex((item) => item.name === obj.name))
        
        await this.prismaService.country.createMany({
            data: countries,
            skipDuplicates: true
        });
        await this.prismaService.genre.createMany({
            data: genres,
            skipDuplicates: true
        });
      
        // Get all Countries
        const allCountries = await this.prismaService.country.findMany({});
        // Get all Countries
        const allGenres = await this.prismaService.genre.findMany({});

        for (const row of fileContent){

            for(const country of allCountries){
                if (row['Country'] == country.name){
                delete row['Country']
                row['countryId'] = country.id;
                
                for(const genre of allGenres ){
                    if(row['Genre'] == genre.name){
                    delete row['Genre']
                    row['genreId'] = genre.id;
                    break
                    }
                }
        
                }
                
            }
        }
    
        await this.prismaService.movie.createMany({
        data: fileContent
        });

        return 'Upload CSVFile to DB Successfully...';
    }
}
