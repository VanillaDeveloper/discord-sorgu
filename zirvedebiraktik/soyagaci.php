<?php

// Connect to the database
$username = "root";
$password = "";
$host = "localhost";
$dbname = "101m";
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

try {
  $conn = new PDO($dsn, $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}

// Check if the authentication code is correct
if (!isset($_GET['qwertyzz'])) {
  echo "Error: incorrect authentication code";
  exit;
}

// Check if the TC parameter is set in the URL
if (!isset($_GET['TC'])) {
  echo "Error: no TC provided";
  exit;
}
$tc = $_GET['TC'];

// Query the database for the record with the given TC
$stmt = $conn->prepare("SELECT * FROM 101m WHERE TC = :tc");
$stmt->bindParam(":tc", $tc);
$stmt->execute();
$record = $stmt->fetch();

// If no record was found, output an error message
if (!$record) {
  echo "Error: no record found with TC $tc";
  exit;
}

// Add the YAKINLIK column to the record and set its value to COCUKLARI
$record['YAKINLIK'] = "COCUKLARI";

// Query the database for the record with the BABATC of the original record
$stmt = $conn->prepare("SELECT * FROM 101m WHERE TC = :tc");
$stmt->bindParam(":tc", $record['BABATC']);
$stmt->execute();
$baba = $stmt->fetch();

// If a record was found, add the YAKINLIK column to the record and set its value
if ($baba) {
  $baba['YAKINLIK'] = "BABASININ KARDESLERI";
}

// Query the database for the record with the BABATC of the original record
$stmt = $conn->prepare("SELECT * FROM 101m WHERE TC = :tc");
$stmt->bindParam(":tc", $baba['BABATC']);
$stmt->execute();
$dede = $stmt->fetch();

// If a record was found, add the YAKINLIK column to the record and set its value
if ($dede) {
  $dede['YAKINLIK'] = "BABASI";
}

// Query the database for the record with the ANNETC of the original record
$stmt = $conn->prepare("SELECT * FROM 101m WHERE TC = :tc");
$stmt->bindParam(":tc", $record['ANNETC']);
$stmt->execute();
$anne = $stmt->fetch();

// If a record was found, add the YAKINLIK column to the record and set its value
if ($anne) {
  $anne['YAKINLIK'] = "ANNESI";
}

// Create an array to hold the records
$output = array();

// Add the records to the array
$output[] = $record;
if ($baba) {
  $output[] = $baba;
}
if ($dede) {
  $output[] = $dede;
}
if ($anne) {
  $output[] = $anne;
}

// Output the results as a JSON object
header("Content-Type: application/json");
echo json_encode($output, JSON_PRETTY_PRINT);

