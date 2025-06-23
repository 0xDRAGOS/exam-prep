import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, AlertTriangle, Info, WrapText } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../context/ThemeContext';
import {IMAGE_PATH, QUESTIONS_PATH, TEST_DURATION_SECONDS, TEST_QUESTION_COUNT} from "../constants/constants";

const TestPage = () => {
    const { isDark } = useTheme();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [started, setStarted] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
    const [finished, setFinished] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answered, setAnswered] = useState(false);
    const timerRef = useRef(null);
    const [wrapText, setWrapText] = useState(() => {
        const saved = localStorage.getItem("wrapText");
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [selectSubjectsMode, setSelectSubjectsMode] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [showWrongAnswers, setShowWrongAnswers] = useState(false);
    const [visibleExplanations, setVisibleExplanations] = useState({});

    useEffect(() => {
        localStorage.setItem("wrapText", JSON.stringify(wrapText));
    }, [wrapText]);

    useEffect(() => {
        loadQuestions();
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            finishTest(true);
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timeLeft]);

    useEffect(() => {
        if (selectSubjectsMode) loadAvailableSubjects();
    }, [selectSubjectsMode]);

    useEffect(() => {
        const saved = sessionStorage.getItem("selectedSubjects");
        if (saved) {
            setSelectedSubjects(JSON.parse(saved));
        }
    }, []);

    const current = questions[currentIndex];
    const correct = current?.correct_answer ?? [];
    const isMultiple = Array.isArray(correct);

    const loadQuestions = () => {
        fetch(QUESTIONS_PATH)
            .then(res => res.json())
            .then(data => {
                const allQuestions = data.subjects.flatMap(s => s.questions);
                const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, TEST_QUESTION_COUNT);
                setQuestions(shuffled);
            });
    };

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

    const loadAvailableSubjects = () => {
        fetch(QUESTIONS_PATH)
            .then(res => res.json())
            .then(data => setAvailableSubjects(data.subjects || []));
    };

    const getOptionClass = (key) => {
        if (!answered) return "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600";
        if (isCorrectOption(key)) return "bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 border border-green-500";
        if (isSelected(key)) return "bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100 border border-red-500";
        return "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600";
    };

    const handleAnswer = () => {
        const selected = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]);
        const correctSet = isMultiple ? correct : [correct];
        const isCorrect = selected.length === correctSet.length &&
            selected.every(k => correctSet.includes(k));

        if (isCorrect) {
            setScore(s => s + 1);
        } else {
            setWrongAnswers(prev => [...prev, {
                question: current,
                selected: selected,
                correct: correctSet
            }]);
        }

        setFeedback(isCorrect ? 'Răspuns corect!' : `Greșit. Corect: ${correctSet.join(', ')}`);
        setAnswered(true);
    };

    const nextQuestion = () => {
        setSelectedAnswers({});
        setFeedback(null);
        setShowExplanation(false);
        setAnswered(false);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(i => i + 1);
        } else {
            finishTest();
        }
    };

    const finishTest = (timeout = false) => {
        setFinished(true);
        clearTimeout(timerRef.current);
        const entry = {
            timestamp: new Date().toISOString(),
            score,
            total: questions.length,
            mode: 'test'
        };
        const history = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
        history.push(entry);
        localStorage.setItem('scoreHistory', JSON.stringify(history));
        setFeedback(timeout ? '⏰ Timpul a expirat!' : '✅ Ai terminat testul!');
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const questionProgress = questions.length
        ? ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100
        : 0;

    const toggleExplanation = (index) => {
        setVisibleExplanations(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (selectSubjectsMode && !started) {
        return (
            <div className="max-w-xl sm:mx-auto mx-2 mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-xl text-center text-gray-900 dark:text-gray-100">
                <h2 className="text-2xl font-bold mb-4">🎯 Selectează materiile</h2>
                <div className="grid grid-cols-1 gap-3 text-left mb-4">
                    {availableSubjects.map((subject, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={subject.name}
                                checked={selectedSubjects.includes(subject.name)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    const name = subject.name;
                                    const updated = checked
                                        ? [...selectedSubjects, name]
                                        : selectedSubjects.filter(s => s !== name);

                                    setSelectedSubjects(updated);
                                    sessionStorage.setItem("selectedSubjects", JSON.stringify(updated));
                                }}
                            />
                            {subject.name}
                        </label>
                    ))}
                </div>
                <button
                    disabled={selectedSubjects.length === 0}
                    onClick={() => {
                        fetch(QUESTIONS_PATH)
                            .then(res => res.json())
                            .then(data => {
                                const filtered = data.subjects
                                    .filter(s => selectedSubjects.includes(s.name))
                                    .flatMap(s => s.questions);
                                const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, TEST_QUESTION_COUNT);
                                setQuestions(shuffled);
                                setStarted(true);
                                setSelectSubjectsMode(false);
                            });
                    }}
                    className="mt-4 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                    ✅ Începe Testul
                </button>
                <button
                    onClick={() => setSelectSubjectsMode(false)}
                    className="ml-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                    ↩ Înapoi
                </button>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="max-w-xl sm:mx-auto mx-2 mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-xl text-center text-gray-900 dark:text-gray-100">
                <h2 className="text-2xl font-bold mb-4">🧪 Pregătit pentru test?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Vei primi 30 de întrebări aleatorii, cu timp limitat. Răspunde cât mai corect pentru a-ți îmbunătăți scorul.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => {
                            setStarted(true);
                            loadQuestions();
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        🚀 Test Aleator
                    </button>
                    <button
                        onClick={() => setSelectSubjectsMode(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        🎯 Test Personalizat
                    </button>
                </div>
            </div>
        );
    }

    if (finished) {
        return (
            <div
                className="max-w-xl sm:mx-auto mx-2 mt-10 text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow text-gray-900 dark:text-gray-100">
                <CheckCircle className="w-10 h-10 mx-auto text-green-500"/>
                <h2 className="text-2xl font-bold mt-2">Test Finalizat</h2>
                <p className="text-lg mt-2 text-blue-600 dark:text-blue-400">Scor: {score} / {questions.length}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{feedback}</p>
                <button
                    onClick={() => {
                        setStarted(false);
                        setFinished(false);
                        setQuestions([]);
                        setCurrentIndex(0);
                        setSelectedAnswers({});
                        setFeedback(null);
                        setScore(0);
                        setTimeLeft(TEST_DURATION_SECONDS);
                        setAnswered(false);
                        setShowExplanation(false);
                        setWrongAnswers([]);
                        setShowWrongAnswers(false);
                        setVisibleExplanations({});

                        loadQuestions();
                    }}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    🔁 Reia Testul
                </button>
                {wrongAnswers.length > 0 && (
                    <button
                        onClick={() => setShowWrongAnswers(prev => !prev)}
                        className="ml-2 mt-6 mb-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        {showWrongAnswers ? '🔽 Ascunde răspunsurile greșite' : '❌ Afișează răspunsurile greșite'}
                    </button>
                )}
                {showWrongAnswers && wrongAnswers.map((item, index) => {
                    const isMulti = Array.isArray(item.correct);
                    const isMarked = (key) => item.selected.includes(key);
                    const isCorrectKey = (key) => isMulti ? item.correct.includes(key) : item.correct === key;

                    const getAnswerStyle = (key) => {
                        if (isCorrectKey(key)) return "bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 border border-green-500";
                        if (isMarked(key)) return "bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-100 border border-red-500";
                        return "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600";
                    };

                    return (
                        <div key={index} className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded shadow">
                            <div className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                                <SyntaxHighlighter
                                    language="java"
                                    style={isDark ? oneDark : oneLight}
                                    wrapLines={wrapText}
                                    wrapLongLines={wrapText}
                                    codeTagProps={{
                                        style: {
                                            whiteSpace: wrapText ? 'pre-wrap' : 'pre',
                                            wordBreak: wrapText ? 'break-word' : 'normal',
                                        }
                                    }}
                                    customStyle={{
                                        borderRadius: '0.5rem',
                                        padding: '1rem',
                                        fontSize: '0.9rem',
                                        background: isDark ? '#1e293b' : '#f9fafb',
                                        overflowX: wrapText ? 'visible' : 'auto',
                                    }}
                                >
                                    {index + 1 + ". " + item.question.text}
                                </SyntaxHighlighter>
                            </div>

                            {item.question.image && (
                                <img
                                    src={`${IMAGE_PATH}${item.question.image}`}
                                    alt="Întrebare"
                                    className="my-4 rounded shadow max-w-full"
                                />
                            )}

                            <div className="grid grid-cols-1 gap-3 mt-3">
                                {Object.entries(item.question.options).map(([key, val]) => (
                                    <div
                                        key={key}
                                        className={`p-4 rounded-md select-none ${getAnswerStyle(key)}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                type={isMulti ? 'checkbox' : 'radio'}
                                                checked={isMarked(key)}
                                                readOnly
                                            />
                                            <span className="text-base break-words">{key}. {val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {item.question.explanation && (
                                <>
                                    <button
                                        onClick={() => toggleExplanation(index)}
                                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                    >
                                        {visibleExplanations[index] ? 'Ascunde Explicația' : 'Vezi Explicația'}
                                    </button>

                                    {visibleExplanations[index] && (
                                        <div className="flex items-start mt-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-600 p-4 rounded">
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                                <Info size={20} className="mt-1" />
                                                <p className="font-semibold">Explicație:</p>
                                                {item.question.explanation || "(Nu există explicație pentru această întrebare.)"}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    );
                })}
            </div>
        );
    }

    if (!current) return <div className="p-6 text-center text-gray-500 dark:text-gray-300">Încărcare întrebări...</div>;

    return (
        <div
            className="max-w-3xl sm:mx-auto mx-2 p-4 sm:p-6 bg-white dark:bg-gray-900 shadow rounded-xl text-gray-900 dark:text-gray-100">
            <div
                className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-1 gap-2">
                <span className="font-medium">Întrebarea {currentIndex + 1} / {questions.length}</span>
                <div className="flex items-center gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-mono">⏳ {formatTime(timeLeft)}</span>
                    <button
                        onClick={() => setWrapText(prev => !prev)}
                        title={wrapText ? "Textul se încadrează automat" : "Textul are scroll orizontal"}
                        className={`p-2 rounded-full border transition-colors
                ${wrapText
                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600'
                        } hover:shadow`}
                    >
                        <WrapText
                            className={`w-5 h-5 ${wrapText ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`}
                        />
                    </button>
                </div>
            </div>

            <div className="mb-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2">
                    <div
                        className="h-2 rounded bg-blue-500 transition-all duration-300"
                        style={{width: `${questionProgress}%`}}
                    />
                </div>
            </div>

            <div className="text-sm text-right text-green-700 dark:text-green-400 font-medium mb-4">
                📊 Scor: {score} / {questions.length}
            </div>

            <SyntaxHighlighter
                language="java"
                style={isDark ? oneDark : oneLight}
                wrapLines={wrapText}
                wrapLongLines={wrapText}
                codeTagProps={{
                    style: {
                        whiteSpace: wrapText ? 'pre-wrap' : 'pre',
                        wordBreak: wrapText ? 'break-word' : 'normal',
                    }
                }}
                customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontSize: '0.9rem',
                    background: isDark ? '#1e293b' : '#f9fafb',
                    overflowX: wrapText ? 'visible' : 'auto',
                }}
            >
                {current.text}
            </SyntaxHighlighter>

            {current.image && (
                <img
                    src={`${IMAGE_PATH}${current.image}`}
                    alt="Întrebare"
                    className="my-4 rounded shadow max-w-full"
                />
            )}

            <div className="grid grid-cols-1 gap-4 mt-4">
                {Object.entries(current.options).map(([key, value]) => (
                    <div
                        key={key}
                        onClick={() => handleSelect(key)}
                        className={`p-4 rounded-md transition cursor-pointer select-none ${getOptionClass(key)}`}
                    >
                        <div className="flex items-center space-x-3 w-full">
                            <input
                                type={isMultiple ? 'checkbox' : 'radio'}
                                name="answer"
                                checked={isSelected(key)}
                                onChange={() => handleSelect(key)}
                            />
                            <span className="text-base whitespace-pre-wrap break-words">{key}. {value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {feedback && (
                <div className={`mt-6 flex items-center space-x-2 p-3 rounded ${feedback.includes('corect') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.includes('corect') ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span>{feedback}</span>
                </div>
            )}

            {feedback && showExplanation && (
                <div className="mt-4 bg-yellow-100 text-yellow-900 border border-yellow-300 p-4 rounded flex items-start gap-3">
                    <Info size={20} className="mt-1" />
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        <p className="font-semibold text-gray-900">Explicație:</p>
                        {current.explanation || "(Nu există explicație pentru această întrebare.)"}
                    </div>
                </div>
            )}

            <div className="mt-6 flex flex-wrap gap-1 sm:gap-3 justify-center">
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
                    onClick={() => answered && setShowExplanation(prev => !prev)}
                    className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    {showExplanation ? 'Ascunde Explicația' : 'Vezi Explicația'}
                </button>
            </div>
        </div>
    );
};

export default TestPage;
