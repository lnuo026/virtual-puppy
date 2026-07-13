import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('health')
export class HealthController {
     constructor(
          private readonly health: HealthCheckService,
          private readonly mongoose: MongooseHealthIndicator,     
     ){}

     @Get()
     @Public()
     @HealthCheck()
     check() {
          return this.health.check([ () => 
               this.mongoose.pingCheck('mongodb')
     ]);
     }
}
