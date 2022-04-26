import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "../services/cookie.service";

export class Transfer {
  purpose: string | undefined;
  amount: string | undefined;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  API: string = 'http://localhost:8080';
  hist_table: Transfer[] | undefined = []
  constructor( private cookie: CookieService,
               private http: HttpClient) { }

  ngOnInit(): void {
    if(this.cookie.getCookie('credentials')){
      this.credentials = JSON.parse(this.cookie.getCookie('credentials'));
    };
    this.history()
  }

  credentials: {
    password: string;
    username: string;
  } = {password: '', username: ''}

  history(): void {
    this.http.get(this.API + '/api/v1/transfer', {
      headers: { "Authorization": "Basic " + btoa(this.credentials.username + ':' + this.credentials.password)}
    }).subscribe({
      next: (data)=>{
        this.hist_table = JSON.parse(JSON.stringify(data))
      },
      error: (err) => {
        console.log(err)
      }
    });
  }
}
