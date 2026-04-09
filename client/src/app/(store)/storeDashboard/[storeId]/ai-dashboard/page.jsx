"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AIDashboardContent } from "@/features/aiDashboard/components";
import {
  fetchForecast,
  fetchInsights,
  fetchRestockPlan,
} from "@/features/aiDashboard/services/aiDashboardService";
import { fetchStoreById } from "@/features/storeDashboard/services/storeDashboardService";

const AIDashboardPage = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;

  const [store, setStore] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [restock, setRestock] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [storeResponse, forecastData, restockData, insightsData] =
          await Promise.all([
            fetchStoreById(storeId),
            fetchForecast(storeId),
            fetchRestockPlan(storeId),
            fetchInsights(storeId),
          ]);

        if (!isMounted) {
          return;
        }

        setStore(storeResponse?.data || null);
        setForecast(forecastData);
        setRestock(restockData);
        setInsights(insightsData);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err?.message || "Failed to load AI dashboard");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (storeId) {
      loadDashboard();
    }

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 rounded-[2.5rem] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-600">
                AI Decision Support
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                {store?.name || "Store"} Intelligence Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-slate-600">
                Forecast demand, prioritize restocks, and review explainable inventory insights from recent store activity.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/storeDashboard/${storeId}`)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50"
              >
                Back To Inventory
              </button>
            </div>
          </div>
        </section>

        <AIDashboardContent
          forecast={forecast}
          restock={restock}
          insights={insights}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  );
};

export default AIDashboardPage;
