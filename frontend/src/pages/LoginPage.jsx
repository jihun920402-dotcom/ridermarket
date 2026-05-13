import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      console.log("로그인 응답 전체:", res.data); // 1단계: 구조 확인용

      if (res.data) {
        // 2단계: 객체 그대로 저장하지 않고 반드시 JSON.stringify 사용
        // 백엔드가 { user: { id... } } 로 주는지 { id... } 로 주는지에 상관없이 저장
        localStorage.setItem('user', JSON.stringify(res.data));

        alert(`반갑습니다!`);
        navigate('/');
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("정보를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100 relative">
        <button onClick={() => navigate('/')} className="absolute left-6 top-10 text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-blue-900 mb-2 italic tracking-tighter">RIDER MARKET</h1>
          <p className="text-gray-500 font-medium">로그인 후 다양한 매물을 확인하세요.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              required
            />
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              required
            />
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : '로그인'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm font-bold">
          계정이 없으신가요? <Link to="/signup" className="text-blue-600 hover:underline ml-1">회원가입</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage