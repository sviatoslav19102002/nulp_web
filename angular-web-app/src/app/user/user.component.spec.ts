import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {CookieService} from "../services/cookie.service";

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ UserComponent ]
    })
    .compileComponents();
    let cookie = new CookieService();
    let value_credentials = {password: 'string', username: 'string'};
    let value_user = {first_name: 'string', second_name: 'string', username: 'string', email: 'string'};
    // let minutes = 60
    // let expires = '';
    // if (minutes) {
    //   let date = new Date();
    //   date.setTime(date.getTime() + minutes * 60 * 1000);
    //   expires = '; expires=' + date.toUTCString();
    // }
    // document.cookie = 'user' + '=' + (value_user || '') + expires + '; path=/';
    // document.cookie = 'credentials' + '=' + (value_credentials || '') + expires + '; path=/';
    cookie.setCookie('user', JSON.stringify(value_user), 60);
    cookie.setCookie('credentials', JSON.stringify(value_credentials), 60);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make put request', function () {
    component.submit();
    const req = httpTestingController.match('http://localhost:8080/api/v1/user/put');
    expect(req[0].request.method).toEqual('PUT');
  });

  it('should make delete request', function () {
    component.delete();
    const req = httpTestingController.match('http://localhost:8080/api/v1/user/delete');
    expect(req[0].request.method).toEqual('DELETE');
  });

  it('should changeEditableState', () => {
    component.changeEditableState()
    expect(component).toBeTruthy();
  });
});
