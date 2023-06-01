<?php
	require('../server/sqli_conn.php');

    if (isset($_POST['str'])) {
        $ss = validateInput($_POST['str']);
    
        if (empty($ss)) {
            echo json_encode(['error' => 'Please provide a search string.']);
            exit;
        }
    
        $ss = mysqli_real_escape_string($conn, $ss);
    
        $qry = "SELECT * FROM student WHERE id = ?";
        $stmt = mysqli_prepare($conn, $qry);
        mysqli_stmt_bind_param($stmt, "s", $ss);
    
        $res = mysqli_stmt_execute($stmt);
    
        if (!$res) {
            echo json_encode(['error' => 'An error occurred while searching the database.']);
            exit;
        }
    
        $result = mysqli_stmt_get_result($stmt);
    
        $det_ar = array();
    
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $image_data = base64_encode($row['picture']);
            unset($row['picture']);
            $row['image_data'] = $image_data;
            array_push($det_ar, $row);
        }
    
        echo json_encode($det_ar);
    } else {
        echo json_encode(['error' => 'Invalid request.']);
    }
    
   
    

?>