package server.stocksyncbackend.dto.requests;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import server.stocksyncbackend.utils.types.CaregoryStatus;
import server.stocksyncbackend.utils.types.GrnStatus;
import server.stocksyncbackend.utils.types.LocationLevel;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class CreateGRNRequest {
    @NonNull
    private Long poId;

    private String grnNote;

    @Enumerated(EnumType.STRING)
    private CaregoryStatus CategoryStatus;

    @Enumerated(EnumType.STRING)
    private LocationLevel locationLevel;

    @Enumerated(EnumType.STRING)
    private GrnStatus status;

}
