import AppRoutes from "./task2/components/AppRoutes";
import { UserContextProvider } from "./task2/UserContext";

function App() {
  return (
    <UserContextProvider>
      <AppRoutes />
    </UserContextProvider>
  );
}

export default App;   
