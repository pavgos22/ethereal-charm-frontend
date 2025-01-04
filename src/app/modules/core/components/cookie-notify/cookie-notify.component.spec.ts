import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieNotifyComponent } from './cookie-notify.component';

describe('CookieNotifyComponent', () => {
  let component: CookieNotifyComponent;
  let fixture: ComponentFixture<CookieNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookieNotifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
