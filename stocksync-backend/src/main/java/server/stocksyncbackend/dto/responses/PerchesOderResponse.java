package server.stocksyncbackend.dto.responses;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PerchesOderResponse {
    private String poId;
    private String ItemName;
    private LocalDate orderDate;
    private LocalDate expectedDeliveryDate;
    private String status;
    private BigDecimal totalAmount;
    private List<String> supplierName;
    private String createdByUsername;
    private List<String> warehouseLocation;
}
