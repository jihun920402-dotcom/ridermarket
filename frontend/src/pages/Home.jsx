import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Search,
  MapPin,
  PlusCircle,
  LogOut,
  ChevronRight,
  Filter,
  Navigation,
  RefreshCcw,
  PackageSearch
} from 'lucide-react'

function Home() {
  const navigate = useNavigate()

  // 데이터 상태
  const [products, setProducts] = useState([])
  const [userName] = useState(localStorage.getItem('userName'))

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const categories = [
    "전체", "오토바이", "헬멧/보호구", "배달통/거치대",
    "라이딩의류", "전기자전거/킥보드", "기타 용품"
  ]

  // [데이터 로드] 백엔드 Entity 구조에 맞춰 데이터 수신
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/products')
        setProducts(res.data)
      } catch (err) {
        console.error("매물 로딩 실패:", err)
      }
    }
    fetchProducts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('token')
    alert("로그아웃 되었습니다.")
    window.location.reload()
  }

  // --- 필터링 로직 (Entity 필드명 기반) ---
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === '전체' || product.category === selectedCategory
    const title = product.title || ""
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())

    const price = product.price || 0
    const matchesMinPrice = minPrice === '' || price >= parseInt(minPrice)
    const matchesMaxPrice = maxPrice === '' || price <= parseInt(maxPrice)

    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice
  })

  const resetFilters = () => {
    setSearchQuery('')
    setMinPrice('')
    setMaxPrice('')
    setSelectedCategory('전체')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      {/* 상단 네비게이션 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <h1
              className="text-2xl font-black text-blue-900 tracking-tighter cursor-pointer uppercase italic"
              onClick={() => navigate('/')}
            >
              RIDER MARKET
            </h1>
            <div className="hidden md:flex items-center bg-gray-50 px-5 py-2.5 rounded-2xl w-96 border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input
                type="text"
                placeholder="모델명, 부품 검색..."
                className="bg-transparent outline-none text-sm w-full font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {userName ? (
              <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <span className="text-sm font-black text-blue-900">{userName}님</span>
                <button onClick={handleLogout} className="text-blue-400 hover:text-red-500 transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="text-sm font-black text-gray-400 hover:text-blue-900 transition">LOGIN</button>
            )}
            <button
              onClick={() => navigate('/post')}
              className="bg-blue-900 text-white px-6 py-3 rounded-[1.2rem] font-black hover:bg-black transition shadow-lg shadow-blue-900/10 flex items-center gap-2 text-sm"
            >
              <PlusCircle size={18} /> 판매하기
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex gap-12 p-8 md:p-12">
        {/* 사이드바 필터 */}
        <aside className="hidden lg:block w-64 flex-none">
          <div className="sticky top-28 space-y-10">
            <div>
              <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2 text-lg italic">
                <MapPin size={20} className="text-blue-900" /> LOCATION
              </h3>
              <div className="text-sm font-black text-gray-500 p-5 bg-white border border-gray-100 rounded-[1.5rem] flex justify-between items-center cursor-pointer hover:shadow-xl transition-all group">
                <span>대구광역시 중구</span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-900" />
              </div>
            </div>

            <div>
              <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2 text-lg italic">
                <Filter size={20} className="text-blue-900" /> PRICE RANGE
              </h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="최소 금액"
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-blue-900 font-bold"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="최대 금액"
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-blue-900 font-bold"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
                {(minPrice || maxPrice || searchQuery || selectedCategory !== '전체') && (
                  <button onClick={resetFilters} className="w-full py-3 flex items-center justify-center gap-2 text-[11px] font-black text-red-400 bg-red-50 rounded-2xl hover:bg-red-100 transition">
                    <RefreshCcw size={12} /> RESET FILTERS
                  </button>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2 text-lg italic">
                <Navigation size={20} className="text-blue-900" /> CATEGORY
              </h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[14px] py-3.5 px-5 rounded-2xl cursor-pointer transition-all font-bold ${selectedCategory === cat ? "bg-blue-900 text-white shadow-xl" : "text-gray-400 hover:text-blue-900"}`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* 메인 리스트 영역 */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase">
              {selectedCategory === '전체' ? 'New Arrivals' : selectedCategory}
              <span className="ml-3 text-blue-900 opacity-30 text-xl">{filteredProducts.length}</span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-32 bg-white border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center">
              <PackageSearch size={40} className="text-gray-200 mb-6" />
              <h3 className="text-xl font-black text-gray-900 mb-2">매물을 찾지 못했습니다</h3>
              <button onClick={resetFilters} className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-black text-xs">전체 매물 보기</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-14">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] overflow-hidden relative mb-6 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-500">
                    <img
                      // Entity의 imageUrl 필드 사용
                      src={product.imageUrl ? `http://localhost:8081${product.imageUrl}` : "https://placehold.co/400"}
                      className={`w-full h-full object-cover transition duration-700 group-hover:scale-110 ${product.status === 'SOLD' ? 'grayscale opacity-40' : ''}`}
                      onError={(e) => { e.target.src = "https://placehold.co/400?text=No+Image" }}
                    />
                    {product.status === 'SOLD' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <div className="bg-white/90 px-6 py-2 rounded-full shadow-2xl">
                          <span className="text-black font-black text-[12px] tracking-widest uppercase">Sold Out</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-blue-900 shadow-sm border border-blue-50 uppercase">
                      {product.category}
                    </div>
                  </div>

                  <div className="space-y-2 px-2">
                    <h4 className="font-black text-[19px] text-gray-900 truncate tracking-tight group-hover:text-blue-900 transition">
                      {product.title}
                    </h4>
                    <div className="flex items-center text-gray-400 text-[11px] font-black gap-1.5 uppercase tracking-widest">
                      <MapPin size={12} className="text-blue-900" />
                      <span>{product.address || '대구광역시'}</span>
                    </div>
                    <p className={`text-[24px] font-black mt-3 italic ${product.status === 'SOLD' ? 'text-gray-300 line-through' : 'text-blue-900'}`}>
                      {(product.price || 0).toLocaleString()} <span className="text-sm not-italic font-bold">KRW</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home