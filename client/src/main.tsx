import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { store } from "./store";

// Read APPLICATION_TITLE from environment variable (must be prefixed with VITE_)
// Fall back to "production" if not set
const appTitle = import.meta.env.VITE_APPLICATION_TITLE || 'production';

// Update document title and meta description
function updateDocumentMeta() {
  document.title = appTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', appTitle);
  }
}

// Update on mount
updateDocumentMeta();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
