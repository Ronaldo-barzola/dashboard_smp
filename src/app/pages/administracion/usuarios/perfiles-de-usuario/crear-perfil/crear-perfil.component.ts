import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { AdministracionService } from 'src/app/services/administracion.service';

@Component({
  selector: 'app-crear-perfil',
  templateUrl: './crear-perfil.component.html',
  styleUrls: ['./crear-perfil.component.css']
})
export class CrearPerfilComponent implements OnInit {
  inputSearchMenu: string = '';
  dataMenuSel: any;
  dataMenuSearchArray: any = [];
  dataMenuPermissionSeted: any = [];

  constructor(private appComponent: AppComponent, private administracionService: AdministracionService, private toastComponent: ToastComponent){
    this.appComponent.login = false;
  }

  ngOnInit(){
    this.fillMenuSel();
  }

  fillMenuSel(){
    let data = {
      p_men_id: 0
    }

    this.administracionService.postGetMenuSel(data).subscribe({
      next: (result: any) => {
        this.dataMenuSel = result;
        console.log(result);
      },
      error: (error: any) => {
        console.error(error);
        this.toastComponent.showToast(error, 'danger');
      }
    });
  }

  menuSearcher(){
    this.dataMenuSearchArray = [];

    this.dataMenuSel.forEach((elementN1: any) => {
      if((elementN1.title).toLowerCase().includes((this.inputSearchMenu).toLowerCase()) && (elementN1.url != null && elementN1.url != '')){
        this.dataMenuSearchArray.push({
          id: elementN1.id,
          title: elementN1.title,
          menu_n1: elementN1.title,
          menu_n2: '-',
          menu_n3: '-',
        });
      }

      if(elementN1.hasOwnProperty('sub_menu')){
        elementN1.sub_menu.forEach((elementN2: any) => {
          if((elementN2.title).toLowerCase().includes((this.inputSearchMenu).toLowerCase()) && (elementN2.url != null && elementN2.url != '')){
            this.dataMenuSearchArray.push({
              id: elementN2.id,
              title: elementN2.title,
              menu_n1: elementN1.title,
              menu_n2: elementN2.title,
              menu_n3: '-',
            });
          }

          if(elementN2.hasOwnProperty('sub_menu')){
            elementN2.sub_menu.forEach((elementN3: any) => {
              if((elementN3.title).toLowerCase().includes((this.inputSearchMenu).toLowerCase()) && (elementN3.url != null && elementN3.url != '')){
                this.dataMenuSearchArray.push({
                  id: elementN3.id,
                  title: elementN3.title,
                  menu_n1: elementN1.title,
                  menu_n2: elementN2.title,
                  menu_n3: elementN3.title,
                });
              }
            });      
          }
        });
      }
    });

    console.log(this.dataMenuSearchArray);
  }

  updatePermissionsModal(id: number){
    let permissionsSee = document.getElementById('permissionsSee' + id) as HTMLInputElement;
    let permissionsInsert = document.getElementById('permissionsInsert' + id) as HTMLInputElement;
    let permissionsEdit = document.getElementById('permissionsEdit' + id) as HTMLInputElement;
    let permissionsDelete = document.getElementById('permissionsDelete' + id) as HTMLInputElement;

    this.dataMenuSearchArray.forEach((element: any) => {
      if(element.id == id){
        element.permisos = {
          sw_see: permissionsSee.checked,
          sw_insert: permissionsInsert.checked,
          sw_edit: permissionsEdit.checked,
          sw_delete: permissionsDelete.checked,
        }

        if(this.dataMenuPermissionSeted.length > 0){
          if(this.searchPermissionByID(this.dataMenuPermissionSeted, id)){
            this.dataMenuPermissionSeted.forEach((element2: any) => {
              if(element2.id == id){
                element2.permisos = element.permisos;
              }
            });
          }else{
            this.dataMenuPermissionSeted.push(element);
          }
        }else{
          this.dataMenuPermissionSeted.push(element);
        }
      } 
    });

    console.log(this.dataMenuPermissionSeted);
  }

  searchPermissionByID(array: any, id: number){
    let counter = 0;
    let permissionExists = false;

    array.forEach((element: any) => {
      if(element.id == id){
        counter++;
      }
    });

    if(counter > 0){
      permissionExists = true;
    }

    return permissionExists;
  }

  returnReadablePermissions(permisos: any){
    let permisosSee = '';
    let permisosInsert = '';
    let permisosEdit = '';
    let permisosDelete = '';
    let returnReadablePermissions = '';

    if(permisos.sw_see){
      permisosSee = 'Lectura, ';  
    }

    if(permisos.sw_insert){
      permisosInsert = 'Escritura, ';  
    }

    if(permisos.sw_edit){
      permisosEdit = 'Actualización, ';  
    }

    if(permisos.sw_delete){
      permisosDelete = 'Eliminación, ';  
    }

    returnReadablePermissions = permisosSee + permisosInsert + permisosEdit + permisosDelete;

    returnReadablePermissions = (permisosSee + permisosInsert + permisosEdit + permisosDelete).substring(0, returnReadablePermissions.length - 2);

    return returnReadablePermissions;
  }

  editSpecificPermission(id: number){

  }

  deleteSpecificPermission(id: number){
    
  }

}
