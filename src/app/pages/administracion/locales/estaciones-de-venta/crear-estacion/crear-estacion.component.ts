import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-estacion',
  templateUrl: './crear-estacion.component.html',
  styleUrls: ['./crear-estacion.component.css']
})
export class CrearEstacionComponent implements OnInit {

  formStation!: FormGroup;
  p_sta_id: number = 0;
  p_psa_id: string = '';
  p_sta_descri: string = '';

  dataSalePoint: any;
  constructor(private appComponent: AppComponent, private fb: FormBuilder,
    private administracionService: AdministracionService, private toastComponent: ToastComponent,
    private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_sta_id = params['sta_id'];
        this.listStation();
      }
    });
  }

  ngOnInit() {
    this.setForm();
    this.listSalePoints();
  }

  setForm() {
    this.formStation = this.fb.group({
      p_psa_id: ['', [Validators.required]],
      p_sta_descri: ['', [Validators.required]],
    })
  }

  listStation() {
    let post = {
      p_sta_id: this.p_sta_id,
      p_psa_id: 0,
      p_psa_active: null,
    };
    console.log(post);
    this.administracionService.postSaleStationList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        let dataSalePoint = data[0];
        this.p_sta_id = dataSalePoint.sta_id;
        this.p_psa_id = dataSalePoint.psa_id;
        this.p_sta_descri = dataSalePoint.sta_descri;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listSalePoints() {
    let post = {
      p_psa_id: 0,
      p_com_id: '',
      p_psa_active: null,
    };
    console.log(post);
    this.administracionService.postGetSalePointList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSalePoint = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  onSubmit() {
    if (this.formStation.valid) {
      let post = {
        p_sta_id: this.p_sta_id,
        p_psa_id: this.p_psa_id,
        p_sta_descri: this.p_sta_descri,
      }
      console.log(post);
      this.administracionService.postSaleStationRegister(post).subscribe({
        next: (data: any) => {
          console.log("data retorno ", data);
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/locales/estaciones-de-venta']);
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
