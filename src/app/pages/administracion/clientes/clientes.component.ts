import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  dataClients: any;
  p_limit: number = 10;
  p_offset: number = 0;
  total: number = 0;
  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, public utils: FunctionsUtils, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listClients();
  }

  goRoute(id: number) {
    this.router.navigate(['administracion/clientes/crear-cliente'], { queryParams: { cli_id: id } });
  }

  listClients() {
    let post = {
      p_cli_id: 0,
      p_cli_docnum: '',
      p_cli_active: null,
      p_limit: this.p_limit,
      p_offset: this.p_offset
    };
    console.log(post);
    this.administracionService.postGetClientList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataClients = data;
        (data[0]) ? this.total = data[0].v_total : 0;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  deleteClient(id: number, status: boolean) {
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
          p_cli_id: id,
          p_cli_active: !status
        }

        this.administracionService.postClientRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listClients();
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
    this.listClients()
  }

  onPageSizeChange(e: any) {
    this.p_offset = 0;
    this.listClients();
  }

}
