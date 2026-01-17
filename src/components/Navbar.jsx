import { Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center bg-brand-dark border-b border-brand-surface">
      <Link to="/" className="flex items-center gap-3 font-bold text-xl hover:text-brand-accent transition-colors font-mono">
        <Terminal size={24} className="text-brand-accent" />
        <span>SortLab.exe</span>
      </Link>
      <div className="flex gap-8 text-sm font-medium font-mono">
        <Link to="/" className="text-gray-400 hover:text-brand-accent transition-colors">[ Home ]</Link>
        <Link to="/algorithms" className="text-gray-400 hover:text-brand-accent transition-colors">[ Algorithms ]</Link>
        <Link to="/compare" className="text-gray-400 hover:text-brand-accent transition-colors">[ Compare ]</Link>
      </div>
    </nav>
  );
}