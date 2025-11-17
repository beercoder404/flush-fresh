import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedAdminRoute } from './ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { z } from 'zod';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
  image_url: string;
  benefits: string[];
  ingredients: string[];
  how_to_use: string[];
}

const productSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
  description: z.string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  price: z.number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  size: z.string()
    .trim()
    .min(1, "Size is required")
    .max(50, "Size must be less than 50 characters"),
  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  image_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .max(500, "Image URL must be less than 500 characters"),
  benefits: z.array(z.string().trim().max(200, "Each benefit must be less than 200 characters"))
    .min(1, "At least one benefit is required")
    .max(20, "Maximum 20 benefits allowed"),
  ingredients: z.array(z.string().trim().max(200, "Each ingredient must be less than 200 characters"))
    .min(1, "At least one ingredient is required")
    .max(50, "Maximum 50 ingredients allowed"),
  how_to_use: z.array(z.string().trim().max(300, "Each instruction must be less than 300 characters"))
    .min(1, "At least one instruction is required")
    .max(20, "Maximum 20 instructions allowed")
});

const AdminProductsContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    category: '',
    image_url: '',
    benefits: '',
    ingredients: '',
    how_to_use: ''
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('products').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product created successfully' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase.from('products').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product updated successfully' });
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      size: '',
      category: '',
      image_url: '',
      benefits: '',
      ingredients: '',
      how_to_use: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      size: product.size,
      category: product.category,
      image_url: product.image_url,
      benefits: product.benefits.join('\n'),
      ingredients: product.ingredients.join('\n'),
      how_to_use: product.how_to_use.join('\n')
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      size: formData.size,
      category: formData.category,
      image_url: formData.image_url,
      benefits: formData.benefits.split('\n').filter(b => b.trim()),
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      how_to_use: formData.how_to_use.split('\n').filter(h => h.trim())
    };

    // Validate the product data
    try {
      productSchema.parse(productData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive'
        });
        return;
      }
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Manage Products</h1>
            <p className="text-muted-foreground mt-2">Add, edit, or remove products from your store</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingProduct(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (one per line)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Enter each benefit on a new line"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                  <Textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Enter each ingredient on a new line"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="how_to_use">How to Use (one per line)</Label>
                  <Textarea
                    id="how_to_use"
                    value={formData.how_to_use}
                    onChange={(e) => setFormData({ ...formData, how_to_use: e.target.value })}
                    placeholder="Enter each instruction on a new line"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-gradient-card">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{product.size}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => deleteMutation.mutate(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const AdminProducts = () => {
  return (
    <ProtectedAdminRoute>
      <AdminProductsContent />
    </ProtectedAdminRoute>
  );
};

export default AdminProducts;
