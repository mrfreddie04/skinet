import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { map } from "rxjs/operators";
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl: string = "https://localhost:5001/api/";

  constructor(private http: HttpClient) { }

  public getProducts(shopParams: ShopParams) {
    const { brandId, typeId, sort, pageNumber, pageSize, search } = shopParams;

    let params = new HttpParams();
    if(brandId !== 0) params = params.append("brandId", brandId.toString()); 
    if(typeId !== 0) params = params.append("typeId", typeId.toString()); 
    params = params.append("sort", sort); 
    params = params.append("pageIndex", pageNumber.toString()); 
    params = params.append("pageSize", pageSize.toString()); 
    if(search && search !== "") params = params.append("search", search);

    //console.log(`Params: ${params}`);

    return this.http.get<IPagination>(`${this.baseUrl}products`, { observe: "response", params})
      .pipe(
        map(response => response.body)
      );
  }

  public getProduct(id: number) {
    return this.http.get<IProduct>(`${this.baseUrl}products/${id}`);    
  }

  public getBrands() {
    return this.http.get<IBrand[]>(`${this.baseUrl}products/brands`);
  }  

  public getTypes() {
    return this.http.get<IType[]>(`${this.baseUrl}products/types`);
  }    
}
