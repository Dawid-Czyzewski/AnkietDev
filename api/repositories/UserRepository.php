<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/User.php';

class UserRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->db->prepare('SELECT id, password as password_hash, email FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? User::fromRow($row) : null;
    }

    public function save(User $user): User
    {
        $stmt = $this->db->prepare('
            INSERT INTO users (email, password)
            VALUES (:email, :hash)
        ');
        $ok = $stmt->execute([
            'email' => $user->getEmail(),
            'hash'  => $user->getPasswordHash(),
        ]);

        if (! $ok) {
            throw new RuntimeException('Failed to save user');
        }

        $reflection = new ReflectionClass($user);
        $prop = $reflection->getProperty('id');
        $prop->setAccessible(true);
        $prop->setValue($user, (int)$this->db->lastInsertId());

        return $user;
    }
}
