import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgInputEmail } from './kg-input-email';

describe('KgInputEmail', () => {
  let component: KgInputEmail;
  let fixture: ComponentFixture<KgInputEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KgInputEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KgInputEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
