"use client";

import { useBillingContext } from "../context/billingContext";
import { Trash2, Plus, Minus } from "lucide-react";

export const BilledProductsList = () => {
  const { billedProducts, removeProduct, updateProductQuantity } =
    useBillingContext();

  if (billedProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Current Bill</h2>
        <div className="text-center py-12 text-gray-400">
          <p>No products added yet</p>
          <p className="text-sm mt-2">Scan or add products to start billing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
        Current Bill ({billedProducts.length} items)
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {billedProducts.map((product) => {
          const price = product.price || product.sellingPrice || 0;
          const quantity = product.billedQuantity || 1;
          const total = price * quantity;
          const availableQty = product.quantity || product.qty || 0;

          return (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 gap-3"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  {product.barcode && `Barcode: ${product.barcode}`}
                  {product.category && ` | ${product.category}`}
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  Available: {availableQty} units
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() =>
                      updateProductQuantity(product._id, quantity - 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 flex-shrink-0"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} className="w-4 h-4 md:w-4 md:h-4" />
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const newQty = Number.parseInt(e.target.value, 10) || 1;
                      updateProductQuantity(product._id, newQty);
                    }}
                    className="w-12 md:w-16 text-center border border-gray-300 rounded px-1 md:px-2 py-1 text-sm"
                    min="1"
                    max={availableQty}
                  />

                  <button
                    onClick={() =>
                      updateProductQuantity(product._id, quantity + 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 flex-shrink-0"
                    disabled={quantity >= availableQty}
                  >
                    <Plus size={16} className="w-4 h-4 md:w-4 md:h-4" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right min-w-[70px] md:min-w-24">
                  <p className="text-xs md:text-sm text-gray-500">
                    ₹{price.toFixed(2)} ea
                  </p>
                  <p className="font-semibold text-gray-900 text-sm md:text-base">
                    ₹{total.toFixed(2)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeProduct(product._id)}
                  className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Remove product"
                >
                  <Trash2 size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
