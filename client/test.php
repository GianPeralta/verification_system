<?php
	require('../server/sqli_conn.php');

        $ss = 102906;
    
            $qrystuds = "SELECT ut.user_index, ut.id_number, CONCAT(ut.lname, ', ', ut.fname, ' ', ut.mname) AS full_name, ut.gender, sch.cur_hist_index, sch.course_index schci, sch.semester, sch.year_level, gd.grad_data_index, gd.grad_year, co.course_index, co.tution_type, co.course_code, co.course_name, c.c_index, c.c_code, c.c_name
            FROM user_table ut
            LEFT JOIN stud_curriculum_hist sch ON sch.user_index = ut.user_index
            LEFT JOIN graduation_data gd ON gd.stud_index = ut.user_index
            LEFT JOIN course_offered co ON co.course_index = sch.course_index
            LEFT JOIN college c ON c.c_index = co.c_index
            WHERE ut.user_index = '$ss';";

            /*
            ""s
            */
            $resstuds = mysqli_query($conn, $qrystuds);
            while($rowstuds=mysqli_fetch_assoc($resstuds)){
                if($rowstuds['schci'] === '0'){
                    $yl = $rowstuds['year_level'];
                    $qrystuds = "SELECT level_name FROM bed_level_info WHERE g_level = $yl;";

                    /*
                    ""s
                    */
                    $resstuds = mysqli_query($conn, $qrystuds);
                    while($rowstuds=mysqli_fetch_assoc($resstuds)){
                        var_dump($rowstuds);
                    }
                }else{
                    var_dump($rowstuds['schci']);
                }
				
			}


            /*
            $reasons = array();
            $qryreasons = "SELECT *
            FROM gp_reasons;";

            $resreasons = mysqli_query($conn, $qryreasons);
            while($rowreasons=mysqli_fetch_assoc($resreasons)){
				array_push($reasons,$rowreasons);
			}
            array_push($res,$reasons);
            */


?>