package com.example.backend.controller;

import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // 리액트(Vite) 기본 포트로 수정
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@ModelAttribute Product product) {
        // 💡 로그 추가: 프론트에서 데이터가 하나라도 누락되면 여기서 바로 보입니다.
        System.out.println("상품 등록 요청 수신: " + product.toString());

        if (product.getStatus() == null || product.getStatus().isEmpty()) {
            product.setStatus("SALE");
        }

        Product saved = productRepository.save(product);
        System.out.println("DB 저장 완료. ID: " + saved.getId());
        return saved;
    }

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty())
            return null;

        try {
            System.out.println("설정된 업로드 경로: " + uploadDir);

            // ✅ 수정 1: 경로 끝에 / 보장
            String safeUploadDir = uploadDir.endsWith(File.separator)
                    ? uploadDir
                    : uploadDir + File.separator;

            File folder = new File(safeUploadDir);

            // ✅ 폴더 없으면 생성
            if (!folder.exists()) {
                System.out.println("폴더가 없어 새로 생성합니다: " + safeUploadDir);
                folder.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String savedFilename = UUID.randomUUID().toString() + extension;

            File targetFile = new File(folder, savedFilename);
            file.transferTo(targetFile);

            System.out.println("파일 저장 완료: " + targetFile.getAbsolutePath());

            // ✅ 이건 이미 잘 되어 있음 (유지)
            return "/uploads/" + savedFilename;

        } catch (Exception e) {
            System.err.println("파일 업로드 중 에러 발생!");
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다. ID: " + id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Product> updateProductStatus(@PathVariable Long id, @RequestBody String status) {
        return productRepository.findById(id).map(product -> {
            String cleanStatus = status.replace("\"", "");
            product.setStatus(cleanStatus);
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok("삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
        }

    }

    // 2. 게시글 수정 (Update)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("price") int price,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        return productRepository.findById(id).map(product -> {
            product.setTitle(title);
            product.setCategory(category);
            product.setPrice(price);
            product.setDescription(description);

            // 새로운 이미지가 넘어온 경우에만 이미지 경로 변경
            if (image != null && !image.isEmpty()) {
                String imagePath = saveImage(image); // 기존 이미지 저장 로직 재활용
                product.setImageUrl(imagePath);
            }

            productRepository.save(product);
            return ResponseEntity.ok("수정 완료");
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 📸 이미지를 서버에 저장하고 경로를 반환하는 공통 메서드
    private String saveImage(MultipartFile image) {
        try {
            // 1. 저장할 경로 설정 (기존에 쓰시던 경로가 있다면 그걸로 바꾸세요)
            String uploadDir = "C:/uploads/products/";
            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists())
                dir.mkdirs(); // 폴더 없으면 생성

            // 2. 파일명 중복 방지를 위해 현재 시간 붙이기
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + fileName);

            // 3. 파일 저장
            java.nio.file.Files.copy(image.getInputStream(), filePath);

            // 4. DB에 저장할 웹 경로 반환 (예: /uploads/123_image.jpg)
            return "/uploads/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 저장 중 오류 발생");
        }
    }
}
