import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCar } from './shop-car';

describe('ShopCar', () => {
  let component: ShopCar;
  let fixture: ComponentFixture<ShopCar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopCar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopCar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
