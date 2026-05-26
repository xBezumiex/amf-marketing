<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// ── Антиспам: honeypot ──────────────────────────────────────────────
$honeypot = trim($_POST['website'] ?? '');
if ($honeypot !== '') {
    // Бот заполнил скрытое поле — тихо "успех"
    echo json_encode(['success' => true, 'message' => 'Спасибо, заявка отправлена']);
    exit;
}

// ── Антиспам: таймер ────────────────────────────────────────────────
$form_time = intval($_POST['form_time'] ?? 0);
$elapsed   = (int)(microtime(true) * 1000) - $form_time; // миллисекунды
if ($form_time === 0 || $elapsed < 3000) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните форму внимательно']);
    exit;
}

// ── Валидация полей ─────────────────────────────────────────────────
$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    echo json_encode(['success' => false, 'message' => 'Заполните все поля']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Некорректный email']);
    exit;
}

// ── Санитизация ─────────────────────────────────────────────────────
$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// ── Отправка ────────────────────────────────────────────────────────
$to      = "amediafactor@gmail.com";
$subject = "Новая заявка с сайта AMF-marketing";
$body    = "Имя: $name\n";
$body   .= "Email: $email\n";
$body   .= "Вопрос: $message\n";
$body   .= "IP: $ip\n";
$body   .= "Время заполнения: " . round($elapsed / 1000, 1) . " сек.\n";

$headers   = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: AMF-marketing <a.usenko@amf-marketing.ru>";
$headers[] = "Reply-To: $email";

$ok = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$ok) {
    echo json_encode(['success' => false, 'message' => 'Ошибка отправки письма']);
} else {
    echo json_encode(['success' => true, 'message' => 'Спасибо, заявка отправлена']);
}
exit;