package com.example.backend.controller;

import com.example.backend.entity.ChatMessage;
import com.example.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // [웹소켓] 메시지 전송 및 브로드캐스팅
    // 프론트에서 /app/chat.sendMessage로 보낸 메시지를 처리함
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        // DB에 실시간 저장
        return chatMessageRepository.save(chatMessage);
    }

    // [REST API] 기존 채팅 내역 불러오기
    @GetMapping("/api/chat/{roomId}")
    public List<ChatMessage> getChatHistory(@PathVariable String roomId) {
        return chatMessageRepository.findByRoomIdOrderByTimestampAsc(roomId);
    }
}