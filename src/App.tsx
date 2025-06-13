import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserList from "./components/user/UserList.component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoList from "./components/todo/TodoList.component";
import Layout from "./components/layout/Layout.component";
import ProductTable from "./components/product/ProductTable.component";

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
            <Route path="/products" element={<ProductTable />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={true} client={queryClient} />
    </QueryClientProvider>
  );
}

export default App;
