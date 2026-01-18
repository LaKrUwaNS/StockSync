package server.stocksyncbackend.dto.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierEditRequest {
    private long supplierId;
    private String supplierName;
    private String contactInfo;
    private String phone;
    private String email;
    private Integer leanTime;
}
