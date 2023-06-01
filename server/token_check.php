<?php

require('../server/sqli_conn.php');

if (isset($_POST['token'])) {
    $token = mysqli_real_escape_string($conn, $_POST['token']);

    $qry = "SELECT token FROM token WHERE id = 1";
    $res = mysqli_query($conn, $qry);
    while ($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
        echo $row['token'];

        if ($token === $row['token']) {
            echo json_encode(['status' => 'ok', 'message' => 'User is logged in.']);
            http_response_code(200); 
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
            http_response_code(401); 
            exit;
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
    http_response_code(400); 
    exit;
}

?>