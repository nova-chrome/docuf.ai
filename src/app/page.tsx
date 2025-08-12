export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      {/* Header Section */}
      <div className="text-center max-w-4xl mb-16">
        <h1 className="text-6xl font-bold mb-8">
          <span className="text-blue-500">docuf</span>
          <span className="text-gray-900">.ai</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Transform any PDF into a smart form. AI detects fields, you fill them
          out, and get your completed document instantly.
        </p>
      </div>

      {/* Stepper Section */}
      <div className="w-full max-w-6xl mb-16">
        {/* Placeholder for stepper component */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            Stepper Component (Upload PDF → Review Form → Fill Form → Download)
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Upload Your PDF
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Upload a PDF document and our AI will automatically detect fillable
            fields
          </p>

          {/* Upload Area Placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <div className="mb-4">
              {/* Upload icon placeholder */}
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            </div>
            <p className="text-gray-600 mb-2">Drag and drop your PDF here</p>
            <p className="text-gray-500 mb-6">or</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
