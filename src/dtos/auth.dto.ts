import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
    allowUnknown: false,
})
export class RegisterDto{
    @JoiSchema(Joi.string().email().required())
    email:  string;
    @JoiSchema(Joi.string().required())
    name:   string;
    @JoiSchema(Joi.string().required())
    password:   string;
};

@JoiSchemaOptions({
    allowUnknown: false,
})
export class LoginDto{
    @JoiSchema(Joi.string().email().required())
    email:  string;
    @JoiSchema(Joi.string().required())
    password:   string;
};