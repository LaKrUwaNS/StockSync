package server.stocksyncbackend.dto.requests;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateSupplierRequest {
    private String supplierName;
    private String contactInfo;
    private String phone;
    private String email;
}
