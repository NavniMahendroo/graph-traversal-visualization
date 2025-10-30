#include <bits/stdc++.h>
using namespace std;

void bfs(const vector<vector<int>>& adj, int start = 0) {
    int n = adj.size();
    vector<bool> discovered(n, false), visited(n, false);
    queue<int> q;

    auto print_state = [&](const string& msg) {
        cout << msg << "\n";
        cout << "Queue: ";
        queue<int> tmp = q;
        while (!tmp.empty()) { cout << tmp.front() << " "; tmp.pop(); }
        cout << "\nDiscovered: ";
        for (int i = 0; i < n; i++) if (discovered[i]) cout << i << " ";
        cout << "\nVisited: ";
        for (int i = 0; i < n; i++) if (visited[i]) cout << i << " ";
        cout << "\n---\n";
    };

    // Run BFS on each component
    for (int i = 0; i < n; i++) {
        int s = (i + start) % n;  // ensures we start from 'start' first if valid
        if (!discovered[s]) {
            cout << "\n=== Starting new component from " << s << " ===\n";
            q.push(s);
            discovered[s] = true;
            print_state("Init");

            while (!q.empty()) {
                int u = q.front(); q.pop();
                visited[u] = true;
                print_state("Visit " + to_string(u));

                for (int v : adj[u]) {
                    if (!discovered[v]) {
                        discovered[v] = true;
                        q.push(v);
                        print_state("Discover " + to_string(v));
                    }
                }
            }
        }
    }

    cout << "\nTraversal complete for all components.\n";
}

int main() {
    // Example disconnected graph
    vector<vector<int>> adj = {
        {1},      // 0
        {0},      // 1
        {3},      // 2
        {2},      // 3
        {5},      // 4
        {4}       // 5
    };

    cout << "BFS traversal (works for disconnected graphs):\n";
    bfs(adj, 0);
}
