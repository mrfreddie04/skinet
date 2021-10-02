import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

interface PageChangedEventArgs {
  page: number; 
  itemsPerPage: number;
};

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild("search", {static: false}) searchTerm: ElementRef;
  public products: IProduct[];
  public brands: IBrand[];
  public types: IType[];
  public shopParams: ShopParams;
  public totalCount: number;
  public sortOptions = [
    { name: "Alphabetical", value: "name"},
    { name: "Price: Low to High", value: "priceAsc"},
    { name: "Price: High to Low", value: "priceDesc"}
  ];

  constructor(private shopService: ShopService ) { 
    this.shopParams = this.shopService.getShopParams();
  }

  // public async ngOnInit(): Promise<void> {
  //   await this.getProductsAsync();
  //   await this.getBrandsAsync();
  //   await this.getTypesAsync();
  // }

  public ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }  

  public onBrandSelected(brandId: number): void {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  public onTypeSelected(typeId: number): void {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  public onSortSelected(sort: string): void {
    //console.log(`sort: ${sort}`);
    this.shopParams.sort = sort;
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  public onPageChanged(page: number) {
    if(this.shopParams.pageNumber !== page) {
      this.shopParams.pageNumber = page;
      this.shopService.setShopParams(this.shopParams);
      this.getProducts(true);  
    }
  }

  public onSearch() {
    //console.log("Search");
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
  
  public onReset() {
    this.searchTerm.nativeElement.value = "";
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
  
  private getProducts(useCache: boolean = false) {
    this.shopService.getProducts(useCache).subscribe( 
      response => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error => {
        console.error(error);
      }
    );
  }

  private getBrands() {
    this.shopService.getBrands().subscribe( 
      response => this.brands = [{id: 0, name: "All"},...response],
      error => console.error(error)      
    );
  }  

  private getTypes() {
    this.shopService.getTypes().subscribe( 
      response => this.types = [{id: 0, name: "All"},...response],
      error => console.error(error)      
    );
  }    

  // private async getProductsAsync(): Promise<void> {
  //   const response = await this.shopService.getProducts().toPromise();
  //   this.products = response.data;
  //   this.shopParams.pageNumber = response.pageIndex;
  //   this.shopParams.pageSize = response.pageSize;
  //   this.totalCount = response.count;    
  //   return;
  // }

  // private async getBrandsAsync(): Promise<void> {
  //   const response = await this.shopService.getBrands().toPromise();
  //   this.brands = [{id: 0, name: "All"},...response];
  //   return;
  // }    

  // private async getTypesAsync(): Promise<void> {
  //   const response = await this.shopService.getTypes().toPromise();
  //   this.types = [{id: 0, name: "All"},...response];
  //   return;
  // }      
}
