<?php
    $conn = mysqli_connect('localhost','root','','for_verification'); 
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