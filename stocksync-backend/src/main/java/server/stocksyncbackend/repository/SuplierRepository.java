package server.stocksyncbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import server.stocksyncbackend.model.Supplier;

import java.util.List;
import java.util.Optional;


public interface SuplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Boolean> existsBySupplierId(long supplierId);
    @Query("SELECT supplierName, supplierId FROM Supplier")
    List<String> findBySupplierName();
}
