import React from 'react';
import { Github, Mail, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {APP_NAME, LOGO_PATH} from "../constants/constats";

const Footer = () => {
    const { isDark } = useTheme();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 shadow-inner mt-12">
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-600 dark:text-gray-300">

                <div className="text-center md:text-left flex items-center gap-2">
                    <img src={LOGO_PATH} alt={APP_NAME} className="w-12 h-12" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white tracking-wide">{APP_NAME}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fă-ți studiul mai eficient. Simplu. Clar. Rapid.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="mailto:contact@examprep.com"
                        className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                        <Mail size={20} />
                    </a>
                    <a
                        href="https://github.com/examprep"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                        <Github size={20} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                        <Linkedin size={20} />
                    </a>
                </div>
            </div>

            <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-4 border-t dark:border-gray-800">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
