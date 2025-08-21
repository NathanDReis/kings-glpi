import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverComponent } from './recover';

describe('Recover', () => {
  let component: RecoverComponent;
  let fixture: ComponentFixture<RecoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
