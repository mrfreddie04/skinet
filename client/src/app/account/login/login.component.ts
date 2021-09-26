import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/models/user';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public returnUrl: string;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    // Would have worked to!
    // const navigation = this.router.getCurrentNavigation();
    // this.returnUrl = navigation?.extras?.queryParams?.returnUrl;  
    // console.log(`Return URL Ctor - ${this.returnUrl}`);  
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || "/shop";  
    //console.log(`Return URL Init - ${this.returnUrl}`);
    this.createLoginForm();
  }

  private createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      password: new FormControl("", [Validators.required])
    });
  }

  public onSubmit() {    
    this.accountService.login(this.loginForm.value).subscribe(
      (user: IUser) => {
        this.router.navigateByUrl(this.returnUrl);
      },
      (err) => console.log(err)
    );
  }
}
