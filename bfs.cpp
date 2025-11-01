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

    for (int i = 0; i < n; i++) {
        int s = (i + start) % n;
        if (!discovered[s]) {
            cout << "\n=== Starting new component (BFS) from " << s << " ===\n";
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

    cout << "\nBFS traversal complete.\n";
}

// DFS for directed graph
void dfs_util(const vector<vector<int>>& adj, int u, vector<bool>& visited) {
    visited[u] = true;
    cout << u << " ";
    for (int v : adj[u]) {
        if (!visited[v])
            dfs_util(adj, v, visited);
    }
}

void dfs(const vector<vector<int>>& adj, int start = 0) {
    int n = adj.size();
    vector<bool> visited(n, false);

    cout << "\n=== DFS traversal (Directed Graph) ===\n";
    for (int i = 0; i < n; i++) {
        int s = (i + start) % n;
        if (!visited[s]) {
            cout << "Starting new DFS from node " << s << ": ";
            dfs_util(adj, s, visited);
            cout << "\n";
        }
    }
    cout << "DFS traversal complete.\n";
}

int main() {
    vector<vector<int>> adj; 
}
