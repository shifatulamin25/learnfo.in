<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development only

// Error handling
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

$response = [
    'success' => false,
    'message' => 'An unexpected error occurred',
    'errors' => []
];

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Validate required fields
    $requiredFields = ['name', 'email', 'subject', 'message'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        $response['message'] = 'Please fill in all required fields';
        $response['errors'] = array_fill_keys($missingFields, 'This field is required');
        echo json_encode($response);
        exit;
    }

    // Sanitize inputs
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address';
        $response['errors']['email'] = 'Invalid email format';
        echo json_encode($response);
        exit;
    }

    // Process file uploads
    $uploadedFiles = [];
    if (!empty($_FILES['attachments']) && is_array($_FILES['attachments']['name'])) {
        $uploadDir = __DIR__ . '/uploads/';
        
        // Create upload directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception('Could not create upload directory');
            }
        }

        // Verify upload directory is writable
        if (!is_writable($uploadDir)) {
            throw new Exception('Upload directory is not writable');
        }

        foreach ($_FILES['attachments']['name'] as $index => $fileName) {
            // Skip empty file inputs
            if ($_FILES['attachments']['error'][$index] === UPLOAD_ERR_NO_FILE) {
                continue;
            }

            // Check for upload errors
            if ($_FILES['attachments']['error'][$index] !== UPLOAD_ERR_OK) {
                $response['errors']['attachments'][$fileName] = getUploadError($_FILES['attachments']['error'][$index]);
                continue;
            }

            // Validate file
            $tmpName = $_FILES['attachments']['tmp_name'][$index];
            $fileSize = $_FILES['attachments']['size'][$index];
            
            // Sanitize file name
            $safeFileName = preg_replace("/[^\w\.\-]/", '', basename($fileName));
            $targetPath = $uploadDir . uniqid() . '_' . $safeFileName;
            
            // Move uploaded file
            if (move_uploaded_file($tmpName, $targetPath)) {
                $uploadedFiles[] = [
                    'path' => $targetPath,
                    'name' => $safeFileName,
                    'size' => $fileSize
                ];
            } else {
                $response['errors']['attachments'][$fileName] = 'Failed to move uploaded file';
            }
        }
    }

    // Prepare email
    $to = 'learnfo25@gmail.com';
    $emailSubject = "Contact Form: $subject";
    $emailHeaders = [
        'From' => "$name <$email>",
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion()
    ];

    // Build email message
    $emailMessage = "You have received a new message from your website contact form.\n\n";
    $emailMessage .= "Name: $name\n";
    $emailMessage .= "Email: $email\n";
    $emailMessage .= "Subject: $subject\n\n";
    $emailMessage .= "Message:\n$message\n";

    // Handle attachments if any
    if (!empty($uploadedFiles)) {
        $boundary = uniqid('np');
        $emailHeaders['MIME-Version'] = '1.0';
        $emailHeaders['Content-Type'] = "multipart/mixed; boundary=\"$boundary\"";
        
        $emailBody = "--$boundary\r\n";
        $emailBody .= "Content-Type: text/plain; charset=\"utf-8\"\r\n";
        $emailBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $emailBody .= $emailMessage . "\r\n\r\n";
        
        foreach ($uploadedFiles as $file) {
            if (file_exists($file['path'])) {
                $fileContent = file_get_contents($file['path']);
                if ($fileContent === false) {
                    throw new Exception("Failed to read file: {$file['path']}");
                }
                
                $fileContent = chunk_split(base64_encode($fileContent));
                $emailBody .= "--$boundary\r\n";
                $emailBody .= "Content-Type: application/octet-stream; name=\"{$file['name']}\"\r\n";
                $emailBody .= "Content-Disposition: attachment; filename=\"{$file['name']}\"\r\n";
                $emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
                $emailBody .= $fileContent . "\r\n";
            }
        }
        
        $emailBody .= "--$boundary--";
    } else {
        $emailBody = $emailMessage;
    }

    // Send email
    $mailSent = mail(
        $to,
        $emailSubject,
        $emailBody,
        $emailHeaders
    );
    
    if ($mailSent) {
        $response['success'] = true;
        $response['message'] = 'Thank you! Your message has been sent successfully.';
    } else {
        throw new Exception('Failed to send email. Mail function returned false.');
    }

} catch (Exception $e) {
    error_log('Contact Form Error: ' . $e->getMessage());
    $response['message'] = $e->getMessage();
    $response['error_details'] = 'An error occurred while processing your request';
}

echo json_encode($response);

function getUploadError($errorCode) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'File upload stopped by extension',
    ];
    
    return $errors[$errorCode] ?? 'Unknown upload error';
}
?>
