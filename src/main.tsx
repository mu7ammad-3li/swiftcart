import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeServices } from "./lib/services";

// Initialize all services before rendering the app
try {
  console.log('Initializing services...');
  initializeServices();
  console.log('Services initialized successfully');
} catch (error) {
  console.error('Failed to initialize services:', error);
  // You might want to render an error page instead of crashing
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
          <p className="text-gray-600 mb-4">
            Sorry, we encountered an error while initializing the application. Please try refreshing the page.
          </p>
          <p className="text-sm text-gray-500">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
  throw error;
}

// Ensure the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

// Create root and render app
const root = createRoot(rootElement);
root.render(<App />);
