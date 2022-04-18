import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthorizationService} from "../services/authorization.service";
import {Router} from "@angular/router";
import {CookieService} from "../services/cookie.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = {} as FormGroup;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthorizationService,
              private router: Router,
              private cookie: CookieService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: '',
      password: ''
    })
  }

  submit() {
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (data) => {
        this.cookie.setCookie('user', JSON.stringify(data), 60);
        this.cookie.setCookie('credentials',
          '{"password":"'+this.form.getRawValue().password+'", "username":"'+this.form.getRawValue().username+'"}',
          60);
        this.router.navigate(['/user']);
      },
      error: (err => {
        if(err.status === 404){
          alert('Wrong Data');
        }
      })
    });
  }
}
