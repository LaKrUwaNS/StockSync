package server.stocksyncbackend.dto.responses;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GrnKPICardResponse {
    private int totalGrns;
    private int pendingGrns;
    private int IncompleteGrns;
}
