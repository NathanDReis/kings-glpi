import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
} from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast';
import { InputComponent } from '../../../components/input/input';
import { LoadingService } from '../../../services/loading';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, InputComponent],
  templateUrl: './login.html',
  styles: ``,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private ld = inject(LoadingService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async login() {
    try {
      this.ld.loading(true);
      const raw = this.form.getRawValue();
      await this.authService.login(raw.email, raw.password);
    } catch (err) {
      this.toast.show('Credenciais inválidas', 'error');
    } finally {
      this.ld.loading(false);
    }
  }
}
