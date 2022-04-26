import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from "@angular/router";
import { NavComponent } from './nav/nav.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WalletComponent } from './wallet/wallet.component';
import { HistoryComponent } from './history/history.component';

const appRoutes: Routes =[
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent},
  {path: '', component: HomeComponent},
  {path: 'wallet', component: WalletComponent},
  {path: 'history', component: HistoryComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    RegisterComponent,
    UserComponent,
    HomeComponent,
    WalletComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [NavComponent, HistoryComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
