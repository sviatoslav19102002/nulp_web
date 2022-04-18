import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../services/authorization.service";
import {CookieService} from "../services/cookie.service";
import {Router} from "@angular/router";
import {EmitterService} from "../services/emitter.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  authenticated: boolean = false;

  constructor(private auth: AuthorizationService,
              private cookie: CookieService,
              private router: Router) {
  }

  ngOnInit(): void {
    EmitterService.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    )
  }

  logout(): void {
    this.cookie.clearCookie('credentials');
    this.cookie.clearCookie('user');
    EmitterService.authEmitter.emit(false);
    this.router.navigate(['/']);
  }
}
