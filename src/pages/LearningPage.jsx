import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';
import {IMAGE_PATH, QUESTIONS_PATH} from "../constants/constats";

const LearningPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answered, setAnswered] = useState(false);

    const { isDark } = useTheme();

    useEffect(() => {
        fetch(QUESTIONS_PATH)
            .then(res => res.json())
            .then(data => setSubjects(data.subjects || []));
    }, []);

    const currentQuestion = selectedSubject?.questions[currentQuestionIndex];
    const correct = currentQuestion?.correct_answer ?? [];
    const isMultiple = Array.isArray(correct);

    const handleSelect = (key) => {
        if (answered) return;
        if (isMultiple) {
            setSelectedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
        } else {
            setSelectedAnswers({ [key]: true });
        }
    };

    const isCorrectOption = (key) => isMultiple ? correct.includes(key) : correct === key;
    const isSelected = (key) => !!selectedAnswers[key];

    const getOptionClass = (key) => {
        if (!answered) return "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600";
        if (isCorrectOption(key)) return "bg-green-100 dark:bg-green-900 border border-green-500";
        if (isSelected(key)) return "bg-red-100 dark:bg-red-900 border border-red-500";
        return "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600";
    };

    const handleAnswer = () => {
        const selected = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]);
        const correctSet = isMultiple ? correct : [correct];
        const isCorrect = selected.length === correctSet.length &&
            selected.every(k => correctSet.includes(k));
        setFeedback(isCorrect ? 'Răspuns corect!' : `Greșit. Corect: ${correctSet.join(', ')}`);
        setAnswered(true);
    };

    const nextQuestion = () => {
        setSelectedAnswers({});
        setFeedback(null);
        setShowExplanation(false);
        setAnswered(false);
        setCurrentQuestionIndex(i => i + 1);
    };

    if (!started) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100 text-center">
                <h2 className="text-2xl font-semibold mb-6">Selectează o materie</h2>
                <div className="grid grid-cols-1 gap-3 text-left">
                    {subjects.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedSubject(s)}
                            className={`px-4 py-2 rounded border transition text-left shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 ${
                                selectedSubject?.name === s.name
                                    ? 'border-blue-600 bg-blue-100 text-blue-800 font-medium dark:bg-blue-900 dark:text-blue-300'
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                            }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
                {selectedSubject && (
                    <button
                        onClick={() => setStarted(true)}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Începe
                    </button>
                )}
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="p-4 text-center text-gray-800 dark:text-gray-100">
                <h2 className="text-xl font-bold text-green-600 dark:text-green-400">Ai parcurs toate întrebările!</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 shadow rounded-xl text-gray-900 dark:text-gray-100">
            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Întrebarea {currentQuestionIndex + 1} / {selectedSubject.questions.length}</span>
                <span className="text-blue-600 font-mono dark:text-blue-400">📚 {selectedSubject.name}</span>
            </div>

            <SyntaxHighlighter
                language="java"
                style={isDark ? oneDark : oneLight}
                customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontSize: '0.9rem',
                    background: isDark ? '#1e293b' : '#f9fafb',
                }}
            >
                {currentQuestion.text}
            </SyntaxHighlighter>

            {currentQuestion.image && (
                <img
                    src={`${IMAGE_PATH}${currentQuestion.image}`}
                    alt="Întrebare"
                    className="my-4 rounded shadow max-w-full"
                />
            )}

            <div className="grid grid-cols-1 gap-4 mt-4">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div
                        key={key}
                        onClick={() => handleSelect(key)}
                        className={`p-4 rounded-md transition cursor-pointer select-none ${getOptionClass(key)} text-gray-900 dark:text-gray-100`}
                    >
                        <div className="flex items-center space-x-3 w-full cursor-pointer">
                            <input
                                type={isMultiple ? 'checkbox' : 'radio'}
                                name="answer"
                                checked={isSelected(key)}
                                onChange={() => handleSelect(key)}
                            />
                            <span className="text-base">{key}. {value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {feedback && (
                <div className={`mt-6 flex items-center space-x-2 p-3 rounded ${
                    feedback.includes('corect') ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                }`}>
                    {feedback.includes('corect') ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span>{feedback}</span>
                </div>
            )}

            {showExplanation && (
                <div className="mt-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-600 p-4 rounded flex items-start gap-3">
                    <Info size={20} className="mt-1" />
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        <p className="font-semibold">Explicație:</p>
                        {currentQuestion.explanation || "(Nu există explicație pentru această întrebare.)"}
                    </div>
                </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3 justify-start">
                <button
                    onClick={handleAnswer}
                    disabled={answered}
                    className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Răspunde
                </button>
                <button
                    onClick={nextQuestion}
                    disabled={!answered}
                    className="px-5 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                    Următoarea
                </button>
                <button
                    onClick={() => setShowExplanation(true)}
                    className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Vezi Explicația
                </button>
            </div>
        </div>
    );
};

export default LearningPage;
