<?php

header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$password = "";
$dbname = "101m";

$conn = mysqli_connect($host, $user, $password, $dbname);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8");

$babatc = $_GET['BABATC'];

if (!isset($babatc)) {
  $error = array('error' => 'BABATC value is not set');
  echo json_encode($error, JSON_UNESCAPED_UNICODE);
  exit;
}

if (!checkAuthToken()) {
  $error = array('error' => 'Authentication token is not valid');
  echo json_encode($error, JSON_UNESCAPED_UNICODE);
  exit;
}

$sql = "SELECT * FROM 101m WHERE BABATC = '$babatc'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
  while($row = mysqli_fetch_assoc($result)) {
    $output[] = $row;
  }
  echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE, 4);
} else {
  $error = array('error' => 'No data found');
  echo json_encode($error, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE, 4);
}

mysqli_close($conn);

function checkAuthToken() {
  $auth_token = $_GET['auth_token'];

  if ($auth_token == "qwertyzz") {
    return true;
  } else {
    return false;
  }
}