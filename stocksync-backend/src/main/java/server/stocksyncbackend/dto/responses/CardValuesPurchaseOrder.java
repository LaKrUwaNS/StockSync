package server.stocksyncbackend.dto.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardValuesPurchaseOrder {
    private int totalOrders;
    private double totalValue;
    private int pendingOrders;
    private int receivedOrders;
}
