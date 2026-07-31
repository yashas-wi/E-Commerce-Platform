package com.practice.ecommerceplatform.repository;

import com.practice.ecommerceplatform.entity.User;
//import org.hibernate.internal.util.Optional;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}
