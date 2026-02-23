"use client";

import { useManualProductAdd } from "../hooks";
import { Search, X } from "lucide-react";

export const ManualProductModal = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    isModalOpen,
    setIsModalOpen,
    filteredProducts,
    handleAddProduct,
  } = useManualProductAdd();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold">Add Product Manually</h2>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setSearchTerm("");
              setSelectedProduct(null);
              setQuantity(1);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or barcode..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Product List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No products found</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => {
                const price = product.price || product.sellingPrice || 0;
                const availableQty = product.quantity || product.qty || 0;
                const isSelected = selectedProduct?._id === product._id;

                return (
                  <button
                    type="button"
                    key={product._id}
                    onClick={() => setSelectedProduct(product)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedProduct(product)
                    }
                    className={`w-full p-4 border rounded-lg cursor-pointer transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.barcode && `Barcode: ${product.barcode}`}
                          {product.category && ` | ${product.category}`}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Available: {availableQty} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{price.toFixed(2)}
                        </p>
                        {availableQty === 0 && (
                          <span className="text-xs text-red-600">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Product & Quantity */}
        {selectedProduct && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {selectedProduct.name}
                </p>
                <p className="text-sm text-gray-500">
                  ₹
                  {(
                    selectedProduct.price ||
                    selectedProduct.sellingPrice ||
                    0
                  ).toFixed(2)}{" "}
                  per unit
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label
                    htmlFor="quantity-input"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity-input"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Number.parseInt(e.target.value, 10) || 1),
                      )
                    }
                    min="1"
                    max={selectedProduct.quantity || selectedProduct.qty || 0}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                </div>

                <button
                  onClick={handleAddProduct}
                  disabled={
                    quantity <= 0 ||
                    quantity >
                      (selectedProduct.quantity || selectedProduct.qty || 0)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
