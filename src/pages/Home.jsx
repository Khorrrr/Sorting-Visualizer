import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 w-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Master Algorithms <br /> Through Motion.
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          Visualizing the hidden logic behind sorting algorithms.
          See how data moves, compares, and settles into place in real-time.
        </p>

        <Link to="/algorithms">
          <button className="bg-brand-accent hover:bg-blue-600 px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95 text-white">
            Start Visualizing <ArrowRight size={20} />
          </button>
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32">
        <FeatureCard
          icon={<BarChart3 className="text-brand-accent" />}
          title="Visual Clarity"
          desc="Watch every swap and comparison with high-fidelity animations."
        />
        <FeatureCard
          icon={<Cpu className="text-brand-accent" />}
          title="Deep Logic"
          desc="Detailed breakdowns of Big O complexity and memory usage."
        />
        <FeatureCard
          icon={<Layers className="text-brand-accent" />}
          title="Step-by-Step"
          desc="Pause, rewind, and control the speed of every algorithm."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-brand-surface/50 border border-white/5 hover:border-brand-accent/30 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}