<?php
declare(strict_types=1);

class Survey
{
    private int $id;
    private string $title;
    private \DateTime $createdDate;
    private ?\DateTime $expireDate;
    private int $userId;

    public function __construct(
        int $id,
        string $title,
        \DateTime $createdDate,
        ?\DateTime $expireDate,
        int $userId
    ) {
        $this->id           = $id;
        $this->title        = $title;
        $this->createdDate  = $createdDate;
        $this->expireDate   = $expireDate;
        $this->userId       = $userId;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getCreatedDate(): \DateTime
    {
        return $this->createdDate;
    }

    public function getExpireDate(): ?\DateTime
    {
        return $this->expireDate;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }
}