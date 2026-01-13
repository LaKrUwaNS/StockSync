package server.stocksyncbackend.dto.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WareHouseNameAndIdResponse {
    private String name;
    private String id;
}
