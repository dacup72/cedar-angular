import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import { environment } from '@env/environment';
import { AuthService } from './auth.service';

const SECRET_KEY = '123456789';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem("id_token");

    if(idToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + idToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }

  // verifyToken(token) {
  //   return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
  // }



  // constructor(private authService: AuthService) {}

  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   // add auth header with jwt if user is logged in and request is to the api url
  //   const currentUser = this.authService.currentUserValue;
  //   const isLoggedIn = currentUser && currentUser['body'].token;
  //   const isApiUrl = request.url.startsWith('/api');
  //   console.log(currentUser)
  //   if (isLoggedIn && isApiUrl) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${currentUser['body'].token}`
  //       }
  //     });
  //   }

  //   // console.log('---- request ----');
  //   // console.log(request);
  //   // console.log('--- end of request ---');

  //   return next.handle(request).pipe(
  //     tap(
  //       event => {
  //         if (event instanceof HttpResponse) {
  //           console.log(' all looks good');
  //           // http response status code
  //           console.log(event.status);
  //         }
  //       },
  //       error => {
  //         // http response status code
  //         console.log('---- response ----');
  //         console.error('status code:');
  //         console.error(error.status);
  //         console.error(error.message);
  //         console.log('--- end of response ---');
  //       }
  //     )
  //   );
  // }
}
