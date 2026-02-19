"use client";

import React from "react";
import { CreateStoreProvider } from "@/features/createStore/context/CreateStoreContext";
import StoreForm from "@/features/createStore/components/StoreForm";

/**
 * Create Store Page
 * Main page for creating a new store
 */
function CreateStorePage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Create Your Store
          </h1>
          <p className="mt-3 text-lg text-slate-600 font-semibold">
            Set up your store in a few simple steps
          </p>
        </div>

        {/* Store Creation Form */}
        <CreateStoreProvider>
          <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-white/60 p-8">
            <StoreForm />
          </div>
        </CreateStoreProvider>
      </div>
    </div>
  );
}

export default CreateStorePage;
