package server.stocksyncbackend.service.purches;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import server.stocksyncbackend.dto.requests.PerchesOderRequest;
import server.stocksyncbackend.dto.requests.SupplierNameAndIdResponse;
import server.stocksyncbackend.dto.requests.WareHouseNameAndIdResponse;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.model.Supplier;
import server.stocksyncbackend.model.Warehouse;
import server.stocksyncbackend.repository.PurchaseOrderRepository;
import server.stocksyncbackend.repository.SuplierRepository;
import server.stocksyncbackend.repository.UserRepository;
import server.stocksyncbackend.repository.WarehouseRepository;
import server.stocksyncbackend.utils.exception.SuplierNotFoundException;
import server.stocksyncbackend.utils.exception.WarehouseNotFoundException;
import server.stocksyncbackend.utils.types.OrderStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewPurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SuplierRepository suplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final UserRepository userRepository;

    // Get All Supplier Names
    public List<SupplierNameAndIdResponse> getAllSupplierNamesAndId(){
        List<Supplier> supplier = suplierRepository.findAll();
        return supplier.stream()
                .map(s -> new SupplierNameAndIdResponse(s.getSupplierName(), String.valueOf(s.getSupplierId())))
                .toList();
    }

    // Get All Warehouse Locations
    public List<WareHouseNameAndIdResponse> getAllWarehouseLocationsAndId(){
        List<Warehouse> warehouses = warehouseRepository.findAll();
        return warehouses.stream()
                .map(w -> new WareHouseNameAndIdResponse(w.getLocation(), String.valueOf(w.getWarehouseId())))
                .toList();
    }

    // Create New Purchase Order
    public void createNewPurcheaseOrder(PerchesOderRequest request, Authentication authentication) {
        Supplier supplier = suplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new SuplierNotFoundException(
                        "Supplier not found with id: " + request.getSupplierId()
                ));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new WarehouseNotFoundException(
                        "Warehouse not found with id: " + request.getWarehouseId()
                ));

        userRepository.findByUsername(authentication.getName()).orElseThrow(
                ()-> new SuplierNotFoundException("User not found with username: " + authentication.getName()));

        PurchaseOrder order = PurchaseOrder.builder()
                .createdBy(userRepository.findByUsername(authentication.getName()).get())
                .ItemName(request.getItemName())
                .orderDate(request.getOrderDate())
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .status(OrderStatus.valueOf(request.getStatus()))
                .totalAmount(request.getTotalAmount())
                .supplier(suplierRepository.findById(request.getSupplierId()).get())
                .warehouse(warehouseRepository.findById(request.getWarehouseId()).get())
                .build();

        purchaseOrderRepository.save(order);
    }



}
