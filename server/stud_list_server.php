<?php
    require('../server/sqli_conn.php');

    if (isset($_POST['str'])) {
        $ss = validateInput($_POST['str']);
    
        if (empty($ss)) {
            echo json_encode(['error' => 'Please provide a search string.']);
            exit;
        }
    
        $ss = mysqli_real_escape_string($conn, $ss);
    
        $qry = "SELECT id, name, student_id, department FROM student WHERE name LIKE ? OR student_id LIKE ?";
        $stmt = mysqli_prepare($conn, $qry);

        $searchString = "%$ss%";
        mysqli_stmt_bind_param($stmt, "ss", $searchString, $searchString);

        $res = mysqli_stmt_execute($stmt);

        if (!$res) {
            echo json_encode(['error' => 'An error occurred while searching the database.']);
            exit;
        }

        $result = mysqli_stmt_get_result($stmt);

        $studs_ar = array();

        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            array_push($studs_ar, $row);
        }

        echo json_encode($studs_ar);
    } else {
        echo json_encode(['error' => 'Invalid request.']);
    }
    
   
    
?>