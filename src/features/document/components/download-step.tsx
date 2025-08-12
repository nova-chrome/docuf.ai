"use client";

interface DownloadStepProps {
  onStartOver: () => void;
}

export function DownloadStep({ onStartOver }: DownloadStepProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Download Your Document
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Your completed document is ready for download
      </p>
      <div className="text-center">
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors mr-4">
          Download PDF
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onStartOver}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
