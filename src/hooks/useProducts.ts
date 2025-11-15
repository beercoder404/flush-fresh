import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
  benefits: string[];
  ingredients: string[];
  how_to_use: string[];
  image_url: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.description.substring(0, 100) + '...',
        price: Number(product.price),
        size: product.size,
        category: product.category,
        benefits: product.benefits,
        ingredients: product.ingredients,
        howToUse: product.how_to_use,
        image: product.image_url,
      }));
    },
  });
};
