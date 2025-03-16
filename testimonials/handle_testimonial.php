<?php
header('Content-Type: application/json');
require_once 'dbase.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
    $rating = filter_var($data['rating'], FILTER_SANITIZE_NUMBER_INT);
    $review = filter_var($data['review'], FILTER_SANITIZE_STRING);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO testimonials (name, rating, review) VALUES (?, ?, ?)");
        $stmt->execute([$name, $rating, $review]);
        
        echo json_encode(['success' => true, 'message' => 'Testimonial submitted successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error submitting testimonial']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC");
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'testimonials' => $testimonials]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error retrieving testimonials']);
    }
}
?> 