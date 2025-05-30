import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?worker';
import { FileText, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {PDF_FILES, PDF_PATH} from "../constants/constants";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

const ResourcesPage = ({ url = "./assets/pdf/licenta-2015-grile-modul-1.pdf" }) => {
    const canvasRef = useRef(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const renderTaskRef = useRef(null);
    const [pageNum, setPageNum] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const [pdfList] = useState(PDF_FILES);
    const [currentFile, setCurrentFile] = useState(url);

    const { isDark } = useTheme();

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(currentFile);
        loadingTask.promise.then(pdf => {
            setPdfDoc(pdf);
            setPageNum(1);
            renderPage(pdf, 1);
        });

        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [currentFile]);

    const renderPage = (pdf, num) => {
        pdf.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            renderTaskRef.current = renderTask;

            renderTask.promise.catch(err => {
                if (err?.name !== 'RenderingCancelledException') {
                    console.error("Eroare la redarea paginii:", err);
                }
            });
        });
    };

    const goToPage = (delta) => {
        const newPage = pageNum + delta;
        if (newPage >= 1 && newPage <= pdfDoc.numPages) {
            setPageNum(newPage);
            renderPage(pdfDoc, newPage);
        }
    };

    return (
        <div className="max-w-4xl sm:mx-auto mx-2 p-6 bg-white dark:bg-gray-900 shadow rounded-xl text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="text-indigo-500 dark:text-indigo-400" /> Vizualizare PDF
            </h2>

            <div className="relative mb-6 w-full sm:w-auto">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-between gap-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {currentFile?.split('/').pop() || 'Selectează document'} <ChevronDown size={18} />
                </button>

                {showDropdown && (
                    <div className="absolute left-0 mt-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow z-10 max-h-60 overflow-y-auto">
                        {pdfList.map(file => (
                            <button
                                key={file}
                                onClick={() => {
                                    setCurrentFile(`${PDF_PATH}${file}`);
                                    setShowDropdown(false);
                                }}
                                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {file}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <canvas
                ref={canvasRef}
                className="w-full max-w-full h-auto border shadow rounded bg-white dark:bg-gray-800"
            />

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={() => goToPage(-1)}
                    disabled={pageNum === 1}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                    <ChevronLeft size={16} /> Pagina anterioară
                </button>

                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium text-center">
          Pagina {pageNum} / {pdfDoc?.numPages || "?"}
        </span>

                <button
                    onClick={() => goToPage(1)}
                    disabled={pdfDoc && pageNum >= pdfDoc.numPages}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                    Pagina următoare <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ResourcesPage;