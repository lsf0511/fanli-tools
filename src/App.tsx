import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { ADMIN_PATH_SUFFIX } from "./constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`/admin-${ADMIN_PATH_SUFFIX}`} element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
