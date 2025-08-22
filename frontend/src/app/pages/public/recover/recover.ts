import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-recover',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './recover.html',
  styles: ``,
})
export class RecoverComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  form: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]]
  });

  async recoverPassword(): Promise<void> {
    try {
      const email = this.form.get('email')!.value;
      await this.authService.recoverPassword(email);
      this.toast.show('E-mail de recuperação enviado', 'success', 5000);
    } catch (error) {
      this.toast.show('Não foi possível enviar o e-mail', 'error', 5000);
    }
  }
}
