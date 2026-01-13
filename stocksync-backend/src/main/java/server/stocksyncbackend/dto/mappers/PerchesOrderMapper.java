package server.stocksyncbackend.dto.mappers;

import org.springframework.stereotype.Component;
import server.stocksyncbackend.dto.requests.PerchesOderRequest;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.model.User;
import server.stocksyncbackend.utils.types.OrderStatus;

import java.time.LocalDate;

@Component
public class PerchesOrderMapper {

    public static PurchaseOrder toEntity(PerchesOderRequest perchesOderRequest, User user) {
        return PurchaseOrder.builder()
                .ItemName(perchesOderRequest.getItemName())
                .orderDate(perchesOderRequest.getOrderDate() != null ? perchesOderRequest.getOrderDate() : LocalDate.now())
                .expectedDeliveryDate(perchesOderRequest.getExpectedDeliveryDate())
                .status(OrderStatus.valueOf(perchesOderRequest.getStatus()))
                .createdBy(user)
                .totalAmount(perchesOderRequest.getTotalAmount())
                .build();
    }
}
