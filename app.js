// Simple graph visualizer with step-by-step BFS/DFS
// Graph represented as adjacency list: array of arrays

const svg = document.getElementById('graph');
const structureEl = document.getElementById('structure');
const logEl = document.getElementById('log');
const adjacencyEl = document.getElementById('adjacency');
const startBtn = document.getElementById('startBtn');
const stepBtn = document.getElementById('stepBtn');
const pauseBtn = document.getElementById('pauseBtn');
const loadGraphBtn = document.getElementById('loadGraph');
const algorithmEl = document.getElementById('algorithm');
const startNodeEl = document.getElementById('startNode');
const speedEl = document.getElementById('speed');
const panelTitle = document.querySelector('.panel h3');
const traversalEl = document.getElementById('traversal'); // ✅ traversal container

// Track traversal order
let traversalOrder = [];

algorithmEl.addEventListener('change', () => {
  if (algorithmEl.value === 'bfs') panelTitle.textContent = 'Queue';
  else if (algorithmEl.value === 'dfs') panelTitle.textContent = 'Stack';
  traversalOrder = [];
  traversalEl.innerHTML = ''; // clear traversal
});
panelTitle.textContent = algorithmEl.value === 'bfs' ? 'Queue' : 'Stack';

let adjacency = [[1, 2], [0, 2, 3], [0, 1, 3], [1, 2]]; // default graph
adjacencyEl.value = JSON.stringify(adjacency);

let state = {
  nodes: [],
  edges: [],
  generator: null,
  running: false,
  timer: null,
};

function buildGraphFromAdj(adj) {
  const n = adj.length;
  const nodes = [];
  const edges = [];
  const W = svg.clientWidth || 700;
  const H = svg.clientHeight || 500;
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 70;
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    nodes.push({ id: i, x, y, status: 'idle' });
  }
  const seen = new Set();
  for (let u = 0; u < n; u++) {
    for (const v of adj[u]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ u, v });
      }
    }
  }
  return { nodes, edges };
}

function clearSVG() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function render() {
  clearSVG();
  for (const e of state.edges) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', state.nodes[e.u].x);
    line.setAttribute('y1', state.nodes[e.u].y);
    line.setAttribute('x2', state.nodes[e.v].x);
    line.setAttribute('y2', state.nodes[e.v].y);
    line.setAttribute('class', 'edge');
    line.setAttribute('data-u', e.u);
    line.setAttribute('data-v', e.v);
    svg.appendChild(line);
  }
  for (const n of state.nodes) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', 20);
    circle.setAttribute('class', `node ${n.status}`);
    circle.dataset.id = n.id;
    circle.addEventListener('click', () => {
      startNodeEl.value = n.id;
    });
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#082b2b');
    text.textContent = n.id;
    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
  }
}

function log(msg) {
  logEl.textContent = msg + '\n' + logEl.textContent;
}

// === BFS generator ===
function* bfs(adj, start) {
  const n = adj.length;
  const visited = Array(n).fill(false);
  const discovered = Array(n).fill(false);
  const q = [];
  q.push(start);
  discovered[start] = true;
  yield { type: 'init', queue: q.slice(), discovered: discovered.slice(), visited: visited.slice(), current: null };
  while (q.length > 0) {
    const u = q.shift();
    visited[u] = true;
    yield { type: 'visit', node: u, queue: q.slice(), discovered: discovered.slice(), visited: visited.slice(), current: u };
    for (const v of adj[u]) {
      if (!discovered[v]) {
        discovered[v] = true;
        q.push(v);
        yield { type: 'discover', node: v, from: u, queue: q.slice(), discovered: discovered.slice(), visited: visited.slice(), current: u };
      }
    }
  }
  yield { type: 'done', queue: [], discovered: discovered.slice(), visited: visited.slice(), current: null };
}

