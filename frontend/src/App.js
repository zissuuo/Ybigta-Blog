import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import { createGlobalStyle } from "styled-components";

// Pages
import BlogListPage from "./components/page/BlogListPage";
import ContentPage from "./components/page/ContentPage";
import TagFilteredPage from "./components/page/TagFilteredPage";


const AllGlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard-ExtraBold';
    src: url('/font/Pretendard-ExtraBold.ttf') format('truetype');
  }
    body {
    font-family: 'Pretendard-ExtraBold';
    }
  @font-face {
    font-family: 'Pretendard-SemiBold';
    src: url('/font/Pretendard-SemiBold.ttf') format('truetype');;
  }
 `;

function App(props) {
  return (
    <>
    <AllGlobalStyle />
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