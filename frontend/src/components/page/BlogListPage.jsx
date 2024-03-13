import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px;
`;

const TagContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    //width: 600px;
    gap: 7px;
`;

const Tags = styled.span`
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 8px;
    padding-left: 8px;
    background-color: #EBEBEB;
    text-align: center;
    font-size: 13px;
    justify-content: center;
    color: #666666;
    border-radius: 5px;
`;

const BlogListPage = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]); // 서버로부터 받은 포스트들을 저장할 상태

    const navigate = useNavigate(); // 페이지 이동

    useEffect(() => {
        fetch('http://localhost:8000/posts/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
        }, []);

    // 글 제목 클릭 시 해당 글의 상세 페이지로 이동하는 함수
    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`); 
      };

    // 태그 버튼 클릭 시 해당 태그를 가진 글로 필터링하는 로직
    const filterPostsByTag = (tag) => {
        navigate(`/tags/${encodeURIComponent(tag)}`);
      };
    
    // 상단 태그 버튼 클릭 시 이벤트
    const handleTagClick = (tag, event) => {
        event.stopPropagation();
        filterPostsByTag(tag);
    };

    const allTags = posts.reduce((acc, post) => [...acc, ...post.tags], []);
    const uniqueTags = [...new Set(allTags)];


    return (
    <Wrapper>
        <h1>블로그 메인/리스트 페이지</h1>
        <TagContainer>
            {uniqueTags.map((tag, tagIndex) => (
                <Tags key={tagIndex} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }} onClick={(event) => handleTagClick(tag, event)}>
                    #{tag}
                </Tags>     
            ))}
        </TagContainer>
        <div>
            {posts.map((post, index) => (
                <div key={index}>
                    <h2 onClick={() => handlePostClick(post._id)} style={{ cursor: 'pointer' }}>
                        {post.title}
                    </h2>
                    <h4>{post.outline}</h4>
                    {post.tags.map((tag, tagIndex) => (
                        <Tags key={tagIndex} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }} onClick={(event) => handleTagClick(tag, event)}>
                            #{tag}
                        </Tags>
                    ))}
                </div>
            ))}
        </div>
    </Wrapper>
    );
};

export default BlogListPage;