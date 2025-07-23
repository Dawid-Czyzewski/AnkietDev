<?php
declare(strict_types=1);

require_once __DIR__ . '/../services/UserService.php';

class RegisterController
{
    private UserService $service;

    public function __construct(PDO $db)
    {
        $repo          = new UserRepository($db);
        $this->service = new UserService($repo);
    }

    public function register(array $data = []): void
    {
        header('Content-Type: application/json');

        $email = trim($data['email'] ?? '');
        $pass  = $data['password'] ?? '';

        if ($email === '' || $pass === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        try {
            $user = $this->service->register($email, $pass);
            http_response_code(201);
            echo json_encode([
                'user_id' => $user->getId(),
                'email'   => $user->getEmail(),
            ]);
        } catch (InvalidArgumentException $e) {
            http_response_code(409);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (Throwable $e) {
            print_r($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
}