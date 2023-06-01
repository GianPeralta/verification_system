<?php
    require('../server/sqli_conn.php');
    if (isset($_POST['startDate']) && isset($_POST['endDate']) && isset($_POST['department'])) {
        $startDate = validateInput($_POST['startDate']);
        $endDate = validateInput($_POST['endDate']);
        $department = validateInput($_POST['department']);
    
        if (empty($startDate) || empty($endDate) || empty($department)) {
            echo json_encode(['error' => 'Please provide start date, end date, and department.']);
            exit;
        }
    
        $startDate = mysqli_real_escape_string($conn, $startDate);
        $endDate = mysqli_real_escape_string($conn, $endDate);
        $department = mysqli_real_escape_string($conn, $department);
    
        $list_ar = array();
        $qry = "";
    
        if ($department === "All Departments") {
            $qry = "SELECT * FROM display_record WHERE date BETWEEN ? AND ?";
            $stmt = mysqli_prepare($conn, $qry);
            mysqli_stmt_bind_param($stmt, "ss", $startDate, $endDate);
        } else {
            $qry = "SELECT * FROM display_record WHERE date BETWEEN ? AND ? AND department = ?";
            $stmt = mysqli_prepare($conn, $qry);
            mysqli_stmt_bind_param($stmt, "sss", $startDate, $endDate, $department);
        }
        
        $res = mysqli_stmt_execute($stmt);
        
        if (!$res) {
            echo json_encode(['error' => 'An error occurred while querying the database.']);
            exit;
        }
        
        $result = mysqli_stmt_get_result($stmt);
        $list_ar = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        mysqli_stmt_close($stmt);
        
        echo json_encode($list_ar);
    } else {
        echo json_encode(['error' => 'Invalid request.']);
    }
    
    
    
?>