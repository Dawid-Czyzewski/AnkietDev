<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Answer.php';
require_once __DIR__ . '/../repositories/AnswerRepository.php';
require_once __DIR__ . '/../repositories/QuestionRepository.php';

class AnswerService
{
    private AnswerRepository   $answerRepo;
    private QuestionRepository $questionRepo;

    public function __construct(
        AnswerRepository $answerRepo,
        QuestionRepository $questionRepo
    ) {
        $this->answerRepo   = $answerRepo;
        $this->questionRepo = $questionRepo;
    }

    public function getAnswersByQuestionId(int $questionId): array
    {
        return $this->answerRepo->findByQuestionId($questionId);
    }

    public function getAnswersBySurveyId(int $surveyId): array
    {
        return $this->answerRepo->findBySurveyId($surveyId);
    }

    public function submitAnswers(int $surveyId, array $answersPayload): void
    {
        if (empty($answersPayload)) {
            throw new \InvalidArgumentException('Brak odpowiedzi do zapisania.');
        }

        $questions = $this->questionRepo->findBySurvey($surveyId);
        $validIds  = array_map(fn($q) => $q->getId(), $questions);

        $models = [];
        foreach ($answersPayload as $idx => $item) {
            if (!isset($item['questionId'], $item['answer'])) {
                throw new \InvalidArgumentException("Element #{$idx} musi zawierać questionId i answer.");
            }

            $qid  = (int) $item['questionId'];
            $text = trim((string) $item['answer']);

            if (!in_array($qid, $validIds, true)) {
                throw new \InvalidArgumentException("QuestionId {$qid} nie należy do surveyId {$surveyId}.");
            }

            if ($text === '') {
                throw new \InvalidArgumentException("Odpowiedź dla questionId {$qid} nie może być pusta.");
            }
            if (mb_strlen($text) > 500) {
                throw new \InvalidArgumentException("Odpowiedź dla questionId {$qid} jest zbyt długa (max 500 znaków).");
            }

            $models[] = new Answer(null, $surveyId, $qid, $text);
        }

        $this->answerRepo->saveAll($models);
    }
}
