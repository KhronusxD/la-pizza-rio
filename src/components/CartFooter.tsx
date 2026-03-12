import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";

interface CartFooterProps {
  onOpenCheckout: () => void;
}

export function CartFooter({ onOpenCheckout }: CartFooterProps) {
  const { getTotalItems, getSubtotal } = useCartStore();
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
      <div className="max-w-md mx-auto">
        <button
          onClick={onOpenCheckout}
          className="w-full bg-red-600 text-white rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="bg-red-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
              {totalItems}
            </div>
            <span className="font-medium">Ver carrinho</span>
          </div>
          <span className="font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(subtotal)}
          </span>
        </button>
      </div>
    </div>
  );
}
