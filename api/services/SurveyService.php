<?php
declare(strict_types=1);

require_once __DIR__ . '/../repositories/SurveyRepository.php';
require_once __DIR__ . '/../models/Survey.php';

class SurveyService
{
    private SurveyRepository $repo;

    public function __construct(SurveyRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * @return Survey[]
     */
    public function getSurveysByUser(int $userId): array
    {
        return $this->repo->findByUser($userId);
    }

    public function getQuestionsBySurveyId(int $surveyId): array
    {
        return $this->repo->getQuestionsBySurveyId($surveyId);
    }

    public function getSurveyById(int $surveyId): ?Survey
    {
        return $this->repo->findById($surveyId);
    }

    public function deleteSurvey(int $surveyId): bool
    {
        return $this->repo->deleteSurvey($surveyId);
    }

    public function createSurvey(
        int $userId,
        string $title,
        ?\DateTime $expireDate = null,
        array $questionsPayload
    ): Survey {
        return $this->repo->createSurveyWithQuestions(
            $userId,
            $title,
            $expireDate,
            $questionsPayload
        );
    }

    public function updateSurvey(
        int $surveyId,
        string $title,
        ?\DateTime $expireDate,
        array $questionsPayload
    ): Survey {
        $survey = $this->repo->findById($surveyId);
        if (! $survey) {
            throw new \InvalidArgumentException("Survey with ID {$surveyId} not found");
        }

        if (trim($title) === '') {
            throw new \InvalidArgumentException('Title cannot be empty');
        }

        return $this->repo->updateSurveyWithQuestions(
            $surveyId,
            $title,
            $expireDate,
            $questionsPayload
        );
    }
}
