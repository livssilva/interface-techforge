import { BrowserRouter } from "react-router-dom";
import Rotas from "./components/Rotas/Routes";
import Rodape from "./components/Rodape/Rodape";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Rotas />
        </main>
        <Rodape />
      </div>
    </BrowserRouter>
  );
}

export default App;