import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserList from "./components/UserList.component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoList from "./components/TodoList.component";
import Layout from "./components/Layout.component";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/todos" element={<TodoList />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={true} client={queryClient} />
    </QueryClientProvider>
  );
}

export default App;
