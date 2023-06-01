<?php
    require('../server/sqli_conn.php');
    if (isset($_POST['name']) && isset($_POST['student_id']) && isset($_POST['reason']) && isset($_POST['date']) && isset($_POST['department'])) {
        $name = validateInput($_POST['name']);
        $student_id = validateInput($_POST['student_id']);
        $reason = validateInput($_POST['reason']);
        $date = validateInput($_POST['date']);
        $department = validateInput($_POST['department']);
    
        if (empty($name) || empty($student_id) || empty($reason) || empty($date) || empty($department)) {
            echo json_encode(['error' => 'Please fill in all the fields.']);
            exit;
        }
    
        $name = mysqli_real_escape_string($conn, $name);
        $student_id = mysqli_real_escape_string($conn, $student_id);
        $reason = mysqli_real_escape_string($conn, $reason);
        $date = mysqli_real_escape_string($conn, $date);
        $department = mysqli_real_escape_string($conn, $department);
    
        $qry = "INSERT INTO display_record (name, student_id, reason, date, department) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $qry);
        mysqli_stmt_bind_param($stmt, "sssss", $name, $student_id, $reason, $date, $department);

        $res = mysqli_stmt_execute($stmt);
    
        if (!$res) {
            echo json_encode(['error' => 'An error occurred while saving the record.']);
            exit;
        }
    
        echo json_encode(['success' => 'Record saved successfully.']);
    } else {
        echo json_encode(['error' => 'Invalid request.']);
    }
    
    
    
?>