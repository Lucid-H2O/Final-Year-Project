
import AppLayout from "./components/appLayout";

import { UserContextProvider } from "./context/userContext";

const App = () => {


  return (
  <UserContextProvider>
    <div className="h-screen">
      <AppLayout />
    </div>
  </UserContextProvider>
  

    

    
  );
};

export default App;
