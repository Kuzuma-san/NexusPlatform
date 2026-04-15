import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch() // catch ALL exceptions
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);//Tags logs with class name. Eg. [GlobalExceptionFilter] Error Occured

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || 'Error';
    }

    // Log 5xx as errors, 4xx as warnings (4xx are client mistakes, not server problems)
    const logContext = {//Attach useful debugging info:
      method: request.method, // eg. GET or POST /users ...
      path: request.url,
      statusCode: status,
      // Never log request.body — it can contain passwords and tokens
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),//this is stack trace..if real error log full stack trace else fallback string
        logContext,//attack metadata
      );//Log message like: GET /users → 500
    } else {
      this.logger.warn(
        `${request.method} ${request.url} → ${status}: ${message}`,
        logContext,
      );
    }

    response.status(status).json({//send response to client
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
/**Final response sent to frontend
 {
  "success": false,
  "statusCode": 404,
  "message": "User not found",
  "timestamp": "2026-04-13T12:00:00Z",
  "path": "/users/123"
}
 */