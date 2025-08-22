import { Injectable, inject } from '@angular/core';
import { 
    Auth, 
    user, 
    signInWithEmailAndPassword, 
    signOut, 
    UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  user$: Observable<any> = user(this.auth);

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then((user: UserCredential) => {
      this.router.navigate(['/panel']);
      return user;
    });
  }

  async logout(): Promise<void> {
    return signOut(this.auth)
    .then(() => {
      this.router.navigate(['/login']);
    });
  }
}
