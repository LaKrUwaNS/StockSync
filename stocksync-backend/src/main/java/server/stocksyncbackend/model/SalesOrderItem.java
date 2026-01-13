package server.stocksyncbackend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

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
public class SalesOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long salesOrderItemId;

    @ManyToOne
    private SalesOrder salesOrder;

    @ManyToOne
    private Product product;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}

