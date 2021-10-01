import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../shared/models/user';
import { ILogin } from '../shared/models/login';
import { tap, catchError } from 'rxjs/operators';
import { IRegister } from '../shared/models/register';
import { IAddress } from '../shared/models/address';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl: string = environment.apiUrl;
  //private currentUserSource$ = new BehaviorSubject<IUser>(null);
  private currentUserSource$ = new ReplaySubject<IUser>(1);
  public currentUser$ = this.currentUserSource$.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(login: ILogin): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}account/login`,login).pipe(
      tap((user) =>{
        this.currentUserSource$.next(user);
        localStorage.setItem("token",user.token);
      })
    ); 
  }

  public register(register: IRegister): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}account/register`,register).pipe(
      tap((user) =>{
        this.currentUserSource$.next(user);
        localStorage.setItem("token",user.token);
      })
    ); 
  }  

  public logout(): void {
    this.currentUserSource$.next(null);
    localStorage.removeItem("token");
  }  
  
  public checkEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}account/emailexists?email=${email}`);
  }

  public loadCurrentUser(token: string): Observable<IUser>  {
    //console.log(`Token: ${token}`);
    if(!token) {
      this.logout();
      return of(null);
    }

    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
    //return this.http.get<IUser>(`${this.baseUrl}account/`,{headers: headers}).pipe(
    return this.http.get<IUser>(`${this.baseUrl}account/`).pipe(
      tap((user) =>{
        if(user) {
          this.currentUserSource$.next(user);
          localStorage.setItem("token",user.token);
        } else {
          this.logout();
        } 
      }), 
      catchError((err, caught)=>{
        this.logout();
        return throwError(err);
      })       
    );
  }  

  public getUserAddress() {
    return this.http.get<IAddress>(`${this.baseUrl}account/address`);
  }

  public updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(`${this.baseUrl}account/address`, address);
  }

  // public getCurrentUserValue(): IUser {
  //   return this.currentUserSource$.getValue();
  // }
}
