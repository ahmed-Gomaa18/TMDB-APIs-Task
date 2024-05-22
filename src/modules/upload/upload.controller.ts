import { Controller, FileTypeValidator, HttpStatus, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";


@Controller('upload')
export class UploadController{
    constructor(private readonly uploadService: UploadService) {}
    
    @Post('file')
    @UseInterceptors(FileInterceptor('csvFile', {dest: './uploads'}))
    async file(@UploadedFile( new ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: "text/csv",
        })
        
        .addMaxSizeValidator({
        maxSize: 500000
        })
        
        .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        }),
        
    ) csvFile: Express.Multer.File){

        const res = await this.uploadService.file(csvFile.path);
        return res
        
    }
};