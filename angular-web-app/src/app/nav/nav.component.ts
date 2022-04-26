import {Component, OnInit} from '@angular/core';
import {AuthorizationService} from "../services/authorization.service";
import {CookieService} from "../services/cookie.service";
import {Router} from "@angular/router";
import {EmitterService} from "../services/emitter.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  API: string = 'http://localhost:8080';
  authenticated: boolean = false;
  transfer_history: boolean = false;

  constructor(private auth: AuthorizationService,
              private cookie: CookieService,
              private router: Router,
              private http: HttpClient,) {
  }

  ngOnInit(): void {
    EmitterService.authEmitter.subscribe(
      (auth: boolean) => {
        this.authenticated = auth;
      }
    )

    EmitterService.historyEmitter.subscribe(
      (history: boolean) => {
        this.transfer_history = history;
      }
    )
  }

  checkCred(){
    if(this.cookie.getCookie('credentials')){
      this.credentials = JSON.parse(this.cookie.getCookie('credentials'));
    };
    this.checkWallet()
  }

  credentials: {
    password: string;
    username: string;
  } = {password: '', username: ''}

  checkWallet(): void {
    this.http.get(this.API + '/api/v1/wallet', {
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: (data)=>{
        console.log(data)
        this.cookie.setCookie('wallet',JSON.stringify(data), 60);
        console.log(JSON.stringify(data))
        EmitterService.walletEmitter.emit(false);
        EmitterService.historyEmitter.emit(true);
      },
      error: (err) => {
        if(err.status === 404){
          console.log('hi, all')
          EmitterService.walletEmitter.emit(true);
        }
      }
    });
  }

  logout(): void {
    this.cookie.clearCookie('credentials');
    this.cookie.clearCookie('user');
    EmitterService.authEmitter.emit(false);
    this.router.navigate(['/']);
  }
}
