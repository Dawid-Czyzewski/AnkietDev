<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Question.php';

class QuestionRepository
{
    private \PDO $db;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    /**
     * @return Question[]
     */
    public function findBySurvey(int $surveyId): array
    {
        $sql = "
            SELECT id,
                name,
                order_number,
                survey_id,
                type,
                options      -- tutaj bierzemy cały string
            FROM questions
            WHERE survey_id = :surveyId
            ORDER BY order_number ASC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['surveyId' => $surveyId]);
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(function(array $r) {
            return new Question(
                (int)   $r['id'],
                $r['name'],
                (int)   $r['order_number'],
                (int)   $r['survey_id'],
                $r['type'],
                (string)$r['options']
            );
        }, $rows);
    }
}
