import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
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
  public shopParams: ShopParams = new ShopParams();
  public totalCount: number;
  public sortOptions = [
    { name: "Alphabetical", value: "name"},
    { name: "Price: Low to High", value: "priceAsc"},
    { name: "Price: High to Low", value: "priceDesc"}
  ];

  constructor(private shopService: ShopService ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  public onBrandSelected(brandId: number): void {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  public onTypeSelected(typeId: number): void {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  public onSortSelected(sort: string): void {
    //console.log(`sort: ${sort}`);
    this.shopParams.sort = sort;
    this.getProducts();
  }

  public onPageChanged(page: number) {
    if(this.shopParams.pageNumber !== page) {
      this.shopParams.pageNumber = page;
      this.getProducts();  
    }
  }

  public onSearch() {
    //console.log("Search");
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  
  public onReset() {
    this.searchTerm.nativeElement.value = "";
    this.shopParams = new ShopParams();
    this.getProducts();
  }
  
  private getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe( 
      response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
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

}
