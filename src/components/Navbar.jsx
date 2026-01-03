import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md bg-brand-dark/50 border-b border-white/10">
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity">
        <Zap className="text-brand-accent fill-brand-accent" />
        <span>SORT<span className="text-brand-accent">LAB</span></span>
      </Link>
      <div className="flex gap-8 text-sm font-medium text-gray-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/algorithms" className="hover:text-white transition-colors">Algorithms</Link>
        <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
      </div>
    </nav>
  );
}