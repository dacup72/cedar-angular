import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '@cedar-angular/api-interfaces';
import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import * as path from "path";

// Temporary database
const users: User[] = [
  {
    "id": 1,
    "username": "admin",
    "email": "admin@email.com",
    "password": "admin"
  },
  {
    "id": 2,
    "username": "techie",
    "email": "techie@email.com",
    "password": "techie"
  },
  {
    "id": 3,
    "username": "user",
    "email": "user@email.com",
    "password": "user"
  }
];

// TODO: Use RSA Key for JWT signing
const RSA_PRIVATE_KEY = fs.readFileSync('./apps/api/private.key');
const SECRET_KEY = '123456789';

@Injectable()
export class FakeBackendInterceptor {

      authenticate(username, password, auth) {
        console.log("AUTH: ", auth, " : ", username)
          const user = users.find(x => x.username === username && x.password === password);
          const expireTime = 120;
          if (!user) return this.error('Username or password is incorrect');
          const jwtBearerToken = jwt.sign({}, SECRET_KEY, { 
            //algorithm: 'RS256',
            expiresIn: expireTime,
            subject: user.id.toString() 
          });

          return { ...this.omitPassword(user), jwtBearerToken, expiresIn: expireTime };
      }

      omitPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

       getUsers() {
          return users.map(u => this.omitPassword(u));
      }

       error(message) {
          return throwError({ error: { message } });
      }

       unauthorized() {
          return throwError({ status: 401, error: { message: 'Unauthorised' } });
      }

      // verifyToken(token) {
      //   return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
      // }
  }

  

