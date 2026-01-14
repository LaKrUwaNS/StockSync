package server.stocksyncbackend.controller.purches;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import server.stocksyncbackend.dto.requests.CreateGRNRequest;
import server.stocksyncbackend.dto.responses.GrnKPICardResponse;
import server.stocksyncbackend.model.GRN;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.service.purches.CreateNewGRNService;

import java.util.List;

@RestController
@RequestMapping("/api/grns")
@RequiredArgsConstructor
@Tag(
        name = "GRN Management",
        description = "APIs for managing Goods Received Notes (GRN)"
)
public class GRNController {

    private final CreateNewGRNService grnService;

    // ==================================================
    // Create New GRN
    // ==================================================

    @Operation(
            summary = "Create a new GRN",
            description = "Creates a GRN for a PENDING purchase order. " +
                    "If GRN status is COMPLETED, the product is added to store inventory."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "GRN created successfully"),
            @ApiResponse(responseCode = "400", description = "Order not in PENDING state"),
            @ApiResponse(responseCode = "404", description = "Purchase order not found")
    })
    @PostMapping
    public ResponseEntity<String> createNewGrn(
            @RequestBody CreateGRNRequest request
    ) {
        grnService.createNewGRN(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("GRN created successfully");
    }

    // ==================================================
    // Get Purchase Order by ID
    // ==================================================

    @Operation(
            summary = "Get purchase order details",
            description = "Fetch purchase order information using purchase order ID"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Purchase order retrieved successfully",
                    content = @Content(schema = @Schema(implementation = PurchaseOrder.class))
            ),
            @ApiResponse(responseCode = "404", description = "Purchase order not found")
    })
    @GetMapping("/purchase-orders/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(
            @PathVariable("id") Long purchaseOrderId
    ) {
        return ResponseEntity.ok(
                grnService.getPurchaseOrderDataById(purchaseOrderId)
        );
    }

    // ==================================================
    // GRN KPI Cards
    // ==================================================

    @Operation(
            summary = "Get GRN KPI cards",
            description = "Returns KPI statistics related to GRNs for dashboard views"
    )
    @ApiResponse(
            responseCode = "200",
            description = "KPI data retrieved successfully",
            content = @Content(schema = @Schema(implementation = GrnKPICardResponse.class))
    )
    @GetMapping("/kpi")
    public ResponseEntity<GrnKPICardResponse> getGrnKPICards() {
        return ResponseEntity.ok(grnService.getGrnKPICards());
    }

    // ==================================================
    // Get All GRNs
    // ==================================================

    @Operation(
            summary = "Get all GRNs",
            description = "Fetch all Goods Received Notes from the system"
    )
    @ApiResponse(
            responseCode = "200",
            description = "GRN list retrieved successfully"
    )
    @GetMapping
    public ResponseEntity<List<GRN>> getAllGrns() {
        return ResponseEntity.ok(grnService.getAllGrnRecords());
    }
}