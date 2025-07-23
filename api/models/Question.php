<?php
declare(strict_types=1);

class Question
{
    private int $id;
    private string $name;
    private int $orderNumber;
    private int $surveyId;
    private string $type;
    private string $options;

    public function __construct(
        int $id,
        string $name,
        int $orderNumber,
        int $surveyId,
        string $type,
        string $options
    ) {
        $this->id           = $id;
        $this->name         = $name;
        $this->orderNumber  = $orderNumber;
        $this->surveyId     = $surveyId;
        $this->type         = $type;
        $this->options      = $options;
    }

    public function getId(): int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getOrderNumber(): int { return $this->orderNumber; }
    public function getSurveyId(): int { return $this->surveyId; }
    public function getType(): string { return $this->type; }
    public function getOptions(): string { return $this->options; }
}
