import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { algorithms } from '../data/algorithms';
import { ChevronRight } from 'lucide-react';

export default function Algorithms() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
            <header className="mb-12 text-center">
                <h2 className="text-4xl font-bold mb-4">Select an Algorithm</h2>
                <p className="text-gray-400">Choose a method to visualize its internal logic and performance.</p>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {algorithms.map((algo, index) => (
                    <motion.div
                        key={algo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/visualizer/${algo.id}`} className="group block p-1 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent hover:from-brand-accent/40 transition-all">
                            <div className="bg-brand-surface p-8 rounded-[1.9rem] h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-brand-accent border border-white/10">
                                            {algo.complexity}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{algo.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                        {algo.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm font-bold group-hover:text-brand-accent transition-colors">
                                    Explore Method <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}