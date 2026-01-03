import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import Visualizer from './pages/Visualizer';
import Comparison from './pages/Comparison';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/visualizer/:id" element={<Visualizer />} />
        <Route path="/compare" element={<Comparison />} />
      </Routes>
    </Router>
  );
}

export default App;