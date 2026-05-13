package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository // 이 어노테이션이 있어야 스프링이 관리하기 편합니다.
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 1. 로그인 및 사용자 조회를 위한 메서드
     * 이메일(아이디)로 사용자 정보를 한 건 찾아옵니다.
     */
    Optional<User> findByEmail(String email);

    /**
     * 2. 회원가입 중복 확인을 위한 메서드
     * 이메일이 이미 존재하는지 true/false로 바로 알려줍니다. (성능상 더 좋음)
     */
    boolean existsByEmail(String email);
}