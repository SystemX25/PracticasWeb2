import { TestBed } from '@angular/core/testing';

import { CarritoService } from './carrito.service.ts.service';

describe('CarritoServiceTsService', () => {
  let service: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
