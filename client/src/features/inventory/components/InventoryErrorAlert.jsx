const InventoryErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
      <svg
        className="h-5 w-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="flex-1">{error}</span>
    </div>
  );
};

export default InventoryErrorAlert;
