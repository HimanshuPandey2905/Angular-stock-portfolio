import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiKey = '9d08e98d9fa24024889123cc632a189c';
  private apiUrl = 'https://newsapi.org/v2/everything';

  constructor(private http: HttpClient) {}

  getStockNews(query: string = 'stocks'): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?q=${query}&apiKey=${this.apiKey}`
    );
  }
}
