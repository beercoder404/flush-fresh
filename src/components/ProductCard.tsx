import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };
  
  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <div 
        className="aspect-square relative overflow-hidden"
        style={{ background: 'var(--gradient-card)' }}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="text-xs font-medium text-primary mb-2">
          {product.category}
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            ${product.price}
          </span>
          <span className="text-sm text-muted-foreground">
            / {product.size}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link to={`/product/${product.id}`}>
            View Details
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
