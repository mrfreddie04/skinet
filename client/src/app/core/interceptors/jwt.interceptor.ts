import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem("token");
    if(token) {    
      const headers = request.headers.append('Authorization', `Bearer ${token}`);
      request = request.clone({headers: headers});
      //should do the same in one step
      //request = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    }
        
    return next.handle(request);
  }
}
