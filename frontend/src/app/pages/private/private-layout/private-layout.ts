import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ConfirmationService, MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AuthService } from '../../../core/auth.service';

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
    MenubarModule,
    SplitButtonModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './private-layout.html',
  styles: ``,
})
export class PrivateLayoutComponent implements AfterViewInit, OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);

  logout() {
    this.confirmationService.confirm({
      message: 'Deseja encerrar a sessão?',
      header: 'Sair',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass: 'p-button-text',
      rejectButtonProps: {
        label: 'Não',
        severity: 'secondary',
        text: true,
      },
      acceptButtonProps: {
        label: 'Sim',
        text: true,
      },
      accept: () => {
        this.authService.logout();
      },
      key: 'positionDialog',
    });
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

  itemsConfig: MenuItem[] = [
    {
      label: 'Usuário',
      icon: 'pi pi-fw pi-user',
      items: [
        // {
        //   label: 'Novo',
        //   icon: 'pi pi-fw pi-user-plus'
        // },
        // {
        //   label: 'Editar',
        //   icon: 'pi pi-fw pi-user-minus'
        // },
        // {
        //   label: 'Pesquisar',
        //   icon: 'pi pi-fw pi-users',
        //   items: [
        //     {
        //       label: 'Filtrar',
        //       icon: 'pi pi-fw pi-filter',
        //       items: [
        //         {
        //           label: 'Print',
        //           icon: 'pi pi-fw pi-print'
        //         }
        //       ]
        //     },
        //     {
        //       icon: 'pi pi-fw pi-bars',
        //       label: 'Listar'
        //     }
        //   ]
        // }
      ]
    },
    {
      label: 'Configurações',
      icon: 'pi pi-fw pi-cog',
      // items: [
      //   {
      //     label: 'Edit',
      //     icon: 'pi pi-fw pi-pencil',
      //     items: [
      //       {
      //         label: 'Save',
      //         icon: 'pi pi-fw pi-calendar-plus'
      //       },
      //       {
      //         label: 'Delete',
      //         icon: 'pi pi-fw pi-calendar-minus'
      //       }
      //     ]
      //   },
      //   {
      //     label: 'Archieve',
      //     icon: 'pi pi-fw pi-calendar-times',
      //     items: [
      //       {
      //         label: 'Remove',
      //         icon: 'pi pi-fw pi-calendar-minus'
      //       }
      //     ]
      //   }
      // ]
    },
    {
      separator: true
    },
    {
      label: 'Sair',
      icon: 'pi pi-fw pi-power-off'
      , command: () => this.logout()
    }
  ];
}
