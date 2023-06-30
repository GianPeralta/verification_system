<?php
require('../server/sqli_conn.php');

if (isset($_POST['startDate']) && isset($_POST['endDate']) && isset($_POST['department'])) {
    $startDate = validateInput($_POST['startDate']);
    $endDate = validateInput($_POST['endDate']);
    $department = validateInput($_POST['department']);

    $res = array();
    $error = null;
    try {
        if ($department === '35' || $department === '36' || $department === '41') {
            if ($department === '35') {
                $res = secondarySchool($conn, $startDate, $endDate, 1, 9, 'ELEMENTARY', 35, 'ELEM', $res);
            } else if ($department === '36') {
                $res = secondarySchool($conn, $startDate, $endDate, 10, 17, 'JUNIOR HIGH SCHOOL', 36, 'HS', $res);
            } else {
                $res = secondarySchool($conn, $startDate, $endDate, 18, 53, 'SENIOR HIGH SCHOOL', 41, 'SHS', $res);
            }
        } else if($department === 'All Departments'){
            $qryrecords = queryBody($startDate, $endDate);

            $resrecords = mysqli_query($conn, $qryrecords);
            while ($rowrecords = mysqli_fetch_assoc($resrecords)) {
                array_push($res, $rowrecords);
            }
        }else {
            $qryrecords = queryBody($startDate, $endDate)."
            AND c.c_index = $department;";

            $resrecords = mysqli_query($conn, $qryrecords);
            while ($rowrecords = mysqli_fetch_assoc($resrecords)) {
                array_push($res, $rowrecords);
            }
        }
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
    $response = array(
        'error' => $error,
        'res' => $res
    );

    echo json_encode($response);
} else if (isset($_POST['retrieveColleges']) && $_POST['retrieveColleges'] === 'retrieveColleges') {
    $res = array();
    $error = null;
    try {
        $qrycollege = "SELECT * FROM college;";
        $rescollege = mysqli_query($conn, $qrycollege);
        while ($rowcollege = mysqli_fetch_assoc($rescollege)) {
            array_push($res, $rowcollege);
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

function secondarySchool($conn, $startDate, $endDate, $year_from, $year_to, $c_name, $c_index, $c_code, $res)
{
    $qryrecords = queryBody($startDate, $endDate)."
    AND sch.course_index = 0 
    AND sch.year_level >= $year_from && sch.year_level <= $year_to;";

    $resrecords = mysqli_query($conn, $qryrecords);
    while ($rowrecords = mysqli_fetch_assoc($resrecords)) {
        $rowrecords['c_name'] = $c_name;
        $rowrecords['c_index'] = $c_index;
        $rowrecords['c_code'] = $c_code;
        array_push($res, $rowrecords);
    }

    return $res;
}

function queryBody($startDate, $endDate){
    return "SELECT ut.user_index, ut.id_number, COALESCE(ut.lname, '-') as lname, COALESCE(ut.fname, '-') as fname, COALESCE(ut.mname, '-') as mname, CONCAT_WS(
        IFNULL(
          ':',
          ''
        ),
        grs.description,
        gr.reason_others
      ) AS reason, c.c_name, sch.course_index schci, sch.year_level, c.c_index, gr.create_dt
    FROM gp_record gr
    JOIN gp_reasons grs ON grs.r_index = gr.reason_index
    LEFT JOIN user_table ut ON ut.user_index = gr.user_index
    LEFT JOIN stud_curriculum_hist sch ON sch.user_index = ut.user_index
    LEFT JOIN graduation_data gd ON gd.stud_index = ut.user_index
    LEFT JOIN course_offered co ON co.course_index = sch.course_index
    LEFT JOIN college c ON c.c_index = co.c_index
    WHERE DATE(gr.create_dt) BETWEEN '$startDate' AND '$endDate'";
}
?>
