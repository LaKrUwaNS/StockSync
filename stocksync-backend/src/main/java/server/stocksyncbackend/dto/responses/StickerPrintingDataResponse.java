package server.stocksyncbackend.dto.responses;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StickerPrintingDataResponse {
    // Use consistent, camelCase property names that map cleanly to JSON
    private Long poId;
    private String supplierName;
    private String warehouse;
    private LocalDate receivedDate;
}
