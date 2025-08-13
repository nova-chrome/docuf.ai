"use client";

interface FillFormStepProps {
  onNext: () => void;
  onRestart: () => void;
}

export function FillFormStep({ onNext, onRestart }: FillFormStepProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-4">Fill Out Form</h2>
      <p className="text-gray-600 text-center mb-8">
        Complete the detected fields below
      </p>
      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-4"
          onClick={onNext}
        >
          Generate Document
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={onRestart}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
