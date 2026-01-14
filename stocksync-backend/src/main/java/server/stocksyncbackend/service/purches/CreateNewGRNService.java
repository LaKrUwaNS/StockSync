package server.stocksyncbackend.service.purches;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import server.stocksyncbackend.dto.requests.CreateGRNRequest;
import server.stocksyncbackend.dto.responses.GrnKPICardResponse;
import server.stocksyncbackend.model.GRN;
import server.stocksyncbackend.model.Product;
import server.stocksyncbackend.model.PurchaseOrder;
import server.stocksyncbackend.repository.GRNRepository;
import server.stocksyncbackend.repository.ProductRepository;
import server.stocksyncbackend.repository.PurchaseOrderRepository;
import server.stocksyncbackend.utils.exception.OrderNotFoundExceptionn;
import server.stocksyncbackend.utils.exception.UnacceptedOrderException;
import server.stocksyncbackend.utils.types.GrnStatus;
import server.stocksyncbackend.utils.types.OrderStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateNewGRNService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final GRNRepository grnRepository;

    @Transactional
    public void createNewGRN(CreateGRNRequest request) {

        PurchaseOrder order = purchaseOrderRepository
                .findById(request.getPoId())
                .orElseThrow(() ->
                        new OrderNotFoundExceptionn("Purchase order not found")
                );

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new UnacceptedOrderException("Only PENDING orders can create a GRN");
        }
        GRN grn = GRN.builder()
                .purchaseOrder(order)
                .GrnNote(request.getGrnNote())
                .status(request.getStatus())
                .build();

        grnRepository.save(grn);

        if (request.getStatus() == GrnStatus.COMPLETED) {

            Product product = Product.builder()
                    .productName(order.getItemName())
                    .sku("SKU-" + System.currentTimeMillis())
                    .category(request.getCategoryStatus())
                    .unitPrice(order.getTotalAmount())
                    .reorderLevel(request.getLocationLevel())
                    .build();

            productRepository.save(product);

            order.setStatus(OrderStatus.RECEIVED);
        }

        purchaseOrderRepository.save(order);
    }

    // ==========================
    // Get Purchase Order by ID
    // ==========================
    public PurchaseOrder getPurchaseOrderDataById(Long purchaseOrderId) {
        return purchaseOrderRepository
                .findById(purchaseOrderId)
                .orElseThrow(() ->
                        new OrderNotFoundExceptionn("Purchase order not found")
                );
    }

    // ==========================
    // KPI Cards Data
    // ==========================
    public GrnKPICardResponse getGrnKPICards() {
        int totalGrns = Math.toIntExact(grnRepository.count());
        int completedGrns = grnRepository.countAllByStatus(GrnStatus.COMPLETED);
        int incompleteGrns = grnRepository.countAllByStatus(GrnStatus.INCOMPLETE);

        return GrnKPICardResponse.builder()
                .totalGrns(completedGrns)
                .IncompleteGrns(incompleteGrns)
                .totalGrns(totalGrns)
                .build();
    }

    // ==========================
    // Get all GRNs
    // ==========================
    public List<GRN> getAllGrnRecords() {
        return grnRepository.findAll();
    }
}
