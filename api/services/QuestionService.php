<?php
declare(strict_types=1);

require_once __DIR__ . '/../repositories/QuestionRepository.php';
require_once __DIR__ . '/../models/Question.php';

class QuestionService
{
    private QuestionRepository $repo;

    public function __construct(QuestionRepository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * @return Question[]
     */
    public function getQuestionsBySurvey(int $surveyId): array
    {
        return $this->repo->findBySurvey($surveyId);
    }
}
