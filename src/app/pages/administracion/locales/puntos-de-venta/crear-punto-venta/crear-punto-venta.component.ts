import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-punto-venta',
  templateUrl: './crear-punto-venta.component.html',
  styleUrls: ['./crear-punto-venta.component.css']
})
export class CrearPuntoVentaComponent implements OnInit {
  formSalePoint!: FormGroup

  p_psa_id: number = 0;
  p_psa_descri: string = '';
  p_psa_code: string = '';
  p_psa_addres: string = '';
  p_psa_x: string = '';
  p_psa_y: string = '';
  p_psa_phonum: string = '';

  constructor(private appComponent: AppComponent, private fb: FormBuilder
    , private administracionService: AdministracionService, private toastComponent: ToastComponent
    , private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_psa_id = params['psa_id'];
        this.listSalePoints();
      }
    });

  }

  ngOnInit() {
    this.setForm();
  }


  listSalePoints() {
    let post = {
      p_psa_id: this.p_psa_id,
    };
    console.log(post);
    this.administracionService.postGetSalePointList(post).subscribe({
      next: (data: any) => {
        let dataSalePoint = data[0];
        this.p_psa_descri = dataSalePoint.psa_descri;
        this.p_psa_code = dataSalePoint.psa_code;
        this.p_psa_addres = dataSalePoint.psa_addres;
        this.p_psa_phonum = dataSalePoint.psa_phonum;

      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  onSubmit() {
    if (this.formSalePoint.valid) {
      let post = {
        p_psa_id: this.p_psa_id,
        p_psa_descri: this.p_psa_descri,
        p_psa_code: this.p_psa_code,
        p_psa_addres: this.p_psa_addres,
        p_psa_x: this.p_psa_x,
        p_psa_y: this.p_psa_y,
        p_psa_phonum: this.p_psa_phonum,
      }
      console.log(post);
      this.administracionService.postSalePointRegister(post).subscribe({
        next: (data: any) => {
          console.log("data retorno ", data);
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/locales/puntos-de-venta']);
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

  setForm() {
    this.formSalePoint = this.fb.group({
      p_psa_descri: ['', [Validators.required]],
      p_psa_code: ['', [Validators.required]],
      p_psa_addres: ['', [Validators.required]],
      // p_psa_y: ['', [Validators.required]],
      p_psa_phonum: ['', [Validators.required]],
    })
  }

}
