import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import * as dateFns from 'date-fns';
import { NgxSpinnerService } from "ngx-spinner";
import { AdministracionService } from 'src/app/services/administracion.service';
@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {
  dataDia: any;
  dataContribuyente: any;
  chartOptions: any;
  p_dia: string = dateFns.format(new Date(), 'yyyy-MM-dd');
  p_dia_fin: string = dateFns.format(new Date(), 'yyyy-MM-dd');
  totalDia: number = 0;

  constructor(private appComponent: AppComponent, private spinner: NgxSpinnerService, private service: AdministracionService) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    console.log(this.p_dia + " " + this.p_dia_fin);
    this.loadBarByDay();
  }

  loadBarByDay() {
    if (this.p_dia_fin > dateFns.format(new Date(), 'yyyy-MM-dd') || this.p_dia > this.p_dia_fin || this.p_dia_fin < this.p_dia) {
      alert("Elija un rango de fecha correcto");
    } else {
      this.totalDia = 0;
      let post = {
        p_dia: this.p_dia,
        p_dia_fin: this.p_dia_fin
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
      p_dia_fin: this.p_dia_fin
    }
    this.service.postContribuyenteSel(post).subscribe({
      next: (data: any) => {
        this.dataContribuyente = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
