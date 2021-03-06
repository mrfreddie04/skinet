import { BusyService } from './../services/busy.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log("Loading Interceptor In");
    if(request.url.includes("account/emailexists") ||
      request.method === "POST" && request.url.includes("orders") || 
      request.method === "DELETE" 
      ) 
    {
      return next.handle(request);
    }
    else 
    {
      this.busyService.busy();
          
      return next.handle(request).pipe(
        //delay(1000),
        //tap(()=>{console.log("Loading Interceptor Out");}),
        finalize( () => {
          this.busyService.idle();
        })
      );  
    }
  }
}


