<?php
declare(strict_types=1);

require_once __DIR__ . '/../repositories/SurveyRepository.php';
require_once __DIR__ . '/../services/SurveyService.php';
require_once __DIR__ . '/../models/Survey.php';
require_once __DIR__ . '/../repositories/AnswerRepository.php';
require_once __DIR__ . '/../services/AnswerService.php';
require_once __DIR__ . '/../models/Answer.php';
require_once __DIR__ . '/../models/Question.php';

class SurveyController
{
    private SurveyService $service;
    private AnswerService $answerService;

    public function __construct(PDO $db)
    {
        $repo           = new SurveyRepository($db);
        $this->service  = new SurveyService($repo);
        $this->answerService = new AnswerService(new AnswerRepository($db), new QuestionRepository($db));
    }

    public function list(array $data = []): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 31536000);
            ini_set('session.gc_maxlifetime', 31536000);
            session_start();
        }

        header('Content-Type: application/json');

        if (empty($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_SESSION['user']->getId();

        try {
            $surveys = $this->service->getSurveysByUser($userId);
            
            $output = array_map(function(Survey $survey) {
                $questions = $this->service->getQuestionsBySurveyId($survey->getId());
                
                $outputQuestions = array_map(function(Question $q) {
                    $answers = $this->answerService->getAnswersByQuestionId($q->getId());
                    return [
                        'id' => $q->getId(),
                        'text' => $q->getName(),
                        'orderNumber' => $q->getOrderNumber(),
                        'type' => $q->getType(),
                        'options' => $q->getOptions(),
                        'answers' => array_map(function(Answer $a) {
                            return [
                                'id' => $a->getId(),
                                'surveyId' => $a->getSurveyId(),
                                'questionId' => $a->getQuestionId(),
                                'text' => $a->getAnswerText(),
                            ];
                        }, $answers)
                    ];
                }, $questions);

                return [
                    'id' => $survey->getId(),
                    'title' => $survey->getTitle(),
                    'createdDate' => $survey->getCreatedDate()->format(\DateTime::ATOM),
                    'expireDate' => $survey->getExpireDate()?->format(\DateTime::ATOM),
                    'userId' => $survey->getUserId(),
                    'questions' => $outputQuestions
                ];
            }, $surveys);

            http_response_code(200);
            echo json_encode($output);

        } catch (\Throwable $e) {
            error_log((string)$e);
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function get(array $data = []): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 31536000);
            ini_set('session.gc_maxlifetime', 31536000);
            session_start();
        }

        $surveyIdRaw = $data['id'] ?? null;

        if ($surveyIdRaw === null || !ctype_digit(strval($surveyIdRaw))) {
            http_response_code(400);
            echo json_encode(['error' => 'Survey ID must be a valid integer']);
            return;
        }

        $surveyId = (int)$surveyIdRaw;
        header('Content-Type: application/json');
  
        $currentUserId = (isset($_SESSION['user']) && is_object($_SESSION['user'])) ? $_SESSION['user']->getId() : null;

        try {
           
            $survey = $this->service->getSurveyById($surveyId);
            if (!$survey) {
                http_response_code(404);
                echo json_encode(['error' => 'Survey not found']);
                return;
            }

            $ownerId  = $survey->getUserId();
            $isOwner  = ($currentUserId !== null && $ownerId === $currentUserId);

            if (!$isOwner) {
                $expireDate = $survey->getExpireDate();
                if ($expireDate instanceof \DateTime && $expireDate < new \DateTime()) {
                    http_response_code(410);
                    echo json_encode(['error' => 'Survey has expired']);
                    return;
                }
            }

            $questions = $this->service->getQuestionsBySurveyId($survey->getId());

            $outputQuestions = array_map(function(Question $q) use ($isOwner) {
                $base = [
                    'id'          => $q->getId(),
                    'text'        => $q->getName(),
                    'orderNumber' => $q->getOrderNumber(),
                    'type'        => $q->getType(),
                    'options'     => $q->getOptions(),
                ];

                if ($isOwner) {
                    $answers = $this->answerService->getAnswersByQuestionId($q->getId());
                    $base['answers'] = array_map(function(Answer $a) {
                        return [
                            'id'         => $a->getId(),
                            'surveyId'   => $a->getSurveyId(),
                            'questionId' => $a->getQuestionId(),
                            'text'       => $a->getAnswerText(),
                        ];
                    }, $answers);
                }

                return $base;
            }, $questions);

            $output = [
                'id'        => $survey->getId(),
                'title'     => $survey->getTitle(),
                'questions' => $outputQuestions,
            ];

            http_response_code(200);
            echo json_encode($output);

        } catch (\Throwable $e) {
            error_log((string)$e);
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function delete(array $data = []): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 31536000);
            ini_set('session.gc_maxlifetime', 31536000);
            session_start();
        }

        header('Content-Type: application/json');

        if (empty($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_SESSION['user']->getId();

        $surveyId = $data['id'] ?? null;
        if (! $surveyId) {
            http_response_code(400);
            echo json_encode(['error' => 'Survey ID is required']);
            return;
        }

        $survey = $this->service->getSurveyById($surveyId);
        if (! $survey) {
            http_response_code(404);
            echo json_encode(['error' => 'Survey not found']);
            return;
        }

        if ($survey->getUserId() !== $userId) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        try {
            $this->service->deleteSurvey($surveyId);
            http_response_code(204);
            echo json_encode(['message' => 'Survey deleted successfully']);

        } catch (\InvalidArgumentException $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

     public function submit(array $data = []): void
    {
        header('Content-Type: application/json');

        $payload = json_decode(file_get_contents('php://input'), true);
        if (!is_array($payload)) {
            http_response_code(400);
            echo json_encode(['error' => 'Nieprawidłowy JSON']);
            return;
        }

        $surveyId = isset($payload['surveyId']) ? (int)$payload['surveyId'] : null;
        $answers  = $payload['answers'] ?? null;

        if (!$surveyId || !is_array($answers)) {
            http_response_code(422);
            echo json_encode(['error' => 'surveyId i answers są wymagane']);
            return;
        }

        try {
            $this->answerService->submitAnswers($surveyId, $answers);
            http_response_code(201);
            echo json_encode(['message' => 'Answers saved successfully',"success" => true]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function update(array $data = []): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 31536000);
            ini_set('session.gc_maxlifetime', 31536000);
            session_start();
        }

        header('Content-Type: application/json');

        if (empty($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_SESSION['user']->getId();

        $payload = json_decode(file_get_contents('php://input'), true);
        if (!is_array($payload)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            return;
        }

        $surveyId      = $payload['id'] ?? null;
        $title         = trim((string)($payload['title'] ?? ''));
        $hasExpiration = (bool)($payload['hasExpiration'] ?? false);
        $expireDateStr = $payload['expireDate'] ?? null;
        $questions     = $payload['questions'] ?? [];
       
        if (!$surveyId) {
            http_response_code(400);
            echo json_encode(['error' => 'Survey ID is required']);
            return;
        }
        if ($title === '') {
            http_response_code(422);
            echo json_encode(['error' => 'Title is required']);
            return;
        }

        $survey = $this->service->getSurveyById($surveyId);
        if (!$survey) {
            http_response_code(404);
            echo json_encode(['error' => 'Survey not found']);
            return;
        }

        if ($survey->getUserId() !== $userId) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }

        $expireDate = null;
      
        if ($hasExpiration) {
           
            if (!$expireDateStr) {
                http_response_code(422);
                echo json_encode(['error' => 'Expiration date required']);
                return;
            }

            try {
                $expireDate = new \DateTime($expireDateStr);
            } catch (\Exception $e) {
                http_response_code(422);
                echo json_encode(['error' => 'Invalid expiration date']);
                return;
            }
        }

        if (!is_array($questions)) {
            http_response_code(422);
            echo json_encode(['error' => 'Questions must be an array']);
            return;
        }

        foreach ($questions as $idx => $q) {
            if (!isset($q['text']) || trim($q['text']) === '') {
                http_response_code(422);
                echo json_encode(['error' => "Question #{$idx} text is required"]);
                return;
            }
            if (in_array($q['type'], ['select', 'radio'], true)) {
                if (empty($q['options']) || !is_array($q['options'])) {
                    http_response_code(422);
                    echo json_encode(['error' => "Question #{$idx} options are required"]);
                    return;
                }
            }
        }

        try {
            $updated = $this->service->updateSurvey(
                $surveyId,
                $title,
                $expireDate,
                $questions
            );

            $response = [
                'id'          => $updated->getId(),
                'title'       => $updated->getTitle(),
                'createdDate' => $updated->getCreatedDate()->format(\DateTime::ATOM),
                'expireDate'  => $updated->getExpireDate()?->format(\DateTime::ATOM),
                'userId'      => $updated->getUserId(),
                'questions'   => array_map(function(Question $q) {
                    return [
                        'id'          => $q->getId(),
                        'text'        => $q->getName(),
                        'orderNumber' => $q->getOrderNumber(),
                        'type'        => $q->getType(),
                        'options'     => $q->getOptions(),
                    ];
                }, $this->service->getQuestionsBySurveyId($updated->getId())),
            ];

            http_response_code(200);
            echo json_encode($response);

        } catch (\InvalidArgumentException $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()]);

        } catch (\Throwable $e) {
            print_r($e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function create(array $data = []): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_lifetime', 31536000);
            ini_set('session.gc_maxlifetime', 31536000);
            session_start();
        }

        header('Content-Type: application/json');

        if (empty($_SESSION['user'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $userId = $_SESSION['user']->getId();

        $payload = json_decode(file_get_contents('php://input'), true);
        if (! is_array($payload)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            return;
        }

        $title         = trim($payload['title'] ?? '');
        $hasExpiration = (bool) ($payload['hasExpiration'] ?? false);
        $expireDateStr = $payload['expirationDate'] ?? null;
        $questions     = $payload['questions'] ?? [];

        if ($title === '') {
            http_response_code(422);
            echo json_encode(['error' => 'Title is required']);
            return;
        }
        if ($hasExpiration) {
            if (! $expireDateStr) {
                http_response_code(422);
                echo json_encode(['error' => 'Expiration date required']);
                return;
            }
            try {
                $expireDt = new \DateTime($expireDateStr);
            } catch (\Exception $e) {
                http_response_code(422);
                echo json_encode(['error' => 'Invalid expiration date']);
                return;
            }
        } else {
            $expireDt = null;
        }

        try {
            $survey = $this->service->createSurvey(
                $userId,
                $title,
                $expireDt,
                $questions
            );

            $response = [
                'id'          => $survey->getId(),
                'title'       => $survey->getTitle(),
                'createdDate' => $survey->getCreatedDate()->format(\DateTime::ATOM),
                'expireDate'  => $survey->getExpireDate() 
                    ? $survey->getExpireDate()->format(\DateTime::ATOM) 
                    : null,
                'userId'      => $survey->getUserId(),
            ];

            http_response_code(201);
            echo json_encode($response);

        } catch (\InvalidArgumentException $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()]);

        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
}
