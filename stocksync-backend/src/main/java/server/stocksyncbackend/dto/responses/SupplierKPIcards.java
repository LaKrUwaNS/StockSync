package server.stocksyncbackend.dto.responses;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierKPIcards {
    private Integer TotalSuppliers;
    private Double TotalSpent;
    private Integer TotalStock;
    private Integer OnTimeDeliveryRate;
}
