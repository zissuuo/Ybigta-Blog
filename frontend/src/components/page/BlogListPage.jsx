import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';

/* 컴포넌트 임포트 */
import Button from '../ui/Button';


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px;
`;


const BlogListPage = () => {

    const [posts, setPosts] = useState([]); // 서버로부터 받은 포스트들을 저장할 상태

    useEffect(() => {
      // 서버로부터 포스트 데이터를 가져옵니다.
      fetch('http://localhost:8000/posts') // 이 URL은 예시이며, 실제 서버의 URL을 사용해야 합니다.
        .then(response => response.json())
        .then(data => setPosts(data))
        .catch(error => console.log(error));
    }, []);

    /* 이동 */
    const navigate = useNavigate();

    const navigateTo = (path) => {
        console.log(`${path} clicked!`);
        navigate(path);
      };


    return (
    <Wrapper>
        <h1>블로그 메인/리스트 페이지</h1>
        <div>
            {posts.map((post, index) => (
                <div key={index}>
                    <h2 onClick={() => navigate('/content-page')}>{post.title}</h2>
                    {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} style={{marginRight: "10px"}}>
                            #{tag}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    </Wrapper>
    );
};

export default BlogListPage;