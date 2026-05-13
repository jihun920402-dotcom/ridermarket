import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
    MapPin, ArrowLeft, Share2, Heart, Home,
    MessageCircle, MoreHorizontal, ChevronRight, ShieldCheck, List,
    Edit3, Trash2
} from 'lucide-react'

const API_BASE_URL = "http://localhost:8080";
const FALLBACK_IMAGE = "https://picsum.photos/600";

function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [otherProducts, setOtherProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // 1. 현재 로그인한 사용자 정보 가져오기 (JSON.parse 안전 처리)
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
    // 유저 데이터 계층 구조(user.id 또는 직접 id)에 관계없이 ID 추출
    const myId = currentUser?.id || currentUser?.user?.id || currentUser?.userId || currentUser?.userNo || currentUser?.idx;

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${API_BASE_URL}/api/products/${id}`)
                setProduct(res.data)

                const allRes = await axios.get(`${API_BASE_URL}/api/products`)
                setOtherProducts(allRes.data.filter(p => p.id !== parseInt(id)).slice(0, 4))
            } catch (err) {
                console.error("데이터 로딩 실패:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    // 2. 삭제 처리 함수
    const handleDelete = async () => {
        if (!window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/products/${id}`);
            alert("삭제되었습니다.");
            navigate('/');
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 권한이 없거나 오류가 발생했습니다.");
        }
    };

    // 3. 본인 확인 로직 (타입 불일치 방지를 위해 Number() 강제 변환)
    const isOwner = myId && product?.userId && Number(myId) === Number(product.userId);

    // 디버깅 로그 (필요 시 주석 처리)
    console.log(`[ID CHECK] ME: ${myId}(${typeof myId}) | OWNER: ${product?.userId}(${typeof product?.userId}) | Result: ${isOwner}`);

    // 이미지 경로 및 에러 처리 함수
    const getImageUrl = (url) => {
        if (!url || url === 'undefined' || url === 'null') return FALLBACK_IMAGE;
        return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    };

    const handleImgError = (e) => {
        e.target.onerror = null; // 무한 루프 방지 핵심
        e.target.src = FALLBACK_IMAGE;
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin mb-4"></div>
            <div className="text-blue-900 font-black text-xl animate-pulse">매물 정보를 가져오고 있어요</div>
        </div>
    )

    if (!product) return (
        <div className="flex flex-col justify-center items-center h-screen">
            <p className="text-gray-400 font-bold mb-4">해당 매물을 찾을 수 없습니다.</p>
            <button onClick={() => navigate('/')} className="text-blue-900 font-black underline">홈으로 돌아가기</button>
        </div>
    )

    return (
        <div className="min-h-screen bg-white">
            {/* 상단 네비게이션 */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600 flex items-center gap-1 group">
                            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline font-bold text-sm text-gray-900">뒤로가기</span>
                        </button>
                        <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600 flex items-center gap-2">
                            <Home size={20} className="text-gray-900" />
                            <span className="hidden sm:inline font-bold text-sm text-gray-900">홈으로</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 transition"><Share2 size={20} /></button>
                        <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 transition"><MoreHorizontal size={20} /></button>
                    </div>
                </div>
            </nav>

            {/* 브레드크럼 */}
            <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-gray-400 flex items-center gap-2 font-bold uppercase tracking-wider">
                <Link to="/" className="hover:text-blue-900 transition">RIDER MARKET</Link>
                <ChevronRight size={12} />
                <span className="hover:text-blue-900 cursor-pointer transition">중고거래</span>
                <ChevronRight size={12} />
                <span className="text-blue-900 font-black">{product.title}</span>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col lg:flex-row gap-12 mb-20">
                    {/* 왼쪽: 이미지 섹션 */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-28">
                            <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm bg-gray-50 group">
                                <img 
                                    src={getImageUrl(product.imageUrl)} 
                                    alt={product.title} 
                                    className="w-full h-full object-cover shadow-inner group-hover:scale-105 transition-transform duration-700" 
                                    onError={handleImgError} 
                                />
                            </div>
                            
                            {/* 판매자 정보 카드 */}
                            <div className="mt-6 flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-blue-100 flex items-center justify-center shadow-sm overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.writer || 'Rider'}`} alt="user" className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 flex items-center gap-1 italic">{product.writer || 'RIDER_MEMBER'} <ShieldCheck size={14} className="text-blue-500" /></h4>
                                        <p className="text-xs text-gray-500 font-bold">{product.address || '지역 정보 없음'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-600 font-black text-sm">46.4°C 😊</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Trust Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 상세 정보 섹션 */}
                    <div className="lg:w-1/2 py-2">
                        <div className="border-b border-gray-100 pb-8 mb-8">
                            <div className="inline-block px-3 py-1 bg-blue-900 text-white rounded-lg text-[11px] font-black mb-4 uppercase tracking-widest">
                                {product.category || '기타 용품'}
                            </div>
                            <h1 className="text-3xl font-black text-gray-950 mb-3 leading-tight tracking-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-4xl font-black text-blue-900 tracking-tighter">
                                    {product.price?.toLocaleString()}원
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                <MapPin size={16} className="text-blue-900" />
                                <span>{product.address}</span>
                                <span className="text-gray-200">|</span>
                                <span>방금 전</span>
                            </div>
                        </div>

                        <div className="text-[17px] text-gray-800 leading-[1.9] whitespace-pre-wrap min-h-[300px] font-medium">
                            {product.description}
                        </div>

                        <div className="flex gap-4 text-xs font-bold text-gray-400 mt-12 mb-10 border-t border-gray-50 pt-8">
                            <span>관심 18</span><span>·</span><span>채팅 1</span><span>·</span><span>조회 1,606</span>
                        </div>

                        {/* 하단 버튼 액션 */}
                        <div className="flex gap-3 sticky bottom-6 lg:relative lg:bottom-0 bg-white/80 lg:bg-transparent backdrop-blur-sm p-4 lg:p-0 rounded-3xl border border-gray-100 lg:border-none shadow-lg lg:shadow-none">
                            {isOwner ? (
                                <>
                                    <button
                                        onClick={() => navigate(`/edit-product/${id}`)}
                                        className="flex-1 bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-blue-900 transition shadow-xl flex items-center justify-center gap-2 text-[15px] active:scale-[0.98]"
                                    >
                                        <Edit3 size={20} /> 게시글 수정하기
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 bg-red-50 text-red-600 font-black py-5 rounded-2xl hover:bg-red-100 transition flex items-center justify-center gap-2 text-[15px] active:scale-[0.98]"
                                    >
                                        <Trash2 size={20} /> 삭제하기
                                    </button>
                                </>
                            ) : (
                                <button className="flex-1 bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-black transition shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 text-[15px] active:scale-[0.98]">
                                    <MessageCircle size={20} /> 라이더 채팅으로 거래하기
                                </button>
                            )}
                            <button className="p-5 bg-gray-100 text-gray-400 rounded-2xl hover:text-red-500 hover:bg-red-50 transition shadow-sm active:scale-90">
                                <Heart size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 추천 매물 섹션 */}
                <div className="border-t border-gray-100 pt-16 pb-20">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-black text-2xl text-gray-950 tracking-tight italic">Other Listings</h3>
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-900 font-black text-sm hover:underline">
                            전체 목록 보기 <List size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {otherProducts.map(item => (
                            <div key={item.id} className="group cursor-pointer" onClick={() => { navigate(`/product/${item.id}`); window.scrollTo(0, 0); }}>
                                <div className="aspect-square rounded-3xl overflow-hidden mb-4 border border-gray-100 shadow-sm bg-gray-50">
                                    <img 
                                        src={getImageUrl(item.imageUrl)} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                        onError={handleImgError}
                                    />
                                </div>
                                <p className="text-[15px] font-bold text-gray-900 truncate mb-1">{item.title}</p>
                                <p className="text-[16px] font-black text-blue-900">{item.price?.toLocaleString()}원</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProductDetail;