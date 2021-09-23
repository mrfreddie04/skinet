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

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService
  ) { 
    this.route.snapshot.paramMap.get("id");
    this.bcService.set("@productDetails", " ");
  }

  ngOnInit(): void {
    this.loadProduct();
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
