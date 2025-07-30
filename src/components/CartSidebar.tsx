import React from "react";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type CartSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const CartSidebar = ({ open, onClose }: CartSidebarProps) => {
  const { state, removeItem, updateQuantity, itemCount, totalPrice } =
    useCart();

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto" dir="rtl">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-bella" />
              <span>سلة التسوق ({itemCount})</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute left-4 top-4"
            >
              <X className="h-5 w-5" />
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">سلة التسوق فارغة</p>
              <Button onClick={onClose}>تسوق الآن</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-bella font-bold">{item.price}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 h-7 w-7"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <DrawerFooter className="border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">الإجمالي:</span>
              <span className="font-bold text-bella text-xl">{totalPrice}</span>
            </div>
            <Link to="/checkout" className="w-full">
              <Button
                className="w-full bg-bella hover:bg-bella-dark"
                onClick={onClose}
              >
                إتمام الشراء
              </Button>
            </Link>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartSidebar;
