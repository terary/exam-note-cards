import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { store } from "./store";

// Determine environment (dev or prod)
const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
const envName = isDev ? 'DEV' : 'PROD';
const appTitle = `Exam Note Cards - ${envName}`;

// Update document title and meta description
function updateDocumentMeta() {
  document.title = appTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', `Exam Note Cards - ${envName} Environment`);
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
