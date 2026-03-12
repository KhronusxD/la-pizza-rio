import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Product } from "../data/menu";
import { useCartStore } from "../store/cartStore";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const hasMultiplePrices = product.prices.length > 1;
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

  const selectedPrice = product.prices[selectedPriceIndex];

  // Cart item key is product id + price label (to differentiate sizes)
  const cartKey = hasMultiplePrices
    ? `${product.id}-${selectedPrice.label}`
    : product.id;

  const cartItem = items.find((item) => item.id === cartKey);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      ...product,
      id: cartKey,
      name: hasMultiplePrices
        ? `${product.name} (${selectedPrice.label})`
        : product.name,
      prices: [selectedPrice],
    });
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 bg-white">
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Size selector */}
        {hasMultiplePrices && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {product.prices.map((priceOpt, idx) => (
              <button
                key={priceOpt.label}
                onClick={() => setSelectedPriceIndex(idx)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                  selectedPriceIndex === idx
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                )}
              >
                {priceOpt.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-base">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(selectedPrice.price)}
          </span>

          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-200">
              <button
                onClick={() => updateQuantity(cartKey, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 shadow-sm active:scale-95 transition-transform"
                aria-label="Diminuir quantidade"
              >
                <Minus size={16} />
              </button>
              <span className="w-4 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(cartKey, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 shadow-sm active:scale-95 transition-transform"
                aria-label="Aumentar quantidade"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 bg-red-50 text-red-600 font-medium text-sm rounded-full active:scale-95 transition-transform hover:bg-red-100"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>

      {/* Imagem placeholder quando não há imagem */}
      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-4xl">🍕</span>
        )}
      </div>
    </div>
  );
}
