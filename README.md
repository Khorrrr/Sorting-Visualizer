#  Sorting Algorithm Visualizer

A high-fidelity, interactive web application built with **React 19** and **Vite** to visualize the inner workings of common sorting algorithms. Master data structures through motion, sound, and real-time analytics.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

##  Features

- ** Real-time Visualization**: Watch bars dance as they find their place, with smooth animations powered by Framer Motion.
- ** Educational Insights**:
    - **Live Code Preview**: Synchronized line-by-line highlighting showing the exact step being executed.
    - **Complexity Analysis**: Stay informed with Big O Time and Space complexity for every algorithm.
    - **Step-by-Step Control**: Pause, Rewind, and Step Forward to inspect the logic at your own pace.
- ** Audio Feedback**: Aesthetic sound effects mapped to array values, providing an auditory layer to the sorting process.
- ** Live Analytics**: Track comparisons, swaps, elapsed time, and operations per second in real-time.
- ** Algorithm Comparison**: Pit two algorithms against each other in a side-by-side race to see which one performs better.
- ** Modern UI/UX**: Sleek dark mode design with glassmorphism, responsive across all devices.

---

##  Supported Algorithms

| Algorithm | Complexity | Space | Best Use Case |
| :--- | :---: | :---: | :--- |
| **Quick Sort** | O(n log n) | O(log n) | General Purpose, Large Datasets |
| **Merge Sort** | O(n log n) | O(n) | Stable Sorting, Linked Lists |
| **Heap Sort** | O(n log n) | O(1) | Memory Constrained Systems |
| **Bubble Sort** | O(n²) | O(1) | Educational, Small Datasets |
| **Selection Sort** | O(n²) | O(1) | Small Datasets, Minimizing Swaps |
| **Insertion Sort** | O(n²) | O(1) | Nearly Sorted Data |

---

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khorrrr/Sorting-Visualizer.git
   cd Sorting-Visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

##  Project Structure

```text
src/
├── algorithms/     # Sorting logic (Generators for visualization)
├── components/     # Reusable UI components (Navbar, CodePreview)
├── data/           # Algorithm documentation and complexity data
├── pages/          # Main views (Home, Visualizer, Comparison)
├── utils/          # Audio engine and helper functions
└── index.css       # Global styles and Tailwind configuration
```

---

##  Tech Stack

- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)

---

## Technical Implementation

Unlike traditional visualizers that use `setTimeout` chains, this project leverages **JavaScript Generator Functions (`function*`)**. 

- **State Management**: The algorithms `yield` state objects (comparisons, swaps, sorted indices) instead of just sorting.
- **Interruptible Logic**: This allows the UI to pause, step forward, or rewind through the sort history effortlessly.
- **Performance**: Decoupling the calculation from the rendering ensures smooth 60FPS animations even with larger arrays.

---

## Improvement
-  Create visualizer for Linked List, Trees and other Data Structure objects.
-  The sorted Array will be inputed by the user rather than be auto-generated


