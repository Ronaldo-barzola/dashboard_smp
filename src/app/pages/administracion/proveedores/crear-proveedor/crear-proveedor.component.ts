import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.css']
})
export class CrearProveedorComponent implements OnInit {
  dataDocument: any;
  formProvider!: FormGroup;

  p_prv_id: number = 0;
  p_tid_id: string = '';
  p_prv_docnum: string = '';
  p_prv_funame: string = ''
  p_prv_addres: string = ''
  p_prv_email: string = ''
  p_prv_phonum: string = ''

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, private fb: FormBuilder, private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listTypeDocumentIdentity();
    this.setForm();
  }


  setForm() {
    this.formProvider = this.fb.group({
      p_tid_id: ['', [Validators.required]],
      p_prv_docnum: ['', [Validators.required]],
      p_prv_funame: ['', [Validators.required]],
      p_prv_addres: ['', [Validators.required]],
      p_prv_email: ['', [Validators.required]],
      p_prv_phonum: ['', [Validators.required]],
    })
  }
  onSubmit() {
    if (this.formProvider.valid) {
      let post = {
        p_prv_id: this.p_prv_id,
        p_tid_id: this.p_tid_id,
        p_prv_docnum: this.p_prv_docnum,
        p_prv_funame: this.p_prv_funame,
        p_prv_addres: this.p_prv_addres,
        p_prv_email: this.p_prv_email,
        p_prv_phonum: this.p_prv_phonum,
        p_prv_uidreg: 8
      }
      console.log(post);
      this.administracionService.postProviderRegister(post).subscribe({
        next: (data: any) => {
          console.log("data retorno ", data);
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/proveedores']);
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

  listTypeDocumentIdentity() {
    let post = {
      p_tid_id: 0
    }
    this.administracionService.postGetTypeDocumentIdentityList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataDocument = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}
