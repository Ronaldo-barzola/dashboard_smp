import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {
  dataBrand: any;
  p_limit: number = 10;
  p_offset: number = 0;
  total: number = 0;
  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, public utils: FunctionsUtils, private router: Router) {
    this.appComponent.login = false;
  }
  ngOnInit() {
    this.listBrand();
  }


  goRoute(id: number) {
    this.router.navigate(['administracion/productos/marcas/crear-marca'], { queryParams: { bra_id: id } });
  }

  listBrand() {
    let post = {
      p_bra_id: 0,
      p_cat_id: 0,
      p_cat_active: null,
      p_limit: this.p_limit,
      p_offset: this.p_offset
    };
    this.administracionService.postGetBrandList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataBrand = data;
        (data[0]) ? this.total = data[0].v_total : 0;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  deleteBrand(id: number, status: boolean) {
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
          p_cat_id: id,
          p_cat_active: !status
        }

        this.administracionService.postCategoryRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            }
            this.toastComponent.showToast(result.message, 'success');
            this.listBrand();
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
    this.listBrand()
  }

  onPageSizeChange(e: any) {
    this.p_offset = 0;
    this.listBrand();
  }

}
