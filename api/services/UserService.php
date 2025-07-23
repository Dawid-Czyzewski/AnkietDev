<?php
declare(strict_types=1);

require_once __DIR__ . '/../repositories/UserRepository.php';

class UserService
{
    private UserRepository $repo;

    public function __construct(UserRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * @throws InvalidArgumentException
     */
    public function register(string $email, string $plainPassword): User
    {
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email format');
        }
        if (strlen($plainPassword) < 8) {
            throw new InvalidArgumentException('Password must be at least 8 characters');
        }

        if ($this->repo->findByEmail($email) !== null) {
            throw new InvalidArgumentException('Email already exists');
        }

        $user = new User($email, $plainPassword);
        return $this->repo->save($user);
    }

    /**
     * @throws InvalidArgumentException
     */
    public function login(string $email, string $plainPassword): User
    {
        $user = $this->repo->findByEmail($email);
        if ($user === null) {
            throw new InvalidArgumentException('Invalid email or password');
        }

        if (!password_verify($plainPassword, $user->getPasswordHash())) {
            throw new InvalidArgumentException('Invalid email or password');
        }

        return $user;
    }
}
