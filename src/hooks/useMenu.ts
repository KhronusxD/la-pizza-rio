import { useState, useEffect } from "react";
import { Product, fetchMenuFromSheets } from "../data/menu";

interface UseMenuResult {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

let cachedProducts: Product[] | null = null;

export function useMenu(): UseMenuResult {
  const [products, setProducts] = useState<Product[]>(cachedProducts ?? []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedProducts) return;

    setLoading(true);
    fetchMenuFromSheets()
      .then((data) => {
        cachedProducts = data;
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Erro ao carregar o cardápio.");
        setLoading(false);
      });
  }, []);

  const categories: string[] = products.length > 0
    ? ["Todas", ...Array.from(new Set<string>(products.map((p) => p.category)))]
    : [];

  return { products, categories, loading, error };
}
