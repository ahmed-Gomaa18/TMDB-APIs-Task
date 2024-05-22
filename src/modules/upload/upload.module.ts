import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { CsvReaderUtil } from "src/utils/csv-reader.util";
import { UploadService } from "./upload.service";
import { PrismaService } from "src/prisma.service";

@Module({
    imports: [
      
    ],
    controllers: [UploadController],
    providers: [UploadService, CsvReaderUtil, PrismaService],
  })
export class UploadModule{}