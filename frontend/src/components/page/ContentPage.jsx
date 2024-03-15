import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 원하는 스타일 테마를 선택하세요. 예: vs, xcode, prism, atomDark 등
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const Tags = styled.span`
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: #ebebeb;
  text-align: center;
  font-size: 13px;
  justify-content: center;
  color: #666666;
  border-radius: 5px;
`;

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={prism}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const Image = ({ node, ...props }) => (
  <img
    {...props}
    style={{
      flex: "column",
      maxWidth: "auto",
      height: "450px",
      justifyItems: "center",
    }} // 이 부분을 조정하여 이미지 크기 스타일을 적용
  />
);

const ContentPage = () => {
  const { postId } = useParams(); // URL에서 postId를 추출
  console.log(postId);
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/posts/${postId}`) // postId를 사용하여 해당 글 정보를 불러옵니다.
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.log(error));

    fetch(`http://localhost:8000/posts`) // 모든 posts를 가져옵니다.
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.log(error));
  }, [postId]);

  // 태그 단일선택 처리 (공통사용)
  const handleTagClick = (tag, event) => {
    event.stopPropagation();
    navigate(`/?tags=${tag}`);
  };

  if (!post || !posts.length) return <div>Loading...</div>;

  // 현재 포스트의 인덱스를 찾음
  const currentIndex = posts.findIndex((p) => p._id === postId);

  // 이전 포스트와 다음 포스트를 결정
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const goToPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Wrapper>
      <div>
        <h2>{post.title}</h2>

        {/* 작성자, 프사, 날짜, 아웃라인 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            color: "gray",
          }}
        >
          <span>{post.author}</span>
          <img
            src={post.profileImagePath}
            alt="Author's profile"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
          <span
            style={{
              margin: "0 10px",
              fontWeight: "bold",
              color: "lightgray",
            }}
          >
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* 태그 및 단일 필터링 */}
        {post.tags.map((tag, tagIndex) => (
          <Tags
            key={tagIndex}
            onClick={(event) => handleTagClick(tag, event)}
            style={{ marginRight: "10px", cursor: "pointer", gap: "10px" }}
          >
            #{tag}
          </Tags>
        ))}

        <h4>{post.outline}</h4>

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ code: CodeBlock, img: Image }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {prevPost && (
        <Box onClick={() => goToPost(prevPost._id)}>
          이전글: {prevPost.title}
        </Box>
      )}
      {nextPost && (
        <Box onClick={() => goToPost(nextPost._id)}>
          다음글: {nextPost.title}
        </Box>
      )}
    </Wrapper>
  );
};

const Box = ({ children, onClick }) => (
  <button
    style={{
      border: "1px solid black",
      padding: "20px",
      marginTop: "20px",
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ContentPage;
