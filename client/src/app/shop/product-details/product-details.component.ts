import { BasketService } from 'src/app/basket/basket.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IProduct } from './../../shared/models/product';
import { ShopService } from './../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public product: IProduct;
  public quantity: number = 1;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService,
    private basketService: BasketService
  ) { 
    this.route.snapshot.paramMap.get("id");
    this.bcService.set("@productDetails", " ");
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  public addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }  

  public incrementItemQuantity() {
    this.quantity++;
  }
  
  public decrementItemQuantity() {
    if(this.quantity > 1)
      this.quantity--;
  }   

  private loadProduct() {
    const productId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.shopService.getProduct(productId).subscribe( 
      product => {
        this.product = product;
        this.bcService.set("@productDetails", product.name)
      },
      error => console.error(error)      
    );
  }
}
