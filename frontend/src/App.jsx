import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 기존 페이지들
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
// App.jsx 상단 import 구역
import EditProduct from './pages/EditProduct'; // 파일 경로가 ./pages/ 안에 있다면 이대로 작성
// 우리가 새롭게 만든/수정한 페이지들
import PostPage from './pages/PostPage'   // BikePostPage 대신 이 파일을 사용합니다.
import ChatPage from './pages/ChatPage'
import MyPage from './pages/MyPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 메인 목록 페이지 (검색/필터 강화 버전) */}
        <Route path="/" element={<Home />} />

        {/* 2. 상품 상세 페이지 */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* 3. 상품 등록 페이지 (로그인 체크 로직 포함) */}
        <Route path="/post" element={<PostPage />} />

        {/* 4. 로그인/회원가입 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 5. 실시간 채팅 페이지 (2단 레이아웃) */}
        <Route path="/chat" element={<ChatPage />} />

        {/* 6. 마이 페이지 (신뢰 온도/내 매물 관리) */}
        <Route path="/mypage" element={<MyPage />} />

        {/* 7. 상품 수정 페이지 (EditProduct.jsx) */}
        <Route path="/edit/:id" element={<EditProduct />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App