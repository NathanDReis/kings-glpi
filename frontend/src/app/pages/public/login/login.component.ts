import { Component, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user 
} from '@angular/fire/auth';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  FormControlName 
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async login() {
    try {
      const raw = this.form.getRawValue();
      await this.authService.login(raw.email, raw.password);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }
}
