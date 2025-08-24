import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast';
import { SpinnerComponent } from './components/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ToastComponent,
    SpinnerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 
}
