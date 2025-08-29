import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePdf } from './template-pdf';

describe('TemplatePdf', () => {
  let component: TemplatePdf;
  let fixture: ComponentFixture<TemplatePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatePdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
