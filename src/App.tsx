import { useState, useMemo } from "react";
import { Search, Utensils, Pizza, Coffee, Sandwich, Soup, GlassWater, Loader2, AlertCircle } from "lucide-react";
import { useMenu } from "./hooks/useMenu";
import { ProductCard } from "./components/ProductCard";
import { CartFooter } from "./components/CartFooter";
import { CheckoutModal } from "./components/CheckoutModal";
import { cn } from "./lib/utils";

// Ícone por categoria (fallback para Utensils)
function getCategoryIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes("pizza") || lower.includes("brotinho")) return Pizza;
  if (lower.includes("sanduíche") || lower.includes("sandwich")) return Sandwich;
  if (lower.includes("bebida") || lower.includes("suco") || lower.includes("vitamina") || lower.includes("água")) return GlassWater;
  if (lower.includes("prato") || lower.includes("sopa") || lower.includes("porção") || lower.includes("sobremesa")) return Soup;
  if (lower.includes("café") || lower.includes("adicional")) return Coffee;
  return Utensils;
}

export default function App() {
  const { products, categories, loading, error } = useMenu();
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredMenu = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todas" || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">La Pizza Rio 🍕</h1>
          <p className="text-sm text-gray-500 mt-1">Faça seu pedido agora!</p>

          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="px-4 pb-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-3">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category);
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all",
                      activeCategory === category
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <Icon size={16} />
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-red-500" />
            <p className="text-sm">Carregando cardápio...</p>
          </div>
        )}

        {error && !loading && (
          <div className="mx-4 mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-red-700">Erro ao carregar o cardápio</p>
              <p className="text-sm text-red-500 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          filteredMenu.length > 0 ? (
            <div className="flex flex-col">
              {filteredMenu.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500">
                {searchQuery
                  ? `Nenhum produto encontrado para "${searchQuery}"`
                  : "Nenhum produto nesta categoria."}
              </p>
            </div>
          )
        )}
      </main>

      {/* Cart Footer */}
      <CartFooter onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
