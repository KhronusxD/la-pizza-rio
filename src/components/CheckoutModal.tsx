import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, MapPin, Store, CreditCard, Banknote, QrCode, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { cn } from "../lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeliveryMethod = "entrega" | "retirada";
type PaymentMethod = "pix" | "cartao" | "dinheiro";

interface FormData {
  name: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
  };
  paymentMethod: PaymentMethod;
  changeFor?: string;
}

const TAXA_ENTREGA = 8.0;
const WHATSAPP_NUMBER = "5511999999999"; // Substitua pelo número real

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getSubtotal, removeItem, updateQuantity } = useCartStore();
  const subtotal = getSubtotal();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      deliveryMethod: "entrega",
      paymentMethod: "pix",
    },
    mode: "onChange",
  });

  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");
  const total = deliveryMethod === "entrega" ? subtotal + TAXA_ENTREGA : subtotal;

  const onSubmit = (data: FormData) => {
    if (items.length === 0) return;

    let message = `🍕 *NOVO PEDIDO*\n`;
    message += `👤 Cliente: ${data.name}\n`;
    message += `📱 Contato: ${data.phone}\n\n`;

    message += `🛵 *MÉTODO:* ${data.deliveryMethod === "entrega" ? "Entrega" : "Retirada"}\n`;
    
    if (data.deliveryMethod === "entrega") {
      message += `📍 *ENDEREÇO:* ${data.address.street}, ${data.address.number}, ${data.address.neighborhood}`;
      if (data.address.complement) {
        message += ` - ${data.address.complement}`;
      }
      message += `\n\n`;
    } else {
      message += `📍 *ENDEREÇO:* Retirada no Balcão\n\n`;
    }

    message += `📦 *RESUMO DO PEDIDO:*\n`;
    items.forEach((item) => {
      const itemPrice = item.prices[0]?.price ?? 0;
      message += `- ${item.quantity}x ${item.name} (${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(itemPrice)})\n`;
    });
    
    message += `----------------------------\n`;
    message += `Subtotal: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}\n`;
    
    if (data.deliveryMethod === "entrega") {
      message += `Taxa de Entrega: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(TAXA_ENTREGA)}\n`;
    }
    
    message += `----------------------------\n`;
    message += `💰 *TOTAL A PAGAR: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}*\n\n`;

    message += `💳 *PAGAMENTO:* ${
      data.paymentMethod === "pix" ? "PIX" : data.paymentMethod === "cartao" ? "Cartão (Levar maquininha)" : "Dinheiro"
    }\n`;

    if (data.paymentMethod === "dinheiro" && data.changeFor) {
      message += `🪙 *TROCO PARA:* R$ ${data.changeFor}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div 
        className="bg-white w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Resumo do Carrinho */}
              <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Seu Pedido</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-500">{item.quantity}x</span>
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((item.prices[0]?.price ?? 0) * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Identificação */}
              <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Seus Dados</h3>
                
                <div className="space-y-3">
                  <div>
                    <input
                      {...register("name", { required: "Nome é obrigatório" })}
                      placeholder="Nome completo"
                      className={cn(
                        "w-full p-3 rounded-lg bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all",
                        errors.name ? "border-red-300" : "border-gray-200"
                      )}
                    />
                    {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
                  </div>
                  
                  <div>
                    <input
                      {...register("phone", { required: "Telefone é obrigatório" })}
                      placeholder="WhatsApp (Ex: 11999999999)"
                      type="tel"
                      className={cn(
                        "w-full p-3 rounded-lg bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all",
                        errors.phone ? "border-red-300" : "border-gray-200"
                      )}
                    />
                    {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone.message}</span>}
                  </div>
                </div>
              </section>

              {/* Método de Entrega */}
              <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Como quer receber?</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <label className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all",
                    deliveryMethod === "entrega" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  )}>
                    <input type="radio" value="entrega" {...register("deliveryMethod")} className="sr-only" />
                    <MapPin size={24} className="mb-2" />
                    <span className="font-medium text-sm">Entrega</span>
                  </label>
                  
                  <label className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all",
                    deliveryMethod === "retirada" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  )}>
                    <input type="radio" value="retirada" {...register("deliveryMethod")} className="sr-only" />
                    <Store size={24} className="mb-2" />
                    <span className="font-medium text-sm">Retirada</span>
                  </label>
                </div>

                {deliveryMethod === "entrega" && (
                  <div className="space-y-3 pt-3 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <input
                          {...register("address.street", { required: deliveryMethod === "entrega" ? "Rua obrigatória" : false })}
                          placeholder="Rua"
                          className={cn(
                            "w-full p-3 rounded-lg bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all",
                            errors.address?.street ? "border-red-300" : "border-gray-200"
                          )}
                        />
                      </div>
                      <div>
                        <input
                          {...register("address.number", { required: deliveryMethod === "entrega" ? "Nº obrigatório" : false })}
                          placeholder="Número"
                          className={cn(
                            "w-full p-3 rounded-lg bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all",
                            errors.address?.number ? "border-red-300" : "border-gray-200"
                          )}
                        />
                      </div>
                    </div>
                    <input
                      {...register("address.neighborhood", { required: deliveryMethod === "entrega" ? "Bairro obrigatório" : false })}
                      placeholder="Bairro"
                      className={cn(
                        "w-full p-3 rounded-lg bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all",
                        errors.address?.neighborhood ? "border-red-300" : "border-gray-200"
                      )}
                    />
                    <input
                      {...register("address.complement")}
                      placeholder="Complemento / Referência (opcional)"
                      className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                )}
              </section>

              {/* Pagamento */}
              <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Pagamento na entrega</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <label className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all",
                    paymentMethod === "pix" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  )}>
                    <input type="radio" value="pix" {...register("paymentMethod")} className="sr-only" />
                    <QrCode size={20} className="mb-1" />
                    <span className="font-medium text-xs">PIX</span>
                  </label>
                  
                  <label className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all text-center",
                    paymentMethod === "cartao" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  )}>
                    <input type="radio" value="cartao" {...register("paymentMethod")} className="sr-only" />
                    <CreditCard size={20} className="mb-1" />
                    <span className="font-medium text-xs">Cartão</span>
                  </label>

                  <label className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all",
                    paymentMethod === "dinheiro" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  )}>
                    <input type="radio" value="dinheiro" {...register("paymentMethod")} className="sr-only" />
                    <Banknote size={20} className="mb-1" />
                    <span className="font-medium text-xs">Dinheiro</span>
                  </label>
                </div>

                {paymentMethod === "dinheiro" && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                    <input
                      {...register("changeFor")}
                      placeholder="Precisa de troco para quanto? (Ex: 100)"
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                )}
              </section>
              
              {/* Espaço extra para o footer não cobrir o último campo */}
              <div className="h-24"></div>
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(subtotal)}</span>
            </div>
            {deliveryMethod === "entrega" && (
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500">Taxa de Entrega</span>
                <span className="font-medium">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(TAXA_ENTREGA)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4 text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-red-600">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total)}</span>
            </div>
            
            <button
              type="submit"
              form="checkout-form"
              disabled={!isValid}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl p-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              Enviar Pedido no WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
