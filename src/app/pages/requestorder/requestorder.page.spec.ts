import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestorderPage } from './requestorder.page';

describe('RequestorderPage', () => {
  let component: RequestorderPage;
  let fixture: ComponentFixture<RequestorderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestorderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
