import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  dataEmpresas: any;
  dataProviders: any;

  p_limit: number = 10;
  p_offset: number = 0;
  total: number = 0;

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, public utils: FunctionsUtils, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listProviders();
  }

  goRoute(id: number) {
    this.router.navigate(['administracion/clientes/crear-cliente'], { queryParams: { cli_id: id } });
  }

  deleteProvider(id: number, status: boolean) {
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
          p_prv_id: id,
          p_prv_active: !status
        }
        console.log(data);
        this.administracionService.postProviderRegister(data).subscribe({
          next: (data: any) => {            
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listProviders();
          },
          error: (error: any) => {
            this.toastComponent.showToast('Error al deshabilitar empresa, intentelo nuevamente.', 'info');
            console.error(error);
          }
        });
      }
    });
  }

  listProviders() {
    let post = {
      p_prv_id: 0,
      p_prv_active: null,
      p_limit: this.p_limit,
      p_offset: this.p_offset
    };
    console.log(post);
    this.administracionService.postGetProviderList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataProviders = data;
        (data[0]) ? this.total = data[0].v_total : 0;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  changePage(e: any) {
    console.log(e);
    this.p_offset = e;
    this.listProviders()
  }

  onPageSizeChange(e: any) {
    this.p_offset = 0;
    this.listProviders();
  }


}
