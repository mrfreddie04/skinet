import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IUser } from 'src/app/shared/models/user';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public errors: string[];

  constructor(
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.registerForm = new FormGroup({
      displayName:new FormControl("", [Validators.required]),
      email: new FormControl("", 
        [Validators.required, Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")],
        [this.validateEmailAsync]),
      password: new FormControl("", [Validators.required])
    });
  }

  public onSubmit() {    
    this.accountService.register(this.registerForm.value).subscribe(
      (user: IUser) => {
        this.router.navigateByUrl("/shop");
      },
      (err) => {
        console.log(err);
        this.errors = err.errors;
      }  
    );
  }

  // public validateEmailNotTaken(): AsyncValidatorFn {    
  //   return (control: FormControl): Observable<ValidationErrors> => {
  //     return timer(500).pipe(
  //       switchMap(()=>{
  //         const email = control.value;
  //         if(!email) 
  //           return of(false);          
  //         return this.accountService.checkEmailExist(email);
  //       }),
  //       map( (value: boolean) =>{
  //         return value ? { emailExists: true} : null;
  //       })        
  //     )
  //   };    
  // }

  public validateEmailAsync: (control: FormControl) => Observable<ValidationErrors> =
    (control: FormControl): Observable<ValidationErrors> => {
      return timer(500).pipe(
        switchMap(()=>{
          const email = control.value;
          //console.log(`SwitchMap: ${email}`);
          if(!email) 
            return of(false);          
          return this.accountService.checkEmailExist(email);
        }),
        map( (emailExists: boolean) =>{
          //console.log(`Map: ${emailExists}`);
          return emailExists ? { emailExists: true} : null;
        })        
      )
    };   
}
