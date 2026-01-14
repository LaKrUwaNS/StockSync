package server.stocksyncbackend.model;

import jakarta.persistence.*;
import lombok.*;
import server.stocksyncbackend.utils.types.GrnStatus;
import server.stocksyncbackend.utils.types.LocationLevel;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GRN {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime receivedDate = LocalDateTime.now();

    private String GrnNote;

    @Enumerated(EnumType.STRING)
    private GrnStatus status;

    @Enumerated(EnumType.STRING)
    private LocationLevel inspectionLevel;

    @OneToOne
    private PurchaseOrder purchaseOrder;

}
