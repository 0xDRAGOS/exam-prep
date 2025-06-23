import React from 'react';

const ResumePopup = ({ onContinue, onRestart, subjectName, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-sm text-center text-gray-900 dark:text-gray-100">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white text-lg font-bold"
                aria-label="Închide"
            >
                ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">Continuă de unde ai rămas?</h3>
            <p className="mb-6">Ai progres salvat pentru <span className="font-medium">{subjectName}</span>.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onContinue} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Continuă
                </button>
                <button onClick={onRestart} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Ia de la capăt
                </button>
            </div>
        </div>
    </div>
);

export default ResumePopup;
