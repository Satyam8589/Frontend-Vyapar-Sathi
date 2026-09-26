"use client";

import { useManualProductAdd } from "../hooks";
import { Package, Search, X } from "lucide-react";

export const ManualProductModal = ({ inline = false }) => {
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
    isSearching,
    addProduct,
    handleAddProduct,
  } = useManualProductAdd();

  const renderProductRows = (compact = false) => (
    <div className={compact ? "divide-y divide-gray-100" : "space-y-2"}>
      {filteredProducts.map((product) => {
        const price = Number(product.price || product.sellingPrice || 0);
        const availableQty = Number(product.quantity || product.qty || 0);

        return (
          <div
            key={product._id}
            className={`flex items-center gap-3 ${
              compact
                ? "px-3 py-2.5"
                : "p-4 border border-gray-200 rounded-lg"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50">
              {product.image ? (
                <img
                  src={product.image}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <Package className="text-gray-400" size={22} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-gray-800">
                {product.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {product.barcode
                  ? `Barcode: ${product.barcode}`
                  : product.sku
                    ? `SKU: ${product.sku}`
                    : "No barcode or SKU"}
              </p>
              <p
                className={`text-xs font-semibold ${
                  availableQty > 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                Stock: {availableQty}
              </p>
            </div>

            <p className="shrink-0 font-bold text-gray-800">
              ₹{price.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => addProduct(product)}
              disabled={availableQty <= 0}
              className="shrink-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Add
            </button>
          </div>
        );
      })}
    </div>
  );

  if (inline) {
    return (
      <div className="rounded-lg bg-white shadow-md">
        <div className="p-4 md:p-6 pb-0">
          <h2 className="mb-3 text-lg font-semibold text-gray-800 md:text-xl">
            Search Product
          </h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search product name, barcode or SKU..."
              className="w-full rounded-lg border-2 border-blue-500 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Search products"
            />
          </div>
        </div>

        {searchTerm.trim() && (
          <div className="mt-2 max-h-[22rem] overflow-y-auto">
            {isSearching ? (
              <p className="p-6 text-center text-sm text-gray-500">
                Searching products...
              </p>
            ) : filteredProducts.length > 0 ? (
              renderProductRows(true)
            ) : (
              <p className="p-6 text-center text-sm text-gray-500">
                No matching products found
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

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
