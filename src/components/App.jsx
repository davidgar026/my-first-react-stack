import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Content from "./Content";

function App() {

  return (
      <div className="grid grid-rows-[80px_1fr_60px] min-h-screen bg-[#183B4E]">
          <Header />
          <Content />
          <Footer />
      </div>
  );
}

export default App;
