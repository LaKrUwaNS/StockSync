package server.stocksyncbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import server.stocksyncbackend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
