package com.example.backend.config;

import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepo,
                                     ProductRepository productRepo,
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepo.count() > 0) return;

            // 샘플 유저 3명
            User u1 = new User();
            u1.setEmail("kim@test.com");
            u1.setPassword(passwordEncoder.encode("1234"));
            u1.setName("김라이더");
            u1.setPhone("010-1111-2222");
            u1.setAddress("서울시 강남구");
            userRepo.save(u1);

            User u2 = new User();
            u2.setEmail("lee@test.com");
            u2.setPassword(passwordEncoder.encode("1234"));
            u2.setName("이바이크");
            u2.setPhone("010-3333-4444");
            u2.setAddress("서울시 마포구");
            userRepo.save(u2);

            User u3 = new User();
            u3.setEmail("park@test.com");
            u3.setPassword(passwordEncoder.encode("1234"));
            u3.setName("박오토");
            u3.setPhone("010-5555-6666");
            u3.setAddress("경기도 성남시");
            userRepo.save(u3);

            // 샘플 상품 9개
            String[][] products = {
                {"혼다 CB500F 2021", "오토바이", "5800000", "주행거리 8,000km, 사고 이력 없음. 상태 아주 좋습니다.", "서울시 강남구", "판매중", "1", "김라이더"},
                {"야마하 MT-07 2020", "오토바이", "7200000", "주행거리 12,000km. 풀 서비스 기록 있음.", "서울시 마포구", "판매중", "2", "이바이크"},
                {"BMW G310R 2022", "오토바이", "6500000", "거의 새것. 주행거리 3,500km.", "경기도 성남시", "판매중", "3", "박오토"},
                {"오거나이저 탑박스 45L", "부품/용품", "85000", "알루미늄 재질, 범용 장착 가능. 사용감 있으나 기능 이상 없음.", "서울시 강남구", "판매중", "1", "김라이더"},
                {"AGV K6 헬멧 M사이즈", "헬멧", "320000", "6개월 사용. 스크래치 없음. 정품 보증서 포함.", "서울시 마포구", "판매중", "2", "이바이크"},
                {"RST 가죽 라이딩 자켓 L", "의류", "150000", "1시즌 착용. 프로텍터 포함. 블랙 컬러.", "경기도 성남시", "판매중", "3", "박오토"},
                {"가우다 USB 충전 핸들바 마운트", "부품/용품", "35000", "고속 충전 지원. 방수 커버 포함. 미개봉.", "서울시 강남구", "판매중", "1", "김라이더"},
                {"카와사키 Z400 2019", "오토바이", "5200000", "주행거리 18,000km. 타이어 최근 교체.", "서울시 마포구", "예약중", "2", "이바이크"},
                {"드래그스페셜티 쇼트 윈드쉴드", "부품/용품", "55000", "범용 핏. 설치 간편. 투명 아크릴.", "경기도 성남시", "판매중", "3", "박오토"},
            };

            for (String[] p : products) {
                Product product = new Product();
                product.setTitle(p[0]);
                product.setCategory(p[1]);
                product.setPrice(Integer.parseInt(p[2]));
                product.setDescription(p[3]);
                product.setAddress(p[4]);
                product.setStatus(p[5]);
                product.setUserId(Long.parseLong(p[6]));
                product.setWriter(p[7]);
                productRepo.save(product);
            }
        };
    }
}
