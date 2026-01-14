package server.stocksyncbackend.controller.purches;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import server.stocksyncbackend.dto.requests.PerchesOderRequest;
import server.stocksyncbackend.dto.requests.SupplierNameAndIdResponse;
import server.stocksyncbackend.dto.requests.WareHouseNameAndIdResponse;
import server.stocksyncbackend.service.purches.NewPurchaseOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/new-purchase-orders")
@RequiredArgsConstructor
@Tag(
        name = "Purchase Orders",
        description = "APIs for managing purchase orders, suppliers, and warehouses"
)
public class PurchaseOrderController {

    private final NewPurchaseOrderService purchaseOrderService;

    // ===============================
    // Get All Supplier Names & IDs
    // ===============================
    @Operation(
            summary = "Get all suppliers",
            description = "Retrieve all supplier names with their corresponding IDs"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Suppliers retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/suppliers")
    public ResponseEntity<List<SupplierNameAndIdResponse>> getAllSuppliers() {
        return ResponseEntity.ok(
                purchaseOrderService.getAllSupplierNamesAndId()
        );
    }

    // =================================
    // Get All Warehouse Locations & IDs
    // =================================
    @Operation(
            summary = "Get all warehouses",
            description = "Retrieve all warehouse locations with their corresponding IDs"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Warehouses retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/warehouses")
    public ResponseEntity<List<WareHouseNameAndIdResponse>> getAllWarehouses() {
        return ResponseEntity.ok(
                purchaseOrderService.getAllWarehouseLocationsAndId()
        );
    }

    // ===============================
    // Create New Purchase Order
    // ===============================
    @Operation(
            summary = "Create a new purchase order",
            description = "Create a new purchase order using supplier, warehouse, and order details"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Purchase order created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Supplier or warehouse not found")
    })
    @PostMapping
    public ResponseEntity<String> createPurchaseOrder(
            @RequestBody PerchesOderRequest request,
            Authentication authentication
    ) {
        purchaseOrderService.createNewPurcheaseOrder(request, authentication);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Purchase order created successfully");
    }
}
