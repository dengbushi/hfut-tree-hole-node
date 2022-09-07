import { CallHandler, ExecutionContext, Inject, Injectable, LoggerService, NestInterceptor } from '@nestjs/common'
import { Observable, catchError } from 'rxjs'
import { tap } from 'rxjs/operators'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Request } from 'express'
import { isNotEmptyObject } from 'class-validator'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const request = context.switchToHttp().getRequest() as Request

    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.log(`[${context.getClass().name}]${context.getHandler().name}: ${request.user.studentId || request.body.studentId} cost: ${Date.now() - now}ms`)
        }),
        catchError((err) => {
          this.logger.error(`[${context.getClass().name}]${context.getHandler().name}: ${request?.user?.studentId || request.body.studentId} ${err.stack} \ninputs: ${JSON.stringify(
            isNotEmptyObject(request.params) ? request.params : request.body,
          )} cost: ${Date.now() - now}ms\n`)
          throw err
        }),
      )
  }
}
