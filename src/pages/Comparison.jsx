import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, ChevronLeft, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { bubbleSort } from '../algorithms/bubbleSort';
import { insertionSort } from '../algorithms/insertionSort';
import { selectionSort } from '../algorithms/selectionSort';
import { quickSort } from '../algorithms/quickSort';
import { mergeSort } from '../algorithms/mergeSort';
import { heapSort } from '../algorithms/heapSort';
import { algorithms } from '../data/algorithms';

const algoMap = {
    'bubble-sort': bubbleSort,
    'insertion-sort': insertionSort,
    'selection-sort': selectionSort,
    'quick-sort': quickSort,
    'merge-sort': mergeSort,
    'heap-sort': heapSort
};

export default function Comparison() {
    const navigate = useNavigate();

    const [algo1, setAlgo1] = useState('bubble-sort');
    const [algo2, setAlgo2] = useState('quick-sort');
    const [array1, setArray1] = useState([]);
    const [array2, setArray2] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [arraySize, setArraySize] = useState(30);

    const [v1, setV1] = useState({ comparing: [], swapping: [], sorted: [], stats: { comparisons: 0, swaps: 0 } });
    const [v2, setV2] = useState({ comparing: [], swapping: [], sorted: [], stats: { comparisons: 0, swaps: 0 } });

    const isSortingRef = useRef(false);
    useEffect(() => {
        isSortingRef.current = isSorting;
    }, [isSorting]);

    const resetArrays = useCallback(() => {
        if (isSortingRef.current) return;
        const newArray = Array.from({ length: arraySize }, () => ({
            id: Math.random().toString(36).substr(2, 9),
            value: Math.floor(Math.random() * 85) + 5
        }));
        setArray1([...newArray]);
        setArray2([...newArray]);
        setV1({ comparing: [], swapping: [], sorted: [], stats: { comparisons: 0, swaps: 0 } });
        setV2({ comparing: [], swapping: [], sorted: [], stats: { comparisons: 0, swaps: 0 } });
    }, [arraySize]);

    useEffect(() => {
        resetArrays();
    }, [resetArrays, arraySize]);

    const runComparison = async () => {
        if (isSorting) return;

        if (v1.sorted.length === array1.length && array1.length > 0) {
            resetArrays();
        }

        setIsSorting(true);

        const gen1 = algoMap[algo1]([...array1]);
        const gen2 = algoMap[algo2]([...array2]);

        let done1 = false;
        let done2 = false;

        let stats1 = { comparisons: 0, swaps: 0 };
        let stats2 = { comparisons: 0, swaps: 0 };

        while (!done1 || !done2) {
            if (!done1) {
                const step = await gen1.next();
                if (!step.done) {
                    const data = step.value;
                    setArray1(data.array);
                    if (data.type === 'compare') stats1.comparisons++;
                    if (data.type === 'swap') stats1.swaps++;
                    setV1(prev => ({
                        ...prev,
                        comparing: data.type === 'compare' ? data.indices : [],
                        swapping: data.type === 'swap' ? data.indices : [],
                        sorted: data.type === 'sorted' ? [...new Set([...prev.sorted, ...data.indices])] : prev.sorted,
                        stats: { ...stats1 }
                    }));
                } else {
                    done1 = true;
                    setV1(prev => ({ ...prev, comparing: [], swapping: [] }));
                }
            }

            if (!done2) {
                const step = await gen2.next();
                if (!step.done) {
                    const data = step.value;
                    setArray2(data.array);
                    if (data.type === 'compare') stats2.comparisons++;
                    if (data.type === 'swap') stats2.swaps++;
                    setV2(prev => ({
                        ...prev,
                        comparing: data.type === 'compare' ? data.indices : [],
                        swapping: data.type === 'swap' ? data.indices : [],
                        sorted: data.type === 'sorted' ? [...new Set([...prev.sorted, ...data.indices])] : prev.sorted,
                        stats: { ...stats2 }
                    }));
                } else {
                    done2 = true;
                    setV2(prev => ({ ...prev, comparing: [], swapping: [] }));
                }
            }

            await new Promise(r => setTimeout(r, speed));
        }

        setIsSorting(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-12 bg-brand-dark overflow-x-hidden text-white flex flex-col items-center font-mono">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <button onClick={() => navigate('/algorithms')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm">
                        <ChevronLeft size={16} /> ../algorithms
                    </button>
                    <h1 className="text-3xl font-bold flex gap-3 items-center">
                        <Terminal size={24} className="text-brand-accent" />
                        diff -y algorithm1 algorithm2
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-brand-surface p-2 rounded border border-white/10">
                    <button onClick={resetArrays} disabled={isSorting} className="p-2 rounded hover:bg-white/10 text-white disabled:opacity-30 border border-transparent">
                        <RotateCcw size={18} />
                    </button>
                    <button onClick={runComparison} disabled={isSorting} className="px-4 py-2 rounded bg-brand-accent/20 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white font-bold flex items-center gap-2 text-sm transition-all">
                        <Play size={16} fill="currentColor" /> Run Comparison
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-7xl">
                <VisualizerPane
                    id="1"
                    algo={algo1}
                    setAlgo={setAlgo1}
                    array={array1}
                    vState={v1}
                    isSorting={isSorting}
                />
                <VisualizerPane
                    id="2"
                    algo={algo2}
                    setAlgo={setAlgo2}
                    array={array2}
                    vState={v2}
                    isSorting={isSorting}
                />
            </div>
        </div>
    );
}

function VisualizerPane({ id, algo, setAlgo, array, vState, isSorting }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-brand-surface p-4 rounded border border-white/10">
                <div className="flex flex-col">
                    <label className="text-[10px] uppercase text-gray-500 font-bold mb-1">Algorithm {id}</label>
                    <select
                        value={algo}
                        onChange={(e) => setAlgo(e.target.value)}
                        disabled={isSorting}
                        className="bg-brand-dark text-white font-mono text-sm outline-none cursor-pointer rounded border border-white/20 px-4 py-2 hover:border-brand-accent transition-colors"
                    >
                        {algorithms.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500">CMP</span>
                        <span className="text-yellow-400 font-bold">{vState.stats.comparisons}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500">SWP</span>
                        <span className="text-red-500 font-bold">{vState.stats.swaps}</span>
                    </div>
                </div>
            </div>

            <div className="relative h-[400px] bg-brand-dark rounded p-6 border border-white/10 flex items-end justify-center gap-1 overflow-hidden shadow-inner">
                {array.map((item, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        style={{ height: `${item.value}%`, originY: 1 }}
                        className={`flex-1 rounded-t-sm transition-colors duration-100 ${vState.swapping.includes(idx) ? 'bg-red-500' :
                            vState.comparing.includes(idx) ? 'bg-yellow-400' :
                                vState.sorted.includes(idx) ? 'bg-emerald-500' : 'bg-slate-600'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
