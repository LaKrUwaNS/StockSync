package server.stocksyncbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import server.stocksyncbackend.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier,Long> {
}
