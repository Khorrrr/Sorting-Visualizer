import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, RotateCcw, ChevronLeft,
    Activity, Info, Code2, BookOpen,
    Volume2, VolumeX, Pause, SkipForward, SkipBack, Terminal
} from 'lucide-react';

import { bubbleSort } from '../algorithms/bubbleSort';
import { insertionSort } from '../algorithms/insertionSort';
import { selectionSort } from '../algorithms/selectionSort';
import { quickSort } from '../algorithms/quickSort';
import { mergeSort } from '../algorithms/mergeSort';
import { heapSort } from '../algorithms/heapSort';
import { algorithms } from '../data/algorithms';
import CodePreview from '../components/CodePreview';
import { audioEngine } from '../utils/audioEngine';

const algoMap = {
    'bubble-sort': bubbleSort,
    'insertion-sort': insertionSort,
    'selection-sort': selectionSort,
    'quick-sort': quickSort,
    'merge-sort': mergeSort,
    'heap-sort': heapSort
};

export default function Visualizer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const algoData = algorithms.find(a => a.id === id);

    const [array, setArray] = useState([]);
    const [comparing, setComparing] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [arraySize, setArraySize] = useState(20);
    const [status, setStatus] = useState('Ready to start');
    const [activeTab, setActiveTab] = useState('explanation');

    const [stats, setStats] = useState({
        comparisons: 0,
        swaps: 0,
        startTime: null,
        elapsedTime: 0,
        opsPerSec: 0
    });

    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [generator, setGenerator] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeLine, setActiveLine] = useState(0);

    const isPausedRef = useRef(false);
    const isSortingRef = useRef(false);
    const speedRef = useRef(speed);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        isSortingRef.current = isSorting;
    }, [isSorting]);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    const resetArray = useCallback(() => {
        if (isSortingRef.current) return;
        const newArray = Array.from(
            { length: arraySize },
            () => ({
                id: Math.random().toString(36).substr(2, 9),
                value: Math.floor(Math.random() * 85) + 5
            })
        );
        setArray(newArray);
        setComparing([]);
        setSwapping([]);
        setSorted([]);
        setStatus('Array reset. Ready to start.');
        setStats({
            comparisons: 0,
            swaps: 0,
            startTime: null,
            elapsedTime: 0,
            opsPerSec: 0
        });
        setHistory([]);
        setGenerator(null);
        setIsPaused(false);
    }, [arraySize]);

    useEffect(() => {
        resetArray();
    }, [resetArray, arraySize]);

    const runVisualizer = async () => {
        if (isSorting && !isPaused) return;

        if (isPaused) {
            setIsPaused(false);
            return;
        }

        if (sorted.length === array.length && array.length > 0) {
            resetArray();
        }

        setIsSorting(true);
        setSorted([]);
        const initialStatus = 'Initializing algorithm...';
        setStatus(initialStatus);

        const selectedAlgo = algoMap[id];
        if (!selectedAlgo) return;

        const sorter = selectedAlgo(array);
        setGenerator(sorter);

        setIsPaused(false);
        isPausedRef.current = false;

        const startTime = performance.now();
        let comparisons = 0;
        let swaps = 0;

        for await (const step of sorter) {
            while (isPausedRef.current) {
                await new Promise(r => setTimeout(r, 100));
            }

            setArray(step.array);
            setHistory(prev => [...prev.slice(-100), { ...step, stats: { ...stats } }]);
            setActiveLine(step.line || 0);

            let currentMessage = '';
            if (step.type === 'compare') {
                comparisons++;
                setComparing(step.indices);
                currentMessage = `Comparing indices ${step.indices.join(' & ')}`;
                setStatus(currentMessage);

                if (isSoundEnabled) {
                    const val1 = step.array[step.indices[0]].value;
                    audioEngine.playNote(audioEngine.getFrequency(val1), 0.05, 'sine');

                    if (step.indices[1] !== undefined) {
                        const val2 = step.array[step.indices[1]].value;
                        audioEngine.playNote(audioEngine.getFrequency(val2), 0.05, 'sine');
                    }
                }
            }
            if (step.type === 'swap') {
                swaps++;
                setSwapping(step.indices);
                currentMessage = `Swapping values at indices ${step.indices.join(' & ')}`;
                setStatus(currentMessage);

                if (isSoundEnabled) {
                    const val1 = step.array[step.indices[0]].value;
                    audioEngine.playNote(audioEngine.getFrequency(val1), 0.08, 'sawtooth');

                    if (step.indices[1] !== undefined) {
                        const val2 = step.array[step.indices[1]].value;
                        audioEngine.playNote(audioEngine.getFrequency(val2), 0.08, 'sawtooth');
                    }
                }
            }
            if (step.type === 'sorted') {
                setSorted(prev => [...new Set([...prev, ...step.indices])]);
                setComparing([]);
                setSwapping([]);
                currentMessage = `Elements at ${step.indices.join(', ')} are now in sorted position`;
                setStatus(currentMessage);
            }

            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / 1000;
            setStats({
                comparisons,
                swaps,
                startTime,
                elapsedTime: elapsed.toFixed(2),
                opsPerSec: Math.floor((comparisons + swaps) / (elapsed || 1))
            });

            await new Promise(r => setTimeout(r, speedRef.current));
        }

        setSorted(array.map((_, i) => i));
        setComparing([]);
        setSwapping([]);
        const finalStatus = 'Sorting complete! Everything is in order.';
        setStatus(finalStatus);
        setIsSorting(false);
        setGenerator(null);
    };

    const togglePause = () => {
        setIsPaused(prev => !prev);
    };

    const stepForward = async () => {
        if (!generator) return;
        const result = await generator.next();
        if (!result.done) {
            const step = result.value;
            setArray(step.array);
            setActiveLine(step.line || 0);
            if (step.type === 'compare') setComparing(step.indices);
            if (step.type === 'swap') setSwapping(step.indices);
            if (step.type === 'sorted') setSorted(prev => [...new Set([...prev, ...step.indices])]);
        } else {
            setIsSorting(false);
        }
    };

    const stepBackward = () => {
        if (history.length <= 1) return;
        const newHistory = [...history];
        newHistory.pop();
        const prevState = newHistory[newHistory.length - 1];

        setArray(prevState.array);
        setComparing(prevState.indices || []);
        setSwapping(prevState.indices || []);
        setActiveLine(prevState.line || 0);
        setHistory(newHistory);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-brand-dark overflow-x-hidden text-white flex flex-col items-center font-mono">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-6 gap-6 text-center md:text-left">
                <div>
                    <button
                        onClick={() => navigate('/algorithms')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group text-sm"
                    >
                        <ChevronLeft size={16} />
                        cd ..
                    </button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Terminal size={28} className="text-brand-accent" />
                        {algoData?.title}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-brand-surface p-2 rounded border border-white/10">
                    <div className="flex flex-col gap-1 px-4 border-r border-white/10">
                        <span className="text-[10px] uppercase text-gray-500 font-bold">Delay: {speed}ms</span>
                        <input
                            type="range" min="10" max="400" step="10"
                            value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-32 accent-brand-accent cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-2 border-r border-white/10 pr-4">
                        <button
                            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                            className={`p-2 rounded hover:bg-white/10 transition-all ${isSoundEnabled ? 'text-brand-accent' : 'text-gray-500'}`}
                            title={isSoundEnabled ? 'Mute' : 'Unmute'}
                        >
                            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={resetArray}
                            disabled={isSorting && !isPaused}
                            className="p-2 rounded hover:bg-white/10 text-white disabled:opacity-30 transition-all"
                            title="New Array"
                        >
                            <RotateCcw size={18} />
                        </button>

                        {isSorting && (
                            <>
                                <button
                                    onClick={togglePause}
                                    className="p-2 rounded hover:bg-white/10 text-white transition-all"
                                    title={isPaused ? 'Resume' : 'Pause'}
                                >
                                    {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                                </button>
                                <button
                                    onClick={stepForward}
                                    className="p-2 rounded hover:bg-white/10 text-white transition-all disabled:opacity-30"
                                    title="Step Forward"
                                    disabled={!isPaused}
                                >
                                    <SkipForward size={18} />
                                </button>
                                <button
                                    onClick={stepBackward}
                                    className="p-2 rounded hover:bg-white/10 text-white transition-all disabled:opacity-30"
                                    title="Step Backward"
                                    disabled={!isPaused || history.length <= 1}
                                >
                                    <SkipBack size={18} />
                                </button>
                            </>
                        )}

                        {!isSorting && (
                            <button
                                onClick={runVisualizer}
                                className="px-4 py-2 rounded bg-brand-accent/20 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white font-bold flex items-center gap-2 transition-all text-sm"
                            >
                                <Play size={16} fill="currentColor" /> Run
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl space-y-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 relative h-[500px] bg-brand-dark border border-white/20 rounded p-6 flex items-end justify-center gap-1 overflow-hidden shadow-inner">
                        <div className="absolute top-4 right-4 flex justify-between items-center z-20">
                            <div className="bg-brand-surface px-3 py-2 rounded border border-white/10 text-xs font-bold text-gray-400 font-mono">
                                len(arr) == {array.length}
                            </div>
                        </div>

                        {array.map((item, idx) => {
                            const isComparing = comparing.includes(idx);
                            const isSwapping = swapping.includes(idx);
                            const isSorted = sorted.includes(idx);

                            return (
                                <motion.div
                                    key={idx}
                                    layout
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    style={{ height: `${item.value}%`, originY: 1 }}
                                    className={`flex-1 rounded-t-sm transition-colors duration-200 relative group ${isSwapping ? 'bg-red-500 z-10' :
                                        isComparing ? 'bg-yellow-400 z-10' :
                                            isSorted ? 'bg-emerald-500' : 'bg-slate-600'
                                        }`}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                    <aside className="space-y-4">
                        <div className="p-4 rounded bg-brand-surface border border-white/10">
                            <div className="flex items-center gap-2 text-brand-accent mb-4 border-b border-white/5 pb-2">
                                <Activity size={16} />
                                <h3 className="font-bold text-xs font-mono">STATS_MONITOR</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <StatItem label="cmp_count" value={stats.comparisons} color="text-yellow-400" />
                                <StatItem label="swap_count" value={stats.swaps} color="text-red-500" />
                                <StatItem label="time_elapsed" value={`${stats.elapsedTime}s`} color="text-emerald-400" />
                                <StatItem label="ops_per_sec" value={stats.opsPerSec} color="text-blue-400" />
                            </div>
                        </div>

                        <div className="p-4 rounded bg-brand-surface border border-white/10">
                            <div className="flex items-center gap-2 text-brand-accent mb-4 border-b border-white/5 pb-2">
                                <Info size={16} />
                                <h3 className="font-bold text-xs font-mono">COMPLEXITY_INFO</h3>
                            </div>

                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">O(Time)</span>
                                    <span className="text-brand-accent">
                                        {algoData?.complexity}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">O(Space)</span>
                                    <span className="text-brand-accent">
                                        {algoData?.space || 'O(1)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded bg-brand-surface border border-white/10 space-y-3">
                            <h4 className="text-[10px] font-bold text-gray-500 px-2 font-mono">LEGEND</h4>
                            <div className="space-y-2">
                                <LegendItem color="bg-yellow-400" label="Comparing" />
                                <LegendItem color="bg-red-500" label="Swapping" />
                                <LegendItem color="bg-emerald-500" label="Sorted" />
                                <LegendItem color="bg-slate-600" label="Unsorted" />
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-start w-full">
                        <div className="flex gap-2 mb-4 w-full border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('explanation')}
                                className={`px-4 py-2 text-sm font-mono border-b-2 transition-colors ${activeTab === 'explanation' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-white'}`}
                            >
                                README.md
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`px-4 py-2 text-sm font-mono border-b-2 transition-colors ${activeTab === 'code' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-white'}`}
                            >
                                Source.js
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'explanation' ? (
                                <motion.div
                                    key="explanation"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 rounded bg-brand-surface border border-white/10 w-full"
                                >
                                    <h2 className="text-xl font-bold mb-4 font-mono"># {algoData?.title}</h2>
                                    <p className="text-gray-400 leading-relaxed text-sm font-mono mb-6">
                                        {algoData?.fullDescription}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded bg-brand-dark border border-white/10">
                                            <h4 className="text-brand-accent font-bold mb-2 text-xs font-mono">STRATEGY</h4>
                                            <p className="text-xs text-gray-500 font-mono">{algoData?.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full"
                                >
                                    <CodePreview codeData={algoData?.code} highlightLine={activeLine} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color }) {
    return (
        <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-gray-500">{label}:</span>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-3 px-2">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-gray-400 font-mono">{label}</span>
        </div>
    );
}
