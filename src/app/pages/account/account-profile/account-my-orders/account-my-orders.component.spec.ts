import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMyOrdersComponent } from './account-my-orders.component';

describe('AccountMyOrdersComponent', () => {
  let component: AccountMyOrdersComponent;
  let fixture: ComponentFixture<AccountMyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountMyOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
