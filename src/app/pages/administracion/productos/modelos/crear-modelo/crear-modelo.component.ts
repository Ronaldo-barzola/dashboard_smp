import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-modelo',
  templateUrl: './crear-modelo.component.html',
  styleUrls: ['./crear-modelo.component.css']
})
export class CrearModeloComponent implements OnInit {
  formModel!: FormGroup;

  p_mod_id: number = 0;
  p_mod_descri: string = '';
  p_bra_id: any;
  p_characteristic: string = ''
  dataModels: any = [];
  dataBrand: any;

  constructor(private appComponent: AppComponent, private fb: FormBuilder
    , private administracionService: AdministracionService, private toastComponent: ToastComponent
    , private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_mod_id = params['mod_id'];
        this.listModels();
        this.listCharacteristics();
      }
    });
  }

  ngOnInit() {
    this.setForm();
    this.listBrand();
  }


  setForm() {
    this.formModel = this.fb.group({
      p_mod_descri: ['', [Validators.required]],
      p_bra_id: ['', [Validators.required]],
    })
  }

  listBrand() {
    let post = {
      p_bra_id: 0,
      p_cat_id: 0,
      p_cat_active: true,
    };
    this.administracionService.postGetBrandList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataBrand = data;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  listCharacteristics(){
    let post = {
      p_mod_id: this.p_mod_id,
      p_cmo_id : 0,
    };
    this.administracionService.postGetCharacteristicList(post).subscribe({
      next: (data: any) => {
        this.dataModels = data;
// this.dataModels.
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }
  listModels() {
    let post = {
      p_mod_id: this.p_mod_id,
      p_mod_descri: '',
      p_bra_id: 0
    };
    this.administracionService.postGetModelList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        let dataModel = data[0];
        this.p_mod_id = dataModel.mod_id;
        this.p_mod_descri = dataModel.mod_descri;
        this.p_bra_id = dataModel.bra_id;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  onSubmit() {
    // console.log(JSON.stringify(this.dataModels));

    if (this.formModel.valid) {
      let post = {
        p_mod_id: this.p_mod_id,
        p_mod_descri: this.p_mod_descri,
        p_bra_id: this.p_bra_id,
        // p_json:JSON.stringify(this.dataModels)
      }
      this.administracionService.postModelRegister(post).subscribe({
        next: (data: any) => {
          console.log("Data retorno", data);
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              let postDetail = {
                p_mod_id: result.id,
                p_json: JSON.stringify(this.dataModels)
              }
              console.log(JSON.stringify(this.dataModels));
              this.administracionService.postCharacteristicsModelMasiveRegister(postDetail).subscribe({
                next: (data: any) => {
                  let result = data[0];

                  if (result.hasOwnProperty('error')) {
                    if (result.error != 0) {
                      this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
                    } else {
                      this.toastComponent.showToast(result.message, 'info');

                      this.router.navigate(['/administracion/productos/modelos']);
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

              // this.toastComponent.showToast(result.message, 'info');

              // this.router.navigate(['/administracion/productos/modelos']);
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

  add() {
    this.dataModels.push({ cmo_id: 0, cmo_descri: this.p_characteristic, flgInput: false });
    this.p_characteristic = '';
  }

  showInputText(idx: any) {
    this.dataModels[idx].flgInput = true;
  }

  editRow(idx: any) {
    const textElement = (<HTMLInputElement>document.getElementById(idx)).value;
    this.dataModels[idx].cmo_descri = textElement;
    this.dataModels[idx].flgInput = false;
  }

  deleteElement(idx: any) {
    this.dataModels.splice(idx, 1);
  }
}
