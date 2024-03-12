import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TagFilteredPage = () => {
    const { tagName } = useParams();
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/posts?tag=${tagName}`) 
            .then(response => response.json())
            .then(data => setFilteredPosts(data))
            .catch(error => console.log(error));
    }, [tagName]);

    return (
        <div>
            <h1>태그: #{tagName}</h1>
            {filteredPosts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p> {/* 예시로 내용을 직접 보여주고 있습니다. 실제로는 필요에 따라 다르게 구성할 수 있습니다. */}
                </div>
            ))}
        </div>
    );
};

export default TagFilteredPage;
