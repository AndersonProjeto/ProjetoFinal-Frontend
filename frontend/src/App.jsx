import { Routes, Route, Navigate } from "react-router-dom";

import { Dashboard } from "./Paginas/Dashboard/Dashboard";
import { Login } from "./Paginas/Login/Login";
import { Cadastro } from "./Paginas/Cadastro/Cadastro";
import { DashboardLayout } from "./assets/Layouts/DashboardLayout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Exercicios } from "./Paginas/Exercicio/Exercicio";
import { ExercicioDetalhado } from "./Paginas/Exercicio/ExercicoDetalhado";
import { Treinos } from "./Paginas/Treinos/Treinos";
import { TreinoAdicionar } from "./Paginas/Treinos/TreinoAdicionar";
import { TreinoDetalhe } from "./Paginas/Treinos/TreinoDetalhado";
import { TreinoEditar } from "./Paginas/Treinos/TreinoEditar";
import { Perfil } from "./Paginas/Perfil/Perfil";
import { ChatIA } from "./Paginas/ChatIA/ChatIA";
import { Evolucao } from "./Paginas/Evolucao/Evolucao";
import { EvolucaoAdicionar } from "./Paginas/Evolucao/EvolucaoAdicionar";
import { HistoricoIA } from "./Paginas/HistoricoIA/HistoricoIA";
import { RelatorioIA } from "./Paginas/Relatorio/RelatorioIA"; // NOVO

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />

      <Route
        path="/app"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="exercicios" element={<Exercicios />} />
        <Route path="exercicios/detalhes" element={<ExercicioDetalhado />} />

        <Route path="treinos" element={<Treinos />} />
        <Route path="treinos/novo" element={<TreinoAdicionar />} />
        <Route path="treinos/detalhes/:id" element={<TreinoDetalhe />} />
        <Route path="treinos/editar/:id" element={<TreinoEditar />} />

        <Route path="perfil" element={<Perfil />} />
        <Route path="ia" element={<ChatIA />} />
        <Route path="ia/historico/:usuarioId" element={<HistoricoIA />} />

        <Route path="evolucao" element={<Evolucao />} />
        <Route path="evolucao/adicionar" element={<EvolucaoAdicionar />} />

        <Route path="relatorio" element={<RelatorioIA />} /> {/* NOVO */}
      </Route>
    </Routes>
  );
}

export default App;