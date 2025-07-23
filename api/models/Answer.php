<?php
declare(strict_types=1);

class Answer
{
    private ?int   $id;
    private int    $surveyId;
    private int    $questionId;
    private string $answerText;

    public function __construct(
        ?int $id,
        int $surveyId,
        int $questionId,
        string $answerText
    ) {
        $this->id         = $id;
        $this->surveyId   = $surveyId;
        $this->questionId = $questionId;
        $this->answerText = $answerText;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSurveyId(): int
    {
        return $this->surveyId;
    }

    public function getQuestionId(): int
    {
        return $this->questionId;
    }

    public function getAnswerText(): string
    {
        return $this->answerText;
    }
}
