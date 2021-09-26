import { AccountService } from './../../account/account.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountService: AccountService,
    private router: Router
  ){}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map( user => !!user ),
      tap( auth => {
        if(!auth) {
          const navigationExtras: NavigationExtras = {
            queryParams: { returnUrl: state.url}
          };
          //console.log(`Navigating to: accout/login - ${state.url}`);
          this.router.navigate(["account/login"], navigationExtras);
        }  
      })
    );
  }
  
}
