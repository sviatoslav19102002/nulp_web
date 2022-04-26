import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletComponent } from './wallet.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('WalletComponent', () => {
  let component: WalletComponent;
  let fixture: ComponentFixture<WalletComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ WalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make post request', function () {
    component.createWallet();
    const req = httpTestingController.match('http://localhost:8080/api/v1/wallet');
    expect(req[0].request.method).toEqual('POST');
  });

  it('should make delete request', function () {
    component.deleteWallet();
    const req = httpTestingController.match('http://localhost:8080/api/v1/wallet');
    expect(req[0].request.method).toEqual('DELETE');
  });

  it('should make transfer post request', function () {
    component.transfer();
    const req = httpTestingController.match('http://localhost:8080/api/v1/transfer');
    expect(req[0].request.method).toEqual('POST');
  });

  it('should make put request', function () {
    component.addMoney();
    const req = httpTestingController.match('http://localhost:8080/api/v1/wallet');
    expect(req[0].request.method).toEqual('PUT');
  });

  it('should ngOnInit', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it('should changeAddMoneyVar', () => {
    component.changeAddMoneyVar()
    expect(component).toBeTruthy();
  });
});
