package server.stocksyncbackend.model;

import jakarta.persistence.*;
import lombok.*;
import server.stocksyncbackend.utils.types.GrnStatus;
import server.stocksyncbackend.utils.types.LocationLevel;

import java.time.LocalDate;

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

    private LocalDate receivedDate = LocalDate.now();

    private String GrnNote;

    @Enumerated(EnumType.STRING)
    private GrnStatus status;

    @Enumerated(EnumType.STRING)
    private LocationLevel inspectionLevel;

    @OneToOne
    private PurchaseOrder purchaseOrder;

}
