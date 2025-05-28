import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LearningPage from './pages/LearningPage';
import TestPage from './pages/TestPage';
import ResourcesPage from './pages/ResourcesPage';
import ProgressPage from './pages/ProgressPage';
import { ThemeProvider } from './context/ThemeContext';
import {ROUTES} from "./constants/constats";

function App() {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <Header />
                <main className="pt-6">
                    <Routes>
                        <Route path={ROUTES.home} element={<HomePage />} />
                        <Route path={ROUTES.learn} element={<LearningPage />} />
                        <Route path={ROUTES.test} element={<TestPage />} />
                        <Route path={ROUTES.materials} element={<ResourcesPage />} />
                        <Route path={ROUTES.progress} element={<ProgressPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}

export default App;
