import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const CategoryContainer = styled.div`
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

    // 로딩 및 에러 표시 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 서버로부터 받은 포스트들을 저장할 상태
    const [posts, setPosts] = useState([]); 

    // 태그 및 카테고리 정의
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();

    // 페이지 이동
    const navigate = useNavigate(); 

    // 초기 포스트 페이지 로딩
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
    
    // 사용자의 태그, 카테고리 선택에 따른 포스트 목록 업데이트
    useEffect(() => {
        
        const fetchFilteredPosts = async () => {
            try {
              const response = await fetch(`http://localhost:8000/posts?${buildQueryString()}`);
              if (!response.ok) throw new Error('Network response was not ok');
              const data = await response.json();
              setPosts(data);
            } catch (error) {
              setError(error.message);
            } finally {
              setLoading(false);
            }
          };
        
          if (searchParams.toString()) {
            // URL의 쿼리 파라미터가 변경될 때마다 실행
            fetchFilteredPosts();
          }
    }, [searchParams]); // 이 useEffect는 searchParams의 변화에 따라 실행됩니다.

    // 글 제목 클릭 시 해당 글의 상세 페이지로 이동하는 함수
    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`); 
      };
    

    // 태그 클릭 시 URL 업데이트
    const handleTagChange = tag => {
        const newSelectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
        setSelectedTags(newSelectedTags);
        updateURL(newSelectedTags, selectedCategory);
    };

    // 카테고리 클릭 시 URL 업데이트
    const handleCategoryChange = category => {
        setSelectedCategory(category === 'ALL' ? '' : category);
        updateURL(selectedTags, category === 'ALL' ? '' : category);
    };

    // URL 업데이트
    const updateURL = (tags, category) => {
        const tagsQuery = tags.join('&');
        setSearchParams({ tags: tagsQuery, cat: category });
    };

    // Query String
    const buildQueryString = () => {
        const tagsQuery = selectedTags.join('&');
        return `tags=${tagsQuery}${selectedCategory ? `&cat=${selectedCategory}` : ''}`;
    };

    // posts Data 필터링
    const filteredPosts = posts.filter(post => {
        if (selectedTags.length === 0 && !selectedCategory) return true;
        const hasSelectedTags = selectedTags.every(tag => post.tags.includes(tag));
        const hasSelectedCategory = !selectedCategory || post.categories === selectedCategory;
        return hasSelectedTags && hasSelectedCategory;
    });

    // URL 쿼리 파라미터 값 변화에 따라 바로 렌더링하기
    useEffect(() => {
        // URL에서 tags와 cat 쿼리 파라미터 값을 읽어옵니다.
        const tagsFromURL = searchParams.get('tags');
        const categoryFromURL = searchParams.get('cat');
    
        // 쿼리 파라미터가 없는 경우 빈 배열 또는 빈 문자열로 초기화
        const tagsArray = tagsFromURL ? tagsFromURL.split('&') : [];
        const category = categoryFromURL ? categoryFromURL : '';
    
        // 컴포넌트 상태를 URL의 쿼리 파라미터에 맞게 업데이트
        setSelectedTags(tagsArray);
        setSelectedCategory(category);
    }, [searchParams]); // searchParams 변화 감지
    



    const allTags = posts.reduce((acc, post) => [...acc, ...post.tags], []);
    const uniqueTags = [...new Set(allTags)];

    const uniqueCateogry = [...new Set(posts.map(post => post.categories))]

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    <Wrapper>
        <h1>블로그 메인/리스트 페이지</h1>

        {/* 태그 렌더링 */}
        <TagContainer>
            {uniqueTags.map((tag, tagIndex) => (
                <Tags key={tagIndex} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }} onClick={(event) => handleTagChange(tag, event)}>
                    #{tag}
                </Tags>     
            ))}
        </TagContainer>

        {/* 카테고리 버튼 렌더링 */}
        <CategoryContainer>
        <div>
            {uniqueCateogry.map((category, index) => (
                <Tags key={index} onClick={() => handleCategoryChange(category)} style={{margin: "10px"}}>
                    {selectedCategory === category ? `<Selected> ${category}` : category}
                </Tags>
            ))}
        </div>
        </CategoryContainer>
        

        {/* 포스트 목록 렌더링 및 포스트로 이동 */}
        <div>
            {filteredPosts.map((post, index) => (
                <div key={index}>
                    <h2 onClick={() => handlePostClick(post._id)} style={{ cursor: 'pointer' }}>{post.title}</h2>
                    <h4>{post.outline}</h4>
                    {post.tags.map((tag, tagIndex) => (
                        <Tags key={tagIndex} onClick={(event) => handleTagChange(tag, event)} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }}>
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