import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderhistoryPage } from './orderhistory.page';

describe('OrderhistoryPage', () => {
  let component: OrderhistoryPage;
  let fixture: ComponentFixture<OrderhistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderhistoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderhistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
