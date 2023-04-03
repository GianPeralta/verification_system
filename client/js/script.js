
if (!isLoggedIn()) {
    window.location.href = 'login.html';
}
function isLoggedIn() {
    const userToken = localStorage.getItem('userToken');
    return userToken !== null;
}
$('#userTab').append('<h2 style="padding-left:15px;">Hello, '+ localStorage.getItem('userPos') +' '+ localStorage.getItem('userName') +'</h2>');
console.log(localStorage.getItem('userName'));

$('#logout').click(function() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
});

$('#searchInput').keyup(function(key){	
    if(key.which==13){	
        $UI = $('#searchInput').val();	
        fetchStudent($UI);
    }
});

$('#verifyBtn').click(function() {
    $UI = $('#searchInput').val();	
    fetchStudent($UI);
});

let clickProcessed = false;
$('#searchResults').on('click','tr:not(:first)', function(){
    if (!clickProcessed) {
        clickProcessed = true;
        $UI =$(this).attr('idn');
        fetchStudentsDetails($UI);
        setTimeout(() => {
        clickProcessed = false;
        }, 3000); 
    }		
});	

function check(inp, chk1, chk2, chk3, chk4, chk5, chk6, chk7, chk8, val){
    $('#other_option').prop('disabled', inp);
    $("#checkbox1").prop("checked", chk1);
    $("#checkbox2").prop("checked", chk2);
    $("#checkbox3").prop("checked", chk3);
    $("#checkbox4").prop("checked", chk4);
    $("#checkbox5").prop("checked", chk5);
    $("#checkbox6").prop("checked", chk6);
    $("#checkbox7").prop("checked", chk7);
    $("#checkbox8").prop("checked", chk8);
    $('#others').val(val);
}

function getFormattedDateTime() {
    const date = new Date();

    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return { date: formattedDate, time: formattedTime };
}

