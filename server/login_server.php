<?php
require('../server/sqli_conn.php');

if (isset($_POST['username']) && isset($_POST['password'])) {
    
    $username = validateInput($_POST['username']);
    $password = validateInput($_POST['password']);

    if (empty($username) || empty($password)) {
        echo json_encode(['error' => 'Please provide both username and password.']);
        exit;
    }

    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);

    $qry = "SELECT emp_id, name, position, token, view, is_active FROM users CROSS JOIN token WHERE username=? AND password=MD5(?)";
    $stmt = mysqli_prepare($conn, $qry);
    mysqli_stmt_bind_param($stmt, 'ss', $username, $password);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    
    if (!$res) {
        echo json_encode(['error' => 'An error occurred while querying the database.']);
        exit;
    }else if ($res->num_rows === 0) {
        echo json_encode(['error' => 'Invalid username or password.']);
        exit;
    }

    $user_ar = array();

    while ($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
        if($row['is_active'] !== 0){
            array_push($user_ar, $row);
        }else{
            echo json_encode(['error' => 'User no longer active.']);
            exit;
        }
    }

    echo json_encode($user_ar);
} else {
    echo json_encode(['error' => 'Invalid request.']);
}



?>