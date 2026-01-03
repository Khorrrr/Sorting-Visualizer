import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, RotateCcw, ChevronLeft,
    Settings2, Activity, Info, Code2, BookOpen,
    Volume2, VolumeX, Pause, SkipForward, SkipBack
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
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-brand-dark overflow-x-hidden text-white flex flex-col items-center">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-10 gap-6 text-center md:text-left">
                <div>
                    <button
                        onClick={() => navigate('/algorithms')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Algorithms
                    </button>
                    <h1 className="text-4xl font-black flex items-center gap-3">
                        {algoData?.title}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-brand-surface/40 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
                    <div className="flex flex-col gap-1 px-4 border-r border-white/10">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Delay (ms)</span>
                        <input
                            type="range" min="10" max="400" step="10"
                            value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-32 accent-brand-accent cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-2 border-r border-white/10 pr-4">
                        <button
                            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                            className={`p-3 rounded-2xl transition-all border border-white/5 ${isSoundEnabled ? 'bg-brand-accent/20 text-brand-accent' : 'bg-white/5 text-gray-500'}`}
                            title={isSoundEnabled ? 'Mute' : 'Unmute'}
                        >
                            {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={resetArray}
                            disabled={isSorting && !isPaused}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-all border border-white/5"
                            title="New Array"
                        >
                            <RotateCcw size={20} />
                        </button>

                        {isSorting && (
                            <>
                                <button
                                    onClick={togglePause}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
                                    title={isPaused ? 'Resume' : 'Pause'}
                                >
                                    {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                                </button>
                                <button
                                    onClick={stepForward}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 disabled:opacity-30"
                                    title="Step Forward"
                                    disabled={!isPaused}
                                >
                                    <SkipForward size={20} />
                                </button>
                                <button
                                    onClick={stepBackward}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 disabled:opacity-30"
                                    title="Step Backward"
                                    disabled={!isPaused || history.length <= 1}
                                >
                                    <SkipBack size={20} />
                                </button>
                            </>
                        )}

                        {!isSorting && (
                            <button
                                onClick={runVisualizer}
                                className="px-6 py-3 rounded-2xl bg-brand-accent hover:bg-blue-600 text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                            >
                                <Play size={18} fill="currentColor" /> Run Algorithm
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl space-y-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 relative h-[500px] bg-brand-surface/20 rounded-[3rem] p-10 border border-white/5 flex items-end justify-center gap-1 md:gap-2 overflow-hidden shadow-2xl">
                        <div className="absolute top-8 right-8 flex justify-between items-center z-20">
                            <div className="bg-brand-dark/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-xs font-bold text-gray-400">
                                {array.length} Elements
                            </div>
                        </div>

                        <div className="absolute inset-0 grid grid-rows-6 pointer-events-none opacity-[0.03]">
                            {[...Array(6)].map((_, i) => <div key={i} className="border-t border-white" />)}
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
                                    className={`flex-1 rounded-t-xl transition-colors duration-200 relative group ${isSwapping ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10' :
                                        isComparing ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10' :
                                            isSorted ? 'bg-emerald-400' : 'bg-slate-400 hover:bg-slate-300'
                                        }`}
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                    <aside className="space-y-6">
                        <div className="p-8 rounded-[2.5rem] bg-brand-surface/60 border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-2 text-brand-accent mb-6">
                                <Activity size={18} />
                                <h3 className="font-bold uppercase tracking-wider text-xs">Live Analytics</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <StatItem label="Comparisons" value={stats.comparisons} color="text-yellow-400" />
                                <StatItem label="Swaps" value={stats.swaps} color="text-red-500" />
                                <StatItem label="Time" value={`${stats.elapsedTime}s`} color="text-emerald-400" />
                                <StatItem label="Ops / Sec" value={stats.opsPerSec} color="text-blue-400" />
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-brand-surface/60 border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-2 text-brand-accent mb-4">
                                <Info size={18} />
                                <h3 className="font-bold uppercase tracking-wider text-xs">Complexity</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs uppercase font-semibold">Time</span>
                                    <span className="px-3 py-1 rounded-lg bg-white/5 font-mono text-brand-accent text-sm">
                                        {algoData?.complexity}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-xs uppercase font-semibold">Space</span>
                                    <span className="px-3 py-1 rounded-lg bg-white/5 font-mono text-brand-accent text-sm">
                                        {algoData?.space || 'O(1)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest px-2">Legend</h4>
                            <div className="space-y-3">
                                <LegendItem color="bg-yellow-400" label="Comparison" />
                                <LegendItem color="bg-red-500" label="Swap / Movement" />
                                <LegendItem color="bg-emerald-400" label="Sorted Position" />
                                <LegendItem color="bg-slate-400" label="Unsorted" />
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-start w-full">
                        <div className="flex flex-wrap justify-center gap-4 p-2 bg-brand-surface/40 w-fit rounded-2xl mb-6 border border-white/5">
                            <button
                                onClick={() => setActiveTab('explanation')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'explanation' ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <BookOpen size={18} /> How it Works
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'code' ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Code2 size={18} /> Implementation
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'explanation' ? (
                                <motion.div
                                    key="explanation"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-10 rounded-[3rem] bg-brand-surface/40 border border-white/5 backdrop-blur-xl"
                                >
                                    <h2 className="text-2xl font-black mb-6">Algorithm Explanation</h2>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        {algoData?.fullDescription}
                                    </p>

                                    <div className="mt-8 grid md:grid-cols-2 gap-4">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                            <h4 className="text-brand-accent font-bold mb-2">Algorithm Approach</h4>
                                            <p className="text-sm text-gray-500">{algoData?.description}</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                            <h4 className="text-emerald-400 font-bold mb-2">Efficiency</h4>
                                            <p className="text-sm text-gray-500">The {algoData?.title} algorithm operates with a {algoData?.complexity} time complexity, making it {algoData?.id === 'quick-sort' ? 'very suitable for large datasets' : 'mostly educational for small datasets'}.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <CodePreview codeData={algoData?.code} highlightLine={activeLine} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-[2rem] bg-brand-surface/60 border border-white/10 backdrop-blur-md">
                            <h4 className="text-gray-400 font-bold text-sm mb-3">Data Structure View</h4>
                            <p className="text-[10px] text-gray-500 mb-4 font-medium uppercase tracking-widest">Active Memory Array</p>
                            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                                <AnimatePresence mode="popLayout">
                                    {array.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity: 1,
                                                scale: comparing.includes(i) || swapping.includes(i) ? 1.1 : 1,
                                                backgroundColor: swapping.includes(i) ? 'rgba(239,68,68,0.2)' :
                                                    comparing.includes(i) ? 'rgba(250,204,21,0.2)' :
                                                        sorted.includes(i) ? 'rgba(52,211,153,0.1)' : '#cbd5e1',
                                                borderColor: swapping.includes(i) ? 'rgba(239,68,68,0.4)' :
                                                    comparing.includes(i) ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.1)',
                                                color: swapping.includes(i) ? '#ef4444' :
                                                    comparing.includes(i) ? '#facc15' :
                                                        sorted.includes(i) ? '#34d399' : '#1e293b'
                                            }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl border backdrop-blur-sm"
                                        >
                                            {item.value}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-500">{label}</span>
            <span className={`text-xl font-black font-mono ${color}`}>{value}</span>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-3 px-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-sm text-gray-400 font-medium">{label}</span>
        </div>
    );
}
