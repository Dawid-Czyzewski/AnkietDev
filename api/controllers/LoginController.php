<?php

declare(strict_types=1);

require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../services/UserService.php';
require_once __DIR__ . '/../models/User.php';

class LoginController
{
    private const REQUIRED_FIELDS = ['email', 'password'];
    private const SUCCESS_MESSAGE = 'Login successful';
    private const ERROR_MESSAGES = [
        'validation' => 'Email and password are required',
        'server_error' => 'Internal server error'
    ];

    private UserService $service;

    public function __construct(PDO $db)
    {
        $repo = new UserRepository($db);
        $this->service = new UserService($repo);
    }

    public function login(array $data = []): void
    {
        $this->initializeSession();
        $this->setJsonHeader();
        
        try {
            $validatedData = $this->validateLoginData($data);
            $user = $this->processLogin($validatedData);
            $this->createUserSession($user);
            $this->sendSuccessResponse($user);
        } catch (InvalidArgumentException $e) {
            $this->sendErrorResponse(401, $e->getMessage());
        } catch (Throwable $e) {
            $this->logError($e);
            $this->sendErrorResponse(500, self::ERROR_MESSAGES['server_error']);
        }
    }

    private function initializeSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 31536000);
            ini_set('session.gc_maxlifetime', 31536000);
            session_start();
        }
    }

    private function setJsonHeader(): void
    {
        header('Content-Type: application/json');
    }

    private function validateLoginData(array $data): array
    {
        $validatedData = [];
        
        foreach (self::REQUIRED_FIELDS as $field) {
            $value = trim($data[$field] ?? '');
            
            if (empty($value)) {
                throw new InvalidArgumentException(self::ERROR_MESSAGES['validation']);
            }
            
            $validatedData[$field] = $value;
        }

        if (!$this->isValidEmail($validatedData['email'])) {
            throw new InvalidArgumentException('Invalid email address format');
        }

        return $validatedData;
    }

    private function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function processLogin(array $data): User
    {
        return $this->service->login($data['email'], $data['password']);
    }

    private function createUserSession(User $user): void
    {
        $_SESSION['user'] = $user;
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_email'] = $user->getEmail();
        $_SESSION['logged_in'] = true;
    }

    private function sendSuccessResponse(User $user): void
    {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => self::SUCCESS_MESSAGE,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail()
            ],
            'debug' => [
                'session_id' => session_id(),
                'session_data' => $_SESSION
            ]
        ]);
    }

    private function sendErrorResponse(int $statusCode, string $message): void
    {
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }

    private function logError(Throwable $e): void
    {
        error_log(sprintf(
            'Login error: %s in %s:%d',
            $e->getMessage(),
            $e->getFile(),
            $e->getLine()
        ));
    }
}
