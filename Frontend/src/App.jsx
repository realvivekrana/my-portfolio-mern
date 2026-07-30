import CursorGlow from "./components/common/CursorGlow";
import ScrollProgress from "./components/common/ScrollProgress";
import Loader from "./components/common/loader/Loader";
import ErrorBoundary from "./ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <Loader>
        <ScrollProgress />
        <CursorGlow />
        <AppRoutes />
      </Loader>
    </ErrorBoundary>
  );
}

export default App;