package server.stocksyncbackend.repository;

import org.apache.catalina.util.ErrorPageSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.model.Supplier;
import server.stocksyncbackend.utils.types.OrderStatus;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder,Long> {
    @Query("SELECT SUM(totalAmount) FROM PurchaseOrder")
    Double findTotalValueOfAllPurchaseOrders();

    @Query("SELECT COUNT(p) FROM PurchaseOrder p")
    long countTotalPurchaseOrders();

    int countByStatus(OrderStatus status);

    ErrorPageSupport existsBySupplier(Supplier supplier);
}
