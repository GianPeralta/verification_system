<?php
	require('../server/sqli_conn.php');

    if (isset($_POST['str'])) {
        $ss = validateInput($_POST['str']);
    
        $res = array();
        $error = null;
        try {
            $stud_stats = array();
            $qrystuds = "SELECT ut.user_index, ut.id_number, ut.fname, ut.mname, ut.lname, ut.gender, sch.cur_hist_index, sch.course_index schci, sch.semester, sch.year_level, gd.grad_data_index, gd.grad_year, co.course_index, co.tution_type, co.course_code, co.course_name, c.c_index, c.c_code, c.c_name
            FROM user_table ut
            LEFT JOIN stud_curriculum_hist sch ON sch.user_index = ut.user_index
            LEFT JOIN graduation_data gd ON gd.stud_index = ut.user_index
            LEFT JOIN course_offered co ON co.course_index = sch.course_index
            LEFT JOIN college c ON c.c_index = co.c_index
            WHERE ut.user_index = '$ss';";

            $resstuds = mysqli_query($conn, $qrystuds);
            while($rowstuds=mysqli_fetch_assoc($resstuds)){
				
                if($rowstuds['schci'] === '0'){
                    $yl = $rowstuds['year_level'];
                    $qrybed = "SELECT level_name FROM bed_level_info WHERE g_level = $yl;";

                    $resbed = mysqli_query($conn, $qrybed);
                    while($rowbed=mysqli_fetch_assoc($resbed)){
                        $rowstuds['course_code'] = $rowbed['level_name'];
                        if($yl >= 1 && $yl<= 9){
                            $rowstuds['c_name'] = 'ELEMENTARY';
                            $rowstuds['c_index'] = 35;
                            $rowstuds['c_code'] = 'ELEM';
                        }else if($yl >= 10 && $yl<= 17){
                            $rowstuds['c_name'] = 'JUNIOR HIGH SCHOOL';
                            $rowstuds['c_index'] = 36;
                            $rowstuds['c_code'] = 'HS';
                        }else{
                            $rowstuds['c_name'] = 'SENIOR HIGH SCHOOL';
                            $rowstuds['c_index'] = 41;
                            $rowstuds['c_code'] = 'SHS';
                        }
                        
                    }
                }
                array_push($stud_stats,$rowstuds);
			}
            array_push($res,$stud_stats);

            $reasons = array();
            $qryreasons = "SELECT *
            FROM gp_reasons;";

            $resreasons = mysqli_query($conn, $qryreasons);
            while($rowreasons=mysqli_fetch_assoc($resreasons)){
				array_push($reasons,$rowreasons);
			}
            array_push($res,$reasons);
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