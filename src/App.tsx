import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/Layout.component";

// Create a client
const queryClient = new QueryClient();

// Lazy load components
const UserList = lazy(() => import("./components/user/UserList.component"));
const TodoList = lazy(() => import("./components/todo/TodoList.component"));
const ProductTable = lazy(
  () => import("./components/product/ProductTable.component")
);

// Fallback component for Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="flex flex-col gap-4 w-full max-w-md p-4">
      <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<UserList />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/todos" element={<TodoList />} />
              <Route path="/products" element={<ProductTable />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={true} client={queryClient} />
    </QueryClientProvider>
  );
}

export default App;
