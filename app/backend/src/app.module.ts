import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { validationSchema } from './config/validation';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';  
import { UserModule } from './modules/user/user.module';

import { PetModule } from './modules/pet/pet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    HealthModule,
    AuthModule,
    UserModule,
    PetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
