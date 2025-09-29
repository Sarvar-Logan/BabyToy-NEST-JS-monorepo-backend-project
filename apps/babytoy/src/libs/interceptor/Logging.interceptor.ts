
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  private readonly logger: Logger = new Logger();

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now();
    const requestType = context.getType<GqlContextType>();

    if(requestType === "http") {
      // Develop if needed
    } else if(requestType === "graphql") {
      /*(1)  Print Requst */

      const gqlContex = GqlExecutionContext.create(context);
      this.logger.log(`${this.stringify(gqlContex.getContext().req.body)}`,  'REQUSET');
      
      /*(2)  Errors handling via Graphql  */
      /*(3)  NO Errors giving response below */

      return next.handle().pipe(
        tap((context) => { 
          const responseTime = Date.now() - recordTime;
          this.logger.log(`${ this.stringify(context)} ${responseTime}ms \n\n`, 'RESPONSE');
        }),
      );
    }

    return next.handle()
  }


  private stringify(context: ExecutionContext): string {
    return JSON.stringify(context).slice(0, 75);

  }
}
