import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart2, AlertCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PROGRESS_CHART_LIMIT, PROGRESS_ITEMS_PER_PAGE } from '../constants/constants';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const ProgressPage = () => {
  const [chartData, setChartData] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedMode, setSelectedMode] = useState('test');
  const [currentPage, setCurrentPage] = useState(1);
  const { isDark } = useTheme();

  const modeOptions = [
    { value: 'test', label: 'Test Aleator' },
    { value: 'test_personalizat', label: 'Test Personalizat' },
    { value: 'test_complet', label: 'Test Complet' },
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('scoreHistory') || '[]')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setHistory(saved);

    const filtered = saved.filter(entry => entry.mode === selectedMode);
    if (filtered.length === 0) {
      setChartData(null);
      return;
    }

    const latest = filtered.slice(0, PROGRESS_CHART_LIMIT).reverse();
    const labels = latest.map(h => new Date(h.timestamp).toLocaleString());
    const scores = latest.map(h => h.score);
    const totals = latest.map(h => h.total);

    setChartData({
      labels,
      datasets: [{
        label: 'Scor obținut',
        data: scores,
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.2)',
        tension: 0.25,
        pointRadius: 5,
        pointHoverRadius: 7,
      }],
      meta: { totals }
    });
  }, [isDark, selectedMode]);

  const handleClearHistory = () => {
    localStorage.removeItem('scoreHistory');
    setHistory([]);
    setChartData(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(history.length / PROGRESS_ITEMS_PER_PAGE);
  const paginatedHistory = history.slice(
      (currentPage - 1) * PROGRESS_ITEMS_PER_PAGE,
      currentPage * PROGRESS_ITEMS_PER_PAGE
  );

  return (
      <div className="max-w-5xl sm:mx-auto mx-2 px-4 sm:px-6 py-6 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="w-6 h-6" />
            <h2 className="text-xl font-bold">Istoric Scoruri</h2>
          </div>
          {history.length > 0 && (
              <button
                  onClick={handleClearHistory}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition"
              >
                Șterge Istoricul
              </button>
          )}
        </div>

        {history.length === 0 ? (
            // 1) Niciun istoric
            <div className="flex flex-col items-center text-center text-gray-500 dark:text-gray-400 py-16">
              <AlertCircle className="w-10 h-10 mb-2 text-yellow-500" />
              <p className="text-lg font-medium">Nu ai niciun scor salvat momentan.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Rezolvă cel puțin un test sau o întrebare pentru a genera istoricul scorurilor.
              </p>
            </div>
        ) : (
            <>
              {/* Selector tip test */}
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="modeSelect" className="text-sm font-medium">Tip Test:</label>
                <select
                    id="modeSelect"
                    value={selectedMode}
                    onChange={e => { setSelectedMode(e.target.value); setCurrentPage(1); }}
                    className="border rounded p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {modeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {chartData === null ? (
                  // 2) Istoric există, dar nu pentru modul curent
                  <div className="flex flex-col items-center text-center text-gray-500 dark:text-gray-400 py-16">
                    <AlertCircle className="w-10 h-10 mb-2 text-yellow-500" />
                    <p className="text-lg font-medium">
                      Nu ai niciun scor salvat pentru „{modeOptions.find(o => o.value === selectedMode).label}”.
                    </p>
                  </div>
              ) : (
                  // 3) Afișează graficul
                  <div className="w-full overflow-x-auto h-[300px] mb-10">
                    <div className="min-w-[350px]">
                      <Line
                          data={{
                            labels: chartData.labels,
                            datasets: chartData.datasets
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              tooltip: {
                                callbacks: {
                                  label: context => {
                                    const i = context.dataIndex;
                                    const score = context.raw;
                                    const total = chartData.meta.totals[i];
                                    return `${score} / ${total}`;
                                  }
                                }
                              },
                              legend: {
                                labels: {
                                  color: isDark ? '#d1d5db' : '#374151',
                                  font: { size: 12, weight: '500' }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1, color: isDark ? '#9ca3af' : '#6b7280' },
                                grid: { color: isDark ? '#374151' : '#e5e7eb' }
                              },
                              x: {
                                ticks: { color: isDark ? '#9ca3af' : '#6b7280' },
                                grid: { color: isDark ? '#374151' : '#f3f4f6' }
                              }
                            }
                          }}
                      />
                    </div>
                  </div>
              )}
            </>
        )}

        { history.length !== 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold">Istoric detaliat</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[500px] w-full text-sm text-left border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 border-b">Dată</th>
                <th className="px-4 py-2 border-b">Mod</th>
                <th className="px-4 py-2 border-b">Scor</th>
                <th className="px-4 py-2 border-b">Total</th>
              </tr>
              </thead>
              <tbody>
              {paginatedHistory.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 border-b">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">
                      {modeOptions.find(o => o.value === entry.mode)?.label || entry.mode}
                    </td>
                    <td className="px-4 py-2 border-b font-semibold text-blue-600 dark:text-blue-400">
                      {entry.score}
                    </td>
                    <td className="px-4 py-2 border-b">{entry.total}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Înapoi
                </button>
                <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
              Pagina {currentPage} din {totalPages}
            </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Înainte
                </button>
              </div>
          )}
        </div>
            )}
      </div>
  );
};

export default ProgressPage;
