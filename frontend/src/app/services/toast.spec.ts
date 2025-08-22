import { TestBed } from '@angular/core/testing';

import { ToastComponent } from '../components/toast/toast';

describe('Toast', () => {
  let service: ToastComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
