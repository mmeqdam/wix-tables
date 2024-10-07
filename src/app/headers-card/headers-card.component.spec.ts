import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersCardComponent } from './headers-card.component';

describe('HeadersCardComponent', () => {
  let component: HeadersCardComponent;
  let fixture: ComponentFixture<HeadersCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadersCardComponent]
    });
    fixture = TestBed.createComponent(HeadersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
