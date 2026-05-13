package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 채팅 연결을 위한 엔드포인트 설정
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins("http://localhost:3000") // 리액트 주소
                .withSockJS(); // 낮은 버전의 브라우저 지원용
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메시지를 구독(수신)하는 경로 설정
        registry.enableSimpleBroker("/topic");
        // 메시지를 발행(송신)하는 경로 설정
        registry.setApplicationDestinationPrefixes("/app");
    }
}