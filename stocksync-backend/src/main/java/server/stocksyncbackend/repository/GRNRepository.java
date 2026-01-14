package server.stocksyncbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import server.stocksyncbackend.model.GRN;
import server.stocksyncbackend.utils.types.GrnStatus;

public interface GRNRepository extends JpaRepository<GRN, String> {
    int countAllByStatus(GrnStatus status);
}
