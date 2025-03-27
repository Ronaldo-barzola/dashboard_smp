import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estaciones-de-venta',
  templateUrl: './estaciones-de-venta.component.html',
  styleUrls: ['./estaciones-de-venta.component.css']
})
export class EstacionesDeVentaComponent implements OnInit {
  dataSaleStation: any;

  p_limit: number = 10;
  p_offset: number = 0;
  total: number = 0;
  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, public utils: FunctionsUtils, private toastComponent: ToastComponent, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listSaleStation();
  }

  goRoute(id: number) {
    this.router.navigate(['administracion/locales/estaciones-de-venta/crear-estacion'], { queryParams: { sta_id: id } });
  }

  listSaleStation() {
    let post = {
      p_sta_id: 0,
      p_psa_id: 0,
      p_psa_active: null,
      p_limit: this.p_limit,
      p_offset: this.p_offset
    };
    console.log(post);
    this.administracionService.postSaleStationList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSaleStation = data;
        (data[0]) ? this.total = data[0].v_total : 0;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }


  deleteStation(id: number, status: boolean) {
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
          p_sta_id: id,
          p_sta_active: !status
        }
        console.log(data);

        this.administracionService.postSaleStationRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listSaleStation();
          },
          error: (error: any) => {
            this.toastComponent.showToast('Error al deshabilitar , intentelo nuevamente.', 'info');
            console.error(error);
          }
        });
      }
    });
  }

  changePage(e: any) {
    console.log(e);
    this.p_offset = e;
    this.listSaleStation()
  }

  onPageSizeChange(e: any) {
    this.p_offset = 0;
    this.listSaleStation();
  }

}
