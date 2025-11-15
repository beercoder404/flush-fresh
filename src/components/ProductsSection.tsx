import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

const ProductsSection = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Our Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our range of premium pre-flush sprays, each crafted with 
            natural essential oils for a fresh, luxurious experience.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
