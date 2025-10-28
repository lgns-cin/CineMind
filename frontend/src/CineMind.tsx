import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/**
 * O componente base renderizado na tela do site.
 *
 * Não deve conter nada além de {@link Route Routes} para componentes de páginas.
 */
export default function CineMind() {
  return (
    <Router>
      <Routes></Routes>
    </Router>
  );
}
