import { NgModule, Injectable, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { Socket } from 'ngx-socket-io';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SoporteComponent } from './pages/soporte/soporte.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { ClientesComponent } from './pages/administracion/clientes/clientes.component';
import { MetodosDePagoComponent } from './pages/administracion/finanzas/metodos-de-pago/metodos-de-pago.component';
import { BancosComponent } from './pages/administracion/finanzas/bancos/bancos.component';
import { CuentasBancariasComponent } from './pages/administracion/finanzas/cuentas-bancarias/cuentas-bancarias.component';
import { CertificadosDigitalesComponent } from './pages/administracion/contabilidad/certificados-digitales/certificados-digitales.component';
import { SeriesDocumentosComponent } from './pages/administracion/contabilidad/series-documentos/series-documentos.component';
import { UnidadesDeMedidaComponent } from './pages/administracion/contabilidad/unidades-de-medida/unidades-de-medida.component';
import { CiudadesComponent } from './pages/administracion/delivery/ciudades/ciudades.component';
import { PuntosDeVentaComponent } from './pages/administracion/locales/puntos-de-venta/puntos-de-venta.component';
import { EstacionesDeVentaComponent } from './pages/administracion/locales/estaciones-de-venta/estaciones-de-venta.component';
import { MarcasComponent } from './pages/administracion/productos/marcas/marcas.component';
import { CategoriasComponent } from './pages/administracion/productos/categorias/categorias.component';
import { ProductosComponent } from './pages/administracion/productos/productos/productos.component';
import { ProveedoresComponent } from './pages/administracion/proveedores/proveedores.component';
import { UsuariosComponent } from './pages/administracion/usuarios/usuarios/usuarios.component';
import { PerfilesDeUsuarioComponent } from './pages/administracion/usuarios/perfiles-de-usuario/perfiles-de-usuario.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { VentasComponent } from './pages/ventas/ventas/ventas.component';
import { NotaDeCreditoComponent } from './pages/ventas/nota-de-credito/nota-de-credito.component';
import { NotaDeDebitoComponent } from './pages/ventas/nota-de-debito/nota-de-debito.component';
import { GuiasDeRemisionComponent } from './pages/ventas/guias-de-remision/guias-de-remision.component';
import { CotizacionesComponent } from './pages/ventas/cotizaciones/cotizaciones.component';
import { CajaComponent } from './pages/operaciones/caja/caja.component';
import { ReporteDeCajaComponent } from './pages/operaciones/reporte-de-caja/reporte-de-caja.component';
import { CuentasPorCobrarComponent } from './pages/operaciones/cuentas-por-cobrar/cuentas-por-cobrar.component';
import { ResumenDiarioComponent } from './pages/operaciones/facturacion-electronica/resumen-diario/resumen-diario.component';
import { ComunicacionDeBajaComponent } from './pages/operaciones/facturacion-electronica/comunicacion-de-baja/comunicacion-de-baja.component';
import { InventarioComponent } from './pages/operaciones/inventario/inventario/inventario.component';
import { LotesYSeriesComponent } from './pages/operaciones/inventario/lotes-y-series/lotes-y-series.component';
import { AjustesDeInventarioComponent } from './pages/operaciones/inventario/ajustes-de-inventario/ajustes-de-inventario.component';
import { TrasladosDeInventarioComponent } from './pages/operaciones/inventario/traslados-de-inventario/traslados-de-inventario.component';
import { PreguntasFrecuentesComponent } from './pages/preguntas-frecuentes/preguntas-frecuentes.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { CrearPerfilComponent } from './pages/administracion/usuarios/perfiles-de-usuario/crear-perfil/crear-perfil.component';
import { EmpresasComponent } from './pages/administracion/empresas/empresas.component';
import { CrearEmpresaComponent } from './pages/administracion/empresas/crear-empresa/crear-empresa.component';
import { ToastComponent } from './components/toast/toast.component';
import { EditarEmpresaComponent } from './pages/administracion/empresas/editar-empresa/editar-empresa.component';
import { CrearProveedorComponent } from './pages/administracion/proveedores/crear-proveedor/crear-proveedor.component';
import { CrearClienteComponent } from './pages/administracion/clientes/crear-cliente/crear-cliente.component';
import { CrearBancoComponent } from './pages/administracion/finanzas/bancos/crear-banco/crear-banco.component';
import { CrearCuentaBancariaComponent } from './pages/administracion/finanzas/cuentas-bancarias/crear-cuenta-bancaria/crear-cuenta-bancaria.component';
import { CrearMetodoDePagoComponent } from './pages/administracion/finanzas/metodos-de-pago/crear-metodo-de-pago/crear-metodo-de-pago.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CrearPuntoVentaComponent } from './pages/administracion/locales/puntos-de-venta/crear-punto-venta/crear-punto-venta.component';
import { CrearEstacionComponent } from './pages/administracion/locales/estaciones-de-venta/crear-estacion/crear-estacion.component';
import { CrearCategoriaComponent } from './pages/administracion/productos/categorias/crear-categoria/crear-categoria.component';
import { CrearMarcaComponent } from './pages/administracion/productos/marcas/crear-marca/crear-marca.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModelosComponent } from './pages/administracion/productos/modelos/modelos.component';
import { CrearModeloComponent } from './pages/administracion/productos/modelos/crear-modelo/crear-modelo.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgApexchartsModule } from 'ng-apexcharts';
import { ModalModule } from "ngx-bootstrap/modal";
import { DecimalPipe } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DiarioComponent } from './pages/diario/diario.component';
@Injectable()
export class chatNovaWS extends Socket {
  constructor() {
    super({ url: 'http://localhost:3000', options: { transports: ['websocket'], upgrade: false, reconnection: true, reconnectionDelay: 500, reconnectionDelayMax: 1000, autoConnect: false } });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    TopbarComponent,
    SoporteComponent,
    PerfilComponent,
    MensajesComponent,
    CrearMetodoDePagoComponent,
    AyudaComponent,
    ConfiguracionComponent,
    LogoutComponent,
    ClientesComponent,
    MetodosDePagoComponent,
    BancosComponent,
    CuentasBancariasComponent,
    CertificadosDigitalesComponent,
    SeriesDocumentosComponent,
    UnidadesDeMedidaComponent,
    CiudadesComponent,
    PuntosDeVentaComponent,
    EstacionesDeVentaComponent,
    MarcasComponent,
    CategoriasComponent,
    ProductosComponent,
    ProveedoresComponent,
    UsuariosComponent,
    PerfilesDeUsuarioComponent,
    ComprasComponent,
    VentasComponent,
    NotaDeCreditoComponent,
    NotaDeDebitoComponent,
    GuiasDeRemisionComponent,
    CotizacionesComponent,
    CajaComponent,
    ReporteDeCajaComponent,
    CuentasPorCobrarComponent,
    ResumenDiarioComponent,
    ComunicacionDeBajaComponent,
    InventarioComponent,
    LotesYSeriesComponent,
    AjustesDeInventarioComponent,
    TrasladosDeInventarioComponent,
    PreguntasFrecuentesComponent,
    ContactoComponent,
    CrearPerfilComponent,
    EmpresasComponent,
    CrearEmpresaComponent,
    ToastComponent,
    EditarEmpresaComponent,
    CrearProveedorComponent,
    CrearClienteComponent,
    CrearBancoComponent,
    CrearCuentaBancariaComponent,
    CrearPuntoVentaComponent,
    CrearEstacionComponent,
    CrearCategoriaComponent,
    CrearMarcaComponent,
    ModelosComponent,
    CrearModeloComponent,
    DiarioComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    CanvasJSAngularChartsModule,
    NgxSpinnerModule.forRoot(),
    BrowserAnimationsModule,
    FullCalendarModule,
    ModalModule.forRoot(),
    NgApexchartsModule,
    RouterModule.forRoot(ROUTES),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    ToastComponent,
    DecimalPipe,
    AuthGuard
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
