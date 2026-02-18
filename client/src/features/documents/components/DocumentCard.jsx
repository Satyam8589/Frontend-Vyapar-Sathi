export default function DocumentCard({ document }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      {/* Header with category */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold rounded-full px-3 py-1">
          {document.category}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-4 lg:px-5 lg:py-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {document.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {document.description}
        </p>

        {/* Footer with metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100 pt-3">
          <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>📄</span>
              <span>{document.fileSize}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{new Date(document.uploadedDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Download button */}
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            <span>⬇️</span>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
