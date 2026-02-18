const InventoryPageWrapper = ({ children }) => {
  return (
    <div className="flex flex-col relative antialiased min-h-screen">
      <main className="relative z-10 p-3 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default InventoryPageWrapper;
