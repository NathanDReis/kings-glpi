import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.component.html',
  styles: ``,
})
export class Panel {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
