package server.stocksyncbackend.dto.requests;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PerchesOderRequest {

    private LocalDate orderDate;

    private String ItemName;

    private LocalDate expectedDeliveryDate;

    private String status;

    private BigDecimal totalAmount;

    private Long supplierId;

    private Long warehouseId;
}
