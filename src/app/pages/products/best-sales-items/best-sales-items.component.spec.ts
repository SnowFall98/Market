import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSalesItemsComponent } from './best-sales-items.component';

describe('BestSalesItemsComponent', () => {
  let component: BestSalesItemsComponent;
  let fixture: ComponentFixture<BestSalesItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestSalesItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSalesItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
