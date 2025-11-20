import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderData) {
      setOrder(orderData);

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (items) setOrderItems(items);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center py-16">
            <h1 className="text-3xl font-display font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find an order with this ID.</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusSteps = [
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Order Tracking</h1>
          <p className="text-muted-foreground mb-8">Order #{order.id.slice(0, 13)}...</p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex justify-between items-start mb-8">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-sm font-medium text-center ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted -z-0" style={{ width: '100%', transform: 'translateY(-50%)' }}>
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{order.address}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-lg font-bold">${Number(order.total).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
