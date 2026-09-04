import { BrowserRouter, useLocation } from "react-router-dom";
import Rotas from "./components/Rotas/Routes";
import Rodape from "./components/Rodape/Rodape";
import { Navbar } from "./components/Navbar";
import { AuthProvider, useAuth } from "./Middleware/AuthMiddleware";

function AppContent() {
  const { autenticado } = useAuth();
  const location = useLocation();

  // Esconde Navbar e Rodape apenas na rota de Boas-Vindas ("/") se nao estiver autenticado
  const ehTelaBoasVindas = location.pathname === "/" && !autenticado;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!ehTelaBoasVindas && <Navbar />}
      <main style={{ flex: 1 }}>
        <Rotas />
      </main>
      {!ehTelaBoasVindas && <Rodape />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;