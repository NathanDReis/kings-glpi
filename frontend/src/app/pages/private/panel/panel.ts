import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.html',
  styles: ``,
})
export class PanelComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
