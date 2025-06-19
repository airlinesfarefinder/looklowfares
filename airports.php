<?php

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Only POST method is allowed']);
    exit;
}


function searchAirports(PDO $pdo, string $searchTerm, int $limit = 10): array
{
    $searchTerm = trim($searchTerm);
    if (strlen($searchTerm) < 2)
        return [];
    $matchFields = "airport_name, country_name, region_name, country_keywords, region_keywords, keywords, municipality";
    $sql = "
        SELECT *,
            (
                (airport_type = 'large_airport') * 50 +
                (iata_code = :exact) * 100 +
                MATCH($matchFields) AGAINST (:search IN BOOLEAN MODE)
            ) AS relevance_score
        FROM airports
        WHERE 
            iata_code = :exact
            OR MATCH($matchFields) AGAINST (:search IN BOOLEAN MODE)
        ORDER BY relevance_score DESC
        LIMIT :limit
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':exact', $searchTerm);
    $stmt->bindValue(':search', $searchTerm . '*'); // Use wildcard for prefix matches
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


$search_term = $_POST['search'];

$pdo = new PDO('mysql:host=mysql-database-eskscko8k04so8kwoogok40g;dbname=llf', 'root', 'Admin@8998');
$results = searchAirports($pdo, $search_term);


// returning results.
header('Content-Type: application/json; charset=utf-8');
echo json_encode($results);
