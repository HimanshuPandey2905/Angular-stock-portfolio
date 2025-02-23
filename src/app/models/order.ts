export interface Order {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: 'Buy' | 'Sell';
  status: 'Pending' | 'Completed';
}
