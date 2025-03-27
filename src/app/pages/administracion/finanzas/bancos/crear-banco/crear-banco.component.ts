import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crear-banco',
  templateUrl: './crear-banco.component.html',
  styleUrls: ['./crear-banco.component.css']
})
export class CrearBancoComponent {

  formBank!: FormGroup;
  p_ban_descri: string = '';
  p_ban_id: number = 0;
  dataBank: any;

  constructor(private fb: FormBuilder, private appComponent: AppComponent,
    private administracionService: AdministracionService,
    private toastComponent: ToastComponent, private router: Router, private route: ActivatedRoute) {

    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_ban_id = params['ban_id'];
        this.listBanks();
      }
    });


  }

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.formBank = this.fb.group({
      banDescri: ['', [Validators.required]]
    });
  }


  listBanks() {
    let post = {
      p_ban_id: this.p_ban_id,
    };
    this.administracionService.postGetBankList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.p_ban_descri = data[0].ban_descri;
      },
      error: (error: any) => {
        console.log(error);
        this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  onSubmit() {
    if (this.formBank.valid) {
      let post = {
        p_ban_id: this.p_ban_id,
        p_ban_descri: this.p_ban_descri
      }
      this.administracionService.postGetBankRegister(post).subscribe({
        next: (data: any) => {
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast('HOLA', 'info');
              this.router.navigate(['/administracion/finanzas/bancos']);
            }
          } else {
            this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
        }
      });
    }
  }


}
