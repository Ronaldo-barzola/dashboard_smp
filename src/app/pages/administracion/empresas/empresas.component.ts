import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  dataEmpresas: any;

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.companyList();
  }

  companyList() {
    this.dataEmpresas = [];

    let data = {
      p_com_id: 0
    }

    this.administracionService.postGetCompanyList(data).subscribe({
      next: (result: any) => {
        this.dataEmpresas = result;
      },
      error: (error: any) => {
        this.toastComponent.showToast('Error al listar empresas, intentelo nuevamente.', 'info');
        console.error(error);
      }
    });
  }

  getCompanyStatus(status: boolean) {
    if (status == true) {
      return '<i class="ri-checkbox-circle-line fs-17 align-middle"></i> Activo';
    } else {
      return '<i class="ri-close-circle-line fs-17 align-middle"></i> Inactivo';
    }
  }

  getCompanyStatusClass(status: boolean) {
    if (status == true) {
      return 'text-success';
    } else {
      return 'text-danger';
    }
  }

  getEnableButtonClass(status: boolean) {
    if (status == true) {
      return 'link-danger';
    } else {
      return 'link-success';
    }
  }

  getEnableButtonText(status: boolean) {
    if (status == true) {
      return 'Deshabilitar';
    } else {
      return 'Habilitar';
    }
  }

  deleteCompany(id: number, status: boolean) {
    let swalText = '';

    if (status == true) {
      swalText = '¿Esta seguro de deshabilitar esta empresa?';
    } else {
      swalText = '¿Esta seguro de habilitar esta empresa?';
    }

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
          p_com_id: id,
          p_com_active: !status
        }

        this.administracionService.postGetCompanyRegister(data).subscribe({
          next: (data: any) => {
            let result = data[0];

            if (result.error != 0) {
              this.toastComponent.showToast(result.message, 'error');
            } else {
              if (status == true) {
                this.toastComponent.showToast('Empresa deshabilitada correctamente.', 'success');
              } else {
                this.toastComponent.showToast('Empresa habilitada correctamente.', 'success');
              }
              this.companyList();
            }
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
