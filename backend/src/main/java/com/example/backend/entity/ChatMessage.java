package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;    // 채팅방 ID (상품ID + 구매자ID 조합 등)
    private String sender;    // 보낸 사람 (userName)
    private String message;   // 메시지 내용
    private LocalDateTime timestamp = LocalDateTime.now(); // 보낸 시간

    // 기본 생성자
    public ChatMessage() {}

    // 편의를 위한 생성자
    public ChatMessage(String roomId, String sender, String message) {
        this.roomId = roomId;
        this.sender = sender;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}