import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadOrders(); // Load orders on service initialization
  }

  // 📌 Load orders from localStorage
  private loadOrders(): void {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      this.ordersSubject.next([...this.orders]);
    }
  }

  // 📌 Save orders to localStorage
  private saveOrders(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders));
    this.ordersSubject.next([...this.orders]); // Update subscribers
  }

  // 🛒 Place an order (Buy/Sell)
  placeOrder(order: Order): void {
    order.status = 'Pending';
    this.orders.push(order);
    this.saveOrders();
  }

  // ❌ Cancel an order
  cancelOrder(orderId: string): void {
    this.orders = this.orders.filter((o) => o.id !== orderId);
    this.saveOrders();
  }

  // 🖊️ Update an order (Quantity & Price)
  updateOrder(
    orderId: string,
    updatedQuantity: number,
    updatedPrice: number
  ): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.quantity = updatedQuantity;
      order.price = updatedPrice;
      this.saveOrders();
    }
  }

  // ✅ Complete an order
  completeOrder(orderId: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'Completed';
      this.saveOrders();
    }
  }

  // 📜 Get all orders
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }
}
