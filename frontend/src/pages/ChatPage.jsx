import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import {
    Send,
    ArrowLeft,
    MessageCircle,
    MoreVertical,
    User
} from 'lucide-react'

function ChatPage() {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [userName] = useState(localStorage.getItem('userName'))

    // 웹소켓 관련 레퍼런스
    const stompClient = useRef(null)
    const scrollRef = useRef(null)

    // 1. 초기 대화 내역 불러오기 및 웹소켓 연결
    useEffect(() => {
        if (!userName) {
            alert("로그인이 필요합니다.")
            navigate('/login')
            return
        }

        // 기존 채팅 내역 로드 (백엔드 REST API 호출)
        const fetchChatHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/chat/public-room')
                setMessages(res.data)
            } catch (err) {
                console.error("채팅 내역 로딩 실패:", err)
            }
        }
        fetchChatHistory()

        // 웹소켓 연결 설정
        const socket = new SockJS('http://localhost:8081/ws-chat')
        stompClient.current = Stomp.over(socket)

        stompClient.current.connect({}, (frame) => {
            console.log('Connected: ' + frame)

            // /topic/public 채널 구독 (메시지 수신)
            stompClient.current.subscribe('/topic/public', (sdkEvent) => {
                const newMessage = JSON.parse(sdkEvent.body)
                setMessages((prev) => [...prev, newMessage])
            })
        }, (error) => {
            console.error('WebSocket Error: ', error)
        })

        return () => {
            if (stompClient.current) stompClient.current.disconnect()
        }
    }, [userName, navigate])

    // 2. 새 메시지가 올 때마다 스크롤 아래로
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // 3. 메시지 전송
    const sendMessage = (e) => {
        e.preventDefault()
        if (input.trim() && stompClient.current) {
            const chatMessage = {
                sender: userName,
                message: input,
                roomId: 'public-room', // 임시로 통합 방 사용
                timestamp: new Date().toISOString()
            }

            // 백엔드 ChatController의 @MessageMapping("/chat.sendMessage")로 전송
            stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage))
            setInput('')
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* 사이드바: 채팅방 목록 (디자인 유지) */}
            <aside className="w-80 bg-white border-r border-gray-100 flex-none hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-blue-900 italic uppercase">Messages</h2>
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <MessageCircle size={20} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 bg-blue-50/50 border-l-4 border-blue-900 m-2 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100">
                                <User size={24} className="text-blue-900" />
                            </div>
                            <div>
                                <p className="font-black text-sm text-gray-900">라이더 광장</p>
                                <p className="text-[11px] text-blue-600 font-bold italic underline">실시간 접속 중</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 메인 채팅창 */}
            <main className="flex-1 flex flex-col bg-white">
                {/* 헤더 */}
                <nav className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition text-gray-400">
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h3 className="font-black text-gray-900 flex items-center gap-2 italic">
                                라이더 광장 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            </h3>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Live Community Chat</p>
                        </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition">
                        <MoreVertical size={20} />
                    </button>
                </nav>

                {/* 메시지 영역 */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                    {messages.map((msg, idx) => {
                        const isMine = msg.sender === userName
                        return (
                            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                                {!isMine && (
                                    <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-sm border border-gray-100 flex-none mb-1">
                                        <User size={18} />
                                    </div>
                                )}
                                <div className="flex flex-col max-w-[70%]">
                                    {!isMine && <span className="text-[10px] font-black text-gray-400 ml-1 mb-1 uppercase italic">{msg.sender}</span>}
                                    <div className={`px-5 py-3 rounded-[1.8rem] text-sm font-bold shadow-sm leading-relaxed ${isMine
                                            ? 'bg-blue-900 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}>
                                        {msg.message}
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-gray-300 mb-1 italic">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* 입력창 */}
                <form onSubmit={sendMessage} className="p-6 bg-white border-t border-gray-50 flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="안전하고 매너있는 대화를 나눠보세요."
                        className="flex-1 bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-14 h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Send size={22} fill="currentColor" />
                    </button>
                </form>
            </main>
        </div>
    )
}

export default ChatPage