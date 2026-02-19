"use client";

import { useState } from "react";
import DocumentCard from "./DocumentCard";
import { documents, categories } from "../data";

export default function DocumentList() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter documents based on selected category
  const filteredDocuments =
    selectedCategory === "All"
      ? documents
      : documents.filter((doc) => doc.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          Showing <span className="font-semibold">{filteredDocuments.length}</span> document
          {filteredDocuments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No documents found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
