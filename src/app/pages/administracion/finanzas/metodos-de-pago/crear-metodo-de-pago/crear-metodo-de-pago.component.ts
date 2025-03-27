import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-crear-metodo-de-pago',
  templateUrl: './crear-metodo-de-pago.component.html',
  styleUrls: ['./crear-metodo-de-pago.component.css']
})
export class CrearMetodoDePagoComponent implements OnInit {
  mpg_forpag: string = '';
  showSelectTarjetas: boolean = false;
  showSelectBilleteras: boolean = false;
  p_mpa_id: number = 0;
  p_mpa_descri: string = '';
  p_sw_online: boolean = false;

  formMethod!: FormGroup;

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_mpa_id = params['mpa_id'];
        this.listMethods();
      }
    });
  }

  ngOnInit(): void {
    this.setForm();
  }

  listMethods() {
    let post = {
      p_mpa_id: this.p_mpa_id,
      p_mpa_descri: ''
    };
    this.administracionService.postMethodPaymentList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        let result = data[0];
        this.p_mpa_descri = result.mpa_descri;
        this.p_sw_online = result.sw_online;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  setForm() {
    this.formMethod = this.fb.group({
      mpaDescri: ['', [Validators.required]],
      swOnline: ['']
    });
  }

  onSubmit() {

    if (this.formMethod.valid) {
      let post = {
        p_mpa_id: this.p_mpa_id,
        p_mpa_descri: this.p_mpa_descri,
        p_sw_online: this.p_sw_online
      }
      console.log(post);
      this.administracionService.postMethodPaymentRegister(post).subscribe({
        next: (data: any) => {
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/finanzas/metodos-de-pago']);
            }
          } else {
            this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
          }
        },
        error: (error: any) => {
          console.log(error);
          this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
        }
      });
    }

  }



}
