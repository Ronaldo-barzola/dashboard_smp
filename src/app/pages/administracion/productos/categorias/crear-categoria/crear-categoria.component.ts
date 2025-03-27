import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css']
})
export class CrearCategoriaComponent implements OnInit {

  formCategory!: FormGroup;
  p_cat_id: number = 0;
  p_cat_descri: string = '';



  constructor(private appComponent: AppComponent, private fb: FormBuilder
    , private administracionService: AdministracionService, private toastComponent: ToastComponent
    , private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_cat_id = params['cat_id'];
        this.listCategory();
      }
    });

  }

  ngOnInit() {
    this.setForm();
  }


  listCategory() {
    let post = {
      p_cat_id: this.p_cat_id,
    };
    this.administracionService.postGetCategoryList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        let dataCategory = data[0];
        this.p_cat_descri = dataCategory.cat_descri;

      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  onSubmit() {
    if (this.formCategory.valid) {
      let post = {
        p_cat_id: this.p_cat_id,
        p_cat_descri: this.p_cat_descri,
      }
      console.log(post);
      this.administracionService.postCategoryRegister(post).subscribe({
        next: (data: any) => {
          console.log("data retorno ", data);
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/productos/categorias']);
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
    this.formCategory = this.fb.group({
      p_cat_descri: ['', [Validators.required]],
    })
  }

}
