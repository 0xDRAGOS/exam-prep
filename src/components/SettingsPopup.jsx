import React from 'react';

const SettingsPopup = ({ onClose, shuffleOptions, setShuffleOptions, hideOptionLetters, setHideOptionLetters }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative mx-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-md w-full text-gray-900 dark:text-gray-100">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white text-lg font-bold"
                aria-label="Închide"
            >
                ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">⚙️ Setări Test</h3>

            <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={shuffleOptions}
                        onChange={(e) => {
                            setShuffleOptions(e.target.checked);
                            localStorage.setItem("shuffleOptions", JSON.stringify(e.target.checked));
                        }}
                    />
                    Amestecă opțiunile de răspuns
                </label>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={hideOptionLetters}
                        onChange={(e) => {
                            setHideOptionLetters(e.target.checked);
                            localStorage.setItem("hideOptionLetters", JSON.stringify(e.target.checked));
                        }}
                    />
                    Ascunde literele din fața opțiunilor
                </label>
            </div>

            <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
                Închide
            </button>
        </div>
    </div>
);

export default SettingsPopup;
