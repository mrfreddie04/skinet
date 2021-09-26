import { Component, ElementRef, Input, OnInit, Self, ViewChild, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  //@Input("control") control: FormControl = null;
  @Input("label") label: string = "";
  @Input("type") type: string = "text";
  @ViewChild("input", {static: true}) input: ElementRef;

  constructor(@Self() public controlDir: NgControl) { 
    //this gives us access to FormControl passed to this component
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    //get FormControl
    const control = this.controlDir.control;
    //transform validators
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    //recalculate the value and validation status for the control
    control.updateValueAndValidity();
  }

  public onChange: (event:any)=>any;
  public onTouched: ()=>any;

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  showErrors(): boolean {
    if(this.controlDir && this.controlDir.control) {
      const {valid, touched } = this.controlDir.control;
      return !valid && touched;
    }
    return false;
  }

  showStatus(): boolean {
    if(this.controlDir && this.controlDir.control) {
      const {touched } = this.controlDir.control;
      return touched;
    }
    return false;
  }  
  showErrorsAsync(): boolean {
    if(this.controlDir && this.controlDir.control) {
      const {valid, dirty } = this.controlDir.control;
      return !valid && dirty;
    }
    return false;
  }

}
