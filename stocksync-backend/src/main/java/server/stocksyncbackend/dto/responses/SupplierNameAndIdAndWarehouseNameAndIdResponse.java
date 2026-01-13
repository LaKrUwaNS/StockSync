package server.stocksyncbackend.dto.responses;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierNameAndIdAndWarehouseNameAndIdResponse {
    private List<Long> warehouseIds;
    private List<String> warehouseNames;

    private List<Long> supplierIds;
    private List<String> supplierNames;
}
