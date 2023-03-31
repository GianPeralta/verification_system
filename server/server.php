<?php
	$conn = mysqli_connect('localhost','root','','db_shs_grades'); 
	if(!$conn){
		die('Connection Error: '. mysqli_connect_error());
	}	
    if($_SERVER['REQUEST_METHOD']==='POST'){
        if(isset($_POST['str']) && $_POST['loc']=='studentResult'){			
            $ss=mysqli_real_escape_string($conn, trim($_POST['str']));
            $det_ar=array();
            $qry="select distinct concat(ifnull(lname,''),', ',ifnull(fname,''),' ', ifnull(concat(substr(mname,1,1),'.'),'')) as name, id_number idn, strand, a.user_index as ui from user_table A join stud_curriculum_hist B on a.user_index=b.user_index join bed_level_info C on b.year_level=c.g_level left join bed_stud_lrn bsl on A.user_index=bsl.user_index where g_level>17 and a.is_valid=1 and (lname like '%$ss%' or fname like '%$ss%' or mname like '%$ss%' or id_number like '%$ss%' or lrn_number like '%$ss%') order by name;";
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }else if(isset($_POST['str']) && $_POST['loc']=='verifyResult'){			
            $ss=mysqli_real_escape_string($conn, trim($_POST['str']));
            $det_ar=array();
            $qry="select distinct concat(ifnull(lname,''),', ',ifnull(fname,''),' ', ifnull(concat(substr(mname,1,1),'.'),'')) as name, id_number idn, strand, a.user_index as ui, info_personal.GENDER, c.LEVEL_NAME, c.EDU_LEVEL_NAME, b.DATE_OF_ENROLLMENT from user_table A join stud_curriculum_hist B on a.user_index=b.user_index join bed_level_info C on b.year_level=c.g_level left join bed_stud_lrn bsl on A.user_index=bsl.user_index inner join info_personal ON a.user_index = info_personal.USER_INDEX where g_level>17 and a.is_valid=1 and a.user_index = '$ss' order by b.DATE_OF_ENROLLMENT DESC";
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }else if(isset($_POST['name']) && isset($_POST['student_id']) && isset($_POST['reason']) && isset($_POST['date']) && isset($_POST['department']) && $_POST['loc']=='addToDb'){			
            $name=mysqli_real_escape_string($conn, trim($_POST['name']));
            $student_id=mysqli_real_escape_string($conn, trim($_POST['student_id']));
            $reason=mysqli_real_escape_string($conn, trim($_POST['reason']));
            $date=mysqli_real_escape_string($conn, trim($_POST['date']));
            $department=mysqli_real_escape_string($conn, trim($_POST['department']));
            $qry="INSERT INTO new_table_test (name, student_id, reason, date, department) VALUES ('$name', '$student_id', '$reason', '$date', '$department')";
            $res=mysqli_query($conn,$qry);
        }else if(isset($_POST['department']) && isset($_POST['reason']) && isset($_POST['month']) && isset($_POST['year']) && isset($_POST['day']) && $_POST['loc']=='retrieveList'){			
            $department=mysqli_real_escape_string($conn, trim($_POST['department']));
            $reason=mysqli_real_escape_string($conn, trim($_POST['reason']));
            $month=mysqli_real_escape_string($conn, trim($_POST['month']));
            $year=mysqli_real_escape_string($conn, trim($_POST['year']));
            $day=mysqli_real_escape_string($conn, trim($_POST['day']));
            $det_ar=array();
           
            if($department == "All Deparments"){
                if($reason == "All Reasons"){
                    if(($month == "All Months")){
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test";
                            }else{
                                $qry="select * from new_table_test where date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where date like '%$day%' and date like '%$year'";
                            }
                        }
                    }else{
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where date like '$month%'";
                            }else{
                                $qry="select * from new_table_test where date like '%$day%' and date like '$month%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where date like '$month%' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where date like '$month%' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }
                }else{
                    if(($month == "All Months")){
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where reason like '$reason%'";
                            }else{
                                $qry="select * from new_table_test where reason like '$reason%' and date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where reason like '$reason%' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where reason like '$reason%' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }else{
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where reason like '$reason%' and date like '$month%'";
                            }else{
                                $qry="select * from new_table_test where reason like '$reason%' and date like '$month%' and date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where reason like '$reason%' and date like '$month%' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where reason like '$reason%' and date like '$month%' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }
                }
            }else{
                if($reason == "All Reasons"){
                    if(($month == "All Months")){
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }else{
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and date like '$month%'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and date like '$month%' and date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and date like '$month%' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and date like '$month%' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }
                }else{
                    if(($month == "All Months")){
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }else{
                        if(($year == "All Years")){
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '$month%'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '$month%' and date like '%$day%'";
                            }
                        }else{
                            if(($day == "All Days")){
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '$month%' and date like '%$year'";
                            }else{
                                $qry="select * from new_table_test where department like '$department' and reason like '$reason%' and date like '$month%' and date like '%$year' and date like '%$day%'";
                            }
                        }
                    }
                }
            }
            
            $res=mysqli_query($conn,$qry);
            while($row=mysqli_fetch_array($res, MYSQLI_ASSOC)){
                array_push($det_ar, $row);
            }
            echo json_encode($det_ar);
        }
        
    }
?>