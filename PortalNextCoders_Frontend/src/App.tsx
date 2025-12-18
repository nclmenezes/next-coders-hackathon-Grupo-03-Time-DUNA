import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppProvider/AppProvider";
import { Router } from "./routes";

function App() {
  return (
    <AppProvider>
      <Toaster position="bottom-left" />
      <Router />
    </AppProvider>
  );
}

export default App;
