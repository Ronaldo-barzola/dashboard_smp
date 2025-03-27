import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-perfiles-de-usuario',
  templateUrl: './perfiles-de-usuario.component.html',
  styleUrls: ['./perfiles-de-usuario.component.css']
})
export class PerfilesDeUsuarioComponent implements OnInit {

  constructor(private appComponent: AppComponent){
    this.appComponent.login = false;
  }

  ngOnInit(){

  }

}
