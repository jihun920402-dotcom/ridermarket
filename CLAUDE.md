# RiderMarket 프로젝트

오토바이 및 라이더 용품 중고거래 플랫폼.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 백엔드 | Spring Boot 3.5.13 / Java 17 / Maven |
| DB | H2 (인메모리, 재시작 시 초기화) |
| 인증 | Spring Security + JWT (jjwt 0.11.5) |
| 실시간 | WebSocket (STOMP + SockJS) |
| 프론트엔드 | React 19 + Vite 8 + TailwindCSS 4 |
| HTTP | Axios |
| 라우팅 | React Router v7 |

---

## 프로젝트 구조

```
ridermarket/
├── backend/                          # Spring Boot
│   ├── src/main/java/com/example/backend/
│   │   ├── config/
│   │   │   ├── DataInitializer.java  # 샘플 데이터 자동 삽입 (서버 첫 실행 시)
│   │   │   ├── SecurityConfig.java
│   │   │   ├── WebConfig.java
│   │   │   └── WebSocketConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java   # /api/auth
│   │   │   ├── ChatController.java   # /api/chat + WebSocket
│   │   │   ├── ProductController.java# /api/products
│   │   │   └── UserController.java   # /api/users
│   │   ├── entity/
│   │   │   ├── Product.java
│   │   │   ├── User.java
│   │   │   └── ChatMessage.java
│   │   └── repository/
│   └── src/main/resources/
│       └── application.properties
└── frontend/                         # React + Vite
    └── src/
        ├── App.jsx                   # 라우터 설정
        └── pages/
            ├── Home.jsx              # 상품 목록 + 검색/필터
            ├── ProductDetail.jsx     # 상품 상세
            ├── PostPage.jsx          # 상품 등록
            ├── EditProduct.jsx       # 상품 수정
            ├── LoginPage.jsx
            ├── SignupPage.jsx
            ├── ChatPage.jsx          # 실시간 채팅
            └── MyPage.jsx            # 마이페이지
```

---

## 포트 설정

| 서버 | 포트 |
|------|------|
| 백엔드 (Spring Boot) | **8081** |
| 프론트엔드 (Vite dev) | **5173** |
| H2 콘솔 | http://localhost:8081/h2-console |

> pom.xml Java 버전은 **17** (시스템에 Java 17 설치됨, 21 미설치)

---

## 서버 실행 방법

### 백엔드
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 프론트엔드
```powershell
cd frontend
npm install   # 최초 1회
npm run dev
```

---

## API 엔드포인트 요약

| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/products | 전체 상품 목록 |
| POST | /api/products | 상품 등록 |
| PUT | /api/products/{id} | 상품 수정 |
| POST | /api/products/upload | 이미지 업로드 |
| POST | /api/users/login | 로그인 |
| POST | /api/users/signup | 회원가입 |
| GET | /api/users/check-email | 이메일 중복 확인 |
| PATCH | /api/users/update/{id} | 유저 정보 수정 |
| GET | /api/chat/public-room | 채팅방 목록 |
| WS | /ws-chat | WebSocket 엔드포인트 |

---

## 샘플 데이터 (DataInitializer)

서버 시작 시 자동 삽입. H2 인메모리이므로 **재시작 때마다 초기화 후 재삽입**.

**테스트 계정** (비밀번호 모두 `1234`):
- `kim@test.com` / 김라이더
- `lee@test.com` / 이바이크
- `park@test.com` / 박오토

**상품**: 오토바이 3개, 헬멧 1개, 의류 1개, 부품/용품 4개 (총 9개)

---

## 파일 업로드 경로

```
C:/usedmarket/uploads/
```
`application.properties`의 `file.upload-dir` 참조. 서버 실행 전 디렉터리가 존재해야 함.

---

## 다음 작업 예정

- [ ] **상품 이미지 표시**: 업로드된 이미지가 목록/상세 페이지에 실제로 보이도록 처리
- [ ] **반응형 UI**: 모바일 / 태블릿 / 데스크톱 브라우저 크기에 따라 레이아웃 대응 (TailwindCSS 브레이크포인트 활용)
