import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


// Pages
import BlogListPage from "./components/page/BlogListPage";
import ContentPage from "./components/page/ContentPage";
import TagFilteredPage from "./components/page/TagFilteredPage";

function App(props) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<BlogListPage />} />
          <Route path="/posts/:postId" element={<ContentPage />} /> {/* 동적 경로 변경 */}
          <Route path="/tags/:tagName" element={<TagFilteredPage />} />
          <Route path="/categories/:category" element={<TagFilteredPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
  }

export default App;