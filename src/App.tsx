import { useState, useMemo } from "react";
import { Search, Pizza, Utensils, Coffee } from "lucide-react";
import { menuData } from "./data/menu";
import { ProductCard } from "./components/ProductCard";
import { CartFooter } from "./components/CartFooter";
import { CheckoutModal } from "./components/CheckoutModal";
import { cn } from "./lib/utils";

const CATEGORIES = [
  { id: "Todas", icon: Utensils },
  { id: "Salgadas", icon: Pizza },
  { id: "Doces", icon: Pizza },
  { id: "Bebidas", icon: Coffee },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredMenu = useMemo(() => {
    return menuData.filter((product) => {
      const matchesCategory = activeCategory === "Todas" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Pizzaria Delivery</h1>
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
        <div className="px-4 pb-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all",
                  activeCategory === category.id
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <category.icon size={16} />
                {category.id}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu List */}
      <main className="max-w-md mx-auto">
        {filteredMenu.length > 0 ? (
          <div className="flex flex-col">
            {filteredMenu.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <p className="text-gray-500">Nenhum produto encontrado para "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Cart Footer */}
      <CartFooter onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
