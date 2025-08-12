"use client";

interface ReviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function ReviewStep({ onNext, onPrevious }: ReviewStepProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Review Detected Form
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Our AI has detected the following fields in your document
      </p>
      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-4"
          onClick={onNext}
        >
          Continue to Fill Form
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onPrevious}
        >
          Upload Different File
        </button>
      </div>
    </div>
  );
}
