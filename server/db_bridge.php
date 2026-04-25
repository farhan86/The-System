<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Define your bridge secret in a secure location on the server (matches BRIDGE_SECRET in Vercel .env)
$EXPECTED_SECRET = '348Tj1lCr906!slw';

// Receive Next.js Vercel payload
$inputData = json_decode(file_get_contents("php://input"), true);

// 1. Authenticate the remote request using the secret
if (!isset($inputData['secret']) || $inputData['secret'] !== $EXPECTED_SECRET) {
    http_response_code(403);
    echo json_encode(["message" => "Unauthorized access. Invalid bridge secret."]);
    exit;
}

// 2. Connect to MariaDB Host 
$host = "localhost";
$db = "lspgfcom_thesystem";
$user = "lspgfcom_admin86";
$pass = '380Tj1lCr906$slw';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed"]);
    exit;
}

$action = $inputData['action'] ?? '';

// 3. Handle Login Verification
if ($action === 'login') {
    $email = $inputData['email'] ?? '';
    $password = $inputData['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, name, email, avatarUrl, password, is_approved FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $dbUser = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify hashed password
    if ($dbUser && password_verify($password, $dbUser['password'])) {
        echo json_encode([
            "id" => $dbUser['id'],
            "name" => $dbUser['name'],
            "email" => $dbUser['email'],
            "avatarUrl" => $dbUser['avatarUrl'] ?? null,
            "is_approved" => (bool) $dbUser['is_approved'] // Next.js will reject if this is false
        ]);
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid email or password"]);
    }
} elseif ($action === 'signup') {
    $email = $inputData['email'] ?? '';
    $password = $inputData['password'] ?? '';
    $name = $inputData['name'] ?? '';

    // Check if user exists
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode(["message" => "Email already registered"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $insertStmt = $pdo->prepare("INSERT INTO users (name, email, password, is_approved) VALUES (?, ?, ?, 0)");

    if ($insertStmt->execute([$name, $email, $hashedPassword])) {
        echo json_encode(["message" => "Registration successful. Pending admin approval."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Registration failed."]);
    }
} elseif ($action === 'get_posts') {
    $limit = intval($inputData['limit'] ?? 10);
    $stmt = $pdo->prepare(
        "SELECT p.id, p.title, p.content, p.created_at, u.name as author_name
         FROM posts p
         JOIN users u ON p.author_id = u.id
         ORDER BY p.created_at DESC
         LIMIT ?"
    );
    $stmt->execute([$limit]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($action === 'get_posts_full') {
    $limit = intval($inputData['limit'] ?? 50);
    $stmt = $pdo->prepare(
        "SELECT p.id, p.title, p.content, p.created_at, u.name as author_name
         FROM posts p
         JOIN users u ON p.author_id = u.id
         ORDER BY p.created_at DESC
         LIMIT ?"
    );
    $stmt->execute([$limit]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch attachments for each post
    $attStmt = $pdo->prepare("SELECT post_id, file_url, orig_filename FROM attachments WHERE post_id = ?");
    foreach ($posts as &$post) {
        $attStmt->execute([$post['id']]);
        $post['attachments'] = $attStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    echo json_encode($posts);

} elseif ($action === 'create_post') {
    $authorId    = intval($inputData['author_id'] ?? 0);
    $title       = trim($inputData['title'] ?? '');
    $content     = trim($inputData['content'] ?? '');
    $fileUrl     = $inputData['file_url'] ?? null;
    $origFilename = $inputData['orig_filename'] ?? null;

    if (!$authorId || !$title || !$content) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required fields"]);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO posts (author_id, title, content) VALUES (?, ?, ?)");
        $stmt->execute([$authorId, $title, $content]);
        $postId = $pdo->lastInsertId();

        if ($fileUrl && $origFilename) {
            $attStmt = $pdo->prepare("INSERT INTO attachments (post_id, file_url, orig_filename) VALUES (?, ?, ?)");
            $attStmt->execute([$postId, $fileUrl, $origFilename]);
        }
        $pdo->commit();
        echo json_encode(["message" => "Post created", "postId" => intval($postId)]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["message" => "Failed to create post"]);
    }

} elseif ($action === 'get_stats') {
    $postCount = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
    $memberCount = $pdo->query("SELECT COUNT(*) FROM users WHERE is_approved = 1")->fetchColumn();
    echo json_encode(["totalPosts" => intval($postCount), "totalMembers" => intval($memberCount)]);

} else {
    http_response_code(400);
    echo json_encode(["message" => "Action undefined"]);
}
?>