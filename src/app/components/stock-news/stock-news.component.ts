import { Component } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-news.component.html',
  styleUrl: './stock-news.component.scss',
})
export class StockNewsComponent {
  newsArticles: any[] = [];
  loading = true;

  searchQuery = 'stocks';

  searchNews() {
    this.loading = true;
    this.newsService.getStockNews(this.searchQuery).subscribe((data) => {
      this.newsArticles = data.articles;
      this.loading = false;
    });
  }

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getStockNews().subscribe(
      (data) => {
        this.newsArticles = data.articles;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching stock news', error);
        this.loading = false;
      }
    );
  }
}
