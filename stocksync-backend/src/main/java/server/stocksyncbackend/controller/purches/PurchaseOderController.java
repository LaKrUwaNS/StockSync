package server.stocksyncbackend.controller.purches;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import server.stocksyncbackend.dto.requests.PerchesOderRequest;
import server.stocksyncbackend.dto.responses.PerchesOderResponse;
import server.stocksyncbackend.dto.responses.StickerPrintingDataResponse;
import server.stocksyncbackend.service.purches.PerchesOderService;
import server.stocksyncbackend.utils.exception.OrderNotFoundExceptionn;
import server.stocksyncbackend.utils.exception.SuplierNotFoundException;
import server.stocksyncbackend.utils.exception.WarehouseNotFoundException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/purchase-orders")
@Tag(name = "Purchase Orders", description = "APIs for managing purchase orders")
public class PurchaseOderController {

    private final PerchesOderService perchesOderService;

    // GET ALL PURCHASE ORDERS
    @Operation(
            summary = "Get all purchase orders",
            description = "Retrieve a list of all purchase orders"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Purchase orders retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<List<PerchesOderResponse>> getAllPurchaseOrders() {
        return ResponseEntity.ok(perchesOderService.getAll());
    }

    // GET FORM DATA
    @Operation(
            summary = "Get purchase order form data",
            description = "Retrieve supplier and warehouse IDs and names for purchase order form"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Form data retrieved successfully")
    })
    @GetMapping("/form-data")
    public ResponseEntity<?> getPurchaseOrderFormData() {
        return ResponseEntity.ok(
                perchesOderService.supplierNameAndIdAndWarehouseNameAndIdResponse()
        );
    }

    // localhost:8080/api/purchase-orders
    // CREATE PURCHASE ORDER
    @Operation(
            summary = "Create a new purchase order",
            description = "Create a purchase order using authenticated user details"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Purchase order created successfully"),
            @ApiResponse(responseCode = "404", description = "Supplier or Warehouse not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized user")
    })
    @PostMapping
    public ResponseEntity<?> createPurchaseOrder(
            @RequestBody PerchesOderRequest perchesOderRequest,
            Authentication authentication
    ) throws WarehouseNotFoundException, UsernameNotFoundException, SuplierNotFoundException {

        perchesOderService.createPerchesOder(perchesOderRequest, authentication);
        return ResponseEntity.ok("Purchase Order Created Successfully");
    }

    // lcoalhost:8080/api/purchase-orders/card-values
    // GET CARD VALUES
    @Operation(
            summary = "Get purchase order dashboard card values",
            description = "Retrieve summary values for purchase order dashboard cards"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Card values retrieved successfully")
    })
    @GetMapping("/card-values")
    public ResponseEntity<?> getPurchaseOrderCardValues() {
        return ResponseEntity.ok(perchesOderService.getCardValues());
    }

    // localhost:8080/api/purchase-orders/stickers
    @Operation(
            summary = "Get sticker printing data for purchase orders",
            description = "Retrieve sticker printing data for confirmed purchase orders using purchase order IDs"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Sticker printing data retrieved successfully",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Sticker Printing Data Example",
                                    value = "[{" +
                                            "\"poId\":1001," +
                                            "\"supplierName\":\"ABC Industrial Supplies Pvt Ltd\"," +
                                            "\"warehouse\":\"Central Warehouse - Colombo\"," +
                                            "\"receivedDate\":\"2026-01-10\"" +
                                            "}]"
                            )
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Invalid purchase order IDs"),
            @ApiResponse(responseCode = "404", description = "Purchase order not found")
    })
    @PostMapping("/stickers")
    public ResponseEntity<List<StickerPrintingDataResponse>> getStickerPrintingData(
            @Parameter(
                    description = "List of purchase order IDs",
                    example = "[1001,1002]"
            )
            @RequestBody List<Long> poIds
    ) throws OrderNotFoundExceptionn {

        return ResponseEntity.ok(
                perchesOderService.getStickersData(poIds)
        );
    }



    @PostMapping("/ChangeReceiveStatus")
    public ResponseEntity<?> changeReceiveStatus(
            @RequestParam Long poId
    ) throws OrderNotFoundExceptionn {
        perchesOderService.changingStatesIntoConfirm(poId);
        return ResponseEntity.ok("Purchase Order Status Changed to RECEIVED");
    }

}
