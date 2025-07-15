package com.phoenixfitness.service;

import com.phoenixfitness.dto.ProductRequest;
import com.phoenixfitness.entity.Category;
import com.phoenixfitness.entity.Product;
import com.phoenixfitness.repository.CategoryRepository;
import com.phoenixfitness.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllProducts(String search, Long categoryId, String sortBy) {
        return productRepository.findProductsWithFilters(search, categoryId, sortBy);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setMaterial(request.getMaterial());
        product.setWarranty(request.getWarranty());
        product.setRating(request.getRating());
        product.setReviewCount(request.getReviewCount());
        product.setDiscount(request.getDiscount());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setMaterial(request.getMaterial());
        product.setWarranty(request.getWarranty());
        product.setRating(request.getRating());
        product.setReviewCount(request.getReviewCount());
        product.setDiscount(request.getDiscount());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}