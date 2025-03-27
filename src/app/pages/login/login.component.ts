import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  // login : boolean = true;

  constructor(private router: Router, private appComponent: AppComponent, private auth: AuthService, private toastComponent: ToastComponent, private userService: UsersService) {
    this.appComponent.login = true;
  }

  ngOnInit() {
  }


  loginUser() {
    let btnLogin = document.getElementById('btnLoginAction') as HTMLButtonElement;
    btnLogin.innerHTML = '<span class="align-items-center"><span class="spinner-border flex-shrink-0" role="status"><span class="visually-hidden">Loading...</span></span><span class="flex-grow-1 ms-2">Ingresando...</span></span>';
    btnLogin.classList.add('pe-none', 'btn-load');

    let data = {
      p_loging: this.username,
      p_passwd: this.password,
      p_apl_id: 5
    }
    console.log("data login ", data);

    this.userService.login(data).subscribe({
      next: (data: any) => {
        let result = data[0];
        if (result.hasOwnProperty('error')) {
          if (result.error != 0) {
            btnLogin.innerHTML = 'Ingresar';
            btnLogin.classList.remove('pe-none', 'btn-load');
            this.toastComponent.showToast(result.mensa, 'danger');
          } else {
            this.toastComponent.showToast('Inicio de sesión correcto.', 'success');
            localStorage.setItem("session-dashboard", result.numid);
            setTimeout(() => {
              btnLogin.innerHTML = 'Ingresar';
              btnLogin.classList.remove('pe-none', 'btn-load');
              // this.appComponent.login = false;
              this.router.navigate(['/dashboard']);
            }, 2000);
          }
        } else {
          btnLogin.innerHTML = 'Ingresar';
          btnLogin.classList.remove('pe-none', 'btn-load');
          this.toastComponent.showToast('Error al iniciar sesión, intentelo nuevamente.', 'danger');
        }
      },
      error: (error: any) => {
        console.error(error);
        btnLogin.innerHTML = 'Ingresar';
        btnLogin.classList.remove('pe-none', 'btn-load');
        this.toastComponent.showToast('Error al iniciar sesión, intentelo nuevamente.', 'danger');
      }
    });
  }

  togglePassword() {
    let passwordInput = document.getElementById('password-input') as HTMLInputElement;
    let passwordIcon = document.getElementById('passwordEye') as HTMLSpanElement;

    if (passwordIcon.classList.contains('ri-eye-fill')) {
      passwordInput.type = 'text';
      passwordIcon.classList.remove('ri-eye-fill');
      passwordIcon.classList.add('ri-eye-off-fill');
    } else {
      passwordInput.type = 'password';
      passwordIcon.classList.remove('ri-eye-off-fill');
      passwordIcon.classList.add('ri-eye-fill');
    }
  }

  goToPage(page: any) {
    this.router.navigate([page]);
  }
}
