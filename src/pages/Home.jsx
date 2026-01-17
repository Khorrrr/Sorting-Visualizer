import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Cpu, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 w-full flex flex-col items-center justify-center font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-center"
      >
        <div className="mb-6 inline-block px-4 py-2 border border-brand-accent/50 rounded bg-brand-surface text-brand-accent text-sm">
          $ init sorting-visualizer
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
          Master Algorithms <br /> Through <span className="text-brand-accent">&lt;Code /&gt;</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          // Visualizing the hidden logic behind sorting algorithms.
          <br />
          // See how data moves, compares, and settles into place.
        </p>

        <Link to="/algorithms">
          <button className="bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent text-brand-accent px-8 py-4 rounded font-bold flex items-center gap-2 mx-auto transition-all hover:translate-y-[-2px]">
            <Terminal size={20} />
            ./start_visualizing.sh
          </button>
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 w-full">
        <FeatureCard
          icon={<Code2 className="text-brand-accent" />}
          title="Visual Clarity"
          desc="> Watch every swap and comparison with high-fidelity animations."
        />
        <FeatureCard
          icon={<Cpu className="text-brand-accent" />}
          title="Deep Logic"
          desc="> Detailed breakdowns of Big O complexity and memory usage."
        />
        <FeatureCard
          icon={<Terminal className="text-brand-accent" />}
          title="Step-by-Step"
          desc="> Pause, rewind, and control the speed of every algorithm."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded bg-brand-surface border border-white/5 hover:border-brand-accent transition-colors font-mono">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}