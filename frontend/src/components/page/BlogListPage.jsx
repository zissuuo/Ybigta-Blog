import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';


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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]); 
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    // 페이지 이동
    const navigate = useNavigate(); 

    // 필터링 초기화
    const resetFilters = () => {
        setSelectedTags([]);
        setSelectedCategory('');
        setSearchParams({});
    };

    // 날짜 정렬
    const sortPostsByDate = (posts) => {
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // 페이지네이션


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
            const sortedPosts = sortPostsByDate(data); // 받아온 데이터를 날짜 순으로 정렬
            setPosts(sortedPosts);
            // setPosts(data);
        })
        .catch(error => {
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    // URL 쿼리 파라미터 값 변화에 따라 바로 렌더링하기
    useEffect(() => {
        // URL에서 tags와 cat 쿼리 파라미터 값 읽어오기
        const tagsFromURL = searchParams.get('tags');
        const categoryFromURL = searchParams.get('cat');
    
        // 쿼리 파라미터가 없는 경우 빈 배열 또는 빈 문자열로 초기화
        const tagsArray = tagsFromURL ? tagsFromURL.split('&') : [];
        const category = categoryFromURL ? categoryFromURL : '';
    
        // 컴포넌트 상태를 URL의 쿼리 파라미터에 맞게 업데이트
        setSelectedTags(tagsArray);
        setSelectedCategory(category);
    }, [searchParams]); // searchParams 변화 감지


    // 글 제목 클릭 시 해당 글의 상세 페이지로 이동하는 함수
    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`); 
    };

    // 태그 단일선택 처리 (공통사용)
    const handleTagClick = (tag, event) => {
        event.stopPropagation();
        navigate(`/?tags=${tag}`);
    };

    // 태그 다중선택 처리
    const handleTagChange = (tag) => {
        const newSelectedTags = selectedTags.includes(tag) 
            ? selectedTags.filter(t => t !== tag) 
            : [...selectedTags, tag];
        setSelectedTags(newSelectedTags);
        setSearchParams({ tags: newSelectedTags.join('&'), cat: selectedCategory });
    };

    // 카테고리 선택 처리
    const handleCategoryChange = (category) => {
        const isDeselecting = selectedCategory === category || category === 'ALL';
        const newCategory = isDeselecting ? '' : category; 
        setSelectedCategory(newCategory);
    
        if (newCategory === '') {
            setSearchParams(selectedTags.length > 0 ? { tags: selectedTags.join('&') } : {});
        } else {
            setSearchParams({ tags: selectedTags.join('&'), cat: newCategory });
        }
    };

    // posts Data 필터링
    const filteredPosts = posts.filter(post => {
        const hasSelectedTags = selectedTags.length === 0 || selectedTags.every(tag => post.tags.includes(tag));
        const hasSelectedCategory = !selectedCategory || post.categories.includes(selectedCategory);
        return hasSelectedTags && hasSelectedCategory;
    });

    // const allTags = posts.reduce((acc, post) => [...acc, ...post.tags], []);
    // const uniqueTags = [...new Set(allTags)];
    
    const uniqueTags = [...new Set(posts.flatMap(post => post.tags))];
    const uniqueCategories = [...new Set(posts.map(post => post.categories))];
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Wrapper>
            <h1 onClick={resetFilters} style={{cursor: 'pointer'}}>
            블로그 메인/리스트 페이지
            </h1>
        
            {/* 태그 렌더링 - 다중 선택 */}
            <TagContainer>
            {uniqueTags.map((tag, tagIndex) => (
                <Tags key={tagIndex} onClick={() => handleTagChange(tag)} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }}>
                #{tag}{selectedTags.includes(tag) ? ' (Selected)' : ''}
                </Tags>     
            ))}
            </TagContainer>
        
            {/* 카테고리 버튼 렌더링 */}
            <CategoryContainer>
                {uniqueCategories.map((category, index) => (
                <Tags key={index} onClick={() => handleCategoryChange(category)} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }}>
                    {selectedCategory === category ? `${category} (Selected)` : category}
                </Tags>
                ))}
            </CategoryContainer>
        
            {/* 포스트 목록 렌더링 및 각종 click 이동 이벤트 */}
            <div>
            {filteredPosts.map((post, index) => (
                <div key={index}>
                    {/* 제목 클릭 시 포스트로 이동 */}
                    <h2 onClick={() => handlePostClick(post._id)} style={{cursor: 'pointer'}}> 
                    {post.title} 
                    </h2>

                    {/* 작성자, 프사, 날짜, 아웃라인 */}
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 'bold', color: 'gray' }}>
                        <span>{post.author}</span>
                        <img src={post.profileImagePath} alt="Author's profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <span style={{ margin: '0 10px', fontWeight: 'bold', color: 'lightgray' }}>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <h4>{post.outline}</h4>

                    {/* 태그 및 단일 필터링 */}
                    {post.tags.map((tag, tagIndex) => (
                        <Tags key={tagIndex} onClick={(event) => handleTagClick(tag, event)} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }}>
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