package server.stocksyncbackend.dto.responses;

import lombok.*;
import server.stocksyncbackend.utils.types.GrnStatus;
import server.stocksyncbackend.utils.types.LocationLevel;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GrnResponse {
    private Long id;
    private Long Poid;
    private String receivedDate;
    private String grnNote;
    private GrnStatus status;
    private String receivedBy;
    private Long notes;
    private LocationLevel inspectionLevel;
}
