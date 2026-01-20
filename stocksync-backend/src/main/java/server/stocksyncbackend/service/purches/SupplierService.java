package server.stocksyncbackend.service.purches;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import server.stocksyncbackend.dto.requests.CreateSupplierRequest;
import server.stocksyncbackend.dto.requests.SupplierEditRequest;
import server.stocksyncbackend.dto.responses.SupplierKPIcards;
import server.stocksyncbackend.dto.responses.SupplierResponse;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.model.Supplier;
import server.stocksyncbackend.repository.PurchaseOrderRepository;
import server.stocksyncbackend.repository.SupplierRepository;
import server.stocksyncbackend.utils.types.OrderStatus;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public List<SupplierResponse> getAllSuppliers() {

        List<Supplier> suppliers = supplierRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

        List<PurchaseOrder> validOrders = orders.stream()
                .filter(order -> order.getSupplier() != null)
                .toList();

        Map<Long, List<PurchaseOrder>> ordersBySupplier =
                validOrders.stream()
                        .collect(Collectors.groupingBy(
                                order -> order.getSupplier().getSupplierId()
                        ));

        return suppliers.stream().map(supplier -> {

            List<PurchaseOrder> supplierOrders =
                    ordersBySupplier.getOrDefault(
                            supplier.getSupplierId(),
                            Collections.emptyList()
                    );

            int totalOrders = supplierOrders.size();

            BigDecimal totalSpent = supplierOrders.stream()
                    .map(PurchaseOrder::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            int avgLeadTime = supplierOrders.isEmpty() ? 0 :
                    (int) supplierOrders.stream()
                            .filter(po ->
                                    po.getOrderDate() != null &&
                                            po.getExpectedDeliveryDate() != null
                            )
                            .mapToLong(po ->
                                    ChronoUnit.DAYS.between(
                                            po.getOrderDate(),
                                            po.getExpectedDeliveryDate()
                                    )
                            )
                            .average()
                            .orElse(0);

            return SupplierResponse.builder()
                    .supplierId(supplier.getSupplierId())
                    .supplierName(supplier.getSupplierName())
                    .phone(supplier.getPhone())
                    .email(supplier.getEmail())
                    .leanTime(supplier.getLeanTime())
                    .TotalOders(totalOrders)
                    .TotalSpent(totalSpent)
                    .LeadTime(avgLeadTime)
                    .build();

        }).toList();
    }

    // Edit he supplier data
    public void editSupplierData(SupplierEditRequest supplier) {
        supplierRepository.findById(supplier.getSupplierId()).ifPresent(
                old -> {
                    old.setPhone(supplier.getPhone());
                    old.setEmail(supplier.getEmail());
                    old.setLeanTime(supplier.getLeanTime());
                    old.setSupplierName(supplier.getSupplierName());
                    old.setContactInfo(supplier.getContactInfo());
                    supplierRepository.save(old);
                }
        );
    }

    // Create new Supplier
    public void createNewSupplier(CreateSupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .supplierName(request.getSupplierName())
                .contactInfo(request.getContactInfo())
                .phone(request.getPhone())
                .email(request.getEmail())
                .build();
        supplierRepository.save(supplier);
    }


    // delete supplier by id
    public void deleteSupplier(Long supplierId) {
        supplierRepository.deleteById(supplierId);
    }

    // KPI data
    public SupplierKPIcards getCardData() {

        double totalSpent = 0;

        if (supplierRepository.count() > 0) {
            totalSpent = purchaseOrderRepository.findAll().stream()
                    .filter(po -> po.getSupplier() != null)
                    .map(PurchaseOrder::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .doubleValue();
        }

        long totalOrders = purchaseOrderRepository.count();
        long receivedOrders = purchaseOrderRepository.countByStatus(OrderStatus.RECEIVED);

        double onTimeDeliveryRate = totalOrders == 0
                ? 0
                : (receivedOrders * 100.0) / totalOrders;

        return SupplierKPIcards.builder()
                .TotalSuppliers((int) supplierRepository.count())
                .TotalSpent(totalSpent)
                .TotalStock((int) totalOrders)
                .OnTimeDeliveryRate((int) onTimeDeliveryRate)
                .build();
    }

}
