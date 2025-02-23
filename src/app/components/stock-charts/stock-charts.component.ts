// import { Component, Input, SimpleChanges } from '@angular/core';
// import { Chart } from 'angular-highcharts';

// @Component({
//   selector: 'app-stock-charts',
//   standalone: true,
//   imports: [],
//   templateUrl: './stock-charts.component.html',
//   styleUrl: './stock-charts.component.scss',
// })
// export class StockChartsComponent {
//   @Input() stockSymbol!: string;
//   chart!: Chart;

//   // constructor(private chartsService: ChartsService) {}

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['stockSymbol'] && this.stockSymbol) {
//       this.loadChart();
//     }
//   }

//   loadChart(): void {
//     const to = Math.floor(Date.now() / 1000);
//     const from = to - 30 * 24 * 60 * 60; // Last 30 days

//     this.chartsService
//       .getStockChart(this.stockSymbol, 'D', from, to)
//       .subscribe((data) => {
//         if (data.t) {
//           const seriesData = data.t.map((timestamp: number, index: number) => [
//             timestamp * 1000,
//             data.c[index],
//           ]);

//           this.chart = new Chart({
//             chart: { type: 'line' },
//             title: { text: `${this.stockSymbol} Price Chart` },
//             xAxis: { type: 'datetime' },
//             yAxis: { title: { text: 'Price (USD)' } },
//             series: [
//               {
//                 type: 'line', // ✅ Add this to resolve the type error
//                 name: this.stockSymbol,
//                 data: seriesData,
//               },
//             ],
//           });
//         }
//       });
//   }
// }
