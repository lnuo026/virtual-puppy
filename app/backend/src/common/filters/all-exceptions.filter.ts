import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
     catch(exception: unknown, host: ArgumentsHost) {
          const ctx = host.switchToHttp();
          const response = ctx.getResponse<Response>();
          const request = ctx.getRequest<Request>();
 
          const isHttpException = exception instanceof HttpException;
          const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

          const exceptionResponse = isHttpException ? exception.getResponse() : null;
          const message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as { message?: string | string[]})?.message || 'Internal server error';

          console.error(`Unhandled execption: `, exception );

          response.status(status).json({
               statusCode: status,
               error: isHttpException ? exception.constructor.name: 'InternalServerError',
               message,
               timestap: new Date().toDateString(),
               path: request.url,
          })

     }
}
  