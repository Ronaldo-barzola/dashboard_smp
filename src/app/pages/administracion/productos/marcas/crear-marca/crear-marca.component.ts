import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-crear-marca',
  templateUrl: './crear-marca.component.html',
  styleUrls: ['./crear-marca.component.css']
})
export class CrearMarcaComponent implements OnInit {
  formBrand!: FormGroup;
  p_bra_id: number = 0;
  p_bra_descri: string = '';
  p_cat_id: any;

  dataCategory: any;


  constructor(private appComponent: AppComponent, private fb: FormBuilder
    , private administracionService: AdministracionService, private toastComponent: ToastComponent
    , private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_bra_id = params['bra_id'];
        this.listBrand();
      }
    });
  }

  ngOnInit() {
    this.setForm();
    this.listCategory();
  }


  listBrand() {
    let post = {
      p_bra_id: this.p_bra_id
    };
    this.administracionService.postGetBrandList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        let dataBrand = data[0];
        this.p_bra_id = dataBrand.bra_id;
        this.p_bra_descri = dataBrand.bra_descri;
        this.p_cat_id = dataBrand.cat_id;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  listCategory() {
    let post = {
      p_cat_id: 0,
      p_cat_descri: '',
      p_cat_active: true,
    };
    this.administracionService.postGetCategoryList(post).subscribe({
      next: (data: any) => {
        this.dataCategory = data;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  onSubmit() {
    if (this.formBrand.valid) {
      let post = {
        p_bra_id: this.p_bra_id,
        p_cat_id: this.p_cat_id,
        p_bra_descri: this.p_bra_descri,
      }
      this.administracionService.postBrandRegister(post).subscribe({
        next: (data: any) => {
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/productos/marcas/']);
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

  setForm() {
    this.formBrand = this.fb.group({
      p_cat_id: ['', [Validators.required]],
      p_bra_descri: ['', [Validators.required]],
    })
  }

}
