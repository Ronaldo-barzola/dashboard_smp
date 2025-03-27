import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-cuenta-bancaria',
  templateUrl: './crear-cuenta-bancaria.component.html',
  styleUrls: ['./crear-cuenta-bancaria.component.css']
})
export class CrearCuentaBancariaComponent implements OnInit {

  dataBanks: any;
  dataBankAccountType: any;
  dataAccounts: any;
  formAccount!: FormGroup;
  p_bac_id: number = 0;
  p_ban_id: string = '';
  p_bat_id: string = '';
  p_bac_accnum: string = '';
  p_bac_ccinum: string = '';
  p_bac_owner: string = '';

  constructor(private router: Router, private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent, private fb: FormBuilder, private route: ActivatedRoute) {
    this.appComponent.login = false;
    this.setForm();
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length != 0) {
        this.p_bac_id = params['bac_id'];
        this.listAccounts();
      }
    });

  }

  ngOnInit() {

    this.listBanks();
    this.listBankAccountType();

  }

  setForm() {
    this.formAccount = this.fb.group({
      banId: ['', [Validators.required]],
      batId: ['', [Validators.required]],
      bacAccnum: ['', [Validators.required]],
      bacCcinum: ['', [Validators.required]],
      bacOwner: ['', [Validators.required]],


    });
  }
  onSubmit() {

    if (this.formAccount.valid) {
      let post = {
        p_bac_id: this.p_bac_id,
        p_ban_id: this.p_ban_id,
        p_bat_id: this.p_bat_id,
        p_bac_accnum: this.p_bac_accnum,
        p_bac_ccinum: this.p_bac_ccinum,
        p_bac_owner: this.p_bac_owner
      }
      this.administracionService.postBankAccountRegister(post).subscribe({
        next: (data: any) => {
          let result = data[0];

          if (result.hasOwnProperty('error')) {
            if (result.error != 0) {
              this.toastComponent.showToast('Error al registrar, intentelo nuevamente.', 'info');
            } else {
              this.toastComponent.showToast(result.message, 'info');
              this.router.navigate(['/administracion/finanzas/cuentas-bancarias']);
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

  listAccounts() {
    let post = {
      p_bac_id: this.p_bac_id
    };
    this.administracionService.postGetAccountBankList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        let result = data[0];
        this.p_bat_id = result.bat_id;
        this.p_ban_id = result.ban_id;
        this.p_bac_accnum = result.bac_accnum;
        this.p_bac_ccinum = result.bac_accinum;
        this.p_bac_owner = result.bac_owner;
      },
      error: (error: any) => {
        console.log(error);
        // this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  listBanks() {
    let post = {
      p_ban_id: 0,
      p_ban_descri: '',
      p_ban_active: true

    };
    this.administracionService.postGetBankList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataBanks = data;
      },
      error: (error: any) => {
        console.log(error);
        this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

  listBankAccountType() {
    let post = {
      p_bat_id: 0,
      p_bat_active: true

    };
    this.administracionService.postGetBankAccountTypeList(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataBankAccountType = data;
      },
      error: (error: any) => {
        console.log(error);
        this.toastComponent.showToast('Error al registrar la empresa, intentelo nuevamente.', 'info');
      }
    });
  }

}