// === DFS generator ===
function* dfs(adj, start) {
  const n = adj.length;
  const visited = Array(n).fill(false);
  const discovered = Array(n).fill(false);
  const st = [];
  st.push(start);
  discovered[start] = true;
  yield { type: 'init', stack: st.slice(), discovered: discovered.slice(), visited: visited.slice(), current: null };
  while (st.length > 0) {
    const u = st.pop();
    if (visited[u]) continue;
    visited[u] = true;
    yield { type: 'visit', node: u, stack: st.slice(), discovered: discovered.slice(), visited: visited.slice(), current: u };
    const neighbors = adj[u].slice().reverse();
    for (const v of neighbors) {
      if (!discovered[v]) {
        discovered[v] = true;
        st.push(v);
        yield { type: 'discover', node: v, from: u, stack: st.slice(), discovered: discovered.slice(), visited: visited.slice(), current: u };
      }
    }
  }
  yield { type: 'done', stack: [], discovered: discovered.slice(), visited: visited.slice(), current: null };
}

function highlightEdge(u, v) {
  // highlight connecting edge
  const lines = svg.querySelectorAll('.edge');
  lines.forEach(line => {
    const lu = Number(line.getAttribute('data-u'));
    const lv = Number(line.getAttribute('data-v'));
    if ((lu === u && lv === v) || (lu === v && lv === u)) {
      line.classList.add('active-edge');
      setTimeout(() => line.classList.remove('active-edge'), 700);
    }
  });

  // highlight destination node
  const targetCircle = svg.querySelector(`.node[data-id="${v}"]`);
  if (targetCircle) {
    targetCircle.classList.add('node-highlight');
    setTimeout(() => targetCircle.classList.remove('node-highlight'), 700);
  }
}

function applyStateFromStep(step) {
  for (let i = 0; i < state.nodes.length; i++) state.nodes[i].status = 'idle';
  if (step.discovered)
    for (let i = 0; i < step.discovered.length; i++)
      if (step.discovered[i]) state.nodes[i].status = 'discovered';
  if (step.visited)
    for (let i = 0; i < step.visited.length; i++)
      if (step.visited[i]) state.nodes[i].status = 'visited';
  if (typeof step.current === 'number')
    state.nodes[step.current].status = 'current';
  render();

  // === highlight traversal edge ===
  if (step.type === 'discover' && step.from !== undefined && step.node !== undefined) {
    highlightEdge(step.from, step.node);
  }
  // === re-highlight edge when node is actually visited ===
  if (step.type === 'visit' && step.current !== null && step.current !== undefined) {
    // Find which edge led to this visited node
    const prev = traversalOrder[traversalOrder.length - 1]; // previously visited node
    if (prev !== undefined && prev !== step.current) {
      highlightEdge(prev, step.current);
    }
  }

  // === show Queue or Stack ===
  structureEl.innerHTML = '';
  const arr = step.queue ?? step.stack ?? [];
  arr.forEach((val) => {
    const d = document.createElement('div');
    d.className = 'item';
    d.textContent = val;
    structureEl.appendChild(d);
  });

  // === traversal update ===
  if (step.type === 'visit' && step.node !== undefined) {
    traversalOrder.push(step.node);
  }
  traversalEl.innerHTML = '';
  traversalOrder.forEach((node) => {
    const d = document.createElement('div');
    d.className = 'item';
    d.textContent = node;
    traversalEl.appendChild(d);
  });

  // === logging ===
  if (step.type === 'init') log(`Init: ${arr.join(', ')}`);
  else if (step.type === 'discover') log(`Discovered ${step.node} (from ${step.current}) -> ${arr.join(', ')}`);
  else if (step.type === 'visit') log(`Visited ${step.node} | ${arr.join(', ')}`);
  else if (step.type === 'done') log('Traversal done');
}

function startTraversalLoop() {
  if (state.timer) clearInterval(state.timer);
  
  const stepFunction = () => {
    if (!state.running) return;
    
    const res = state.generator.next();
    
    if (res.done) {
      state.running = false;
      clearInterval(state.timer);
      applyStateFromStep(res.value || { type: 'done', queue: [], stack: [], discovered: [], visited: [] });
      return;
    }
    
    applyStateFromStep(res.value);
  };
  
  const delay = getDelay();
  state.timer = setInterval(stepFunction, delay);
}

function getDelay() {
  const sliderVal = Number(speedEl.value);

  // Map 100–2000 → delay (slow → fast)
  // 100 (left)   → 2500ms (very slow)
  // 700 (middle) → 1000ms (readable)
  // 2000 (right) → 300ms (fast)

  let delay;
  if (sliderVal <= 700) {
    delay = 2500 - ((sliderVal - 100) / 600) * 1500; 
  } else {
    delay = 1000 - ((sliderVal - 700) / 1300) * 700;
  }

  delay = Math.max(300, delay);
  return delay;
}

