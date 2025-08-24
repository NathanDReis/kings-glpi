import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = signal<boolean>(false);
  
  loading(run: boolean): void {
    this.isLoading.set(run);
  }
}
