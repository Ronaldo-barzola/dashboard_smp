import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, firstValueFrom } from 'rxjs';
import { HttpClientUtils } from '../utils/http-client.utils';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {

  private com_id = 1;
  private uidreg = 8;
  constructor(private httpClientUtils: HttpClientUtils) { }

  postMultasSel(data: any) {
    return this.httpClientUtils.postQuery('v1/dashboard/multas/listar', data).pipe(
      map(data => {
        return data;
      })
    );
  }

 


}
