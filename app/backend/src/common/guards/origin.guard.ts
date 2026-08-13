import { CanActivate, ExecutionContext, Injectable, ForbiddenException  } from "@nestjs/common";
import type { Request } from "express";

const SAFT_METHODS = new Set(['GET',  'HEAD', 'OPTIONS']);

@Injectable()
export class OriginGuard implements CanActivate {
     canActivate(context: ExecutionContext): boolean {
          const request = context.switchToHttp().getRequest<Request>();
          
          if(SAFT_METHODS.has(request.method)) {
               return true;
          }

          const allowOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';
          const origin = request.headers.origin;

          if(origin !== allowOrigin) {
               throw new ForbiddenException('Invalid origin');
          }

          return true;
     }          
     }
