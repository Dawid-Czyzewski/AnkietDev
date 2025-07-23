<?php
declare(strict_types=1);

class User
{
    private int $id;
    private string $email;
    private string $passwordHash;

    public function __construct(string $email, string $plainPassword)
    {
        $this->email        = $email;
        $this->passwordHash = password_hash($plainPassword, PASSWORD_ARGON2ID);
    }

    public static function fromRow(array $row): self
    {
        $user = new self($row['email'], '__dummy__');
        $user->id           = (int)$row['id'];
        $user->passwordHash = $row['password_hash'];
        return $user;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function verifyPassword(string $plain): bool
    {
        return password_verify($plain, $this->passwordHash);
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function __serialize(): array
    {
        return [
            'id'           => $this->id,
            'email'        => $this->email,
            'passwordHash' => $this->passwordHash,
        ];
    }

    public function __unserialize(array $data): void
    {
        $this->id           = $data['id'];
        $this->email        = $data['email'];
        $this->passwordHash = $data['passwordHash'];
    }
}
