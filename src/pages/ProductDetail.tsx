import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: products, isLoading } = useProducts();
  const product = products?.find(p => p.id === id);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button>
          
          {/* Product details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div 
              className="rounded-3xl overflow-hidden aspect-square"
              style={{ background: 'var(--gradient-card)' }}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info */}
            <div>
              <div className="text-sm font-medium text-primary mb-2">
                {product.category}
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {product.description}
              </p>
              
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-bold text-foreground">
                  ${product.price}
                </span>
                <span className="text-lg text-muted-foreground">
                  / {product.size}
                </span>
              </div>
              
              <div className="flex gap-4 mb-12">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/cart">View Cart</Link>
                </Button>
              </div>
              
              {/* Benefits */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Ingredients */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Natural Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-primary/10 text-sm text-primary"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* How to use */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">How to Use</h3>
                  <ol className="space-y-3">
                    {product.howToUse.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
