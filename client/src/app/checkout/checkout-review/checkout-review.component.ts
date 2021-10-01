import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {
  @Input() appStepper: CdkStepper;
  public basket$: Observable<IBasket>;

  constructor(
    private basketService: BasketService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  public createPaymentIntent() {
    this.basketService.createPaymentIntent().subscribe( 
      (basket) => {
        this.appStepper.next();
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
