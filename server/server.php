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
        }else if(isset($_POST['department']) && isset($_POST['reason']) && isset($_POST['month']) && isset($_POST['year']) && isset($_POST['day']) && $_POST['loc']=='retrieveList'){			
            $department=mysqli_real_escape_string($conn, trim($_POST['department']));
            $reason=mysqli_real_escape_string($conn, trim($_POST['reason']));
            $month=mysqli_real_escape_string($conn, trim($_POST['month']));
            $year=mysqli_real_escape_string($conn, trim($_POST['year']));
            $day=mysqli_real_escape_string($conn, trim($_POST['day']));
            $det_ar=array();
           
            if($department=="All Deparments"){if($reason=="All Reasons"){if(($month=="All Months")){if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record";}else{$qry="select * from display_record where date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where date like '%$year'";}else{$qry="select * from display_record where date like '%$day%' and date like '%$year'";}}}else{if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where date like '$month%'";}else{$qry="select * from display_record where date like '%$day%' and date like '$month%'";}}else{if(($day=="All Days")){$qry="select * from display_record where date like '$month%' and date like '%$year'";}else{$qry="select * from display_record where date like '$month%' and date like '%$year' and date like '%$day%'";}}}}else{if(($month=="All Months")){if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where reason like '$reason%'";}else{$qry="select * from display_record where reason like '$reason%' and date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where reason like '$reason%' and date like '%$year'";}else{$qry="select * from display_record where reason like '$reason%' and date like '%$year' and date like '%$day%'";}}}else{if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where reason like '$reason%' and date like '$month%'";}else{$qry="select * from display_record where reason like '$reason%' and date like '$month%' and date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where reason like '$reason%' and date like '$month%' and date like '%$year'";}else{$qry="select * from display_record where reason like '$reason%' and date like '$month%' and date like '%$year' and date like '%$day%'";}}}}}else{if($reason=="All Reasons"){if(($month=="All Months")){if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where department like '$department'";}else{$qry="select * from display_record where department like '$department' and date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where department like '$department' and date like '%$year'";}else{$qry="select * from display_record where department like '$department' and date like '%$year' and date like '%$day%'";}}}else{if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where department like '$department' and date like '$month%'";}else{$qry="select * from display_record where department like '$department' and date like '$month%' and date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where department like '$department' and date like '$month%' and date like '%$year'";}else{$qry="select * from display_record where department like '$department' and date like '$month%' and date like '%$year' and date like '%$day%'";}}}}else{if(($month=="All Months")){if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where department like '$department' and reason like '$reason%'";}else{$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '%$year'";}else{$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '%$year' and date like '%$day%'";}}}else{if(($year=="All Years")){if(($day=="All Days")){$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '$month%'";}else{$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '$month%' and date like '%$day%'";}}else{if(($day=="All Days")){$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '$month%' and date like '%$year'";}else{$qry="select * from display_record where department like '$department' and reason like '$reason%' and date like '$month%' and date like '%$year' and date like '%$day%'";}}}}}
            
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }
        
    }
?>