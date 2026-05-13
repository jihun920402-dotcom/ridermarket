package com.example.backend.repository;

import com.example.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 특정 사용자가 올린 상품만 가져오기 (sellerEmail은 본인 구조에 맞게 체크)
    // Product 엔티티에 작성자 정보가 없다면 추가가 필요할 수 있습니다.
    List<Product> findByAddressContaining(String address); // 우선 예시로 주소 기반 검색
}