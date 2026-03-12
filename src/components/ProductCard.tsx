import { Plus, Minus } from "lucide-react";
import { Product } from "../data/menu";
import { useCartStore } from "../store/cartStore";
import { cn } from "../lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 bg-white">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </span>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-200">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 shadow-sm active:scale-95 transition-transform"
                aria-label="Diminuir quantidade"
              >
                <Minus size={16} />
              </button>
              <span className="w-4 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 shadow-sm active:scale-95 transition-transform"
                aria-label="Aumentar quantidade"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="px-4 py-1.5 bg-red-50 text-red-600 font-medium text-sm rounded-full active:scale-95 transition-transform"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
      <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
