package com.phoenixfitness.repository;

import com.phoenixfitness.entity.Product;
import com.phoenixfitness.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategory(Category category);
    
    List<Product> findByCategoryId(Long categoryId);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByBrand(String brand);
    
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) " +
           "ORDER BY " +
           "CASE WHEN :sortBy = 'name' THEN p.name END ASC, " +
           "CASE WHEN :sortBy = 'price' THEN p.price END ASC, " +
           "CASE WHEN :sortBy = 'rating' THEN p.rating END DESC")
    List<Product> findProductsWithFilters(@Param("search") String search, 
                                        @Param("categoryId") Long categoryId, 
                                        @Param("sortBy") String sortBy);
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findInStockProducts();
    
    @Query("SELECT p FROM Product p ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts();
}