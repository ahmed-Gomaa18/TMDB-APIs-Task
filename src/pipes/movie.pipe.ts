import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

import { getClassSchema } from "nestjs-joi";

import {AddToFavoriteDto, RemoveFromFavoriteDto} from "src/dtos/movie.dto"

export class AddToFavoriteValidationPipe implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {

        const schema = getClassSchema(AddToFavoriteDto);
        let error = schema.validate(value).error;
        if (error) {
            throw new BadRequestException(
                'Validation failed: ' +
                error.details.map((err) => err.message).join(', '),
            );
        };

        return value;
    }
};

export class RemoveFromFavoriteValidationPipe implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {

        const schema = getClassSchema(RemoveFromFavoriteDto);
        let error = schema.validate(value).error;
        if (error) {
            throw new BadRequestException(
                'Validation failed: ' +
                error.details.map((err) => err.message).join(', '),
            );
        };

        return value;
    }
};