import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgButton } from './kg-button';

describe('KgButton', () => {
  let component: KgButton;
  let fixture: ComponentFixture<KgButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KgButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KgButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
