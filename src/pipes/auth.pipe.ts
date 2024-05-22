import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

import { getClassSchema } from "nestjs-joi";

import {RegisterDto, LoginDto} from "src/dtos/auth.dto"

export class RegisterValidationPipe implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {

        const schema = getClassSchema(RegisterDto);
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

export class LoginValidationPipe implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {

        const schema = getClassSchema(LoginDto);
        let error = schema.validate(value).error;
        if (error) {
            throw new BadRequestException(
                'Validation failed: ' +
                error.details.map((err) => err.message).join(', '),
            );
        };

        return value;
    }
}