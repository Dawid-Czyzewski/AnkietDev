<?php
declare(strict_types=1);

class LogoutController
{
    public function logout(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        header('Content-Type: application/json');

        if (!isset($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Not logged in']);
            return;
        }

        unset($_SESSION['user']);

        session_regenerate_id(true);

        http_response_code(200);
        echo json_encode(['message' => 'Successfully logged out']);
    }
}
