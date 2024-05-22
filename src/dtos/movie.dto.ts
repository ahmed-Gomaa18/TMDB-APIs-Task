import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
    allowUnknown: false,
})
export class AddToFavoriteDto{
    @JoiSchema(Joi.number().required())
    userId:  number;
    @JoiSchema(Joi.number().required())
    movieId:   number;
};

@JoiSchemaOptions({
    allowUnknown: false,
})
export class RemoveFromFavoriteDto{
    @JoiSchema(Joi.number().required())
    userId:  number;
    @JoiSchema(Joi.number().required())
    movieId:   number;
};