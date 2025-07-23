<?php
declare(strict_types=1);

require_once __DIR__ . '/../models/Survey.php';

class SurveyRepository
{
    private \PDO $db;

    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    /**
     * @return Survey[]
     */
    public function findByUser(int $userId): array
    {
        $sql = "
            SELECT id, title, created_date, expire_date, user_id
              FROM surveys
             WHERE user_id = :userId
             ORDER BY created_date DESC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['userId' => $userId]);
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(function(array $r) {
            return new Survey(
                (int) $r['id'],
                $r['title'],
                new \DateTime($r['created_date']),
                $r['expire_date'] ? new \DateTime($r['expire_date']) : null,
                (int) $r['user_id']
            );
        }, $rows);
    }

    public function getQuestionsBySurveyId(int $surveyId): array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM questions
            WHERE survey_id = :id
            ORDER BY order_number
        ");
        $stmt->execute(['id' => $surveyId]);

        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(function(array $r) {
            return new Question(
                (int)$r['id'],
                $r['name'],
                (int)$r['order_number'],
                (int)$r['survey_id'],
                $r['type'],
                $r['options'] ?? '[]'
            );
        }, $rows);
    }

     public function createSurveyWithQuestions(
        int $userId,
        string $title,
        ?\DateTime $expireDate = null,
        array $questionsPayload
    ): Survey {
        if ($title === '') {
            throw new \InvalidArgumentException("Title cannot be empty");
        }

        if ($expireDate !== null) {
            if ($expireDate < new \DateTime()) {
                throw new \InvalidArgumentException("Expire date must be in the future");
            }
        }   

        $now = new \DateTime();

        if (count($questionsPayload) === 0) {
            throw new \InvalidArgumentException("At least one question is required");
        }

        foreach ($questionsPayload as $i => $q) {
            $idx = $i + 1;
            if (!isset($q['text']) || trim($q['text']) === '') {
                throw new \InvalidArgumentException("Question #{$idx} text cannot be empty");
            }
            $type = $q['type'] ?? '';
            if (!in_array($type, ['open','select','radio'], true)) {
                throw new \InvalidArgumentException("Question #{$idx} has invalid type");
            }
            if (in_array($type, ['select','radio'], true)) {
                $opts = $q['options'] ?? [];
                $valid = array_filter($opts, fn($o) => trim((string)$o) !== '');
                if (count($valid) === 0) {
                    throw new \InvalidArgumentException("Question #{$idx} must have at least one option");
                }
            }
        }

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("
                INSERT INTO surveys (user_id, title, created_date, expire_date)
                VALUES (:uid, :title, :created, :expire)
            ");
            $stmt->execute([
                ':uid'     => $userId,
                ':title'   => $title,
                ':created' => $now->format('Y-m-d H:i:s'),
                ':expire' => $expireDate ? $expireDate->format('Y-m-d H:i:s') : null
            ]);
            $surveyId = (int)$this->db->lastInsertId();

            $survey = new Survey(
                $surveyId,
                $title,
                $now,
                $expireDate,
                $userId
            );

            $qStmt = $this->db->prepare("
                INSERT INTO questions
                  (survey_id, order_number, name, type, options)
                VALUES
                  (:sid, :ord, :name, :type, :opts)
            ");
            foreach ($questionsPayload as $order => $q) {
                $opts = [];
                if (in_array($q['type'], ['select','radio'], true)) {
                    foreach ($q['options'] as $opt) {
                        $o = trim((string)$opt);
                        if ($o !== '') {
                            $opts[] = $o;
                        }
                    }
                }
                $qStmt->execute([
                    ':sid'  => $surveyId,
                    ':ord'  => $order + 1,
                    ':name' => trim($q['text']),
                    ':type' => $q['type'],
                    ':opts' => json_encode($opts, JSON_THROW_ON_ERROR),
                ]);
            }

            $this->db->commit();
            return $survey;

        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw new \RuntimeException("Failed to create survey: " . $e->getMessage(), 0, $e);
        }
    }

    public function findById(int $surveyId): ?Survey
    {
        $stmt = $this->db->prepare("
            SELECT id, title, created_date, expire_date, user_id
            FROM surveys
            WHERE id = :id
        ");
        
        $stmt->execute(['id' => $surveyId]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (! $row) {
            return null;
        }

        $expireDate = $row['expire_date'] !== null
            ? new \DateTime($row['expire_date'])
            : null;

        return new Survey(
            (int)$row['id'],
            $row['title'],
            new \DateTime($row['created_date']),
            $expireDate,
            (int)$row['user_id']
        );
    }

    public function getAnswersByQuestionId(int $questionId): array
    {
        $stmt = $this->db->prepare("
            SELECT id, survey_id, question_id, answer_text
            FROM answers
            WHERE question_id = :qid
        ");
        $stmt->execute([':qid' => $questionId]);
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map(function(array $r) {
            return new Answer(
                (int)$r['id'],
                (int)$r['survey_id'],
                (int)$r['question_id'],
                $r['answer_text']
            );
        }, $rows);
    }

    public function deleteSurvey(int $surveyId): bool
    {
        $this->deleteQuestionsBySurveyId($surveyId);

        $stmt = $this->db->prepare("DELETE FROM surveys WHERE id = :id");
        $stmt->execute(['id' => $surveyId]);
        return $stmt->rowCount() > 0;
    }

    private function deleteQuestionsBySurveyId(int $surveyId): void
    {
        $this->db->prepare("
            DELETE a FROM answers a
            JOIN questions q ON a.question_id = q.id
            WHERE q.survey_id = :sid
        ")->execute([':sid' => $surveyId]);

        $stmt = $this->db->prepare("DELETE FROM questions WHERE survey_id = :sid");
        $stmt->execute([':sid' => $surveyId]);
    }

    public function updateSurveyWithQuestions(
        int $surveyId,
        string $title,
        ?\DateTime $expireDate,
        array $questionsPayload
    ): Survey {
        if (trim($title) === '') {
            throw new \InvalidArgumentException("Title cannot be empty");
        }

        if ($expireDate !== null) {
            $now = new \DateTime();
            if ($expireDate < $now) {
                throw new \InvalidArgumentException("Expire date must be in the future");
            }
        }
    
        if (count($questionsPayload) === 0) {
            throw new \InvalidArgumentException("At least one question is required");
        }

        foreach ($questionsPayload as $i => $q) {
            $idx = $i + 1;
            if (!isset($q['text']) || trim($q['text']) === '') {
                throw new \InvalidArgumentException("Question #{$idx} text cannot be empty");
            }
            $type = $q['type'] ?? '';
            if (!in_array($type, ['open', 'select', 'radio'], true)) {
                throw new \InvalidArgumentException("Question #{$idx} has invalid type");
            }
            if (in_array($type, ['select', 'radio'], true)) {
                $opts = $q['options'] ?? [];
                $valid = array_filter($opts, fn($o) => trim((string)$o) !== '');
                if (count($valid) === 0) {
                    throw new \InvalidArgumentException("Question #{$idx} must have at least one option");
                }
            }
        }

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare(
                "UPDATE surveys
                SET title = :title,
                    expire_date = :expire
                WHERE id = :id"
            );
            $stmt->execute([
                ':title'  => $title,
                ':expire' => $expireDate ? $expireDate->format('Y-m-d H:i:s') : null,
                ':id'     => $surveyId,
            ]);

            $existingStmt = $this->db->prepare("SELECT id FROM questions WHERE survey_id = :sid");
            $existingStmt->execute([':sid' => $surveyId]);
            $existing = array_map(
                fn(array $r) => (int)$r['id'],
                $existingStmt->fetchAll(\PDO::FETCH_ASSOC)
            );

            $payloadIds = [];
            $order      = 1;

            $oldOptionsStmt = $this->db->prepare(
                "SELECT id, options FROM questions WHERE survey_id = :sid"
            );

            $oldOptionsStmt->execute([':sid' => $surveyId]);
            $oldOptionsMap = [];

            foreach ($oldOptionsStmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
                $oldOptionsMap[(int)$row['id']] = json_decode($row['options'] ?? '[]', true);
            }

            $insQ = $this->db->prepare(
                "INSERT INTO questions
                (survey_id, order_number, name, type, options)
                VALUES (:sid, :ord, :name, :type, :opts)"
            );
            $updQ = $this->db->prepare(
                "UPDATE questions
                SET order_number = :ord,
                    name         = :name,
                    type         = :type,
                    options      = :opts
                WHERE id = :id"
            );

            foreach ($questionsPayload as $q) {
                $optsArr = [];
                if (in_array($q['type'], ['select', 'radio'], true)) {
                    foreach ($q['options'] as $opt) {
                        $o = trim((string)$opt);
                        if ($o !== '') {
                            $optsArr[] = $o;
                        }
                    }
                }

                $optsJson = json_encode($optsArr, JSON_THROW_ON_ERROR);

                 if (isset($q['id']) && ctype_digit((string)$q['id'])) {
                    $qid = (int)$q['id'];
                    $oldOptions = $oldOptionsMap[$qid] ?? [];

                    $deletedOptions = array_diff($oldOptions, $optsArr);

                    if (!empty($deletedOptions)) {
                        $placeholders = implode(',', array_fill(0, count($deletedOptions), '?'));
                        $params = array_merge([$qid], $deletedOptions);
                        $delStmt = $this->db->prepare(
                            "DELETE FROM answers WHERE question_id = ? AND answer_text IN ($placeholders)"
                        );
                        $delStmt->execute($params);
                    }
                }

                if (isset($q['id']) && ctype_digit((string)$q['id'])) {
                    $qid = (int)$q['id'];
                    $payloadIds[] = $qid;
                    $updQ->execute([
                        ':ord'  => $order,
                        ':name' => trim($q['text']),
                        ':type' => $q['type'],
                        ':opts' => $optsJson,
                        ':id'   => $qid,
                    ]);
                } else {
                    $insQ->execute([
                        ':sid'  => $surveyId,
                        ':ord'  => $order,
                        ':name' => trim($q['text']),
                        ':type' => $q['type'],
                        ':opts' => $optsJson,
                    ]);

                    $newId = (int)$this->db->lastInsertId();
                    $payloadIds[] = $newId;
                }
                $order++;
            }

            $toDelete = array_diff($existing, $payloadIds);
            if (count($toDelete) > 0) {
                $this->db->prepare(
                    "DELETE FROM questions
                    WHERE id IN (" . implode(',', array_map('intval', $toDelete)) . ")"
                )->execute();
            }

            $this->db->commit();

            $row = $this->db
                ->prepare("SELECT id, title, created_date, expire_date, user_id FROM surveys WHERE id = :id")
                ->execute([':id' => $surveyId]);
            $row = $this->db->query(
                "SELECT id, title, created_date, expire_date, user_id
                FROM surveys
                WHERE id = {$surveyId}"
            )->fetch(\PDO::FETCH_ASSOC);

            return new Survey(
                (int)$row['id'],
                $row['title'],
                new \DateTime($row['created_date']),
                $row['expire_date'] ? new \DateTime($row['expire_date']) : null,
                (int)$row['user_id']
            );

        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw new \RuntimeException("Failed to update survey: " . $e->getMessage(), 0, $e);
        }
    }
}
