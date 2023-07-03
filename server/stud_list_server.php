<?php
    require('../server/sqli_conn.php');

    if (isset($_POST['str'])) {
        $ss = validateInput($_POST['str']);
    
        $res = array();
        $error = null;
        try {
            $qrystuds = "SELECT *
            FROM user_table ut
            WHERE LOWER(CONCAT(ut.fname, ' ', ut.lname)) LIKE LOWER('$ss%') OR
                  LOWER(CONCAT(ut.lname, ' ', ut.fname)) LIKE LOWER('$ss%') OR
                  LOWER(CONCAT(ut.lname, ', ', ut.fname,' ',ut.mname)) LIKE LOWER('$ss%') OR
                  LOWER(CONCAT(ut.fname, ' ', ut.mname,' ',ut.lname)) LIKE LOWER('$ss%') OR
                  LOWER(ut.fname) LIKE LOWER('$ss%') OR
                  LOWER(ut.lname) LIKE LOWER('$ss%') OR
                  LOWER(ut.mname) LIKE LOWER('%$ss%') OR
                  ut.id_number LIKE '$ss%'";

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