import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, firstValueFrom } from 'rxjs';
import { HttpClientUtils } from '../utils/http-client.utils';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClientUtils: HttpClientUtils){}

  postSaveProfile(data: any){
    return this.httpClientUtils.postQuery('user/profile-register', data).pipe(
      map(data => {
        return data;
      })
    );
  }

  postSavePermissions(data: any){
    return this.httpClientUtils.postQuery('user/profile-menu-register', data).pipe(
      map(data => {
        return data;
      })
    );
  }

  
  login(data: any){
    return this.httpClientUtils.postQueryUsuario('usuario/acceso', data).pipe(
      map(data => {
        return data;
      })
    );
  }
}
