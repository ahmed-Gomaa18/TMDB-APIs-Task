
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class CsvReaderUtil {

  async readCsv(filePath: string): Promise<any[]> {

    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {

            //remove file after processing
            fs.unlinkSync(filePath)

            resolve(results)
        })
        .on('error', (error) => reject(error));
    });
  }
}