import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  getAuthorizationHeader(): string{
    const username = environment.basicAuthUser;
    const password = environment.basicAuthPassword;
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }

}
