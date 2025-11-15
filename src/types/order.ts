export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export const getOrders = (): Order[] => {
  const saved = localStorage.getItem('orders');
  return saved ? JSON.parse(saved) : [];
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const updated = orders.map(order =>
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem('orders', JSON.stringify(updated));
};
