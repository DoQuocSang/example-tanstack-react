import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoList from "./components/TodoList.component";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-4 items-center py-12 bg-gray-50 min-h-screen">
        <h1 className="text-3xl uppercase font-bold text-teal-500">
          Todo List
        </h1>
        <TodoList />
      </div>
      <ReactQueryDevtools initialIsOpen={true} client={queryClient} />
    </QueryClientProvider>
  );
}

export default App;
