import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

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