function startTraversal() {
  try {
    adjacency = JSON.parse(adjacencyEl.value);
  } catch (e) {
    alert('Invalid adjacency JSON');
    return;
  }
  state.nodes = buildGraphFromAdj(adjacency).nodes;
  state.edges = buildGraphFromAdj(adjacency).edges;
  render();

  const alg = algorithmEl.value;
  const start = Number(startNodeEl.value) || 0;
  if (start < 0 || start >= adjacency.length) {
    alert('Start node out of range');
    return;
  }

  logEl.textContent = '';
  traversalOrder = [];
  traversalEl.innerHTML = '';

  state.running = true;
  if (alg === 'bfs') state.generator = bfs(adjacency, start);
  else state.generator = dfs(adjacency, start);

  const step = state.generator.next().value;
  applyStateFromStep(step);

  startTraversalLoop();
}

function stepOnce() {
  if (!state.generator) {
    alert('Start traversal first');
    return;
  }
  const res = state.generator.next();
  if (res.done) {
    state.running = false;
    clearInterval(state.timer);
    applyStateFromStep(res.value || { type: 'done', queue: [], stack: [], discovered: [], visited: [] });
    return;
  }
  applyStateFromStep(res.value);
}

startBtn.addEventListener('click', () => startTraversal());
stepBtn.addEventListener('click', () => stepOnce());
pauseBtn.addEventListener('click', () => {
  if (!state.generator) {
    alert('Start traversal first');
    return;
  }

  if (state.running) {
    state.running = false;
    clearInterval(state.timer);
    pauseBtn.textContent = 'Resume';
  } else {
    state.running = true;
    pauseBtn.textContent = 'Pause';
    startTraversalLoop();
  }
});

loadGraphBtn.addEventListener('click', () => {
  try { adjacency = JSON.parse(adjacencyEl.value); }
  catch (e) { alert('Invalid JSON'); return; }
  state.nodes = buildGraphFromAdj(adjacency).nodes;
  state.edges = buildGraphFromAdj(adjacency).edges;
  render();
});

speedEl.addEventListener('input', () => {
  if (state.running && state.timer) {
    startTraversalLoop();
  }
});
// === Add Node ===
const addNodeBtn = document.getElementById('addNodeBtn');
addNodeBtn.addEventListener('click', () => {
  try {
    const adj = JSON.parse(adjacencyEl.value);
    const n = adj.length;

    // Add new node (empty adjacency list)
    adj.push([]);

    // Keep JSON in one line
    adjacencyEl.value = JSON.stringify(adj);
    adjacency = adj;

    state.nodes = buildGraphFromAdj(adj).nodes;
    state.edges = buildGraphFromAdj(adj).edges;
    render();

    log(`Added node ${n}`);
  } catch (e) {
    alert('Invalid adjacency list');
  }
});

// === Add Edge ===
const addEdgeBtn = document.getElementById('addEdgeBtn');
addEdgeBtn.addEventListener('click', () => {
  const u = Number(document.getElementById('edgeU').value);
  const v = Number(document.getElementById('edgeV').value);

  try {
    const adj = JSON.parse(adjacencyEl.value);
    const n = adj.length;

    if (u < 0 || v < 0 || u >= n || v >= n) {
      alert('Node indices out of range');
      return;
    }
    if (u === v) {
      alert('Self-loops not allowed');
      return;
    }

    // Avoid duplicates
    if (!adj[u].includes(v)) adj[u].push(v);
    if (!adj[v].includes(u)) adj[v].push(u);

    // Keep JSON compact
    adjacencyEl.value = JSON.stringify(adj);
    adjacency = adj;

    state.nodes = buildGraphFromAdj(adj).nodes;
    state.edges = buildGraphFromAdj(adj).edges;
    render();

    log(`Added edge ${u}–${v}`);
  } catch (e) {
    alert('Invalid adjacency list');
  }
});

state.nodes = buildGraphFromAdj(adjacency).nodes;
state.edges = buildGraphFromAdj(adjacency).edges;
render();

window.addEventListener('resize', () => {
  state.nodes = buildGraphFromAdj(adjacency).nodes;
  state.edges = buildGraphFromAdj(adjacency).edges;
  render();
});
