import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";

export const winstonConfig = {
     level: 'info',
     transports: [
          new winston.transports.Console({
               format: winston.format.combine(
                    winston.format.timestamp(),
                    nestWinstonModuleUtilities.format.nestLike('Virtual Puppy', { prettyPrint: true,                         
                     }),
               ),
          }),
     ],
};
