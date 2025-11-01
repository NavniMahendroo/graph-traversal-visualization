#include <bits/stdc++.h>
using namespace std;

void dfs(const vector<vector<int>>& adj, int start = 0) {
    int n = adj.size();
    vector<bool> discovered(n, false), visited(n, false);
    vector<int> st;

    auto print_state = [&](const string& msg) {
        cout << msg << "\n";
        cout << "Stack: ";
        for (auto it = st.rbegin(); it != st.rend(); ++it) cout << *it << " ";
        cout << "\nDiscovered: ";
        for (int i = 0; i < n; i++) if (discovered[i]) cout << i << " ";
        cout << "\nVisited: ";
        for (int i = 0; i < n; i++) if (visited[i]) cout << i << " ";
        cout << "\n---\n";
    };

    // Run DFS on each component
    for (int i = 0; i < n; i++) {
        int s = (i + start) % n;  // ensures we start from 'start' first if valid
        if (!discovered[s]) {
            cout << "\n=== Starting new component from " << s << " ===\n";
            st.push_back(s);
            discovered[s] = true;
            print_state("Init");

            while (!st.empty()) {
                int u = st.back(); 
                st.pop_back();
                if (visited[u]) continue;
                visited[u] = true;
                print_state("Visit " + to_string(u));

                // For directed graph: explore edges only in one direction
                for (auto it = adj[u].rbegin(); it != adj[u].rend(); ++it) {
                    int v = *it;
                    if (!discovered[v]) {
                        discovered[v] = true;
                        st.push_back(v);
                        print_state("Discover " + to_string(v));
                    }
                }
            }
        }
    }

    cout << "\nTraversal complete for all components.\n";
}

int main() {
    // ⚠️ Add your own directed graph here
    // Example usage (you can uncomment later):
    //
    // int n = number_of_nodes;
    // vector<vector<int>> adj(n);
    // adj[u].push_back(v); // directed edge u → v
    //
    // dfs(adj, start_node);

    vector<vector<int>> adj; // ← define your graph here before calling dfs()

    // dfs(adj, 0); // uncomment and call after defining your graph
}
