import { Injectable } from '@angular/core';
import { PortfolioStock } from '../models/portfolio';
import { StockService } from './stock.service';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private totalInvestments = 0;
  private currentValue = 0;
  private profitLoss = 0;
  private holdings: PortfolioStock[] = [];

  constructor(
    private orderService: OrderService,
    private stockService: StockService
  ) {
    this.loadPortfolio();
  }

  private savePortfolio(): void {
    localStorage.setItem('portfolio', JSON.stringify(this.holdings));
  }

  private loadPortfolio(): void {
    const storedPortfolio = localStorage.getItem('portfolio');
    if (storedPortfolio) {
      this.holdings = JSON.parse(storedPortfolio);
      this.updatePortfolioStats();
    }
  }

  addStock(stock: PortfolioStock): void {
    const existingStock = this.holdings.find((s) => s.symbol === stock.symbol);
    if (existingStock) {
      existingStock.avgPrice =
        (existingStock.avgPrice * existingStock.quantity +
          stock.price * stock.quantity) /
        (existingStock.quantity + stock.quantity);
      existingStock.quantity += stock.quantity;
    } else {
      this.holdings.push(stock);
    }

    this.updatePortfolioStats();
    this.savePortfolio(); // ✅ Save to localStorage

    // ✅ Place order
    this.orderService.placeOrder({
      id: Date.now().toString(),
      symbol: stock.symbol,
      quantity: stock.quantity,
      price: stock.price,
      type: 'Buy',
      status: 'Pending',
    });
  }

  sellStock(symbol: string, quantity: number): void {
    const stockIndex = this.holdings.findIndex((s) => s.symbol === symbol);
    if (stockIndex !== -1 && this.holdings[stockIndex].quantity >= quantity) {
      this.holdings[stockIndex].quantity -= quantity;

      if (this.holdings[stockIndex].quantity === 0) {
        this.holdings.splice(stockIndex, 1);
      }

      this.updatePortfolioStats();
      this.savePortfolio(); // ✅ Save to localStorage after selling

      // ✅ Place order
      this.orderService.placeOrder({
        id: Date.now().toString(),
        symbol: symbol,
        quantity: quantity,
        price: this.holdings[stockIndex]?.price ?? 0, // Handle case where stock was removed
        type: 'Sell',
        status: 'Pending',
      });
    }
  }

  getPortfolio(): PortfolioStock[] {
    return this.holdings;
  }

  getPortfolioStats() {
    return {
      totalInvestments: this.totalInvestments,
      currentValue: this.currentValue,
      profitLoss: this.profitLoss,
    };
  }

  updatePortfolioStats(): void {
    this.totalInvestments = this.holdings.reduce(
      (sum, stock) => sum + stock.avgPrice * stock.quantity,
      0
    );
    this.currentValue = this.holdings.reduce(
      (sum, stock) => sum + stock.price * stock.quantity,
      0
    );
    this.profitLoss = this.currentValue - this.totalInvestments;
  }
}
