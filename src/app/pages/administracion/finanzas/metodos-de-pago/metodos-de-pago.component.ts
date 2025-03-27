import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metodos-de-pago',
  templateUrl: './metodos-de-pago.component.html',
  styleUrls: ['./metodos-de-pago.component.css']
})
export class MetodosDePagoComponent implements OnInit {

  dataMethods: any;
  p_limit: number = 10;
  p_offset: number = 0;
  total: number = 0;

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, public utils: FunctionsUtils, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.listMethods();
  }

  goRoute(id: number) {
    this.router.navigate(['administracion/finanzas/metodos-de-pago/crear-metodo-de-pago'], { queryParams: { mpa_id: id } });
  }

  listMethods() {
    let post = {
      p_mpa_id: 0,
      p_mpa_active: null,
      p_limit: this.p_limit,
      p_offset: this.p_offset > 0 ? (this.p_offset - 1) * this.p_limit : 0
    };
    console.log('params ', post);
    this.administracionService.postMethodPaymentList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataMethods = data;
        this.total = data[0].v_total;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  deleteMethod(id: number, status: boolean) {
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
          p_mpa_id: id,
          p_mpa_active: !status
        }

        this.administracionService.postMethodPaymentRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listMethods();
          },
          error: (error: any) => {
            this.toastComponent.showToast('Error al deshabilitar empresa, intentelo nuevamente.', 'info');
            console.error(error);
          }
        });
      }
    });
  }

  changePage(e: any) {
    console.log(e);
    this.p_offset = e;
    this.listMethods()
  }

  onPageSizeChange(e: any) {
    this.p_offset = 0;
    this.listMethods();
  }

}
