<?php
declare(strict_types=1);

class LogoutController
{
    public function logout(): void
    {
        try {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            header('Content-Type: application/json');

            if (isset($_SESSION['user'])) {
                unset($_SESSION['user']);
            }
            if (isset($_SESSION['user_id'])) {
                unset($_SESSION['user_id']);
            }
            if (isset($_SESSION['user_email'])) {
                unset($_SESSION['user_email']);
            }
            if (isset($_SESSION['logged_in'])) {
                unset($_SESSION['logged_in']);
            }

            session_regenerate_id(true);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);

        } catch (Throwable $e) {
            error_log('Logout error: ' . $e->getMessage());
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Logged out (with errors)'
            ]);
        }
    }
}
