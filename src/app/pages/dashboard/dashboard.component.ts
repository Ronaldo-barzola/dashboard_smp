import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';
import { AppComponent } from 'src/app/app.component';
import { AdministracionService } from 'src/app/services/administracion.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgxSpinnerService } from "ngx-spinner";
import { DecimalPipe } from '@angular/common';
import * as dateFns from 'date-fns';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  tupaShow: boolean = false
  apexOptions: any;
  totalAnual: number = 0;
  totalDia: number = 0;
  p_anio_anual: number = 2025;
  chartOptions: any;
  chartVerticalOptions: any;
  chartPieOptions: any;
  chartPorcentajeOptions: any;
  dataBars: any = [];
  calendarVisible: boolean = false;
  conceptosOptions: any;
  conceptoMontoOptions: any;

  cartVisible: boolean = false;
  calendarOptions: any;
  dataCalendar: any = [];
  dataDia: any = [];
  dataContribuyente: any = [];

  //FILTROS DE BUSQUEDA
  p_anio: number = 2025;
  p_mes: string = '';
  p_dia: string = dateFns.format(new Date(), 'yyyy-MM-dd');
  p_dia_fin: string = dateFns.format(new Date(), 'yyyy-MM-dd');
  spinnerVisible: boolean = true;
  diarioShow: boolean = true;
  conceptoShow: boolean = false;
  p_tipo: number = 0;
  p_tipo_dia: number = 0;
  p_anio_concepto: number = 2025;
  dia_ini_concepto: string = dateFns.format(new Date(), 'yyyy-MM-dd');
  dia_fin_concepto: string = dateFns.format(new Date(), 'yyyy-MM-dd');

  //PARAMETROS TUPA
  p_anypro: number = 2025;
  chartOptionsTupa: any;
  chartOptionsTupaArea: any; p_arenid: number = 0;

  //MULTAS
  p_anypromulta: number = 2025;
  chartOptionsMulta: any;
  multaShow: boolean = false;

  //TUPA CALENDARIO
  p_mespro: any;
  calendarTupaOptions: any;
  showCalendarTupa: boolean = false;
  p_diapro: string = '';
  detalleArea: any;
  showDetalleTupa: boolean = false;

  //MULTA CALENDARIO 
  p_mespro_multa: any;
  calendarMultaOptions: any;
  showCalendarMulta: boolean = false;

  nombreArea: string = '';


  modalRef?: BsModalRef;
  @ViewChild('calendarTupa') calendarTupa: any;
  @ViewChild('calendarMulta') calendarMulta: any;
  constructor(private router: Router, private appComponent: AppComponent, private modalService: BsModalService, private service: AdministracionService, private el: ElementRef, private spinner: NgxSpinnerService, private _decimalPipe: DecimalPipe) {
    this.appComponent.login = false;
    // console.log(this._decimalPipe.transform("977154.26", '1.2-2'));
  }

  ngOnInit(): void {
    this.loadBarByDay();

  }

  cerrarSesion() {
    localStorage.removeItem('session-dashboard');
    this.router.navigate(['/login']);
  }

  onClickColumn(e: any) {
    alert(e.dataSeries.type + ", dataPoint { x:" + e.dataPoint.x + ", y: " + e.dataPoint.y + " }");
  }
  renderChart(data: any) {
    this.chartOptions =
    {
      title: {
        text: "Recaudación / mes",
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        valueFormatString: "S/#,###.##"
      },
      data: [
        {
          type: "column",
          yValueFormatString: "S/#,###.##",
          // color: "#1E5BA8",

          margin: 5,

          click: (e: any) => {
            this.p_mes = e.dataPoint.info;
            this.p_anio = this.p_anio_anual;
            this.calendar();
            this.cartVisible = false;
            // this.calendarVisible = true;
          },
          indexLabel: "{y}",

          dataPoints: data
        },
      ]
    };
    if (this.chartOptions) {
      const chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
      chart.render();
      this.spinner.hide();
    }
  }

  renderTupa(data: any) {
    console.log(data);
    this.chartOptionsTupa =
    {
      title: {
        text: "Recaudación / Tupa Tusne",
      },
      animationEnabled: true,
      exportEnabled: true,
      axisX: {
        includeZero: true,
        valueFormatString: "S/#,###.##0",
        // labelFontSize:8
        interval: 1,
        labelAngle: 0
      },

      data: [
        {
          type: "bar",
          indexLabel: "{y}",
          // legendText: "First Series",
          // showInLegend: true,
          click: (e: any) => {
            console.log("click")
            this.p_arenid = e.dataPoint.extra;
            this.nombreArea = e.dataPoint.extra2;
            this.loadTupaArea();
          },
          yValueFormatString: "S/#,###.##0",
          dataPoints: data
        },
      ]
    };
    if (this.chartOptionsTupa) {
      const chart = new CanvasJS.Chart('chartContainerTupa', this.chartOptionsTupa);
      chart.render();
      this.spinner.hide();
    }
  }

  renderMulta(data: any) {
    this.chartOptionsMulta =
    {
      title: {
        text: "Recaudación / Multas Gerencia de Fiscalización y Transporte",
      },
      animationEnabled: true,
      exportEnabled: true,
      axisX: {
        includeZero: true,
        valueFormatString: "S/#,###.##",
        // labelFontSize:8
        interval: 1,
        labelAngle: 0
      },

      data: [
        {
          type: "column",
          indexLabel: "{y}",
          yValueFormatString: "S/#,###.##",
          click: (e: any) => {
            console.log("click")
            this.p_mespro_multa = e.dataPoint.extra;

            this.modalRef = this.modalService.show(this.calendarMulta, { id: 100, class: 'modal-lg' });
            this.modalRef.onHide?.subscribe(() => {
              this.calendarMultaOptions = {};
              this.showCalendarMulta = false;
            })
            this.multaCalendar();

          },
          dataPoints: data

        },
      ]
    };
    if (this.chartOptionsMulta) {
      const chart = new CanvasJS.Chart('chartContainerMulta', this.chartOptionsMulta);
      chart.render();
      this.spinner.hide();
    }
  }

  renderTupaArea(data: any) {
    console.log(data);
    this.chartOptionsTupaArea =
    {
      title: {
        text: "Recaudación / " + this.nombreArea,
      },
      animationEnabled: true,
      exportEnabled: true,
      axisX: {
        includeZero: true,
        valueFormatString: "S/#,###.##",
        // labelFontSize:8
        interval: 1,
        labelAngle: 0
      },

      data: [
        {
          type: "column",
          click: (e: any) => {
            console.log("click")
            this.p_mespro = e.dataPoint.extra;

            this.modalRef = this.modalService.show(this.calendarTupa, { id: 100, class: 'modal-lg' });
            this.modalRef.onHide?.subscribe(() => {
              this.calendarTupaOptions = {};
              this.showCalendarTupa = false;
            })
            this.tupaCalendar();

          },
          indexLabel: "{y}",
          yValueFormatString: "S/#,###.##",
          dataPoints: data
        },
      ]
    };
    if (this.chartOptionsTupaArea) {
      const chart = new CanvasJS.Chart('chartContainerTupaArea', this.chartOptionsTupaArea);
      chart.render();
      this.spinner.hide();
    }
  }

  loadBars() {
    let a: any = [];

    this.totalAnual = 0;
    let post = {
      p_anio: this.p_anio_anual,
      p_tipo: this.p_tipo
    }
    this.spinner.show();
    this.service.postAnioSel(post).subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          a.push({ label: item.desmes, y: Number(item.monrec), info: item.mesrec, color: item.colors });
          this.totalAnual += Number(item.monrec);
        });
        this.renderChart(a);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadTupa() {
    let a: any = [];
    this.p_arenid = 0;
    let post = {
      p_anypro: this.p_anypro
    }
    this.spinner.show();
    this.service.reporteTupa(post).subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          a.push({ label: item.sigare, y: Number(item.monpag), extra: item.arenid, extra2: item.sigare });
          // this.totalAnual += Math.round(item.monrec);
        });
        this.renderTupa(a);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadMultas() {
    let a: any = [];
    let post = {
      p_anypro: this.p_anypromulta
    }
    this.spinner.show();
    this.service.postMultaSel(post).subscribe({
      next: (data: any) => {
        console.log(data);
        data.forEach((item: any) => {
          a.push({ label: item.nommes, y: Number(item.monpag), extra: item.mespag });
          // this.totalAnual += Math.round(item.monrec);
        });
        this.renderMulta(a);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadTupaArea() {
    let a: any = [];

    let post = {
      p_anypro: this.p_anypro,
      p_arenid: this.p_arenid
    }
    console.log(post);
    this.spinner.show();
    this.service.reporteTupaArea(post).subscribe({
      next: (data: any) => {
        console.log(data);
        data.forEach((item: any) => {
          a.push({ label: item.nommes, y: Number(item.monpag), extra: item.mespag });
        });
        this.renderTupaArea(a);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  renderCalendarMulta(data: any) {
    // this.calendarOptions = {};
    this.calendarMultaOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',

      initialDate: this.p_anypromulta + '-' + this.p_mespro_multa.padStart(2, '0') + '-01',
      contentHeight: 600,
      weekends: true,
      navLinks: false,
      today: false,
      locale: "es",
      eventContent: function (info: any) {
        return {
          html: info.event.title, // Renderiza el HTML del título del evento
        };
      },
      // datesSet: (info: any) => {
      //   if (data) {
      //     this.refreshCalendarTupa(data);
      //   }

      // },
      events: data,

    };
    this.p_mespro_multa = 0;
    this.showCalendarMulta = true;
    // this.refreshCalendarTupa(data);
    this.spinner.hide();
  }

  detalleTupaArea() {
    let post = {
      p_diapro: this.p_diapro,
      p_areaid: this.p_arenid
    }
    this.service.postDiaTupa(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.detalleArea = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  regresarCalendario() {
    this.detalleArea = null;
    this.showDetalleTupa = false;
    this.showCalendarTupa = true;

  }

  renderCalendarTupa(data: any) {
    this.calendarOptions = {};
    this.calendarTupaOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',

      dateClick: (info: any) => {
        //p_areaid

        this.showCalendarTupa = false;
        this.showDetalleTupa = true;
        this.p_diapro = info.dateStr;
        this.detalleTupaArea();


      },

      initialDate: this.p_anypro + '-' + this.p_mespro.padStart(2, '0') + '-01',
      contentHeight: 600,
      weekends: true,
      navLinks: false,
      today: false,
      locale: "es",
      eventContent: function (info: any) {
        return {
          html: info.event.title, // Renderiza el HTML del título del evento
        };
      },
      datesSet: (info: any) => {
        if (data) {
          this.refreshCalendarTupa(data);
        }

      },
      events: data,

    };
    this.p_mespro = 0;
    this.showCalendarTupa = true;
    this.refreshCalendarTupa(data);
    this.spinner.hide();
  }

  renderCalendar(data: any) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      dateClick: (info: any) => {
        this.p_dia = info.dateStr;
        this.p_dia_fin = info.dateStr;
        this.loadBarByDay();
        this.loadByContrib();
        this.verDiario();
      },
      initialDate: this.p_anio + '-' + this.p_mes.padStart(2, '0') + '-01',
      contentHeight: 600,
      weekends: true,
      navLinks: false,
      today: false,
      locale: "es",
      eventContent: function (info: any) {
        return {
          html: info.event.title, // Renderiza el HTML del título del evento
        };
      },
      datesSet: (info: any) => {
        if (data) {
          this.refreshCalendar(data);
        }

      },
      events: data,

    };
    this.calendarVisible = true;
    this.refreshCalendar(data);
    this.spinner.hide();
  }

  handleDateClick(arg: any) {
    console.log("fecha ", arg.dateStr);
  }

  refreshCalendar(data: any) {
    if (data) {
      data.forEach((item: any) => {
        if (Number(item.extra) > 1000000) {
          const elemento = this.el.nativeElement.querySelector('[data-date="' + item.date + '"]')
          if (elemento) {
            elemento.style.backgroundColor = "#D0F2D5";
          }
        }
      })
    }
  }

  refreshCalendarTupa(data: any) {
    if (data) {
      data.forEach((item: any) => {
        if (Number(item.extra) > 1000000) {
          const elemento = this.el.nativeElement.querySelector('[data-date="' + item.date + '"]')
          if (elemento) {
            elemento.style.backgroundColor = "#D0F2D5";
          }
        }
      })
    }
  }

  calendar() {
    let post = {
      p_anio: this.p_anio,
      p_mes: this.p_mes
    }
    this.spinner.show();
    console.log("parametros", post);
    let dataCalendar: any = [];
    this.service.postMesSel(post).subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          dataCalendar.push({
            title: "<b style='font-size:20px'>S/. " + Number(item.monrec).toLocaleString('es-MX') + '</b> <div ></div>', date: item.diarec,
            textColor: "#4B81D1", backgroundColor: "transparent", extra: item.monrec
          });
          //  textColor: "#4B81D1", className: (item.monrec > 1000000) ? 'selected' : 'transparent' });
        });
        this.renderCalendar(dataCalendar);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  tupaCalendar() {
    let post = {
      p_anypro: this.p_anypro,
      p_mespro: this.p_mespro,
      p_areaid: this.p_arenid
    }
    this.spinner.show();
    let dataCalendar: any = [];
    this.service.postTupaCalendar(post).subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          dataCalendar.push({
            title: "<b>S/. " + Number(Number(item.monrec).toFixed(2)).toLocaleString('es-MX') + '</b> <div ></div>', date: item.diarec,
            textColor: "#4B81D1", backgroundColor: "transparent", extra: item.monrec
          });
        });
        this.renderCalendarTupa(dataCalendar);

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  multaCalendar() {
    let post = {
      p_anypro: this.p_anypromulta,
      p_mespro: this.p_mespro_multa,
    }
    this.spinner.show();
    let dataCalendar: any = [];
    this.service.postMultaCalendar(post).subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          dataCalendar.push({
            title: "<b>S/. " + Number(item.monrec).toLocaleString('es-MX') + '</b> <div ></div>', date: item.diarec,
            textColor: "#4B81D1", backgroundColor: "transparent", extra: item.monrec
          });
          //  textColor: "#4B81D1", className: (item.monrec > 1000000) ? 'selected' : 'transparent' });
        });
        this.renderCalendarMulta(dataCalendar);

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadBarByDay() {
    if (this.p_dia_fin > dateFns.format(new Date(), 'yyyy-MM-dd') || this.p_dia > this.p_dia_fin || this.p_dia_fin < this.p_dia) {
      alert("Elija un rango de fecha correcto");
    } else {
      this.totalDia = 0;
      let post = {
        p_dia: this.p_dia,
        p_dia_fin: this.p_dia_fin,
        p_tipo : this.p_tipo_dia
      }
      this.spinner.show();
      this.service.postDiaSel(post).subscribe({
        next: (data: any) => {
          console.log(data);
          this.dataDia = data;
          let series: any = [];
          let labels: any = [];
          data.forEach((item: any) => {
            this.totalDia += Math.round(item.monpag);
            series.push(item.monpor);
            labels.push(item.desrub);
          })
          this.chartOptions = {
            series: series,
            chart: {
              height: 280,
              type: "radialBar"
            },
            plotOptions: {
              radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                  margin: 5,
                  size: "30%",
                  background: "transparent",
                  image: undefined
                },
                dataLabels: {
                  name: {
                    show: true
                  },
                  value: {
                    show: true
                  }
                }
              }
            },
            colors: ["#0B863B", "#E7A225", "#20529D", "#0077B5"],
            labels: labels,
            legend: {
              show: true,
              floating: true,
              fontSize: "16px",
              position: "bottom",
              offsetX: 50,
              offsetY: 10,
              labels: {
                useSeriesColors: true
              },
              formatter: function (seriesName: any, opts: any) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%";
              },
              itemMargin: {
                horizontal: 3
              }
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: false
                  }
                }
              }
            ]
          };
          this.loadByContrib();
          this.spinner.hide();
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }


  }

  loadByContrib() {
    let post = {
      p_dia: this.p_dia,
      p_dia_fin: this.p_dia_fin,
      p_tipo : this.p_tipo_dia
    }
    this.service.postContribuyenteSel(post).subscribe({
      next: (data: any) => {
        console.log("Contribuyente ", data);
        this.dataContribuyente = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  renderPieMonto(data: any) {
    this.chartPieOptions = {
      animationEnabled: true,
      title: {
        text: "Monto"
      },
      data: [{
        type: "doughnut",
        // startAngle: -90,
        indexLabel: "{name}: {y}",
        // yValueFormatString: "S/#,###.##''",
        dataPoints: data
      }]
    }
    if (this.chartPieOptions) {
      const chart = new CanvasJS.Chart('piePorcentajeContainer', this.chartPieOptions);
      chart.render();
    }
  }


  renderPiePorcentaje(data: any) {

    this.chartPorcentajeOptions = {
      animationEnabled: true,
      title: {
        text: "Porcentaje"
      },
      data: [{
        type: "pie",
        // startAngle: -90,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: data
      }]
    }
    if (this.chartPorcentajeOptions) {
      const chart = new CanvasJS.Chart('pieMontoContainer', this.chartPorcentajeOptions);
      chart.render();
    }

  }

  volver() {
    this.calendarVisible = false;
    this.loadBars();
    this.cartVisible = true;
  }

  verAnual() {
    this.diarioShow = false;
    this.loadBars();
    this.calendarVisible = false;
    this.cartVisible = true;
    this.tupaShow = false;
    this.conceptoShow = false;
    this.multaShow = false;
    this.p_arenid = 0;
  }

  verMulta() {
    this.diarioShow = false;
    this.loadMultas();
    this.calendarVisible = false;
    this.cartVisible = false;
    this.tupaShow = false;
    this.conceptoShow = false;
    this.multaShow = true;
    this.p_arenid = 0;
  }

  verDiario() {
    this.loadBarByDay();
    this.loadByContrib();
    this.diarioShow = true;
    this.cartVisible = false;
    this.calendarVisible = false;
    this.conceptoShow = false;
    this.tupaShow = false;
    this.multaShow = false;
    this.p_arenid = 0;
  }

  verConceptos() {
    this.dia_ini_concepto = dateFns.format(new Date(), 'yyyy-MM-dd');
    this.dia_fin_concepto = dateFns.format(new Date(), 'yyyy-MM-dd');
    this.p_anio_concepto = 2024;
    this.conceptos();
    // this.conceptoMonto();
    this.conceptoShow = true;
    this.calendarVisible = false;
    this.diarioShow = false;
    this.cartVisible = false;
    this.tupaShow = false;
    this.multaShow = false;
    this.p_arenid = 0;
  }

  verTupa() {

    this.p_anypro = 2024;
    this.loadTupa();
    // this.loadTupaArea();
    this.loadBars();
    this.tupaShow = true;
    this.conceptoShow = false;
    this.calendarVisible = false;
    this.diarioShow = false;
    this.cartVisible = false;
    this.multaShow = false;
    this.p_arenid = 0;
  }

  conceptos() {

    let post = {
      p_anio: this.p_anio_concepto
    }
    this.spinner.show();
    let concepto_8: any = [];
    let concepto_9: any = [];
    this.conceptosOptions = {};
    this.service.postConcepto(post).subscribe({
      next: (data: any) => {
        concepto_8 = [];
        concepto_9 = [];
        data.forEach((item: any) => {
          if (item.rubrid === '8') {
            concepto_8.push(item.monpag);
          } else {
            concepto_9.push(item.monpag);
          }
        });

        this.conceptosOptions = {
          series: [
            {
              name: "Rubro 8",
              data: concepto_8
            },
            {
              name: "Rubro 9",
              data: concepto_9
            }
          ],
          chart: {
            type: "area",
            height: 550,
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "straight"
          },
          labels: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"],
          yaxis: {
            opposite: true,
            labels: {
              formatter: (value: any) => {
                return this._decimalPipe.transform(value, '1.2-2');
              }
            },
          },
          legend: {
            horizontalAlign: "center"
          }
        };
        this.conceptoMonto();
        this.spinner.hide();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  conceptoMonto() {
    let post = {
      p_dia: this.dia_ini_concepto,
      p_dia_fin: this.dia_fin_concepto
    }

    let monto: any = [];
    this.conceptoMontoOptions = {};
    this.service.postConceptoMonto(post).subscribe({
      next: (data: any) => {
        monto = [];
        data.forEach((item: any) => {
          monto.push(item.monpag)
        });

        this.conceptoMontoOptions = {
          series: [
            {
              data: monto
            }
          ],
          chart: {
            type: "bar",
            height: 550
          },
          plotOptions: {
            bar: {
              barHeight: "60%",
              distributed: true,
              horizontal: true,
              dataLabels: {
                position: "bottom"
              }
            }
          },

          dataLabels: {
            enabled: true,
            textAnchor: "start",
            style: {
              colors: ["#fff"]
            },
            formatter: (val: any, opt: any) => {
              return "S/.  " + this._decimalPipe.transform(val, "1.2-2");
            },
            offsetX: 0,
          },

          tooltip: {
            theme: "dark",
            x: {
              show: false
            },
            y: {
              title: {
                formatter: function () {
                  return "";
                }
              }
            }
          },

          yaxis: {
            opposite: true,
            labels: {
              formatter: (value: any) => {
                return this._decimalPipe.transform(value, '1.2-2');
              }
            },
          },

          xaxis: {
            labels: {
              formatter: (value: any) => {
                return this._decimalPipe.transform(value, '1.2-2');
              }
            },
            categories: [
              "Rubro 8",
              "Rubro 9",
            ]
          }
        };
      },
      error: (error: any) => {
        console.log(error);
      }
    });

  }



}
