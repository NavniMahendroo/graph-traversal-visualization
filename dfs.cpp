#include <bits/stdc++.h>
using namespace std;

void dfs(const vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<bool> discovered(n,false), visited(n,false);
    vector<int> st;
    st.push_back(start);
    discovered[start] = true;
    auto print_state = [&](const string& msg){
        cout << msg << "\n";
        cout << "Stack: ";
        for(auto it = st.rbegin(); it != st.rend(); ++it) cout << *it << " ";
        cout << "\nDiscovered: ";
        for(int i=0;i<n;i++) if(discovered[i]) cout << i << " ";
        cout << "\nVisited: ";
        for(int i=0;i<n;i++) if(visited[i]) cout << i << " ";
        cout << "\n---\n";
    };

    print_state("Init");
    while(!st.empty()){
        int u = st.back(); st.pop_back();
        if(visited[u]) continue;
        visited[u] = true;
        print_state(string("Visit ") + to_string(u));
        // push neighbors reverse order
        for(auto it = adj[u].rbegin(); it != adj[u].rend(); ++it){
            int v = *it;
            if(!discovered[v]){
                discovered[v] = true;
                st.push_back(v);
                print_state(string("Discover ") + to_string(v));
            }
        }
    }
    cout << "Done\n";
}

int main(){
    vector<vector<int>> adj = {
        {1,2},
        {0,2,3},
        {0,1,3},
        {1,2}
    };
    cout << "DFS example starting at 0" << endl;
    dfs(adj, 0);
    return 0;
}
