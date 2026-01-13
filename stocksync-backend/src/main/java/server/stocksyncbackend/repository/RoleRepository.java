package server.stocksyncbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import server.stocksyncbackend.model.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(String roleName);
}
