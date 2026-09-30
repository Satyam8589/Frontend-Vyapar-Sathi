"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, RefreshCw, Sparkles, Zap } from "lucide-react";
import {
  AutomationCard,
  AutomationFormModal,
  AutomationStats,
  useAutomations,
} from "@/features/automation";

export default function AutomationsPage() {
  const { storeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const automation = useAutomations(storeId);

  const openModal = () => {
    setFormData({ ...automation.formDefaults });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (await automation.create(formData)) closeModal();
  };

  return (
    <main className="min-h-screen px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:gap-6">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-5 py-7 text-white shadow-[0_25px_90px_rgba(15,23,42,0.25)] sm:px-8 sm:py-9">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-300"><Sparkles className="h-4 w-4" />Workflow studio</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Scheduled automations</h1>
              <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-300 sm:text-base">Turn recurring store work into reliable routines for stock, sales, and demand planning.</p>
            </div>
            <button type="button" onClick={openModal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"><Plus className="h-5 w-5" />New automation</button>
          </div>
          <Zap className="absolute -bottom-12 -right-8 h-52 w-52 rotate-12 text-blue-400/10" />
        </section>

        <AutomationStats automations={automation.automations} />

        {automation.loading && <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-500"><RefreshCw className="mb-3 h-8 w-8 animate-spin text-blue-600" /><p className="text-sm font-semibold">Loading automation rules...</p></div>}
        {automation.error && !automation.loading && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">{automation.error}</div>}
        {!automation.loading && !automation.error && automation.automations.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Zap className="h-7 w-7" /></div><h2 className="mt-5 text-xl font-black text-slate-900">No automations yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Create a rule to keep important store routines running in the background.</p><button type="button" onClick={openModal} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"><Plus className="h-4 w-4" />Create your first rule</button></div>}
        {!automation.loading && automation.automations.length > 0 && <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">{automation.automations.map((item) => <AutomationCard key={item._id} item={item} loading={automation.actionLoadingId === item._id} onToggle={automation.toggleStatus} onTrigger={automation.triggerNow} onDelete={(id, title) => { if (window.confirm(`Delete '${title}'?`)) automation.remove(id, title); }} />)}</div>}
      </div>
      {formData && <AutomationFormModal isOpen={isModalOpen} onClose={closeModal} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} submitting={automation.submitting} />}
    </main>
  );
}
