import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TicketScreen from "./components/TicketScreen";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
