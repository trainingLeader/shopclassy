import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HydrationRoutine } from './hydration-routine';

describe('HydrationRoutine', () => {
  let component: HydrationRoutine;
  let fixture: ComponentFixture<HydrationRoutine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HydrationRoutine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HydrationRoutine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
