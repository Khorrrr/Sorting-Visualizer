import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';

export default function CodePreview({ codeData, highlightLine }) {
    const [lang, setLang] = useState('javascript');
    const [copied, setCopied] = useState(false);

    if (!codeData) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeData[lang]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const languages = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'cpp', label: 'C++' },
        { id: 'java', label: 'Java' },
        { id: 'c', label: 'C' }
    ];

    return (
        <div className="rounded-[2rem] bg-brand-surface/40 border border-white/5 overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                <div className="flex flex-wrap gap-2">
                    {languages.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setLang(l.id)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${lang === l.id
                                ? 'bg-brand-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
                    title="Copy code"
                >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
            </div>

            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence mode="wait">
                    <motion.pre
                        key={lang}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-300"
                    >
                        <code>
                            {codeData[lang]?.split('\n').map((line, i) => (
                                <div
                                    key={i}
                                    className={`px-4 -mx-4 transition-colors duration-200 ${highlightLine === i + 1 ? 'bg-brand-accent/20 border-l-4 border-brand-accent' : ''
                                        }`}
                                >
                                    <span className="inline-block w-8 text-gray-600 select-none">{i + 1}</span>
                                    {line}
                                </div>
                            ))}
                        </code>
                    </motion.pre>
                </AnimatePresence>
            </div>

            <div className="px-6 py-2 bg-brand-accent/5 flex items-center gap-2">
                <Terminal size={12} className="text-brand-accent" />
                <span className="text-[10px] text-brand-accent/60 uppercase font-black tracking-widest">
                    Ready to implement
                </span>
            </div>
        </div>
    );
}
