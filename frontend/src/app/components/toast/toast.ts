import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  public toastService = inject(ToastService);

  toasts = this.toastService.toasts();

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
