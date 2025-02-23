import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MarketStock } from '../models/Stock';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private watchListSubject = new BehaviorSubject<MarketStock[]>(
    this.loadWatchlist()
  );
  watchList$ = this.watchListSubject.asObservable();

  constructor() {}

  private loadWatchlist(): MarketStock[] {
    const storedWatchlist = localStorage.getItem('watchlist');
    return storedWatchlist ? JSON.parse(storedWatchlist) : [];
  }

  addToWatchlist(stock: MarketStock): void {
    const currentList = this.watchListSubject.getValue();
    if (!currentList.some((s) => s.symbol === stock.symbol)) {
      const updatedList = [...currentList, stock];
      localStorage.setItem('watchlist', JSON.stringify(updatedList));
      this.watchListSubject.next(updatedList);
    }
  }

  removeFromWatchlist(symbol: string): void {
    const updatedList = this.watchListSubject
      .getValue()
      .filter((stock) => stock.symbol !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(updatedList));
    this.watchListSubject.next(updatedList);
  }
}
