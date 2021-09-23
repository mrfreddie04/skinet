import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { NavigationBehaviorOptions, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError( (error, caught) => {
        //error - represents HttpErrorResponse object - we need to check Status property
        if(error && error instanceof HttpErrorResponse) {
          if( error.status === 400) {
            if(error.error.errors) {
              //validation error - throw to the component and let it handle the error
              return throwError(error.error);
              //throw error.error;
            }
            this.toastr.error(error.error.message,error.error.statusCode);
            return EMPTY; //handling completed            
          }          
          if( error.status === 401) {
            this.toastr.error(error.error.message,error.error.statusCode);
            return EMPTY; //handling completed            
          }            
          if( error.status === 404) {
            this.router.navigateByUrl("/not-found");
            return EMPTY; //handling completed
          }
          if( error.status === 500) {
            const navigationExtras: NavigationBehaviorOptions = {
              state: { error: error.error }
            };
            this.router.navigateByUrl("/server-error", navigationExtras);
            return EMPTY; //handling completed
          }
        }
        //If we cannot handle this error then we pass the error down our pipeline - throwError() operator.
        return throwError(error);
      })
    );
  }
}