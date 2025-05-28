import React, { useState } from 'react';
import {
    ChevronDown, Menu, Home, BookOpen, FileText, File, BarChart, Moon, Sun
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {APP_NAME, LOGO_PATH, PDF_FILES, PDF_PATH, ROUTES} from "../constants/constats";

const Header = () => {
    const [showPdfDropdown, setShowPdfDropdown] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const { isDark, setIsDark } = useTheme();
    const location = useLocation();

    const navItems = [
        { label: 'Acasă', icon: <Home size={16} />, path: ROUTES.home },
        { label: 'Învățare', icon: <BookOpen size={16} />, path: ROUTES.learn },
        { label: 'Simulare Test', icon: <FileText size={16} />, path: ROUTES.test },
        { label: 'Materiale', icon: <File size={16} />, path: ROUTES.materials },
        { label: 'Progres', icon: <BarChart size={16} />, path: ROUTES.progress },
    ];

    const pdfFiles = useState(PDF_FILES)

    return (
        <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50 transition">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to={ROUTES.home} className="flex items-center gap-2 text-gray-800 dark:text-white font-bold text-lg">
                    <img src={LOGO_PATH} alt={APP_NAME} className="w-12 h-12" />
                    {APP_NAME}
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                        aria-label="Comută tema"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        className="md:hidden text-gray-700 dark:text-gray-300"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        <Menu size={24} />
                    </button>
                </div>

                <nav className="hidden md:flex space-x-4 items-center relative">
                    {navItems.map((item) =>
                        item.label === 'Materiale' ? (
                            <div key="Materiale" className="relative">
                                <button
                                    onClick={() => setShowPdfDropdown(!showPdfDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                                        location.pathname === item.path
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {item.icon} {item.label} <ChevronDown size={16} />
                                </button>

                                {showPdfDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-50">
                                        <Link
                                            to={ROUTES.materials}
                                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium border-b dark:border-gray-600"
                                            onClick={() => setShowPdfDropdown(false)}
                                        >
                                            ➤ Vizualizare Materiale
                                        </Link>
                                        {pdfFiles.map((file) => (
                                            <a
                                                key={file}
                                                href={`${PDF_PATH}${file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {file}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.icon} {item.label}
                            </Link>
                        )
                    )}

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                        aria-label="Comută tema"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </nav>
            </div>

            {mobileMenu && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t shadow">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setMobileMenu(false)}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                                location.pathname === item.path
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Header;
