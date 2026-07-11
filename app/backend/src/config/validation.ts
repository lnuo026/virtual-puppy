import Joi from "joi";

export const validationSchema = Joi.object({
     NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
     PORT: Joi.number().default(3000),
     MONGODB_URL: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),
     GOOGLE_CLIENT_ID: Joi.string().required(),
     GOOGLE_CLIENT_SECRET: Joi.string().required(),
     GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
     JWT_SECRET: Joi.string().required(),
     JWT_EXPIRES_IN: Joi.string().default('7d'),
     FRONTEND_URL: Joi.string().uri().required(),
     GEMINI_API_KEY: Joi.string().required(),
     GEMINI_MODEL:
     Joi.string().default('gemini-2.0-flash'),
});