import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './private-layout.html',
  styles: ``,
})
export class PrivateLayoutComponent implements AfterViewInit {
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

    // const btnDropDown = document.getElementById("mega-menu-dropdown-button");
    // const dropdown = document.getElementById("mega-menu-dropdown");

    // if (btnDropDown && dropdown) {
    //   btnDropDown.addEventListener("click", () => {
    //     dropdown.classList.toggle("hidden");
    //   });

    //   // Fecha ao clicar fora
    //   document.addEventListener("click", (event) => {
    //     if (!btnDropDown.contains(event.target as Node) && !dropdown.contains(event.target as Node)) {
    //       dropdown.classList.add("hidden");
    //     }
    //   });
    // }
  }
}
