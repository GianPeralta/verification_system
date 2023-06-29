<?php
    require('../server/sqli_conn.php');
    if (isset($_POST['create_dt']) && isset($_POST['created_by']) && isset($_POST['user_index']) && isset($_POST['reason_index']) && isset($_POST['reason_others'])) {
        $create_dt = validateInput($_POST['create_dt']);
        $created_by = validateInput($_POST['created_by']);
        $user_index = validateInput($_POST['user_index']);
        $reason_index = validateInput($_POST['reason_index']);
        $reason_others = (validateInput($_POST['reason_others']) !== 'null' ? validateInput($_POST['reason_others']) : null);
        
        $error = null;
        try {
            if($reason_index !== '999'){
                $qrystuds = "INSERT INTO `gatepass`.`gp_record` (`create_dt`, `created_by`, `user_index`, `reason_index`, `reason_others`) VALUES ('$create_dt', $created_by, $user_index, $reason_index, null);";
            }else{
                $qrystuds = "INSERT INTO `gatepass`.`gp_record` (`create_dt`, `created_by`, `user_index`, `reason_index`, `reason_others`) VALUES ('$create_dt', $created_by, $user_index, $reason_index, '$reason_others');";
            }
            

            $resstuds = mysqli_query($conn, $qrystuds); 
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
        $response = array(
            'error' => $error
        );

        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Invalid request.']);
    }
    
    
    
?>