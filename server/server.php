<?php
	$conn = mysqli_connect('localhost','root','','for_verification'); 
	if(!$conn){
		die('Connection Error: '. mysqli_connect_error());
	}	
    if($_SERVER['REQUEST_METHOD']==='POST'){
        if(isset($_POST['str']) && $_POST['loc']=='studentResult'){			
            $ss=mysqli_real_escape_string($conn, trim($_POST['str']));
            $det_ar=array();
            $qry="select id, name, student_id, department from student where name like '%$ss%' or student_id like '%$ss%'";
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        
        }else if(isset($_POST['str']) && $_POST['loc']=='verifyResult'){			
            $ss=mysqli_real_escape_string($conn, trim($_POST['str']));
            $det_ar=array();
            $qry="select * from student where id = '$ss'";
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                $image_data = base64_encode($row['picture']);
                unset($row['picture']);
                $row['image_data'] = $image_data;
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }else if(isset($_POST['name']) && isset($_POST['student_id']) && isset($_POST['reason']) && isset($_POST['date']) && isset($_POST['department']) && $_POST['loc']=='addToDb'){			
            $name=mysqli_real_escape_string($conn, trim($_POST['name']));
            $student_id=mysqli_real_escape_string($conn, trim($_POST['student_id']));
            $reason=mysqli_real_escape_string($conn, trim($_POST['reason']));
            $date=mysqli_real_escape_string($conn, trim($_POST['date']));
            $department=mysqli_real_escape_string($conn, trim($_POST['department']));
            $qry="INSERT INTO display_record (name, student_id, reason, date, department) VALUES ('$name', '$student_id', '$reason', '$date', '$department')";
            $res=mysqli_query($conn,$qry);
        }else if(isset($_POST['startDate']) && isset($_POST['endDate']) && isset($_POST['department']) && $_POST['loc']=='retrieveList'){			
            $startDate=mysqli_real_escape_string($conn, trim($_POST['startDate']));
            $endDate=mysqli_real_escape_string($conn, trim($_POST['endDate']));
            $department=mysqli_real_escape_string($conn, trim($_POST['department']));
            $det_ar=array();
            if($department=="All Deparments"){
                $qry="SELECT * FROM display_record WHERE date BETWEEN '$startDate' AND '$endDate'";
            }else{
                $qry="SELECT * FROM display_record WHERE date BETWEEN '$startDate' AND '$endDate' AND department = '$department'";
            }
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }else if(isset($_POST['username']) && isset($_POST['password']) && $_POST['loc']=='logIn'){			
            $username=mysqli_real_escape_string($conn, trim($_POST['username']));
            $password=mysqli_real_escape_string($conn, trim($_POST['password']));
            $det_ar=array();
            $qry="SELECT * FROM users WHERE username='$username' AND password=MD5('$password')";
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }
        
    }
?>