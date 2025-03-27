import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class HttpClientUtils {
    urlApi: string = environment.apiBackEndURL;
    urlApiSigta: string = environment.apiBackEndSigtaURL;
    urlUsuario: string = 'https://webapp.mdsmp.gob.pe/gestusubackend/public/';

    constructor(private httpClient: HttpClient, private router: Router) { }

    getQuery(query: string) {
        const url = `${this.urlApi + query}`;
        return this.httpClient.get(url);
    }

    postQuery(query: string, params: any) {
        const url = `${this.urlApi + query}`;
        return this.httpClient.post(url, params);
    }

    postQuerySigta(query: string, params: any) {
        const url = `${this.urlApiSigta + query}`;
        return this.httpClient.post(url, params);
    }

    postQueryUsuario(query: string, params: any) {
        const url = `${this.urlUsuario + query}`;
        return this.httpClient.post(url, params);
    }
}