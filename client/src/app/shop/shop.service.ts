import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination, Pagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { map, tap } from "rxjs/operators";
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl: string = environment.apiUrl;
  private products: IProduct[] = [];
  private brands: IBrand[] = [];
  private types: IType[] = [];
  private pagination = new Pagination();
  private shopParams = new ShopParams();
  private productCache = new Map<string,IProduct[]>();

  constructor(private http: HttpClient) { }

  public getProducts(useCache: boolean) {
    if(useCache === false) {
      console.log(`Clear Cache`);
      this.productCache = new Map(); //clear cache
    }

    const cacheKey = Object.values(this.shopParams).join("-");
    console.log(`Cache Key: ${cacheKey}`);

    if(this.productCache.size > 0 && useCache) {      
      if(this.productCache.has(cacheKey)) {
        this.pagination.data = this.productCache.get(cacheKey);
        return of(this.pagination);
      }
    }

    const { brandId, typeId, sort, pageNumber, pageSize, search } = this.shopParams;

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
        map(response => {
          //this.products = [...this.products, ...response.body.data];
          this.productCache.set(cacheKey, response.body.data);
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  public setShopParams(params: ShopParams): void {
    this.shopParams = params;
  }

  public getShopParams(): ShopParams {
    return this.shopParams;
  }

  public getProduct(id: number) {
    let product: IProduct; // = this.products.find( p => p.id === id);

    for (let products of this.productCache.values()) {
      product = products.find( p => p.id === id);
      if(product) break;
    }

    // this.productCache.forEach( (products: IProduct[]) =>{
    //   product = this.products.find( p => p.id === id);
    // })

    if(product) {
      return of(product);
    }
    return this.http.get<IProduct>(`${this.baseUrl}products/${id}`);    
  }

  public getBrands() {
    if(this.brands.length > 0) {
      return of(this.brands);
    }    
    return this.http.get<IBrand[]>(`${this.baseUrl}products/brands`)
      .pipe(
        tap( (brands) =>{
            this.brands = brands
        })
      );
  }  

  public getTypes() {
    if(this.types.length > 0) {
      return of(this.types);
    }      
    return this.http.get<IType[]>(`${this.baseUrl}products/types`)
      .pipe(
        tap( (types) =>{
            this.types = types;
        })
    );
  };
}
