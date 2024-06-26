import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, signOut, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    CommonModule,
  ],
})
export class NavbarComponent {
  isLoggedIn = false;
  userEmail = '';
  userName = '';

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        if (user.email) {
          this.userEmail = user.email;
          this.userName = user.email.split('@')[0];
        }
      } else {
        this.isLoggedIn = false;
        this.userEmail = '';
        this.userName = '';
      }
    });
  }

  toggleTheme() {
    document.body.classList.toggle('dark-theme');
  }

  logout() {
    signOut(this.auth).catch((error) => {
      console.error('Logout failed', error);
    });
  }
}
