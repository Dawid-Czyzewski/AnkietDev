<?php

require_once __DIR__ . '/../database/config.php';
require_once __DIR__ . '/../PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/src/SMTP.php';
require_once __DIR__ . '/../PHPMailer/src/Exception.php';

class ContactController
{
    public function send(array $data = []): void
    {
        header('Content-Type: application/json');

        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $message = trim($data['message'] ?? '');
 
        if ($name === '' || $email === '' || $message === '') {
            http_response_code(400);
            echo json_encode(['error' => 'All fields are required.']);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email address.']);
            return;
        }

        $mailConfig = require __DIR__ . '/../database/mailer_config.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
        try {
            $mail->isSMTP();
            $mail->Host       = $mailConfig['smtp_host'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $mailConfig['smtp_user'];
            $mail->Password   = $mailConfig['smtp_pass'];
            $mail->SMTPSecure = $mailConfig['smtp_secure'];
            $mail->Port       = $mailConfig['smtp_port'];

            $mail->setFrom($mailConfig['from_email'], $mailConfig['from_name']);
            $mail->addAddress(CONTACT_EMAIL);
            $mail->addReplyTo($email, $name);

            $mail->isHTML(false);
            $mail->Subject = 'New contact form message from AnkietDev';
            $mail->Body    = "Name: $name\nEmail: $email\nMessage:\n$message";

            $mail->send();
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to send email.']);
        }
    }
}
