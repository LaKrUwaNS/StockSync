package server.stocksyncbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import server.stocksyncbackend.model.Warehouse;

import java.util.List;
import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    Optional<Boolean> existsByWarehouseId(long warehouseId);

    @Query("SELECT warehouseName, warehouseId FROM Warehouse")
    List<String> findAllWarehouseNames();
}