function fetchStudentsDetails(ui) {
    fetch('../server/server.php', {
      method: 'POST',
      body: new URLSearchParams({
        str: ui,
        loc: 'verifyResult'
      }),
    })
    .then(response => response.json())
        .then(studentResult => {
            console.log(studentResult);
            const student = {
                name: studentResult[0].name,
                id: studentResult[0].student_id,
                department: studentResult[0].department,
                course: studentResult[0].course,
                yearLevel: studentResult[0].year_level,
                sex: studentResult[0].sex,
                lastEnrollment: studentResult[0].last_enrollment,
                yearGraduated: studentResult[0].year_graduated,
                date: getFormattedDateTime().date,
                time: getFormattedDateTime().time,
                pic: studentResult[0].image_data
            };
            console.log(student);
            
            $verified = '<tr><td colspan="3" style="text-align: center; font-weight:bold; background-color: ' + (student.lastEnrollment == '2nd Trimester S.Y. 2022-2023' ? '#00b050;">Student Currently Enrolled' : '#ff0000;">Student Currently not Enrolled') + '</td></tr><tr><td width="30%">Name:</td><td width="40%">' + student.name + '</td><td rowspan="8" width="30%"><img src="data:image/jpeg;base64,' + student.pic + '" alt="" width="100%" height="100%"></td></tr><tr><td>ID#:</td><td>' + student.id + '</td></tr><tr><td>Dept.:</td><td>' + student.department + '</td></tr><tr><td>Course:</td><td>' + student.course + '</td></tr><tr><td>Year Level:</td><td>' + student.yearLevel + '</td></tr><tr><td>Sex:</td><td>' + student.sex + '</td></tr><tr><td>Last Enrollment:</td><td>' + student.lastEnrollment + '</td></tr><tr><td>Year Graduated:</td><td>' + student.yearGraduated + '</td></tr><tr><td colspan="3"><div style="display: flex; justify-content: center;"><button id="confirm" style="width:50%; padding:5px; margin:0; background-color:#00b0f0;border:none;cursor:pointer" onmouseover=\'this.style.backgroundColor="#0080c0"\' onmouseout=\'this.style.backgroundColor="#00b0f0"\' >Confirm</button></div></td></tr><tr><td colspan="2">Reason:<br><input type="radio" name="option" value="Lost" id="option1"><label for="option1">Lost</label><br><input type="radio" name="option" value="Forgot" id="option2"><label for="option2">Forgot</label><br><input type="radio" name="option" value="Did not process ID yet" id="option3"><label for="option3">Did not process ID yet</label><br><input type="radio" name="option" value="ID lost, on process for renewal" id="option4"><label for="option4">ID lost, on process for renewal</label><br><input type="radio" name="option" value="Misplaced" id="option5"><label for="option5">Misplaced</label><br><input type="radio" name="option" value="Confiscated" id="option6"><label for="option6">Confiscated</label><br><input type="radio" name="option" value="Deposited" id="option7"><label for="option7">Deposited</label><br><input type="radio" name="option" value="Others" id="option8"><label for="option8">Others:</label><input type="text" name="other_option" id="other_option" style="width:65%;float:right" placeholder="Enter other option"></td><td style="padding: 20px;"><button style="width:100%; background-color: #00b0f0; height:90px; cursor: pointer; border-radius: 8px;" id="print-btn" onmouseover=\'this.style.backgroundColor="#0080c0"\' onmouseout=\'this.style.backgroundColor="#00b0f0"\' >Print</button></td></tr>';
            $('#studentDetailsTable').append($verified);
            $('#studentDetails').fadeIn(1500);
            
            $confirmed = '<tr style="position:relative"><td colspan="2"><img src="./img/logo.png" alt="" width="140px" style="padding-left:5px"><span style="position:absolute;bottom:5px;right:10px;font-size:12px;font-weight:700">OCCUPATIONAL SAFETY AND HEALTH OFFICE</span></td></tr><tr class="grey"><td colspan="2" style="font-weight:700;text-align:center">STUDENT TEMPORARY GATE PASS</td></tr><tr><td>Date: ' + student.date + '</td><td>Entry Time: ' + student.time + '</td></tr><tr><td colspan="2">Name: '+ student.name +' </td></tr><tr><td colspan="2">Course & Year Level: '+ student.course + ' ' + student.yearLevel +' </td></tr><tr class="grey"><td colspan="2" style="font-weight:700;text-align:center">Reason</td></tr><tr><td style="padding-left:20px;width:50%"><input type="checkbox" id="checkbox1" name="checkbox1" value="Lost"><label for="checkbox1">Lost</label><br><input type="checkbox" id="checkbox2" name="checkbox2" value="Forgot"><label for="checkbox2">Forgot</label><br><input type="checkbox" id="checkbox3" name="checkbox3" value="Did not process ID yet"><label for="checkbox3">Did not process ID yet</label><br><input type="checkbox" id="checkbox4" name="checkbox4" value="ID lost, on process for renewal"><label for="checkbox4">ID lost, on process<br>for renewal</label><br></td><td style="padding-left:20px;padding-right:20px;width:50%"><input type="checkbox" id="checkbox5" name="checkbox5" value="Misplaced"><label for="checkbox5">Misplaced</label><br><input type="checkbox" id="checkbox6" name="checkbox6" value="Confiscated"><label for="checkbox6">Confiscated</label><br><input type="checkbox" id="checkbox7" name="checkbox7" value="Deposited"><label for="checkbox7">Deposited</label><br><input type="checkbox" id="checkbox8" name="checkbox8" value="Others"><label for="checkbox8">Others:</label><br><input type="text" id="others" style="border:none;border-bottom:1px solid #000;width:100%;background-color:transparent"></td></tr><tr><td colspan="2" style="font-style:italic;font-weight:700;text-align:center;font-size:14px">Note: This Student Temporary Gate pass is valid 1 day only</td></tr><tr><td colspan="2"><div style="width:70%;margin:0 auto;text-align:center;padding-top:60px;padding-bottom:10px"><hr><span style="font-weight:700">Student Signature</span></div></td></tr><tr><td colspan="2"><div style="margin:0 auto;text-align:center;padding-top:15px;padding-bottom:10px"><span style="text-decoration-line:underline">'+ localStorage.getItem('userPos') +' '+ localStorage.getItem('userName') +' / '+ student.date +'</span><br><span style="font-weight:700;font-size:13px">Issuing Officer</span><br><span style="font-size:13px">(Name | Signature | Date)</span></div></td></tr><tr><td colspan="2" style="font-size:13px">UC-OSH-FORM-03<br>May 26, 2022 Rev.01</td></tr>';
            $('#gatePass').append($confirmed);
            
            $('#searchResults').hide();
          
            $('#other_option').prop('disabled', true);
            $('#studentDetailsTable tr:last-child').hide();
            $('#confirm').click(function() {
                $('#studentDetailsTable tr:last-child').show(500);
                $('#studentDetailsTable tr:last-child').prev().hide();
            });
            $reason = '';
            $('input[type="radio"], #other_option').change(function() {
                if ($('#option8').is(':checked')) {
                    check(false, false, false, false, false, false, false, false, true, $('#other_option').val());
                    $reason = $('#checkbox8').val() + ': ' + $('#others').val();
                }else if ($('#option1').is(':checked')){
                    check(true, true, false, false, false, false, false, false, false, '');
                    $reason = $('#checkbox1').val();
                }else if ($('#option2').is(':checked')){
                    check(true, false, true, false, false, false, false, false, false, '');
                    $reason = $('#checkbox2').val();
                }else if ($('#option3').is(':checked')){
                    check(true, false, false, true, false, false, false, false, false, '');
                    $reason = $('#checkbox3').val();
                }else if ($('#option4').is(':checked')){
                    check(true, false, false, false, true, false, false, false, false, '');
                    $reason = $('#checkbox4').val();
                }else if ($('#option5').is(':checked')){
                    check(true, false, false, false, false, true, false, false, false, '');
                    $reason = $('#checkbox5').val();
                }else if ($('#option6').is(':checked')){
                    check(true, false, false, false, false, false, true, false, false, '');
                    $reason = $('#checkbox6').val();
                }else if ($('#option7').is(':checked')){
                    check(true, false, false, false, false, false, false, true, false, '');
                    $reason = $('#checkbox7').val();
                }
            });
            $('#print-btn').prop('disabled', true);
            $('input[type="radio"]').click(function() {
                if($('input[type="radio"]:checked').length == 1) {
                    $('#print-btn').prop('disabled', false);
                    var printCSS = $('<style media="print">');
                    printCSS.append('#gatePassTab, #gatePassTab * { visibility: visible; }');
                    $('head').append(printCSS); 
                }
            });
            
            $('#print-btn').click(() => {
                window.print();
                addToDB(student.name, student.id, $reason, student.date, student.department);
            });
            
                     
        })
    .catch(error => console.error(error));
}

