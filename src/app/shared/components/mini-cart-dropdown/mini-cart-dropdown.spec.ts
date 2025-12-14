import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCartDropdown } from './mini-cart-dropdown';

describe('MiniCartDropdown', () => {
  let component: MiniCartDropdown;
  let fixture: ComponentFixture<MiniCartDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCartDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCartDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
