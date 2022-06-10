import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CookieService} from "../services/cookie.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EmitterService} from "../services/emitter.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  API: string = 'http://localhost:8080';
  isEditable: boolean = false;
  form: FormGroup = {} as FormGroup;
  cred: string = '';

  user: {
    first_name: string,
    second_name: string,
    username: string,
    email: string
  } = JSON.parse(this.cookie.getCookie('user'));

  checkUserCookie(){
    if(this.cookie.getCookie('user')){
      this.user = JSON.parse(this.cookie.getCookie('user'));
    }
  }

  credentials: {
    password: string,
    username: string,
  } = JSON.parse(this.cookie.getCookie('credentials'));

  checkCredentialsCookie(){
    if(this.cookie.getCookie('credentials')){
      this.credentials = JSON.parse(this.cookie.getCookie('credentials'));
    }
  }

  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
  }

  getCookieVariable() {
    return this.cookie
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: this.user.first_name,
      second_name: this.user.second_name,
      username: this.user.username,
      email: this.user.email,
      password: this.credentials.password
    })
    this.checkAuth();

    this.checkUserCookie();
    this.checkCredentialsCookie();
  }

  checkAuth(){
    if(this.cookie.getCookie('credentials')){
      EmitterService.authEmitter.emit(true);
    }else {
      EmitterService.authEmitter.emit(false);
    }
  }

  changeEditableState(): void {
    this.isEditable = !this.isEditable;
    this.checkUserCookie();
  }

    submit(): void {
      this.http.put(this.API + '/api/v1/user/put', this.form.getRawValue(), {
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: ()=>{
        this.user = this.form.getRawValue();
        this.cookie.setCookie('user', JSON.stringify(this.user), 60);
        this.router.navigate(['/']);
      },
      error: (err => {
        if(err.status === 404){
          alert('Try again!');
        }
      })
    });
  }

  delete(): void {
    this.http.delete(this.API + '/api/v1/user/delete', {
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: ()=>{
        this.router.navigate(['/']);
        this.cookie.clearCookie('user');
        this.cookie.clearCookie('credentials');
      },
      error: (err => {
        if(err.status === 404){
          alert('There is not user with this username');
        }
      })
    });
  }
}
