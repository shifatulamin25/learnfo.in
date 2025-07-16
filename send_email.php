<?php
header('Content-Type: application/json');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Validate required fields
$required = ['name', 'email', 'subject', 'message'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Please fill in all required fields"]);
        exit;
    }
}

// Validate email
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Process file upload if exists
$attachment = null;
if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    // Validate file type
    $allowed_types = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!in_array($_FILES['attachment']['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Only PDF, JPEG, and PNG files are allowed']);
        exit;
    }
    
    // Validate file size (5MB max)
    $max_size = 5 * 1024 * 1024;
    if ($_FILES['attachment']['size'] > $max_size) {
        echo json_encode(['success' => false, 'message' => 'File size must be less than 5MB']);
        exit;
    }
    
    $attachment = $_FILES['attachment'];
}

// Prepare email
$to = "learnfo25@gmail.com";
$subject = $_POST['subject'];
$from = $_POST['name'] . " <" . $_POST['email'] . ">";

// Email headers
$headers = "From: $from\r\n";
$headers .= "Reply-To: " . $_POST['email'] . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";

// Create boundary
$boundary = md5(time());

// Email headers for attachment
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

// Email body
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= "Name: " . $_POST['name'] . "\n";
$body .= "Email: " . $_POST['email'] . "\n\n";
$body .= "Message:\n" . $_POST['message'] . "\r\n";

// Add attachment if exists
if ($attachment) {
    $file_content = file_get_contents($attachment['tmp_name']);
    $file_content = chunk_split(base64_encode($file_content));
    
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: " . $attachment['type'] . "; name=\"" . $attachment['name'] . "\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"" . $attachment['name'] . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= $file_content . "\r\n";
}

// End of email
$body .= "--$boundary--";

// Send email
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message']);
}
?>