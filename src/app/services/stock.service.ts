import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { StockDetails } from '../models/Stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'https://yahoo-finance15.p.rapidapi.com/api/v1/';
  private apiKey = '0cb7ffd718mshb806365b612271ep1d115ajsndede0e8eaa56';
  private apiHost = 'yahoo-finance15.p.rapidapi.com';

  private options = {
    headers: {
      'x-rapidapi-key': `${this.apiKey}`,
      'x-rapidapi-host': `${this.apiHost}`,
    },
  };

  constructor(private http: HttpClient) {}

  searchStocks(
    query: string
  ): Observable<{ body: { name: string; symbol: string; exch: string }[] }> {
    console.log(query);
    const url = `${this.apiUrl}markets/search?search=${query}';`;

    return this.http.get<any>(url, this.options);
  }

  getStockDetails(symbol: string): Observable<StockDetails> {
    return this.http
      .get<{ body: StockDetails }>(
        `${this.apiUrl}markets/stock/modules?ticker=${symbol}&module=asset-profile`,
        this.options
      )
      .pipe(map((data) => data.body));
  }

  getStockPrice(symbol: string): any {
    return this.http.get<any>(
      `${this.apiUrl}markets/stock/modules?ticker=${symbol}&module=financial-data`,
      this.options
    );
  }

  getStockHistory(symbol: string, duration: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}markets/stock/history?symbol=${symbol}&interval=${duration}&diffandsplits=false`,
      this.options
    );
  }
}
