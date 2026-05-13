import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Camera, ChevronLeft } from 'lucide-react';

function EditProduct() {
    const { id } = useParams(); // URL에서 상품 ID 추출
    const navigate = useNavigate();

    // 상태 관리
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); // 새로 선택한 이미지

    // 1. 기존 데이터 불러오기
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/products/${id}`);
                const data = res.data;
                setTitle(data.title);
                setCategory(data.category);
                setPrice(data.price);
                setDescription(data.description);
                setPreview(`http://localhost:8080${data.imageUrl}`); // 기존 이미지 미리보기
            } catch (err) {
                console.error("데이터 로딩 실패:", err);
                alert("게시글을 불러올 수 없습니다.");
            }
        };
        fetchProduct();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // 2. 수정 요청 보내기 (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('description', description);

        // 새 이미지를 선택했을 때만 전송 (백엔드 required=false 처리 확인)
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("수정이 완료되었습니다!");
            navigate(`/product/${id}`);
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b px-6 py-4 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-400"><ChevronLeft size={28} /></button>
                    <h1 className="text-lg font-black italic">EDIT ITEM</h1>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto mt-8 px-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 이미지 영역 */}
                    <div className="flex flex-col items-center">
                        <label className="w-80 h-80 bg-white border-2 border-dashed rounded-[3rem] flex items-center justify-center cursor-pointer overflow-hidden relative">
                            {preview ? (
                                <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={48} className="text-gray-300" />
                            )}
                            <input type="file" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    {/* 입력 폼 (PostPage와 동일하게 구성) */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm space-y-6">
                        <input
                            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
                            placeholder="제목"
                        />
                        <select
                            value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold"
                        >
                            <option value="오토바이">오토바이</option>
                            <option value="헬멧/보호구">헬멧/보호구</option>
                            <option value="라이딩의류">라이딩의류</option>
                            <option value="기타 용품">기타 용품</option>
                        </select>
                        <input
                            type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none"
                            placeholder="가격"
                        />
                        <textarea
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            rows="5" className="w-full p-4 bg-gray-50 rounded-2xl font-bold resize-none outline-none"
                            placeholder="상세 설명"
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full py-5 bg-blue-900 text-white rounded-[2rem] font-black text-lg">
                        수정 완료하기
                    </button>
                </form>
            </main>
        </div>
    );
}

export default EditProduct;