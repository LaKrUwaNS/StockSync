package server.stocksyncbackend.service.purches;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import server.stocksyncbackend.dto.mappers.PerchesOrderMapper;
import server.stocksyncbackend.dto.requests.PerchesOderRequest;
import server.stocksyncbackend.dto.responses.CardValuesPurchaseOrder;
import server.stocksyncbackend.dto.responses.PerchesOderResponse;
import server.stocksyncbackend.dto.responses.StickerPrintingDataResponse;
import server.stocksyncbackend.dto.responses.SupplierNameAndIdAndWarehouseNameAndIdResponse;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.model.User;
import server.stocksyncbackend.repository.PurchaseOrderRepository;
import server.stocksyncbackend.repository.SuplierRepository;
import server.stocksyncbackend.repository.UserRepository;
import server.stocksyncbackend.repository.WarehouseRepository;
import server.stocksyncbackend.utils.exception.OrderNotFoundExceptionn;
import server.stocksyncbackend.utils.types.OrderStatus;
import server.stocksyncbackend.utils.exception.SuplierNotFoundException;
import server.stocksyncbackend.utils.exception.WarehouseNotFoundException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerchesOderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SuplierRepository suplierRepository;
    private final UserRepository userRepository;
    private final WarehouseRepository warehouseRepository;

    // Get all the orders
    public List<PerchesOderResponse> getAll() {
        return purchaseOrderRepository.findAll()
                .stream()
                .map(order -> PerchesOderResponse.builder()
                        .ItemName(order.getItemName())
                        .poId(String.valueOf(order.getPoId()))
                        .orderDate(order.getOrderDate())
                        .expectedDeliveryDate(order.getExpectedDeliveryDate())
                        .status(String.valueOf(order.getStatus()))
                        .totalAmount(order.getTotalAmount())

                        .supplierName(
                                order.getSupplier() != null
                                        ? Collections.singletonList(order.getSupplier().getSupplierName())
                                        : Collections.emptyList()
                        )
                        .warehouseLocation(
                                order.getWarehouse() != null
                                        ? Collections.singletonList(order.getWarehouse().getLocation())
                                        : Collections.emptyList()
                        )
                        .createdByUsername(
                                Collections.singletonList(order.getCreatedBy() != null
                                        ? Collections.singletonList(order.getCreatedBy().getUsername())
                                        : Collections.emptyList()).toString()
                        )
                        .build()
                )
                .toList();
    }

    // Get All SuplierId's and warehouseId's
    public SupplierNameAndIdAndWarehouseNameAndIdResponse supplierNameAndIdAndWarehouseNameAndIdResponse() {

        List<String> warehouseData = warehouseRepository.findAllWarehouseNames();
        List<String> supplierData = suplierRepository.findBySupplierName();

        List<Long> warehouseIds = new ArrayList<>();
        List<String> warehouseNames = new ArrayList<>();

        List<Long> supplierIds = new ArrayList<>();
        List<String> supplierNames = new ArrayList<>();

        // Warehouses
        for (String element : warehouseData) {
            String[] parts = element.split(",");
            warehouseNames.add(parts[0].trim());
            warehouseIds.add(Long.valueOf(parts[1].trim()));
        }

        // Suppliers
        for (String element : supplierData) {
            String[] parts = element.split(",");
            supplierNames.add(parts[0].trim());
            supplierIds.add(Long.valueOf(parts[1].trim()));
        }

        return SupplierNameAndIdAndWarehouseNameAndIdResponse.builder()
                .warehouseIds(warehouseIds)
                .warehouseNames(warehouseNames)
                .supplierIds(supplierIds)
                .supplierNames(supplierNames)
                .build();
    }


    // localost:8080/api/v1/perches-oder/create
    // Create a new Perches Oder
    public void createPerchesOder(PerchesOderRequest request, Authentication authentication) throws WarehouseNotFoundException, UsernameNotFoundException ,SuplierNotFoundException {
        warehouseRepository.existsByWarehouseId(request.getWarehouseId()).orElseThrow(
        ()-> new WarehouseNotFoundException("Warehouse not found with id: " + request.getWarehouseId()));

        suplierRepository.existsBySupplierId(request.getSupplierId()).orElseThrow(
        ()-> new SuplierNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        String userName = authentication.getName();
        User user = userRepository.findByUsername(userName).orElseThrow(
                ()-> new UsernameNotFoundException("User not found with username: " + userName)
        );

        PurchaseOrder perchesOder = PerchesOrderMapper.toEntity(request, user);
        purchaseOrderRepository.save(perchesOder);
    }

    // KPI card values
    public CardValuesPurchaseOrder getCardValues(){
        return CardValuesPurchaseOrder.builder()
                .totalValue(purchaseOrderRepository.countTotalPurchaseOrders())
                .totalValue(purchaseOrderRepository.findTotalValueOfAllPurchaseOrders())
                .pendingOrders(purchaseOrderRepository.countByStatus((OrderStatus.PENDING)))
                .receivedOrders(purchaseOrderRepository.countByStatus(OrderStatus.RECEIVED))
                .build();

    }

    // Getting the Stickers Data
    // Getting the Stickers Data
    public List<StickerPrintingDataResponse> getStickersData(
            List<Long> poIds
    ) throws OrderNotFoundExceptionn {

        List<StickerPrintingDataResponse> responses = new ArrayList<>();

        for (Long poId : poIds) {

            PurchaseOrder order = purchaseOrderRepository.findById(poId)
                    .orElseThrow(() ->
                            new OrderNotFoundExceptionn(
                                    "Purchase order not found with id: " + poId
                            )
                    );

            // Optional business rule: only RECEIVED orders
            if (!OrderStatus.PENDING.equals(order.getStatus())) {
                continue;
            }

            StickerPrintingDataResponse response =
                    StickerPrintingDataResponse.builder()
                            .poId(order.getPoId())
                            .supplierName(
                                    order.getSupplier() != null
                                            ? order.getSupplier().getSupplierName()
                                            : "N/A"
                            )
                            .warehouse(
                                    order.getWarehouse() != null
                                            ? order.getWarehouse().getWarehouseName()
                                            : "N/A"
                            )
                            .receivedDate(order.getExpectedDeliveryDate())
                            .build();

            responses.add(response);
        }

        return responses;
    }

    // chaning the stauts of the Perches orders
    public void changingStatesIntoConfirm(Long poId) throws OrderNotFoundExceptionn{
        PurchaseOrder order = purchaseOrderRepository.findById(poId)
                .orElseThrow(() ->
                        new OrderNotFoundExceptionn(
                                "Purchase order not found with id: " + poId
                        )
                );

        order.setStatus(OrderStatus.RECEIVED);
        purchaseOrderRepository.save(order);
    }


}
