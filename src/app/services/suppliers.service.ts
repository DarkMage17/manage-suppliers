import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../interfaces/supplier.interface';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../settings/app-settings';
import { ResponseAPI } from '../interfaces/response-api.interface';
import { SaveSupplier } from '../interfaces/save-supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private apiUrl:string = appsettings.apiUrl + "Suppliers";
  private http = inject(HttpClient)
  constructor() {}

  getSuppliers(){
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplierById(id: number){
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  addSupplier(supplier: SaveSupplier){
    return this.http.post<ResponseAPI>(this.apiUrl, supplier);
  }

  editSupplier(supplier: SaveSupplier){
    return this.http.put<ResponseAPI>(this.apiUrl, supplier);
  }

  deleteSupplier(id:number){
    return this.http.delete<ResponseAPI>(`${this.apiUrl}/${id}`);
  }
}
