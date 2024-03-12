import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


// Pages
import BlogListPage from "./components/page/BlogListPage";
import ContentPage from "./components/page/ContentPage";

function App(props) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<BlogListPage />} />
          <Route path="/content-page" element={<ContentPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
  }

export default App;