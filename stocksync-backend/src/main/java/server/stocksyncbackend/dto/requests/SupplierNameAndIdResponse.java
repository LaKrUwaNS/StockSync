package server.stocksyncbackend.dto.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierNameAndIdResponse {
    private String name;
    private String id;
}
