package server.stocksyncbackend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import server.stocksyncbackend.utils.types.OrderStatus;

@Entity
@Table(name = "purchase_order")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long poId;

    private String ItemName;

    private LocalDate orderDate;

    private LocalDate expectedDeliveryDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal totalAmount;

    @ManyToOne
    private Supplier supplier;

    @ManyToOne
    private User createdBy;

    @ManyToOne
    private Warehouse warehouse;
}

