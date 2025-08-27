import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "mlk-glpi", appId: "1:483168919453:web:9969de2f577aa8da339974", storageBucket: "mlk-glpi.firebasestorage.app", apiKey: "AIzaSyCyIZdh2rXsXmLE5_mrsUAMyZFLbvq7Ayo", authDomain: "mlk-glpi.firebaseapp.com", messagingSenderId: "483168919453", measurementId: "G-Z4BBJJY09B" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    })
  ]
};
