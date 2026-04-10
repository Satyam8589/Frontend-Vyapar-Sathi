const EmptyState = ({ title, description }) => (
  <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
    <h3 className="text-xl font-black text-slate-900">{title}</h3>
    <p className="mt-3 text-sm font-semibold leading-relaxed">{description}</p>
  </div>
);

export default EmptyState;
