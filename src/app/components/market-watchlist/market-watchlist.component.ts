import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LivePriceDirective } from '../../directives/live-price.directive';
import { StockService } from '../../services/stock.service';
import { RouterLink } from '@angular/router';
import { MarketStock } from '../../models/Stock';
import { MarketService } from '../../services/market.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-market-watchlist',
  standalone: true,
  imports: [CommonModule, LivePriceDirective, RouterLink],
  templateUrl: './market-watchlist.component.html',
  styleUrl: './market-watchlist.component.scss',
})
export class MarketWatchlistComponent implements OnInit {
  watchlist: MarketStock[] = [];
  loading = false;
  searchResults: { name: string; symbol: string; exch: string }[] = [];
  searchCache = new Map<string, any>(); // Cache for search results
  private searchSubject = new Subject<string>(); // Used for debounced search

  constructor(
    private stockService: StockService,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.loadWatchlist();

    // Debounce search input to avoid too many API calls
    this.searchSubject.pipe(debounceTime(500)).subscribe((query) => {
      this.searchStocks(query);
    });
  }

  loadWatchlist(): void {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      this.watchlist = JSON.parse(savedWatchlist);
    }
  }

  onSearchInput(query: string): void {
    this.searchSubject.next(query); // Debounced search
  }

  searchStocks(query: string): void {
    if (!query.trim()) return;
    if (this.searchCache.has(query)) {
      this.searchResults = this.searchCache.get(query);
      return;
    }

    this.loading = true;
    this.stockService.searchStocks(query).subscribe((data) => {
      this.searchResults = data.body;
      this.searchCache.set(query, data.body);
      this.loading = false;
    });
  }

  addToWatchlist(stock: any): void {
    if (this.isInWatchlist(stock.symbol)) return;

    const marketStock: MarketStock = {
      name: stock.name,
      symbol: stock.symbol,
      price: 0,
    };

    this.stockService.getStockPrice(stock.symbol).subscribe((data: any) => {
      marketStock.price = data.body.currentPrice.raw;
      this.watchlist.push(marketStock);
      localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
    });
  }

  removeFromWatchlist(symbol: string): void {
    this.watchlist = this.watchlist.filter((stock) => stock.symbol !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
  }

  isInWatchlist(symbol: string): boolean {
    return this.watchlist.some((stock) => stock.symbol === symbol);
  }
}
