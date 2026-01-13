package server.stocksyncbackend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movementId;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Warehouse warehouse;

    private String movementType; // IN, OUT, TRANSFER
    private Integer quantity;
    private LocalDateTime movementDate;
    private String referenceId;

    @ManyToOne
    private User performedBy;
}
