from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

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

# Pydantic 모델 정의
class Post(BaseModel):
    title: str
    tags: List[str]
    author: str
    profileImagePath: str
    content: str
    createdAt: str


# MongoDB에서 데이터 조회
@app.get("/posts", response_model=List[Post])
async def read_posts():
    posts = await MongoDB.db.find().to_list(100)
    return posts
