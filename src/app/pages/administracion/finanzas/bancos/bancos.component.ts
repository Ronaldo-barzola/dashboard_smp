import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit {

  banks: any

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, public utils: FunctionsUtils, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.listBanks();
  }

  goRoute(id: number) {
    this.router.navigate(['/administracion/finanzas/bancos/crear-banco'], { queryParams: { ban_id: id } });
  }

  listBanks() {
    let post = {
      p_ban_id: 0,
      p_ban_descri: ''

    };
    this.administracionService.postGetBankList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.banks = data;
        console.log(this.banks);
      },
      error: (error: any) => {
        console.log(error);
        this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  deleteBank(id: number, status: boolean) {
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
          p_ban_id: id,
          p_ban_active: !status
        }

        this.administracionService.postGetBankRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listBanks();
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
