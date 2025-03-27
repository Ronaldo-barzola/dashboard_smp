import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuentas-bancarias',
  templateUrl: './cuentas-bancarias.component.html',
  styleUrls: ['./cuentas-bancarias.component.css']
})
export class CuentasBancariasComponent implements OnInit {

  dataAccounts: any;
  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, public utils: FunctionsUtils, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listAccounts();
  }


  goRoute(id: number) {
    this.router.navigate(['administracion/finanzas/cuentas-bancarias/crear-cuenta-bancaria'], { queryParams: { bac_id: id } });
  }

  listAccounts() {
    let post = {
      p_bac_id: 0
    };
    this.administracionService.postGetAccountBankList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataAccounts = data;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  deleteAccount(id: number, status: boolean) {
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
          p_bac_id: id,
          p_bac_active: !status
        }

        this.administracionService.postBankAccountRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listAccounts();
          },
          error: (error: any) => {
            this.toastComponent.showToast('Error al deshabilitar empresa, intentelo nuevamente.', 'info');
            console.error(error);
          }
        });
      }
    });
  }

}
