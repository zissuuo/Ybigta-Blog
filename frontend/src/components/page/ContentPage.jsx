import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 원하는 스타일 테마를 선택하세요. 예: vs, xcode, prism, atomDark 등
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

import HeaderComponent from "../ui/HeaderComponent";
import BottomComponent from "../ui/BottomComponent";

const Title = styled.span`
  font-size: 40px; // 크기는 이미지에 맞춰 조정하세요.
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  font-family: "Pretendard-ExtraBold";
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #d4d4d4;
  margin-top: 40px; // 구분선 위의 간격을 조정하세요.
  margin-bottom: 20px; // 구분선 아래의 간격을 조정하세요.
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  margin-left: 200px;
  margin-right: 200px;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;


const Tags = styled.span`
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  height: 30px;
  cursor: pointer;
  background-color: #ebebeb;
  color: ${(props) =>
    props.isSelected ? "#3b82f6" : "#666666"}; /* 조건부 색상 적용 */
  text-align: center;
  font-family: "Pretendard-SemiBold";
  font-size: 13px;
  justify-content: center;
  align-items: center; /* 이 줄을 추가하세요 */
  border-radius: 30px;
  transition: color 0.1s ease;
  &:hover {
    color: #3b82f6;
  }
`;

const LowerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ListButton = styled.button`
  border: none;
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  cursor: pointer;
  border-radius: 20px;
  color: #666666;
  background-color: white;
  width: 190px;
  height: 40px;
  font-weight: bold;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Pretendard-Bold";
`;

const MoveButton = styled.button`
  position: relative;
  border: none;
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.3);
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
  font-family: "Pretendard-Bold";
  /* margin-left: ${({ alignLeft }) => (alignLeft ? "80px" : "auto")};
  margin-right: ${({ alignLeft }) => (alignLeft ? "auto" : "80px")}; */
`;

const ButtonContainer = styled.div`
  // 버튼 두 개를 감싸는 컨테이너
  display: flex;
  justify-content: center;
  gap: 50px;
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
  font-family: "Pretendard-Medium";
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const Categories = styled.span`
  font-size: 15px; // 카테고리 글씨 크기 변경
  display: flex;
  flex-direction: column;
  align-items: left;
  font-family: "Pretendard-Medium";
`;

const InnerTagContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  const [selectedCategory, setSelectedCategory] = useState("");

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

  // 카테고리 선택 처리
  const handleCategoryChange = (category) => {
    const isDeselecting = selectedCategory === category || category === "ALL";
    const newCategory = isDeselecting ? "" : category;
    setSelectedCategory(newCategory);
    navigate("/" + (newCategory ? `?cat=${newCategory}` : ""));
  };

  if (!post || !posts.length) return <div>Loading...</div>;

  // 날짜 기준으로 포스트를 정렬
  const sortedPosts = posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // 현재 포스트의 인덱스
  const currentIndex = sortedPosts.findIndex((p) => p._id === postId);

  // 이전 포스트와 다음 포스트를 결정
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;


  const goToPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div>
      <HeaderComponent />
      <Wrapper>
        <InfoBox>
          {/* 카테고리 버튼 렌더링 */}
          <Categories
            onClick={() => handleCategoryChange(post.categories)}
            style={{ cursor: "pointer", gap: "10px", color: "#666666" }}
          >
            {post.categories}
          </Categories>
          <Title>{post.title}</Title>

        {/* 작성자, 프사, 날짜, 아웃라인 */}
        <div
            style={{
              display: "flex",
              fontSize: "16px",
              fontFamily: "Pretendard-Medium",
              flexdirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src={post.profileImagePath}
              alt="Author's profile"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
            <span>{post.author}</span>
            <span
              style={{
                color: "#666666",
                flexdirection: "column",
                fontFamily: "Pretendard-Medium",
              }}
            >
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div
            style={{
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* 태그 및 단일 필터링 */}
            <InnerTagContainer>
              {post.tags.map((tag, tagIndex) => (
                <Tags
                  key={tagIndex}
                  onClick={(event) => handleTagClick(tag, event)}
                  style={{
                    marginRight: "05px",
                    cursor: "pointer",
                    gap: "10px",
                  }}
                >
                  {tag}
                </Tags>
              ))}
            </InnerTagContainer>
          </div>

        </InfoBox>

        <Divider />

        <Body>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock, img: Image }}
          >
            {post.content}
          </ReactMarkdown>
        </Body>

        <Divider />

        {/* button to get back to BlogListPage */}
        <LowerContainer>
          <ListButton onClick={() => navigate("/")}>목록으로 돌아가기</ListButton>

          {/* 이전 글, 다음 글 버튼 */}
          <ButtonContainer>
          {/* 이전 글 버튼만 존재할 때 */}
          {prevPost && !nextPost && (
            <>
              <MoveButton alignLeft onClick={() => goToPost(prevPost._id)}>
                <SubTitle alignLeft> 이전 글</SubTitle>
                <PostTitle>{prevPost.title}</PostTitle>
              </MoveButton>
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
                  <SubTitle alignLeft>{"<-"} 이전 글</SubTitle>
                  <PostTitle>{prevPost.title}</PostTitle>
                </MoveButton>
                <div></div> {/* 다음 글 버튼과의 간격을 조절하기 위한 빈 요소 */}
                <MoveButton alignRight onClick={() => goToPost(nextPost._id)}>
                  <SubTitle alignRight>다음 글 {"->"}</SubTitle>
                  <PostTitle>{nextPost.title}</PostTitle>
                </MoveButton>
              </>
            )}
          </ButtonContainer>
        </LowerContainer>
      </Wrapper>
      <BottomComponent />
    </div>
  );
};

export default ContentPage;
