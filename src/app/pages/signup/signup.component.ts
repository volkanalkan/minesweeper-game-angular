import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';

  constructor(private auth: Auth, private router: Router) {}

  signup() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Signup failed', error);
      });
  }
}
