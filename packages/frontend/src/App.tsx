import { useAuthStore } from "./store/useAuthStore";
import { ApiKeyForm } from "./components/ApiKeyForm";
import { Header } from "./components/Header";
import { UserProfile } from "./components/UserProfile";
import { WorkoutHistory } from "./components/WorkoutHistory";

function App() {
  const { apiKey } = useAuthStore();

  if (!apiKey) {
    return <ApiKeyForm />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <Header />

      <section className="mb-12">
        <UserProfile />
      </section>

      <section>
        <WorkoutHistory />
      </section>
    </div>
  );
}

export default App;
