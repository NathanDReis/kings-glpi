import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './public-layout.html',
  styles: `
    main {
      background: #020024;
      background: linear-gradient(343deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 53%, rgba(0, 212, 255, 1) 100%);
    }
  `,
})
export class PublicLayoutComponent {
  
}
