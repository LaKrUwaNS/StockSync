package server.stocksyncbackend.dto.responses;

import lombok.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierResponse {
    private long supplierId;
    private String supplierName;
    private String phone;
    private String email;
    private Integer leanTime;

    private Integer TotalOders;
    private BigDecimal TotalSpent;
    private Integer LeadTime;
}
