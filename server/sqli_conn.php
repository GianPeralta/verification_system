<?php
    //$conn = mysqli_connect('172.16.0.18','shs_web','sHs@W3b.0619','db_shs_grades','3309'); 
	$conn = mysqli_connect('172.16.0.18','gatepass','g@t3@p@55','gatepass','3309');
	//$conn = mysqli_connect('172.16.0.18','gian','G1@nP091','db_shs_grades','3309');
	// $conn = mysqli_connect('172.16.7.66','uc_gs','J@k3.2018b','db_shs_grades','3306'); 
	// $conn = mysqli_connect('172.16.0.18','shs_user','SHS.us3r@UC2016','db_gs_grades','3309');
	if(!$conn){
		die('Connection Error: '. mysqli_connect_error());
	}	

	
	function validateInput($input) {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input);
        return $input;
    }
?>