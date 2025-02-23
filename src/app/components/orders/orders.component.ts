import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs';
import { Order } from '../../models/order';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  orders$: Observable<Order[]>;
  editingOrderId: string | null = null;
  updatedQuantity: number;
  updatedPrice: number;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.orders$;
  }

  cancelOrder(orderId: string): void {
    this.orderService.cancelOrder(orderId);
  }

  editOrder(order: Order): void {
    this.editingOrderId = order.id;
    this.updatedQuantity = order.quantity;
    this.updatedPrice = order.price;
  }

  saveUpdatedOrder(orderId: string): void {
    if (this.updatedQuantity > 0 && this.updatedPrice > 0) {
      this.orderService.updateOrder(
        orderId,
        this.updatedQuantity,
        this.updatedPrice
      );
      this.editingOrderId = null; // Exit edit mode
    }
  }

  cancelEdit(): void {
    this.editingOrderId = null;
  }
}
