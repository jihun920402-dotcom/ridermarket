import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { User, Mail, Lock, Phone, MapPin, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

function SignupPage() {
  const navigate = useNavigate()

  // 1. 상태 관리 (필드 확장)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isEmailChecked, setIsEmailChecked] = useState(false) // 중복확인 여부
  const [isEmailAvailable, setIsEmailAvailable] = useState(null) // 사용가능 여부
  const [passwordMatch, setPasswordMatch] = useState(true) // 비번 일치 여부

  // 2. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // 이메일 수정 시 중복확인 상태 초기화
    if (name === 'email') {
      setIsEmailChecked(false)
      setIsEmailAvailable(null)
    }

    // 비밀번호 일치 실시간 체크
    if (name === 'password' || name === 'confirmPassword') {
      const p1 = name === 'password' ? value : formData.password
      const p2 = name === 'confirmPassword' ? value : formData.confirmPassword
      setPasswordMatch(p1 === p2)
    }
  }

  // 3. 이메일 중복 확인 로직
  const handleCheckEmail = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      alert('올바른 이메일 형식을 입력해 주세요.');
      return;
    }

    try {
      // 주소 뒤에 직접 붙이는 방식보다 params를 사용하는 것이 더 안전합니다.
      const res = await axios.get(`http://localhost:8081/api/users/check-email`, {
        params: { email: formData.email }
      });

      const isExists = res.data; // 백엔드에서 넘어온 true/false

      if (isExists) {
        setIsEmailAvailable(false);
        setIsEmailChecked(false);
      } else {
        setIsEmailAvailable(true);
        setIsEmailChecked(true);
      }
    } catch (err) {
      console.error(err);
      alert('중복 확인 중 에러가 발생했습니다. 서버 연결을 확인하세요.');
    }
  };

  // 4. 회원가입 제출 로직
  const handleSignup = async (e) => {
    e.preventDefault()

    if (!isEmailChecked) return alert('이메일 중복 확인을 진행해 주세요.')
    if (!passwordMatch) return alert('비밀번호가 일치하지 않습니다.')

    setIsLoading(true)
    try {
      // 가입 시에는 confirmPassword를 제외하고 전송
      const { confirmPassword, ...signupData } = formData
      await axios.post('http://localhost:8081/api/users/signup', signupData)

      alert('라이더 마켓의 가족이 되신 것을 환영합니다!')
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert(err.response?.data || '회원가입 실패. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 relative">

        <button onClick={() => navigate(-1)} className="absolute left-8 top-10 text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-blue-900 mb-2">회원가입</h1>
          <p className="text-gray-500 font-medium">라이더 마켓의 새로운 가족이 되어주세요!</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">

          {/* 이름 */}
          <div className="relative">
            <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all" required />
            <User className="absolute left-4 top-4 text-gray-300" size={18} />
          </div>

          {/* 이메일 & 중복확인 */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-4 text-gray-300" size={18} />
                <input type="email" name="email" placeholder="이메일 주소" value={formData.email} onChange={handleChange} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all" required />
              </div>
              <button type="button" onClick={handleCheckEmail} className="px-4 bg-gray-900 text-white text-xs font-bold rounded-2xl hover:bg-blue-900 transition-colors">
                중복확인
              </button>
            </div>
            {isEmailAvailable === true && <p className="text-[11px] text-blue-600 font-bold ml-2 flex items-center gap-1"><CheckCircle2 size={12} /> 사용 가능한 이메일입니다.</p>}
            {isEmailAvailable === false && <p className="text-[11px] text-red-500 font-bold ml-2 flex items-center gap-1"><AlertCircle size={12} /> 이미 가입된 이메일입니다.</p>}
          </div>

          {/* 비밀번호 & 확인 */}
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-300" size={18} />
              <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100" required />
            </div>
            <div className="relative">
              <Lock className={`absolute left-4 top-4 ${passwordMatch ? 'text-gray-300' : 'text-red-400'}`} size={18} />
              <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleChange} className={`w-full p-4 pl-12 bg-gray-50 border rounded-2xl outline-none focus:ring-2 transition-all ${passwordMatch ? 'border-gray-100 focus:ring-blue-100' : 'border-red-200 focus:ring-red-100'}`} required />
            </div>
            {!passwordMatch && <p className="text-[11px] text-red-500 font-bold ml-2 flex items-center gap-1"><AlertCircle size={12} /> 비밀번호가 일치하지 않습니다.</p>}
          </div>

          {/* 전화번호 */}
          <div className="relative">
            <Phone className="absolute left-4 top-4 text-gray-300" size={18} />
            <input type="text" name="phone" placeholder="전화번호 (010-0000-0000)" value={formData.phone} onChange={handleChange} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100" required />
          </div>

          {/* 주소 */}
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-gray-300" size={18} />
            <input type="text" name="address" placeholder="거주 지역 (예: 대구광역시 중구)" value={formData.address} onChange={handleChange} className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-900 text-white font-black py-5 rounded-[2rem] hover:bg-black transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 mt-4 text-lg">
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : '가입 완료하기'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm font-medium">
          이미 계정이 있으신가요? <Link to="/login" className="text-blue-600 font-black ml-1 border-b-2 border-blue-100">로그인</Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage