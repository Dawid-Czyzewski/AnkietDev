<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Answer.php';

class AnswerRepository
{
    private \PDO $db;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    public function save(Answer $answer): void
    {
        $sql = "
            INSERT INTO answers (survey_id, question_id, answer_text)
            VALUES (:surveyId, :questionId, :answerText)
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'surveyId'   => $answer->getSurveyId(),
            'questionId' => $answer->getQuestionId(),
            'answerText' => $answer->getAnswerText(),
        ]);
    }

    public function saveAll(array $answers): void
    {
        $this->db->beginTransaction();
        try {
            foreach ($answers as $answer) {
                $this->save($answer);
            }
            $this->db->commit();
        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

     public function findBySurveyId(int $surveyId): array
    {
        $stmt = $this->db->prepare("
            SELECT id, survey_id, question_id, answer_text
              FROM answers
             WHERE survey_id = :sid
        ");
        $stmt->execute([':sid' => $surveyId]);
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(fn(array $r) => new Answer(
            (int)$r['id'],
            (int)$r['survey_id'],
            (int)$r['question_id'],
            $r['answer_text']
        ), $rows);
    }

     public function deleteByQuestionId(int $questionId): void
    {
        $stmt = $this->db->prepare("DELETE FROM answers WHERE question_id = :qid");
        $stmt->execute([':qid' => $questionId]);
    }

    public function deleteBySurveyId(int $surveyId): void
    {
        $stmt = $this->db->prepare("DELETE FROM answers WHERE survey_id = :sid");
        $stmt->execute([':sid' => $surveyId]);
    }

    public function findByQuestionId(int $questionId): array
    {
        $stmt = $this->db->prepare("
            SELECT id, survey_id, question_id, answer_text
              FROM answers
             WHERE question_id = :qid
        ");
        $stmt->execute([':qid' => $questionId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn(array $r) => new Answer(
            (int)$r['id'],
            (int)$r['survey_id'],
            (int)$r['question_id'],
            $r['answer_text']
        ), $rows);
    }
}
