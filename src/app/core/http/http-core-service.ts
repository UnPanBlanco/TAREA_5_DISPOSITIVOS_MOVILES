import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';

@Service()
export class HttpCoreService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly headers: HttpHeaders = new HttpHeaders().append('Content-Type', 'application/json').append('Access-Control-Allow-Origin', '*');

  private get_url(url: string) {
    return `https://jsonplaceholder.typicode.com/${url}`;
  }

  protected get<RESPONSE>(url: string, params: {
      [param: string]: string | number | boolean | readonly (string | number | boolean)[];
  } = {}): Observable<RESPONSE> {
    const http_params: HttpParams = new HttpParams().appendAll(params);
    return this.httpClient.get<RESPONSE>(this.get_url(url), {headers: this.headers, params: http_params});
  }

  protected post<BODY, RESPONSE>(url: string, body: BODY): Observable<RESPONSE> {
    return this.httpClient.post<
      RESPONSE
    >(this.get_url(url), body, {
      headers: this.headers,
    });
  }
}
