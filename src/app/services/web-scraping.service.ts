import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appsettings } from '../settings/app-settings';

@Injectable({
  providedIn: 'root'
})
export class WebScrapingService {
  private apiUrl:string = appsettings.webScrapingAPIUrl + "Suppliers";

  constructor(private http: HttpClient) { }

  searchSanctionsList(company_name: string, country: string): Observable<any> {
    const body = { company_name, country };
    return this.http.post<any>(this.apiUrl, body);
  }
}
