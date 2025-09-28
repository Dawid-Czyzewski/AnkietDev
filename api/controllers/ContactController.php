<?php

require_once __DIR__ . '/../database/config.php';
require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/src/SMTP.php';
require_once __DIR__ . '/../PHPMailer/src/Exception.php';

class ContactController
{
    private const REQUIRED_FIELDS = ['name', 'email', 'message'];
    private const EMAIL_SUBJECT = 'New contact form message from AnkietDev';
    private const SUCCESS_MESSAGE = 'Message sent successfully.';
    private const ERROR_MESSAGES = [
        'validation' => 'All fields are required.',
        'email_invalid' => 'Invalid email address.',
        'send_failed' => 'Failed to send email.'
    ];

    public function send(array $data = []): void
    {
        $this->setJsonHeader();
        
        try {
            $validatedData = $this->validateContactData($data);
            $this->sendEmail($validatedData);
            $this->sendSuccessResponse();
        } catch (InvalidArgumentException $e) {
            $this->sendErrorResponse(400, $e->getMessage());
        } catch (Exception $e) {
            $this->sendErrorResponse(500, self::ERROR_MESSAGES['send_failed']);
        }
    }

    private function setJsonHeader(): void
    {
        header('Content-Type: application/json');
    }

    private function validateContactData(array $data): array
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
            throw new InvalidArgumentException(self::ERROR_MESSAGES['email_invalid']);
        }

        return $validatedData;
    }

    private function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function sendEmail(array $data): void
    {
        $mailConfig = $this->getMailConfiguration();
        $mailer = $this->createMailerInstance($mailConfig);
        
        $this->configureMailer($mailer, $mailConfig);
        $this->setEmailContent($mailer, $data);
        
        $mailer->send();
    }

    private function getMailConfiguration(): array
    {
        return require __DIR__ . '/../database/mailer_config.php';
    }

    private function createMailerInstance(array $config): PHPMailer\PHPMailer\PHPMailer
    {
        $mailer = new PHPMailer\PHPMailer\PHPMailer(true);
        
        $mailer->isSMTP();
        $mailer->Host = $config['smtp_host'];
        $mailer->SMTPAuth = true;
        $mailer->Username = $config['smtp_user'];
        $mailer->Password = $config['smtp_pass'];
        $mailer->SMTPSecure = $config['smtp_secure'];
        $mailer->Port = $config['smtp_port'];
        
        return $mailer;
    }

    private function configureMailer(PHPMailer\PHPMailer\PHPMailer $mailer, array $config): void
    {
        $mailer->setFrom($config['from_email'], $config['from_name']);
        $mailer->addAddress(CONTACT_EMAIL);
        $mailer->isHTML(false);
    }

    private function setEmailContent(PHPMailer\PHPMailer\PHPMailer $mailer, array $data): void
    {
        $mailer->Subject = self::EMAIL_SUBJECT;
        $mailer->Body = $this->formatEmailBody($data);
        $mailer->addReplyTo($data['email'], $data['name']);
    }

    private function formatEmailBody(array $data): string
    {
        return sprintf(
            "Name: %s\nEmail: %s\nMessage:\n%s",
            $data['name'],
            $data['email'],
            $data['message']
        );
    }

    private function sendSuccessResponse(): void
    {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => self::SUCCESS_MESSAGE
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
}
