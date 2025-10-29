# BFS / DFS Traversal Visualizer

This project contains a web-based BFS/DFS traversal visualizer and example C++ implementations for BFS and DFS that print step-by-step traversal and show queue/stack states.

Files added:
- `index.html` — web UI
- `style.css` — styles for the visualizer
- `app.js` — traversal logic and animation
- `bfs.cpp` — BFS example (C++)
- `dfs.cpp` — DFS example (C++)

How to run the web visualizer locally

1. Open a terminal and change to the project directory:

```bash
cd "c:\Users\Rashi\Desktop\ASSIGNMENT"
```

2. Start a simple static server. If you have Python installed:

```bash
# Python 3
python -m http.server 8000
```

3. Open your browser and navigate to `http://localhost:8000`.

How to compile and run the C++ examples

Using g++:

```bash
# Compile BFS
g++ -std=c++17 -O2 -o bfs bfs.cpp
./bfs

# Compile DFS
g++ -std=c++17 -O2 -o dfs dfs.cpp
./dfs
```

Notes

- The web visualizer is self-contained and works with a small default graph. You can edit the adjacency list in `app.js` or use the UI to add nodes/edges.
- The C++ examples print traversal steps to the console showing discovered/visited nodes and the queue/stack content after each step.
