import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Package, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Message {
  id: string;
  order_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedOrder) {
      fetchMessages(selectedOrder);
      
      // Set up realtime subscription for messages
      const channel = supabase
        .channel('order-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'order_messages',
            filter: `order_id=eq.${selectedOrder}`
          },
          () => {
            fetchMessages(selectedOrder);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder) return;

    try {
      const { error } = await supabase
        .from('order_messages')
        .insert({
          order_id: selectedOrder,
          message: newMessage,
          is_admin: false,
        });

      if (error) throw error;
      setNewMessage('');
      fetchMessages(selectedOrder);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">My Orders</h1>
            <p className="text-muted-foreground">View and track your orders</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                <Button asChild>
                  <Link to="/">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">Order #{order.id.slice(0, 8)}</CardTitle>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order.id)}
                              className="flex-1 sm:flex-none"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Chat
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[600px] flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Order Chat - #{order.id.slice(0, 8)}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                              {messages.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>No messages yet. Start a conversation!</p>
                                </div>
                              ) : (
                                messages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                                  >
                                    <div
                                      className={`max-w-[80%] p-3 rounded-lg ${
                                        msg.is_admin
                                          ? 'bg-muted'
                                          : 'bg-primary text-primary-foreground'
                                      }`}
                                    >
                                      <p className="text-xs font-semibold mb-1 opacity-70">
                                        {msg.is_admin ? 'Admin' : 'You'}
                                      </p>
                                      <p className="text-sm">{msg.message}</p>
                                      <p className="text-xs opacity-70 mt-1">
                                        {new Date(msg.created_at).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="flex gap-2 pt-4 border-t">
                              <Textarea
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="resize-none"
                                rows={2}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                  }
                                }}
                              />
                              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                Send
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          asChild 
                          variant="default" 
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Link to={`/orders/${order.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.order_items && order.order_items.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Items</h4>
                          <div className="space-y-2">
                            {order.order_items.map((item: OrderItem) => (
                              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                  <p className="font-medium">{item.product_name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-lg font-bold text-primary">${Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyOrders;
