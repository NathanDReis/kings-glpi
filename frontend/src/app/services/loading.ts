import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = signal<boolean>(false);

  run(): void {
    this.isLoading.update(() => true);
  }

  stop(): void {
    this.isLoading.update(() => false);
  }

  get current(): boolean {
    return this.isLoading();
  }
}
