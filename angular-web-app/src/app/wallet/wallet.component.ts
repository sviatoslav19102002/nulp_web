import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from "../services/authorization.service";
import {Router} from "@angular/router";
import {CookieService} from "../services/cookie.service";
import {HttpClient} from "@angular/common/http";
import {EmitterService} from "../services/emitter.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  addMoneyVar: boolean = false
  form: FormGroup = {} as FormGroup;
  walletHaving: boolean = false;
  API: string = 'http://localhost:8080';

  changeAddMoneyVar(): void {
    this.addMoneyVar = !this.addMoneyVar
  }

  constructor(private auth: AuthorizationService,
              private router: Router,
              private http: HttpClient,
              private cookie: CookieService,
              private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    EmitterService.walletEmitter.subscribe(
      (wallet: boolean) => {
        this.walletHaving = wallet;
      }
    );
    this.checkWalletCookie();
    this.checkCredentialsCookie();

    this.form = this.formBuilder.group({
      email: '',
      amount: '',
      purpose: ''
    })
  }

  checkWalletCookie(){
    if(this.cookie.getCookie('wallet')){
      this.wallet = JSON.parse(this.cookie.getCookie('wallet'));
    }
  }

  checkCredentialsCookie(){
    if(this.cookie.getCookie('credentials')){
      this.credentials = JSON.parse(this.cookie.getCookie('credentials'));
    }
  }

  wallet: {
    name: string,
    amount: string,
    owner_id: string
  } = {name: '', amount: '', owner_id: ''}

  credentials: {
    password: string,
    username: string,
  } =  {password: '', username: ''}
    // JSON.parse(this.cookie.getCookie('credentials'));

  createWallet() {
    this.http.post(this.API + '/api/v1/wallet', {},{
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: (data) => {
        this.cookie.setCookie('wallet',JSON.stringify(data), 60);
        this.wallet = JSON.parse(JSON.stringify(data));
        EmitterService.walletEmitter.emit(false);
        this.router.navigate(['/']);
      },
      error: (err => {
        if(err.status === 400){
          alert('The user already have the wallet.');
        }
      })
    });
  }

  deleteWallet(): void {
    this.http.delete(this.API + '/api/v1/wallet', {
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: (data)=>{
        this.cookie.clearCookie('wallet');
        EmitterService.walletEmitter.emit(true);
        EmitterService.historyEmitter.emit(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
      }
  });
  }

  transfer(): void {
    this.http.post(this.API + '/api/v1/transfer',  this.form.getRawValue(),{
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: () => {
        this.wallet.amount = String(Number(this.wallet.amount) - Number(this.form.getRawValue().amount))
        this.cookie.setCookie('wallet',JSON.stringify(this.wallet), 60);
        this.router.navigate(['/']);
      },
      error: (err => {
        console.log('transfer error')
      })
    });
  }

  addMoney(): void {
    this.http.put(this.API + '/api/v1/wallet',  {'amount': this.form.getRawValue().amount},{
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: () => {
        this.wallet.amount = String(Number(this.wallet.amount) + Number(this.form.getRawValue().amount))
        this.cookie.setCookie('wallet',JSON.stringify(this.wallet), 60);
        this.changeAddMoneyVar()
      },
      error: (err => {
        console.log('put money error')
      })
    });
  }
}
