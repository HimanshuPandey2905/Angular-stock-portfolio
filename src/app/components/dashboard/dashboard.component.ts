import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RouterLink } from '@angular/router';
import { PortfolioStock } from '../../models/portfolio';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  holdings: PortfolioStock[] = [];
  totalInvestments = 0;
  currentValue = 0;
  profitLoss = 0;

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#f1c40f',
          '#e74c3c',
          '#9b59b6',
        ],
      },
    ],
  };

  pieChartType: ChartType = 'pie';

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.holdings = this.portfolioService.getPortfolio();
    this.updatePortfolio();
  }

  updatePortfolio(): void {
    const stats = this.portfolioService.getPortfolioStats();
    this.totalInvestments = stats.totalInvestments;
    this.currentValue = stats.currentValue;
    this.profitLoss = stats.profitLoss;
    this.holdings = this.portfolioService.getPortfolio();

    this.pieChartData.labels = this.holdings.map((stock) => stock.symbol);
    this.pieChartData.datasets[0].data = this.holdings.map(
      (stock) => stock.price * stock.quantity
    );

    this.chart?.update();
  }

  downloadPDF(): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const content = this.pdfContent.nativeElement;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('portfolio.pdf');
    });
  }
}
