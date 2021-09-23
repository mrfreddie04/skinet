import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private busyRequestCount: number = 0;

  constructor(private spinnerService: NgxSpinnerService ) { }

  public busy() {
    this.busyRequestCount++;
    //console.log("busy");
    this.spinnerService.show("skinet",{
      type: "timer",
      bdColor: "rgba(255,255,255,0.7)",
      color: "#333333"
    });
  }

  public idle() {
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0) {
      //console.log("idle");
      this.busyRequestCount = 0;
      this.spinnerService.hide("skinet");
    }      
  }
}
