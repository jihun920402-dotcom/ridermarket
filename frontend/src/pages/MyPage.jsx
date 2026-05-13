import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    User,
    Settings,
    ShoppingBag,
    Heart,
    ChevronRight,
    Package,
    ArrowLeft,
    ShieldCheck,
    MapPin,
    Save,
    X
} from 'lucide-react'

function MyPage() {
    const navigate = useNavigate()
    
    // 1. 초기 사용자 정보 가져오기 (로그인 시 저장된 데이터)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [activeTab, setActiveTab] = useState('selling')
    const [myProducts, setMyProducts] = useState([])
    const [likedProducts, setLikedProducts] = useState([])
    
    // 수정 모드 상태 관리
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    })

    useEffect(() => {
        if (!user) {
            alert("로그인이 필요합니다.")
            navigate('/login')
            return
        }

        const fetchMyData = async () => {
            try {
                // 전체 상품 중 '주소'가 내 주소와 일치하는 것 필터링 (작성자 필드가 없을 경우 대비)
                const res = await axios.get('http://localhost:8080/api/products')
                setMyProducts(res.data.filter(p => p.address === user.address))
                setLikedProducts(res.data.slice(0, 2)) // 관심 목록 샘플
            } catch (err) {
                console.error("데이터 로딩 실패:", err)
            }
        }
        fetchMyData()
    }, [user, navigate])

    // 정보 수정 저장 함수
    const handleUpdate = async () => {
        try {
            const res = await axios.patch(`http://localhost:8080/api/users/update/${user.id}`, editData)
            const updatedUser = { ...user, ...res.data }
            
            // 상태 업데이트 및 로컬스토리지 동기화
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setIsEditing(false)
            alert("회원 정보가 성공적으로 수정되었습니다.")
        } catch (err) {
            alert("수정 중 오류가 발생했습니다.")
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* 상단 헤더 */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600">
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-lg font-black text-blue-900">마이페이지</h1>
                    <div className="w-10"></div> {/* 밸런스용 빈 공간 */}
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 mt-8">
                {/* 프로필 섹션 */}
                <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center border-2 border-blue-100 shadow-inner">
                                <User size={48} className="text-blue-300" />
                            </div>
                            
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <input 
                                            className="text-xl font-bold border-b-2 border-blue-200 outline-none w-full"
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            placeholder="이름"
                                        />
                                        <input 
                                            className="text-sm font-bold text-gray-600 border-b-2 border-blue-200 outline-none w-full"
                                            value={editData.address}
                                            onChange={(e) => setEditData({...editData, address: e.target.value})}
                                            placeholder="주소"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={handleUpdate} className="flex items-center gap-1 text-xs font-black bg-blue-900 text-white px-3 py-1.5 rounded-full">
                                                <Save size={12}/> 저장
                                            </button>
                                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 text-xs font-black bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full">
                                                <X size={12}/> 취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-2xl font-black text-gray-900">{user.name}님</h2>
                                            <ShieldCheck size={20} className="text-blue-500" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                                            <MapPin size={14} /> {user.address}
                                        </p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">{user.phone}</p>
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="mt-3 text-xs font-black bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full hover:bg-gray-200 transition"
                                        >
                                            프로필 수정
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 매너 온도 */}
                        <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50 min-w-[200px]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-black text-blue-900 uppercase tracking-wider">Manner Temp</span>
                                <span className="text-xl font-black text-blue-600">46.5°C 😊</span>
                            </div>
                            <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-[46.5%] shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 탭 메뉴 */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('selling')}
                        className={`flex-1 py-4 text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'selling' ? "text-blue-900 border-b-2 border-blue-900" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <ShoppingBag size={18} /> 판매 내역 ({myProducts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('liked')}
                        className={`flex-1 py-4 text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'liked' ? "text-blue-900 border-b-2 border-blue-900" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <Heart size={18} /> 관심 목록 ({likedProducts.length})
                    </button>
                </div>

                {/* 리스트 영역 */}
                <div className="space-y-4">
                    {(activeTab === 'selling' ? myProducts : likedProducts).length > 0 ? (
                        (activeTab === 'selling' ? myProducts : likedProducts).map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/product/${item.id}`)}
                                className="bg-white p-5 rounded-[2rem] border border-gray-100 flex gap-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-none">
                                    <img src={`http://localhost:8080${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="product" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="font-bold text-gray-900 truncate mb-1">{item.title}</h4>
                                    <p className="text-xs text-gray-400 font-bold mb-2">{item.address} · 방금 전</p>
                                    <p className="text-lg font-black text-blue-900">{item.price?.toLocaleString()}원</p>
                                </div>
                                <div className="flex items-center px-2">
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-900 transition" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                            <Package size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold text-lg">내역이 없습니다.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default MyPage