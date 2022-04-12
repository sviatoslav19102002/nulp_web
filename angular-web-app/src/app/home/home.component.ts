import { Component, OnInit } from '@angular/core';
import {EmitterService} from "../services/emitter.service";
import {CookieService} from "../services/cookie.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cookie: CookieService) { }

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(){
    if(this.cookie.getCookie('credentials')){
      EmitterService.authEmitter.emit(true);
    }else {
      EmitterService.authEmitter.emit(false);
    }
  }
}