function fetchStudent(ui) {
    $('style[media="print"]').remove();
    $('#gatePass').empty();
    $('#studentDetailsTable').empty();			
    if(ui.length>=2){
        fetch('../server/server.php', {
            method: 'POST',
            body: new URLSearchParams({
                str: ui,
                loc: 'studentResult'
            }),
        })
        .then(response => response.json())
        .then(studentResult => {
            console.log(studentResult);
            
            if ($('#studentDetails').is(':visible')) {
                $('#studentDetails').slideUp(500);
                $('#searchResults').slideDown(1000);
            } else {
                $('#searchResults').slideDown(1000);
            }
            if (studentResult.length == 0) {
                $('#searchResultsTable').empty();
                $verified = '<tr><td style="text-align: center; font-weight:bold; background-color: #ff0000;">No Record Found</td></tr>';
                $('#studentDetailsTable').append($verified);
                $('#studentDetails').fadeIn(1500);
            }
            
            else if (studentResult.length == 1){
                fetchStudentsDetails(studentResult[0].id);
            }
            
            else {
                $('#searchResultsTable').empty();
                $('#searchErrorMessage').empty();
                $('#searchResultsTable').append("<tr class='dth'><th width='40%'>Name</th><th width='20%'>ID Number</th><th width='40%'>Strand</th></tr>");
                studentResult.forEach(function(student) {
                    $studentResultDisplay = '<tr idn="' + student.id + '"><td>' + student.name + '</td><td>' + student.student_id + '</td><td>' + student.department + '</td></tr>';
                    $('#searchResultsTable').append($studentResultDisplay);
                });
                console.log(studentResult);
            }
            
        })
        .catch(error => console.error(error));
    }else{
        $('#searchResultsTable').empty();
        $('#searchErrorMessage').empty();
    }			
}

function addToDB(name, student_id, reason, date, department) {
    fetch('../server/server.php', {
        method: 'POST',
        body: new URLSearchParams({
            name: name,
            student_id: student_id,
            reason: reason,
            date: date,
            department: department,
            loc: 'addToDb'
        }),
    })
    .then(response => {
        if (response.ok) {
            $('style[media="print"]').remove();
            $('#gatePass').empty();
            $('#studentDetailsTable').empty();	
            $('#searchInput').val('');
        } else {
            console.log("Fetch unsuccessful");
        }
    })
    .catch(error => console.error(error));		
}

$('#submit-button').click(function() {
    $('#listHeader').empty();
    $('#displayTabTable').empty();
    $department = $("#deptList").val();
    $reason = $("#reasonList").val();
    $month = $("#monthList").val();
    $year = $("#yearList").val();
    $day = $("#dayList").val();
    $deptMonth = '<h3>UNIVERSITY OF THE CORDILLERAS</h3><h5>Governor Pack Rd. Baguio City</h5><h4>Occupational Safety and Health Office</h4><h5>List of Student Without ID</h5><h5>' + $department + '</h5> <h5>' + ($month == 'All Months' ? $month: 'Month of ' + $month) + '</h5>';
    $('#listHeader').append($deptMonth);
    $('#listHeader').show(500);
    $('#displayTab').show(500);
    retrieveList($department, $reason, $month, $year, $day);
});

function retrieveList(department, reason, month, year, day){
    fetch('../server/server.php', {
        method: 'POST',
        body: new URLSearchParams({
            department: department,
            reason: reason,
            month: month,
            year: year,
            day: day,
            loc: 'retrieveList'
        }),
    })
    .then(response => response.json())
    .then(studentResult => {
        console.log(studentResult);
        $('#displayTabTable').append("<tr><th>Name</th><th>Student ID #</th><th>Reason</th><th>Date</th></tr>");
        if (studentResult.length == 0) {
            $('#displayTabTable').append('<tr><td style="text-align:center;"colspan="4">No Record Found</td></tr>');
        } else {
            studentResult.forEach(function(student) {
                $listDisplay = '<tr><td>' + student.name + '</td><td>' + student.student_id + '</td><td>' + student.reason + '</td><td>' + student.date + '</td></tr>';
                $('#displayTabTable').append($listDisplay);
            });  
        }
    })
    .catch(error => console.error(error));	
}

