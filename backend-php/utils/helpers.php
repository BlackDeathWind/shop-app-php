<?php
function formatCurrency($amount) {
    return number_format($amount, 0, ',', '.') . ' ₫';
}
function generateRandomCode($length = 8) {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $result = '';
    for ($i = 0; $i < $length; $i++) {
        $result .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $result;
}
function slugify($text) {
    $text = strtolower($text);
    $text = preg_replace('/[áàảãạăắằẳẵặâấầẩẫậ]/u', 'a', $text);
    $text = preg_replace('/[éèẻẽẹêếềểễệ]/u', 'e', $text);
    $text = preg_replace('/[íìỉĩị]/u', 'i', $text);
    $text = preg_replace('/[óòỏõọôốồổỗộơớờởỡợ]/u', 'o', $text);
    $text = preg_replace('/[úùủũụưứừửữự]/u', 'u', $text);
    $text = preg_replace('/[ýỳỷỹỵ]/u', 'y', $text);
    $text = preg_replace('/đ/u', 'd', $text);
    $text = preg_replace('/[^\w\s-]/', '', $text);
    $text = preg_replace('/\s+/', '-', $text);
    $text = preg_replace('/-+/', '-', $text);
    return trim($text, '-');
}
function getCurrentDate() {
    return date('Y-m-d');
}
function isValidPhoneNumber($phone) {
    return preg_match('/^[0-9]{10}$/', $phone);
}
function isStrongPassword($password) {
    return strlen($password) >= 6;
}
function formatDateForSqlServer($date = null) {
    $date = $date ? strtotime($date) : time();
    return date('Y-m-d H:i:s', $date);
} 