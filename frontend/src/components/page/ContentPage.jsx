import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 원하는 스타일 테마를 선택하세요. 예: vs, xcode, prism, atomDark 등
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px;
`;

const CodeBlock = ({node, inline, className, children, ...props}) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter style={prism} language={match[1]} PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};


const Image = ({node, ...props}) => (
    <img
      {...props}
      style={{ flex: "column", maxWidth: "auto", height: "450px", justifyItems: "center" }} // 이 부분을 조정하여 이미지 크기 스타일을 적용
    />
  );


const ContentPage = () => {

    const [posts, setPosts] = useState([]); // 서버로부터 받은 포스트들을 저장할 상태
    

    useEffect(() => {
      // 서버로부터 포스트 데이터를 가져옵니다.
      fetch('http://localhost:8000/posts') // 이 URL은 예시이며, 실제 서버의 URL을 사용해야 합니다.
        .then(response => response.json())
        .then(data => setPosts(data))
        .catch(error => console.log(error));
    }, []);
  
    return (
    <Wrapper>
      <div>
        {posts.length > 0 && (
          <div>
            <h2>{posts[0].title}</h2>
            {posts[0].tags.map((tag, index) => (
              <p key={index}>#{tag}</p> // 각 태그에 고유 key 값을 제공합니다.
            ))}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ code: CodeBlock, img: Image }}>
              {posts[0].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </Wrapper>
    );

};

export default ContentPage;