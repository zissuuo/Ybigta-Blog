import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
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
    const { postId } = useParams(); // URL에서 postId를 추출
    console.log(postId);
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/posts/${postId}`) // postId를 사용하여 해당 글 정보를 불러옵니다.
        .then(response => response.json())
        .then(data => setPost(data))
        .catch(error => console.log(error));
    }, [postId]);

    if (!post) return <div>Loading...</div>;

    return (
        <Wrapper>
            <div>
                <h2>{post.title}</h2>
                {post.tags && post.tags.map((tag, index) => (
                    <p key={index}>#{tag}</p>
                ))}
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{ code: CodeBlock, img: Image }}
                >
                    {post.content}
                </ReactMarkdown>
            </div>
        </Wrapper>
    );
};



export default ContentPage;