import { IProduct } from './../../shared/models/product';
import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input("product") product: IProduct = Object();

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
  }

  public addItemToBasket() {
    this.basketService.addItemToBasket(this.product);
  }  

}
