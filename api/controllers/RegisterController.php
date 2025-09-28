<?php

declare(strict_types=1);

require_once __DIR__ . '/../services/UserService.php';

class RegisterController
{
    private const REQUIRED_FIELDS = ['email', 'password'];
    private const SUCCESS_MESSAGE = 'User registered successfully';
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

    public function register(array $data = []): void
    {
        $this->setJsonHeader();
        
        try {
            $validatedData = $this->validateRegistrationData($data);
            $user = $this->processRegistration($validatedData);
            $this->sendSuccessResponse($user);
        } catch (InvalidArgumentException $e) {
            $this->sendErrorResponse(409, $e->getMessage());
        } catch (Throwable $e) {
            $this->logError($e);
            $this->sendErrorResponse(500, self::ERROR_MESSAGES['server_error']);
        }
    }

    private function setJsonHeader(): void
    {
        header('Content-Type: application/json');
    }

    private function validateRegistrationData(array $data): array
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

        if (!$this->isValidPassword($validatedData['password'])) {
            throw new InvalidArgumentException('Password must be at least 6 characters long');
        }

        return $validatedData;
    }

    private function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function isValidPassword(string $password): bool
    {
        return strlen($password) >= 6;
    }

    private function processRegistration(array $data): User
    {
        return $this->service->register($data['email'], $data['password']);
    }

    private function sendSuccessResponse(User $user): void
    {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => self::SUCCESS_MESSAGE,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail()
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
            'Registration error: %s in %s:%d',
            $e->getMessage(),
            $e->getFile(),
            $e->getLine()
        ));
    }
}