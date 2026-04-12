import { trpc } from "./trpc";

function App() {
  const healthQuery = trpc.health.useQuery();

  if (healthQuery.isLoading) return <div>Loading...</div>;
  if (healthQuery.isError) return <div>Error: {healthQuery.error.message}</div>;

  return (
    <div>
      <h1>Connection Successful!</h1>
      <pre>{JSON.stringify(healthQuery.data, null, 2)}</pre>
    </div>
  );
}

export default App;
