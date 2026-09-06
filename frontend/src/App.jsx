import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";
import KYC from "./pages/KYC";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/kyc"
          element={<KYC />}
        />
<Route
  path="/dashboard"
  element={<Dashboard />}
/>
<Route
  path="/transfer"
  element={<Transfer />}
/>
<Route
  path="/transactions"
  element={<Transactions />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;