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

$tc = $_GET['TC'];

if (!isset($tc)) {
  $error = array('error' => 'TC value is not set');
  echo json_encode($error, JSON_UNESCAPED_UNICODE);
  exit;
}

if (!checkAuthToken()) {
  $error = array('error' => 'Authentication token is not valid');
  echo json_encode($error, JSON_UNESCAPED_UNICODE);
  exit;
}

$cocugu_babatcs = array();

while (true) {
  if (isset($processed_tcs[$tc])) {
    break;
  }

  $sql = "SELECT * FROM 101m WHERE TC = '$tc' OR BABATC = '$tc'";
  $result = mysqli_query($conn, $sql);

  if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
      if ($row['TC'] == $tc) {
        $row['YAKINLIK'] = 'Kendisi';
      }
      if ($row['BABATC'] == $tc) {
        $row['YAKINLIK'] = 'BABASININ KARDESLERI';
      }
      if (!isset($output[$row['TC']])) {
        $output[$row['TC']] = $row;
      }

      if ($row['BABATC'] != $tc && !in_array($row['BABATC'], $cocugu_babatcs)) {
        // Retrieve rows where the BABATC value matches the BABATC value of the current row
        $sql_kardesler = "SELECT * FROM 101m WHERE BABATC = '{$row['BABATC']}'";
        $result_kardesler = mysqli_query($conn, $sql_kardesler);
        if (mysqli_num_rows($result_kardesler) > 0) {
          while($row_kardesler = mysqli_fetch_assoc($result_kardesler)) {
            $row_kardesler['YAKINLIK'] = 'COCUGU';
            if (!isset($output[$row_kardesler['TC']])) {
              $output[$row_kardesler['TC']] = $row_kardesler;
            }
          }
        }
        $cocugu_babatcs[] = $row['BABATC'];
      }

      $processed_tcs[$row['TC']] = true;
      if ($row['TC'] != $tc) {
        $tc = $row['TC'];
      }
    }
  } else {
    break;
  }
}

if (isset($output)) {
  echo json_encode(array_values($output), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE, 4);
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

