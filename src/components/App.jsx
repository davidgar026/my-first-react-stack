import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Content from "./Content";

function App() {

  return (
      <div className="grid grid-rows-[80px_1fr_60px] sm:min-h-screen bg-[#F2EFE7]">
          <Header />
          <Content />
          <Footer />
      </div>
  );
}

export default App;
