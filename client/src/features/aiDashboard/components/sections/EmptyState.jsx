const EmptyState = ({ title, description }) => (
  <div className="flex h-full min-h-[400px] items-center justify-center p-4">
    <div className="w-full max-w-md rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
      <h3 className="text-xl font-black text-slate-900">{title}</h3>
      <p className="mt-3 text-sm font-semibold">{description}</p>
    </div>
  </div>
);

export default EmptyState;