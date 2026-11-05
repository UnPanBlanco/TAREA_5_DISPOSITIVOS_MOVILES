import { TestBed } from '@angular/core/testing';
import { ToastUiService } from './toast-ui-service';

describe('ToastUiService', () => {
  let service: ToastUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
