<?php
declare(strict_types=1);

require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../services/UserService.php';
require_once __DIR__ . '/../models/User.php';

class LoginController
{
    private UserService $service;

    public function __construct(PDO $db)
    {
        $repo          = new UserRepository($db);
        $this->service = new UserService($repo);
    }

    public function login(array $data = []): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        header('Content-Type: application/json');

        $email = trim($data['email'] ?? '');
        $pass  = $data['password'] ?? '';

        if ($email === '' || $pass === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        try {
            $user = $this->service->login($email, $pass);

            $_SESSION['user'] = $user;

            http_response_code(200);
            echo json_encode([
                'user_id' => $user->getId(),
                'email'   => $user->getEmail(),
            ]);

        } catch (InvalidArgumentException $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
}
