<?php

require('../server/sqli_conn.php');

try {
    if (isset($_POST['token'])) {
        $token = mysqli_real_escape_string($conn, $_POST['token']);

        if (trim($token) === '') {
            echo json_encode(['status' => 'error', 'message' => 'Token cannot be empty.']);
            http_response_code(400);
            exit;
        }else if($token === null){
            echo json_encode(['status' => 'error', 'message' => 'Token cannot be empty.']);
            http_response_code(400);
            exit;
        }

        $qry = "SELECT token FROM token WHERE id = 1";
        $res = mysqli_query($conn, $qry);

        if ($res === false) {
            echo json_encode(['status' => 'error', 'message' => 'Database query error: ' . mysqli_error($conn)]);
            http_response_code(500);
            exit;
        }

        if (mysqli_num_rows($res) > 0) {
            $row = mysqli_fetch_array($res, MYSQLI_ASSOC);
            if ($token === $row['token']) {
                echo json_encode(['status' => 'ok', 'message' => 'User is logged in.']);
                http_response_code(200);
                exit;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Invalid Token set.']);
                http_response_code(400);
                exit;
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No Token set.']);
            http_response_code(400);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
        http_response_code(400);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    http_response_code(500);
    exit;
} finally {
    mysqli_close($conn);
}

?>