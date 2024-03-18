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

const ListButton = styled.button`
  border: 1px solid #cccccc;
  padding: 20px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 20px;
  color: #666666;
  background-color: white;
  width: 190px;
  height: 40px;
  margin: 0 auto;
  font-weight: bold;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoveButton = styled.button`
  position: relative;
  border: 1px solid #cccccc;
  padding: 20px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 10px;
  color: black;
  background-color: white;
  width: 320px;
  height: 120px;
  font-weight: bold;
  font-size: 25px;
  display: flex;
  flex-direction: column;
  align-items: ${({ alignLeft }) => (alignLeft ? "flex-start" : "flex-end")};
  justify-content: center;
  margin-left: ${({ alignLeft }) => (alignLeft ? "80px" : "auto")};
  margin-right: ${({ alignLeft }) => (alignLeft ? "auto" : "80px")};
`;

const ButtonContainer = styled.div`
  // 버튼 두 개를 감싸는 컨테이너
  display: flex;
  justify-content: center;
  margin-top: 50px;
  width: 100%;
`;

const SubTitle = styled.span`
  font-size: 16px;
  color: #666666;
  text-align: ${({ alignLeft }) => (alignLeft ? "left" : "right")};
  margin-bottom: 10px;
  position: absolute;
  top: 17px;
`;

const PostTitle = styled.span`
  font-size: 20px;
  text-align: left;
  position: absolute;
  top: 50px;
  left: 18px;
  width: 290px;
`;

const Body = styled.span`
  font-size: 17px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #ced4da;
  margin-top: 40px; // 구분선 위의 간격을 조정하세요.
  margin-bottom: 40px; // 구분선 아래의 간격을 조정하세요.
  width: 90%;
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
        <h2 style={{ textAlign: "left" }}>{post.title}</h2>
        {/* 태그 및 단일 필터링 */}
        {post.tags.map((tag, tagIndex) => (
          <Tags key={tagIndex} onClick={(event) => handleTagClick(tag, event)}>
            #{tag}
          </Tags>
        ))}

        <Body>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock, img: Image }}
          >
            {post.content}
          </ReactMarkdown>
        </Body>
      </div>

      <Divider />

      {/* button to get back to BlogListPage */}
      <ListButton onClick={() => navigate("/")}>목록으로 돌아가기</ListButton>

      <ButtonContainer>
        {/* 이전 글 버튼만 존재할 때 */}
        {prevPost && !nextPost && (
          <>
            <MoveButton alignLeft onClick={() => goToPost(prevPost._id)}>
              <SubTitle alignLeft>이전 글</SubTitle>
              <PostTitle>{prevPost.title}</PostTitle>
            </MoveButton>
            <div></div> {/* 다음 글 버튼과의 간격을 조절하기 위한 빈 요소 */}
          </>
        )}

        {/* 다음 글 버튼만 존재할 때 */}
        {!prevPost && nextPost && (
          <>
            <div></div> {/* 이전 글 버튼과의 간격을 조절하기 위한 빈 요소 */}
            <MoveButton alignRight onClick={() => goToPost(nextPost._id)}>
              <SubTitle alignRight>다음 글</SubTitle>
              <PostTitle>{nextPost.title}</PostTitle>
            </MoveButton>
          </>
        )}

        {/* 이전 글과 다음 글 버튼 모두 존재할 때 */}
        {prevPost && nextPost && (
          <>
            <MoveButton alignLeft onClick={() => goToPost(prevPost._id)}>
              <SubTitle alignLeft>이전 글</SubTitle>
              <PostTitle>{prevPost.title}</PostTitle>
            </MoveButton>
            <div></div> {/* 다음 글 버튼과의 간격을 조절하기 위한 빈 요소 */}
            <MoveButton alignRight onClick={() => goToPost(nextPost._id)}>
              <SubTitle alignRight>다음 글</SubTitle>
              <PostTitle>{nextPost.title}</PostTitle>
            </MoveButton>
          </>
        )}
      </ButtonContainer>
    </Wrapper>
  );
};

export default ContentPage;
