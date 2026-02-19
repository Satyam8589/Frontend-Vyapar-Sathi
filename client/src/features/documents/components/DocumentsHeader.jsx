export default function DocumentsHeader() {
  return (
    <div className="mb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">📚</span>
          <h1 className="text-3xl lg:text-4xl font-bold">Documents</h1>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          Access guides, tutorials, and documentation to help you make the most
          of Vyapar Sathi.
        </p>
      </div>
    </div>
  );
}
