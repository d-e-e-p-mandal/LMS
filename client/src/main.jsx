import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "sonner";
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/LoadingSpinner";

// ✅ Safe auth loader (NO white screen)
const Custom = ({ children }) => {
  const { isLoading, isError } = useLoadUserQuery();

  // show loader ONLY while request is running
  if (isLoading) return <LoadingSpinner />;

  // IMPORTANT: if not logged in (401), still render app
  if (isError) return children;

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      {/* ✅ Toaster must ALWAYS be mounted */}
      <Toaster position="top-right" richColors closeButton />

      <Custom>
        <App />
      </Custom>
    </Provider>
  </StrictMode>
);