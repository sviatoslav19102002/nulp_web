import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthorizationService} from "../services/authorization.service";
import {Router} from "@angular/router";
import {CookieService} from "../services/cookie.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup = {} as FormGroup;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthorizationService,
              private router: Router,
              private cookie: CookieService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: '',
      second_name: '',
      username: '',
      email: '',
      password: ''
    })
  }

  submit() {
    this.auth.regsiter(this.form.getRawValue()).subscribe({
      next: (data) => {
        this.cookie.setCookie('user', JSON.stringify(data), 60);
        this.cookie.setCookie('credentials',
          '{"password":"'+this.form.getRawValue().password+'", "username":"'+this.form.getRawValue().username+'"}',
          60);
        console.log(this.cookie.getCookie('credentials'))
        this.router.navigate(['/user']);
      },
      error: (err => {
        if(err.status === 400){
          alert('Wrong Data');
        }
      })
    });
  }
}
