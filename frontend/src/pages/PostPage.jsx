import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, ChevronLeft } from 'lucide-react';

function PostPage() {
    const navigate = useNavigate();

    // 입력 상태 관리
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // 이미지 선택 시 미리보기 처리
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 0. 필수값 검증 (이미지 포함)
        if (!title || !category || !price || !description || !image) {
            alert("이미지를 포함한 모든 항목을 채워주세요.");
            return;
        }

        // 1. 유저 정보 체크 (로그인 필수)
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
            navigate('/login');
            return;
        }
        const currentUser = JSON.parse(storedUser);

        try {
            // 1단계: 이미지 업로드 (Multipart)
            console.log("1단계: 이미지 업로드 시작...");
            const imageFormData = new FormData();
            imageFormData.append('file', image);

            const uploadRes = await axios.post('http://localhost:8081/api/products/upload', imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // ⭐ 중요: 서버 응답이 "/uploads/파일명.png" 형태인지 확인해야 함
            const savedImageUrl = uploadRes.data;
            console.log("서버로부터 받은 이미지 경로:", savedImageUrl);

            if (!savedImageUrl) {
                alert("이미지 경로를 받아오지 못했습니다.");
                return;
            }

            // 2단계: 상품 정보 저장 (JSON)
            console.log("2단계: 상품 정보 DB 저장 시작...");
            const productData = {
                title: title.trim(),
                category: category,
                price: Number(price), // 문자열을 숫자로 확실히 변환
                description: description.trim(),
                imageUrl: savedImageUrl, // 서버에서 받은 경로 그대로 저장
                address: currentUser.address || '지역 정보 없음',
                status: 'SALE',
                userId: currentUser.id, // DB 작성자 구분을 위한 ID
                writer: currentUser.name || '알 수 없는 사용자'
            };

            // 서버 전송 (JSON 형식)
            const finalRes = await axios.post('http://localhost:8081/api/products', productData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (finalRes.status === 200 || finalRes.status === 201) {
                console.log("최종 등록 성공:", finalRes.data);
                alert("매물이 성공적으로 등록되었습니다!");
                navigate('/');
            }

        } catch (err) {
            console.error("등록 실패 상세 로그:", err.response?.data || err.message);
            alert("등록에 실패했습니다. 서버 로그를 확인하세요.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b sticky top-0 z-50 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-black transition">
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="text-lg font-black italic tracking-tighter">POST NEW ITEM</h1>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto mt-8 px-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col items-center">
                        <label className="w-full aspect-square md:w-80 md:h-80 bg-white border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-blue-900 transition-all overflow-hidden relative group">
                            {preview ? (
                                <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera size={48} className="text-gray-300 mb-4 group-hover:text-blue-900 transition" />
                                    <span className="text-sm font-black text-gray-400">사진 등록</span>
                                </>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="space-y-6 bg-white p-10 rounded-[3rem] shadow-sm">
                        <div>
                            <label className="block text-xs font-black text-blue-900 mb-2 uppercase tracking-widest">Title</label>
                            <input
                                type="text" placeholder="매물 제목을 입력하세요"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold"
                                value={title} onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-900 mb-2 uppercase tracking-widest">Category</label>
                            <select
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                value={category} onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">카테고리 선택</option>
                                <option value="오토바이">오토바이</option>
                                <option value="헬멧/보호구">헬멧/보호구</option>
                                <option value="라이딩의류">라이딩의류</option>
                                <option value="기타 용품">기타 용품</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-900 mb-2 uppercase tracking-widest">Price (KRW)</label>
                            <input
                                type="number" placeholder="판매 가격"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-900 mb-2 uppercase tracking-widest">Description</label>
                            <textarea
                                rows="5" placeholder="매물의 상태, 튜닝 내역 등을 상세히 적어주세요"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold resize-none"
                                value={description} onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-blue-900 text-white rounded-[2rem] font-black text-lg hover:bg-black transition-all shadow-xl shadow-blue-900/20"
                    >
                        매물 등록하기
                    </button>
                </form>
            </main>
        </div>
    );
}

export default PostPage;