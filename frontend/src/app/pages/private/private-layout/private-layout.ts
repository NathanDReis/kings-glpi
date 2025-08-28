import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-private-layout',
  imports: [
    RouterOutlet, 
    RouterLink,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    Ripple,
    MenubarModule
  ],
  templateUrl: './private-layout.html',
  styles: ``,
})
export class PrivateLayoutComponent implements AfterViewInit, OnInit {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }

  ngAfterViewInit() {
    const btnMenu = document.getElementById("button-menu");
    const menu = document.getElementById("mega-menu");

    if (btnMenu && menu) {
      btnMenu.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
    }
  }

  items: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          {
              label: 'Painel',
              icon: 'pi pi-home',
              routerLink: '/painel',
          },
          {
              label: 'Serviços',
              icon: 'pi pi-service',
              badge: '2',
              items: [
                  {
                      label: 'Orçamentos',
                      icon: 'pi pi-bolt',
                      routerLink: '/orcamento',
                  },
                  {
                      label: 'Produtos',
                      icon: 'pi pi-server',
                      routerLink: '/produto',
                  },
              ],
          },
      ];
  }
}
