import { IProduct } from './../../shared/models/product';
import { ShopService } from './../shop.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public product: IProduct;

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute
  ) { 
    this.route.snapshot.paramMap.get("id")
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct() {
    const productId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.shopService.getProduct(productId).subscribe( 
      product => this.product = product,
      error => console.error(error)      
    );
  }
}
