import React from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    FileText,
    BarChart2,
    File,
    Lightbulb,
    Rocket,
    FileSearch
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {ROUTES} from "../constants/constats";

const HomePage = () => {
    const { isDark } = useTheme();

    return (
        <div className="max-w-6xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold mb-4">
                    🧠 Pregătește-te pentru examene ca un profesionist
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Învățare, testare și analiză — totul într-un singur loc. Aplică ce știi, învață ce nu știi, evoluează.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-20">
                <Link
                    to={ROUTES.learn}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl flex flex-col items-center transition"
                >
                    <BookOpen size={32} className="mb-2" />
                    <span className="text-base font-semibold">Învățare</span>
                </Link>
                <Link
                    to={ROUTES.test}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl flex flex-col items-center transition"
                >
                    <FileText size={32} className="mb-2" />
                    <span className="text-base font-semibold">Simulare Test</span>
                </Link>
                <Link
                    to={ROUTES.progress}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl flex flex-col items-center transition"
                >
                    <BarChart2 size={32} className="mb-2" />
                    <span className="text-base font-semibold">Progres</span>
                </Link>
                <Link
                    to={ROUTES.materials}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl flex flex-col items-center transition"
                >
                    <File size={32} className="mb-2" />
                    <span className="text-base font-semibold">Materiale</span>
                </Link>
            </div>

            <section className="mt-10 text-gray-800 dark:text-gray-100">
                <h2 className="text-2xl font-bold text-center mb-8">🔍 Funcționalități cheie</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        {
                            icon: <Lightbulb size={32} />,
                            title: 'Învățare ghidată',
                            desc: 'Primești feedback instant după fiecare răspuns.',
                        },
                        {
                            icon: <Rocket size={32} />,
                            title: 'Teste cronometrate',
                            desc: 'Simulezi examenul cu presiune reală de timp.',
                        },
                        {
                            icon: <BarChart2 size={32} />,
                            title: 'Grafic evolutiv',
                            desc: 'Vizualizezi scorurile și progresul în timp.',
                        },
                        {
                            icon: <FileSearch size={32} />,
                            title: 'Materiale PDF',
                            desc: 'Accesezi documente utile pentru studiu eficient.',
                        },
                    ].map(({ icon, title, desc }) => (
                        <div
                            key={title}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition text-center"
                        >
                            <div className="mb-3 text-indigo-600 dark:text-indigo-400 mx-auto">{icon}</div>
                            <h3 className="text-lg font-semibold mb-1">{title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
