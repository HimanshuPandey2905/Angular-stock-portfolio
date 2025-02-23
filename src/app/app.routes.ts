import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { MarketWatchlistComponent } from './components/market-watchlist/market-watchlist.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { StockNewsComponent } from './components/stock-news/stock-news.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'market', component: MarketWatchlistComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'news', component: StockNewsComponent },
  { path: 'stock-details/:symbol', component: StockDetailsComponent },
  { path: '**', redirectTo: 'dashboard' },
];
