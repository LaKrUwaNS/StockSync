package server.stocksyncbackend.model;

import jakarta.persistence.*;
import lombok.*;
import server.stocksyncbackend.utils.types.CaregoryStatus;
import server.stocksyncbackend.utils.types.LocationLevel;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;
    private String sku;

    @Enumerated(EnumType.STRING)
    private CaregoryStatus category;
    private BigDecimal unitPrice;

    @Enumerated(EnumType.STRING)
    private LocationLevel reorderLevel;
}
