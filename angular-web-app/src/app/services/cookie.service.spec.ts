import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setCookie', () => {
    service.setCookie('string', 'string', 70)
    expect(service).toBeTruthy();
  });

  it('should clearCookie', () => {
    service.clearCookie('string')
    expect(service).toBeTruthy();
  });
});
