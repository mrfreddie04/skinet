import { BasketService } from './../basket/basket.service';
import { AccountService } from './../account/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddress } from '../shared/models/address';
import { Observable } from 'rxjs';
import { IBasketTotals } from '../shared/models/basket';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  public checkoutForm: FormGroup;
  public buyerAddress: IAddress;
  public basketTotal$: Observable<IBasketTotals>;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.basketTotal$ = this.basketService.basketTotal$;
  }

  private createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: this.fb.control(null,[Validators.required]),
        lastName: this.fb.control(null,[Validators.required]),
        street: this.fb.control(null,[Validators.required]),
        city: this.fb.control(null,[Validators.required]),
        state: this.fb.control(null,[Validators.required]),
        zipCode: this.fb.control(null,[Validators.required])
      }),
      shippingForm: this.fb.group({
        deliveryMethod: this.fb.control(null,[Validators.required])
      }),      
      paymentForm: this.fb.group({
        nameOnCard: this.fb.control(null,[Validators.required])
      })
    })
  }

  private getAddressFormValues() {
    this.accountService.getUserAddress().subscribe( 
      address => {
        if(address) {
          this.checkoutForm.get("addressForm").patchValue(address);
        }        
      },
      err => console.log(err)
    );
  }

  // private createCheckoutForm() {
  //   this.checkoutForm = this.fb.group({
  //     addressForm: this.fb.group({
  //       firstName: [null, Validators.required],
  //       lastName: [null, Validators.required],
  //       street: [null, Validators.required],
  //       city: [null, Validators.required],
  //       state: [null, Validators.required],
  //       zipCode: [null, Validators.required],
  //     }),
  //     deliveryForm: this.fb.group({
  //       deliveryMethod: [null, Validators.required]
  //     }),
  //     paymentForm: this.fb.group({
  //       nameOnCard: [null, Validators.required]
  //     })
  //   })
  // }

}
