import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.scss',
})
export class StockDetailsComponent implements OnInit {
  stockSymbol: string | null = null;
  historyData: number[] = [];
  historyLabels: string[] = [];
  details: any;
  currentPrice: number = 0;
  quantity: number = 1;
  customPrice: number | null = null;
  holdings: any[] = [];
  selectedRange: string = '5m';
  isLoading: boolean = true; // New: Loading indicator

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Stock Price',
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
      },
    ],
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  constructor(
    private stockService: StockService,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.stockSymbol = params.get('symbol');
      if (!this.stockSymbol) return;

      this.loadStockDetails();
      this.loadStockHistory(this.selectedRange);
      this.loadStockPrice();
      this.holdings = this.portfolioService.getPortfolio();
    });
  }

  loadStockDetails(): void {
    if (!this.stockSymbol) return;
    this.isLoading = true;
    this.stockService.getStockDetails(this.stockSymbol).subscribe(
      (stock) => {
        this.details = stock;
        this.isLoading = false;
      },
      () => (this.isLoading = false) // Ensure loading stops on error
    );
  }

  loadStockHistory(range: string): void {
    if (!this.stockSymbol) return;

    this.stockService
      .getStockHistory(this.stockSymbol, range)
      .subscribe((data) => {
        console.log('data', data);

        // Convert the object into an array
        const historyArray = Object.values(data.body);

        // Extract closing prices
        this.historyData = historyArray.map((entry: any) => entry.close);

        // Extract formatted dates
        this.historyLabels = historyArray.map((entry: any) =>
          new Date(entry.date_utc * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        );

        // Update chart data
        this.lineChartData = {
          labels: this.historyLabels,
          datasets: [
            { ...this.lineChartData.datasets[0], data: this.historyData },
          ],
        };
      });
  }

  loadStockPrice(): void {
    if (!this.stockSymbol) return;
    this.stockService.getStockPrice(this.stockSymbol).subscribe((data: any) => {
      this.currentPrice = data?.body?.currentPrice?.raw ?? 0; // Fix: Safe access
    });
  }

  onRangeChange(): void {
    this.loadStockHistory(this.selectedRange);
  }

  buyStock(): void {
    if (!this.stockSymbol) return;

    if (!this.quantity || this.quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    if (this.customPrice !== null && this.customPrice <= 0) {
      alert('Custom price must be greater than zero.');
      return;
    }

    const priceToUse = this.customPrice ?? this.currentPrice;
    this.portfolioService.addStock({
      symbol: this.stockSymbol,
      quantity: this.quantity,
      avgPrice: priceToUse,
      price: priceToUse,
    });
    alert('Order placed successfully!');
  }

  sellStock(): void {
    if (!this.stockSymbol) return;

    const stockInPortfolio = this.holdings.find(
      (s) => s.symbol === this.stockSymbol
    );
    if (!stockInPortfolio || stockInPortfolio.quantity < this.quantity) {
      alert('Not enough shares to sell!');
      return;
    }

    this.portfolioService.sellStock(this.stockSymbol, this.quantity);
    alert('Order placed successfully!');
  }
}
