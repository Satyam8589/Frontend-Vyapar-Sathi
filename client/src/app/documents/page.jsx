import DocumentsHeader from "@/features/documents/components/DocumentsHeader";
import DocumentList from "@/features/documents/components/DocumentList";

export const metadata = {
  title: "Documents | Vyapar Sathi",
  description: "Access guides and documentation for Vyapar Sathi",
};

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <DocumentsHeader />

        {/* Documents Section */}
        <DocumentList />

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-600 text-sm border-t border-gray-200 pt-8">
          <p>
            Can't find what you're looking for?{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
