<?php
    require('../server/sqli_conn.php');

    if (isset($_POST['str'])) {
        $ss = validateInput($_POST['str']);
    
        $res = array();
        $error = null;
        try {
            $qrystuds = "SELECT *
            FROM user_table ut
            WHERE ut.id_number LIKE '%$ss%' OR ut.fname LIKE '%$ss%' OR ut.lname LIKE '%$ss%';";

            $resstuds = mysqli_query($conn, $qrystuds);
            while($rowstuds=mysqli_fetch_assoc($resstuds)){
				array_push($res,$rowstuds);
			}
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
        $response = array(
            'error' => $error,
            'res' => $res
        );

        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Invalid request.']);
    }
    
   
    
?>