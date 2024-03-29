from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Any, List, Optional
from bson.objectid import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from pydantic_core import core_schema


app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱의 출처 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# MongoDB 연결 설정
class MongoDB:
    client: AsyncIOMotorClient = None

@app.on_event("startup")
async def startup_db_client():
    MongoDB.client = AsyncIOMotorClient("mongodb://localhost:27017")
    # MongoDB 데이터베이스와 컬렉션 이름 지정
    MongoDB.db = MongoDB.client["YbigtaBlog"]["posts"]

@app.on_event("shutdown")
async def shutdown_db_client():
    MongoDB.client.close()

# mongodb의 id를 PyObjectId 타입으로 선언
class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
            cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")

        return ObjectId(value)
    

# Pydantic 모델 정의
class Post(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    tags: List[str]
    outline: str
    author: str
    profileImagePath: str
    content: str
    createdAt: str
    categories: str

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: lambda v: str(v)}


# 블로그 기본 페이지
@app.get("/posts/", response_model=List[Post])
async def read_posts(tag: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if tag:
        query["tags"] = tag
    if category:
        query["categories"] = category

    # query가 비어있으면 모든 문서를 조회하고, tag나 category가 지정되어 있으면 해당 조건에 맞는 문서만 조회
    posts = await MongoDB.db.find(query).to_list(100)
    return posts

# 특정 포스트 조회
@app.get("/posts/{post_id}", response_model=Post)
async def read_post(post_id: str):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post ID format")
    post = await MongoDB.db.find_one({"_id": ObjectId(post_id)})
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Pydantic 모델 인스턴스를 alias를 사용하여 반환
    return Post(**post).model_dump(by_alias=True)   