import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  formClient!: FormGroup
  p_cli_id: number = 0;
  p_tid_id: string = '';
  p_cli_docnum: string = '';
  p_cli_funame: string = '';
  p_cli_laname: string = '';
  p_cli_address: string = '';
  p_cli_email: string = '';
  p_cli_phonum: string = '';
  p_cli_datebi: any;
  p_gen_id: string = '';

  dataGender: any;
  dataDocument: any;
  dataClients: any;

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_cli_id = params['cli_id'];
        this.listClients();
      }
    });
  }

  ngOnInit() {
    this.setForm();
    this.listGenderType();
    this.listTypeDocumentIdentity();
  }

  listClients() {
    let post = {
      p_cli_id: this.p_cli_id,
    };
    console.log(post);
    this.administracionService.postGetClientList(post).subscribe({
      next: (data: any) => {
        let dataClient = data[0];
        this.p_tid_id = dataClient.tid_id;
        this.p_cli_docnum = dataClient.cli_docnum;
        this.p_cli_funame = dataClient.cli_funame;
        this.p_cli_address = dataClient.cli_addres;
        this.p_cli_email = dataClient.cli_email;
        this.p_cli_phonum = dataClient.cli_phonum;
        this.p_cli_datebi = dataClient.cli_datebi;
        this.p_gen_id = dataClient.gen_id;
        
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  onSubmit() {
    if (this.formClient.valid) {
      let post = {
        p_cli_id: this.p_cli_id,
        p_tid_id: this.p_tid_id,
        p_cli_docnum: this.p_cli_docnum,
        p_cli_funame: this.p_cli_funame,
        p_cli_address: this.p_cli_address,
        p_cli_email: this.p_cli_email,
        p_cli_phonum: this.p_cli_phonum,
        p_cli_datebi: this.p_cli_datebi,
        p_gen_id: this.p_gen_id
      }
      console.log(post);
      this.administracionService.postClientRegister(post).subscribe({
        next: (data: any) => {
          console.log("data retorno ", data);
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/clientes']);
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

  listGenderType() {
    let post = {
      p_gen_id: 0
    }
    this.administracionService.postGetGenderTypeList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataGender = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
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

  setForm() {
    this.formClient = this.fb.group({
      tidId: ['', [Validators.required]],
      cliDocnum: ['', [Validators.required]],
      cliFuname: ['', [Validators.required]],
      // cliLaname: ['', [Validators.required]],
      cliAddress: ['', [Validators.required]],
      cliEmail: ['', [Validators.required]],
      cliPhonum: ['', [Validators.required]],
      cliDatebi: ['', [Validators.required]],
      genId: ['', [Validators.required]],
    })
  }

}
