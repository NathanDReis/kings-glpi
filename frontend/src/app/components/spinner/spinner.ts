import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css'
})
export class SpinnerComponent {
  loadingService = inject(LoadingService);
}
