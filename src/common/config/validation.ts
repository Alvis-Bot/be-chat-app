import * as Joi from "joi";

interface IConfig {
  NODE_ENV: string;
  PORT: number;
}
export const validationSchema :Joi.ObjectSchema<IConfig> = Joi.object({
  NODE_ENV: Joi.string().valid("dev", "prod", "test").required(),
  PORT: Joi.number().default(3000),
});
