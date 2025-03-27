import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-puntos-de-venta',
  templateUrl: './puntos-de-venta.component.html',
  styleUrls: ['./puntos-de-venta.component.css']
})

export class PuntosDeVentaComponent implements OnInit {
  dataSalePoint: any;
  p_limit: number = 0;
  p_offset: number = 0;
  total: number = 0;

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, public utils: FunctionsUtils, private router: Router, private toastComponent: ToastComponent) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listSalePoints();
  }


  goRoute(id: number) {
    this.router.navigate(['administracion/locales/puntos-de-venta/crear-punto-venta'], { queryParams: { psa_id: id } });
  }


  deleteSalePoint(id: number, status: boolean) {
    let swalText = '';
    (status) ? swalText = '¿Esta seguro de deshabilitar?' : swalText = '¿Esta seguro de habilitar?';;

    Swal.fire({
      icon: 'info',
      title: 'Información',
      text: swalText,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          p_psa_id: id,
          p_psa_active: !status
        }
        console.log(data);

        this.administracionService.postSalePointRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listSalePoints();
          },
          error: (error: any) => {
            this.toastComponent.showToast('Error al deshabilitar , intentelo nuevamente.', 'info');
            console.error(error);
          }
        });
      }
    });
  }


  listSalePoints() {
    let post = {
      p_psa_id: 0,
      // p_psa_active: '',
      p_limit: this.p_limit,
      p_offset: this.p_offset
    };
    console.log(post);
    this.administracionService.postGetSalePointList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSalePoint = data;
        (data[0]) ? this.total = data[0].v_total : 0;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }
}
