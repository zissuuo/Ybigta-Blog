import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import HeaderComponent from '../ui/HeaderComponent';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ImgTagBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    margin-bottom: 40px;
`;

const BackgroundImg = styled.div`
    width: 100%;
    height: 323px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url('${process.env.PUBLIC_URL}/background.JPG');
    background-size: cover;
    background-position: center;
    opacity: 0.5;
    color: white;
    font-family: 'Pretendard-ExtraBold';
    font-size: 60px;
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
`;


const PostCategoryContainer = styled.div`
    display: flex;
    padding-top: 30px;
    padding-left: 90px;
    padding-right: 90px;
    flex-direction: row;
    align-items: flex-start;
    gap: 50px;
`;


const TagContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 600px;
    gap: 15px 7px;
`;

const CategoryContainer = styled.div`
    display: flex;
    width: 300px;
    flex-direction: column;
    gap: 9px;
`;

const Tags = styled.span`
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    height: 30px;
    cursor: pointer;
    background-color: ${props => props.isSelected ? '#96B8D2' : '#EBEBEB'}; /* 조건부 색상 적용 */
    color: ${props => props.isSelected ? '#ffffff' : '#666666'};
    text-align: center;
    font-family: 'Pretendard-SemiBold';
    font-size: 13px;
    justify-content: center;
    align-items: center; /* 이 줄을 추가하세요 */
    border-radius: 30px;
`;

const SearchInput = styled.input`
    //width: 300px;
    height: 30px;
    border-radius: 30px;
    border: none;
    box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
`;

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 750px;
    gap: 16px;
    //padding: 10px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #d4d4d4;
`;

const InnerTagContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const PostTitle = styled.span`
    font-family: 'Pretendard-ExtraBold';
    font-size: 23px;
    cursor: pointer;
    transition: color 0.1s ease;
    &:hover {
        color: #666666;
    }
`;

const Category = styled.span`
    font-family: 'Pretendard-Medium';
    cursor: pointer;
    color: ${props => props.isSelected ? '#666666' : '#252a2f'};
    transition: color 0.1s ease;
    &:hover {
        color: #666666;
    }
`;


  
const BlogListPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]); 
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

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

    // 검색어 입력 처리 저장
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value); // 입력된 검색어를 상태로 저장
    };


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
        const matchesSearchQuery = 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) || // 제목에 검색어가 포함되는지 확인
            post.content.toLowerCase().includes(searchQuery.toLowerCase()); // 내용에 검색어가 포함되는지 확인
        return hasSelectedTags && hasSelectedCategory && matchesSearchQuery;
    });

    // const allTags = posts.reduce((acc, post) => [...acc, ...post.tags], []);
    // const uniqueTags = [...new Set(allTags)];
    
    const uniqueTags = [...new Set(posts.flatMap(post => post.tags))];
    const uniqueCategories = [...new Set(posts.map(post => post.categories))];
    
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>;

    return (
        <Wrapper>
            <HeaderComponent></HeaderComponent>
        

        <ImgTagBox>
            <BackgroundImg>
                <span>
                    Shape the Future of Data
                </span>
                <span>
                    with a Community of Enthusiasts
                </span>
            </BackgroundImg>

            {/* 태그 렌더링 - 다중 선택 */}
            <TagContainer>
                {uniqueTags.map((tag, tagIndex) => (
                    <Tags key={tagIndex} onClick={() => handleTagChange(tag)} isSelected={selectedTags.includes(tag)}>
                        {tag}
                    </Tags>
   
                ))}
            </TagContainer>
        </ImgTagBox>


            {/* 포스트 목록 렌더링 및 각종 click 이동 이벤트 */}
            <PostCategoryContainer>
                <PostWrapper>
                {filteredPosts.map((post, index) => (
                    <PostContainer key={index}>
                        {/* 제목 클릭 시 포스트로 이동 */}
                        <PostTitle onClick={() => handlePostClick(post._id)}
                                style={{cursor: 'pointer',
                                        fontFamily: 'Pretendard-ExtraBold',
                                        fontSize: '23px'}}> 
                            {post.title} 
                        </PostTitle>

                        {/* 작성자, 프사, 날짜, 아웃라인 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <img src={post.profileImagePath} alt="Author's profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                            <span style={{ fontFamily: 'Pretendard-Medium', color: '#252a2f', marginLeft: '20px'}}>
                                {post.author}
                            </span>
                            <span style={{ fontFamily: 'Pretendard-Medium', color: '#666666', marginLeft: '20px' }}>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <span style={{ fontFamily: 'Pretendard-Medium', color: '#666666'}}>
                            {post.outline}
                        </span>

                        {/* 태그 및 단일 필터링 */}
                        <InnerTagContainer>
                            {post.tags.map((tag, tagIndex) => (
                                <Tags key={tagIndex} onClick={(event) => handleTagClick(tag, event)} style={{marginRight: "10px", cursor: 'pointer', gap: "10px" }}>
                                    {tag}
                                </Tags>
                            ))}
                        </InnerTagContainer>
                    </PostContainer>
                ))}
                </PostWrapper>

                {/* 카테고리 버튼 검색 기능 렌더링 */}
                <CategoryContainer>
                    <SearchInput
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search..."
                    />
                    <span style={{cursor: 'pointer', fontFamily: 'Pretendard-ExtraBold', fontSize: '23px'}}>
                        Category
                    </span>
                        {uniqueCategories.map((category, index) => (
                            <Category key={index} onClick={() => handleCategoryChange(category)} isSelected={selectedCategory === category}>
                                - {category}
                            </Category>
                        ))}
                </CategoryContainer>
            </PostCategoryContainer>
        
        </Wrapper>
        );
      
};

export default BlogListPage;