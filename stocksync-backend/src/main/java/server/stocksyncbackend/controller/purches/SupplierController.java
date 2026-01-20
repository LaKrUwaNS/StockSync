package server.stocksyncbackend.controller.purches;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.stocksyncbackend.dto.requests.CreateSupplierRequest;
import server.stocksyncbackend.dto.requests.SupplierEditRequest;
import server.stocksyncbackend.dto.responses.SupplierKPIcards;
import server.stocksyncbackend.dto.responses.SupplierResponse;
import server.stocksyncbackend.service.purches.SupplierService;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@Tag(name = "Supplier Management", description = "APIs for managing suppliers and supplier KPIs")
public class SupplierController {

    private final SupplierService supplierService;

    // ================= GET ALL SUPPLIERS =================
    @Operation(
            summary = "Get all suppliers",
            description = "Fetch all suppliers along with order statistics such as total orders, total spent, and average lead time"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Suppliers fetched successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SupplierResponse.class)
                    )
            )
    })
    @GetMapping
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    // ================= UPDATE SUPPLIER =================
    @Operation(
            summary = "Edit supplier details",
            description = "Update supplier name, contact details, email, phone, and lead time"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Supplier updated successfully"),
            @ApiResponse(responseCode = "404", description = "Supplier not found")
    })
    @PutMapping
    public ResponseEntity<Void> editSupplier(
            @RequestBody SupplierEditRequest supplierEditRequest
    ) {
        supplierService.editSupplierData(supplierEditRequest);
        return ResponseEntity.ok().build();
    }

    // ================= DELETE SUPPLIER =================
    @Operation(
            summary = "Delete supplier",
            description = "Delete a supplier by supplier ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Supplier deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Supplier not found")
    })
    @DeleteMapping("/{supplierId}")
    public ResponseEntity<Void> deleteSupplier(
            @PathVariable Long supplierId
    ) {
        supplierService.deleteSupplier(supplierId);
        return ResponseEntity.noContent().build();
    }

    // ================= KPI CARDS =================
    @Operation(
            summary = "Get supplier KPI cards",
            description = "Retrieve supplier KPI data such as total suppliers and total spent"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "KPI data fetched successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SupplierKPIcards.class)
                    )
            )
    })
    @GetMapping("/kpi")
    public ResponseEntity<SupplierKPIcards> getSupplierKPIs() {
        return new ResponseEntity<>(supplierService.getCardData(), HttpStatus.OK);
    }

    // ================= CREATE NEW SUPPLIER =================
    @Operation(
            summary = "Create a new supplier",
            description = "Add a new supplier with details such as name, contact info, phone, email, and lead time"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Supplier created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid supplier data")
    })
    @PostMapping("/create")
    public ResponseEntity<Void> createSupplier(@RequestBody CreateSupplierRequest supplier) {
        supplierService.createNewSupplier(supplier);
        return ResponseEntity.status(HttpStatus.CREATED).build();
}
}