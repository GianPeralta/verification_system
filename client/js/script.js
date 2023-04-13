
if (localStorage.getItem('userToken') === null) {
    window.location.href = 'login.html';
} 

$('#userTab').append('<h2 style="padding-left:15px;">'+ localStorage.getItem('userPos') +' '+ localStorage.getItem('userName') +'</h2>');

$('#logout').on('click', function() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
});

$('#display_records').on('click', function() {
    window.location.href = 'display.html';
});

$('#verification').on('click', function() {
    window.location.href = 'index.html';
});

$('#searchInput').on('keyup', function(event){
    if(event.key === 'Enter'){
        $UI = $('#searchInput').val();
        fetchStudent($UI);
    }
});

$('#verifyBtn').on('click', function() {
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

    const unFormattedDate = date.toISOString().slice(0, 10);

    return { date: formattedDate, time: formattedTime, unFoDate: unFormattedDate};
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
                unFormattedDate : getFormattedDateTime().unFoDate,
                time: getFormattedDateTime().time,
                pic: studentResult[0].image_data
            };
            console.log(student);
            
            $verified = '<tr><td colspan="3" style="text-align: center; font-weight:bold; background-color: ' + (student.lastEnrollment == '2nd Trimester S.Y. 2022-2023' ? '#00b050;">Student Currently Enrolled' : '#ff0000;">Student Currently not Enrolled') + '</td></tr><tr><td width="30%">Name:</td><td width="40%">' + student.name + '</td><td rowspan="8" width="30%"><img src="data:image/jpeg;base64,' + student.pic + '" alt="" width="100%" height="100%"></td></tr><tr><td>ID#:</td><td>' + student.id + '</td></tr><tr><td>Dept.:</td><td>' + student.department + '</td></tr><tr><td>Course:</td><td>' + student.course + '</td></tr><tr><td>Year Level:</td><td>' + student.yearLevel + '</td></tr><tr><td>Sex:</td><td>' + student.sex + '</td></tr><tr><td>Last Enrollment:</td><td>' + student.lastEnrollment + '</td></tr><tr><td>Year Graduated:</td><td>' + student.yearGraduated + '</td></tr><tr><td colspan="3"><div style="display: flex; justify-content: center;"><button id="confirm" style="width:50%; padding:5px; margin:0; background-color:#00b0f0;border:none;cursor:pointer" onmouseover=\'this.style.backgroundColor="#0080c0"\' onmouseout=\'this.style.backgroundColor="#00b0f0"\' >Confirm</button></div></td></tr><tr><td colspan="2">Reason:<br><input type="radio" name="option" value="Lost" id="option1"><label for="option1">Lost</label><br><input type="radio" name="option" value="Forgot" id="option2"><label for="option2">Forgot</label><br><input type="radio" name="option" value="Did not process ID yet" id="option3"><label for="option3">Did not process ID yet</label><br><input type="radio" name="option" value="ID lost, on process for renewal" id="option4"><label for="option4">ID lost, on process for renewal</label><br><input type="radio" name="option" value="Misplaced" id="option5"><label for="option5">Misplaced</label><br><input type="radio" name="option" value="Confiscated" id="option6"><label for="option6">Confiscated</label><br><input type="radio" name="option" value="Deposited" id="option7"><label for="option7">Deposited</label><br><input type="radio" name="option" value="Others" id="option8"><label for="option8">Others:</label><input type="text" name="other_option" id="other_option" style="width:65%;float:right" placeholder="Enter other option"></td><td style="padding: 20px;"><button style="width:100%; background-color: #00b0f0; height:90px; cursor: pointer; border-radius: 8px;" id="print-btn" onmouseover=\'this.style.backgroundColor="#0080c0"\' onmouseout=\'this.style.backgroundColor="#00b0f0"\' >Print</button></td></tr>';
            $('#studentDetailsTable').append($verified);
            $('#studentDetails').fadeIn(1500);
            
            $confirmed = '<tr style="position:relative"> <td colspan="2"> <img src="./img/logo.png" alt="" width="90px" style="padding-left:5px"> <span style="position:absolute;bottom:5px;right:2px;font-size:8px;font-weight:700">OCCUPATIONAL SAFETY AND HEALTH OFFICE</span> </td></tr><tr class="grey"> <td colspan="2" style="font-weight:700;text-align:center">STUDENT TEMPORARY GATE PASS</td></tr><tr> <td>Date: ' + student.date + '</td><td>Entry Time: ' + student.time + '</td></tr><tr> <td colspan="2">Name: '+ student.name +' </td></tr><tr> <td colspan="2">Course & Year Level: '+ student.course + ' ' + student.yearLevel +' </td></tr><tr class="grey"> <td colspan="2" style="font-weight:700;text-align:center">Reason</td></tr><tr> <td style="width:50%"> <input type="checkbox" id="checkbox1" name="checkbox1" value="Lost"> <label for="checkbox1">Lost</label> <br><input type="checkbox" id="checkbox2" name="checkbox2" value="Forgot"> <label for="checkbox2">Forgot</label> <br><input type="checkbox" id="checkbox3" name="checkbox3" value="Did not process ID yet"> <label for="checkbox3">Did not process ID yet</label> <br><input type="checkbox" id="checkbox4" name="checkbox4" value="ID lost, on process for renewal"> <label for="checkbox4">ID lost, on process <br>for renewal </label> <br></td><td style="padding-right:20px;width:50%"> <input type="checkbox" id="checkbox5" name="checkbox5" value="Misplaced"> <label for="checkbox5">Misplaced</label> <br><input type="checkbox" id="checkbox6" name="checkbox6" value="Confiscated"> <label for="checkbox6">Confiscated</label> <br><input type="checkbox" id="checkbox7" name="checkbox7" value="Deposited"> <label for="checkbox7">Deposited</label> <br><input type="checkbox" id="checkbox8" name="checkbox8" value="Others"> <label for="checkbox8">Others:</label> <br><input type="text" id="others" style="border:none;font-size:9px;border-bottom:1px solid #000;width:100%;background-color:transparent"> </td></tr><tr> <td colspan="2" style="font-style:italic;font-weight:700;text-align:center;">Note: This Student Temporary Gate pass is valid 1 day only</td></tr><tr> <td colspan="2"> <div style="width:70%;margin:0 auto;text-align:center;padding-top:15px;"> <hr> <span style="font-weight:700">Student Signature</span> </div></td></tr><tr> <td colspan="2"> <div style="margin:0 auto;text-align:center; padding-top: 15px;padding-bottom: 4px;"> <span style="text-decoration-line:underline; font-size:10px;">'+ localStorage.getItem('userPos') +' '+ localStorage.getItem('userName') +' / '+ student.date +'</span> <br><span style="font-weight:700;font-size:8px;">Issuing Officer</span> <br><span style="font-size:8px;">(Name | Signature | Date)</span> </div></td></tr><tr> <td colspan="2" style="padding:0 0 0 3px;">UC-OSH-FORM-03 <br>May 26, 2022 Rev.01 </td></tr>';
            $('#gatePass').append($confirmed);
            
            $('#searchResults').hide();
          
            $('#other_option').prop('disabled', true);
            $('#studentDetailsTable tr:last-child').hide();
            $('#confirm').on('click', function() {
                $('#studentDetailsTable tr:last-child').show(1000);
                $('#studentDetailsTable tr:last-child').prev().hide();
            });
            $('#print-btn').prop('disabled', true);
            $reason = '';
            $('input[type="radio"], #other_option').on('change', function() {
                if ($('#option8').is(':checked')) {
                    check(false, false, false, false, false, false, false, false, true, $('#other_option').val().trim());
                    $reason = $('#checkbox8').val() + ': ' + $('#other_option').val().trim();
                    if($('#other_option').val().trim() != ''){
                        forPrinting();
                    }else{
                        $('#print-btn').prop('disabled', true);
                    }
                }else if ($('#option1').is(':checked')){
                    check(true, true, false, false, false, false, false, false, false, '');
                    $reason = $('#checkbox1').val();
                    forPrinting();
                }else if ($('#option2').is(':checked')){
                    check(true, false, true, false, false, false, false, false, false, '');
                    $reason = $('#checkbox2').val();
                    forPrinting();
                }else if ($('#option3').is(':checked')){
                    check(true, false, false, true, false, false, false, false, false, '');
                    $reason = $('#checkbox3').val();
                    forPrinting();
                }else if ($('#option4').is(':checked')){
                    check(true, false, false, false, true, false, false, false, false, '');
                    $reason = $('#checkbox4').val();
                    forPrinting();
                }else if ($('#option5').is(':checked')){
                    check(true, false, false, false, false, true, false, false, false, '');
                    $reason = $('#checkbox5').val();
                    forPrinting();
                }else if ($('#option6').is(':checked')){
                    check(true, false, false, false, false, false, true, false, false, '');
                    $reason = $('#checkbox6').val();
                    forPrinting();
                }else if ($('#option7').is(':checked')){
                    check(true, false, false, false, false, false, false, true, false, '');
                    $reason = $('#checkbox7').val();
                    forPrinting();
                } 
            });
            
            $('#print-btn').on('click', () => {
                window.print();
                addToDB(student.name, student.id, $reason, student.unFormattedDate, student.department);
            });      
        })
    .catch(error => console.error(error));
}

function forPrinting(){
    $('style[media="print"]').remove();
    $('#print-btn').prop('disabled', false);
    var printCSS = $('<style media="print">');
    printCSS.append('#gatePassTab, #gatePassTab * { visibility: visible; }');
    $('head').append(printCSS); 
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
const monthList = document.getElementById("monthList");



$('#submit-button').on('click', function() {
    $('#listHeader').empty();
    $('#displayTabTable').empty();
    $startDate = $('#startDate').val();
    $endDate = $('#endDate').val();
    $department = $('#deptList').val();
 
    //$deptMonth = '<h3>UNIVERSITY OF THE CORDILLERAS</h3><h5>Governor Pack Rd. Baguio City</h5><h4>Occupational Safety and Health Office</h4><h5>List of Student Without ID</h5><h5>All Departments</h5>';
    //$('#listHeader').append($deptMonth);
    $('#listHeader').show(500);
    $('#displayTab').show(500);
    
    retrieveList($startDate, $endDate, $department);
});

$('#print-display').on('click', function() {
    window.print();
});
function formattedDate(date){
    var dateObj = new Date(date);
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var formattedDate = monthNames[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
    return formattedDate;
}

function retrieveList(startDate, endDate, department){
    fetch('../server/server.php', {
        method: 'POST',
        body: new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
            department: department,
            loc: 'retrieveList'
        }),
    })
    .then(response => response.json())
    .then(studentResult => {
        console.log(department);
        console.log(formattedDate(startDate));
        $('#displayTabTable').append(`<thead><tr id="display-head" style="display: none;"> <th colspan="4" style="text-align: center; border: none; padding-bottom: 25px;"> <h3>UNIVERSITY OF THE CORDILLERAS</h3> <h5>Governor Pack Rd. Baguio City</h5> <h4>Occupational Safety and Health Office</h4> <h5>List of Student Without ID</h5> <h5>`+department+`</h5> <h5>`+formattedDate(startDate)+` - `+formattedDate(endDate)+`</h5> </th> </tr><tr> <th> Name <select id="nameSort"name="nameSort"style="float:right"> <option value="Ascending">Ascending</option> <option value="Descending">Descending</option> </select> </th> <th> Student ID # </th> <th> Reason </th> <th> Date <select id="dateSort"name="dateSort"style="float:right"> <option value="Ascending">Ascending</option> <option value="Descending">Descending</option> </select> </th> </tr></thead>`);
        if (studentResult.length == 0) {
            $('#displayTabTable').append('<tbody><tr><td style="text-align:center;"colspan="4">No Record Found</td></tr></tbody>');
        } else {
            var $newElement = $('<tbody></tbody>');
            studentResult.forEach(function(student) {
                var $listDisplay = '<tr><td>' + student.name + '</td><td>' + student.student_id + '</td><td>' + student.reason + '</td><td>' + student.date + '</td></tr>';
                $newElement.append($listDisplay);          
            });  
            $('#displayTabTable').append($newElement);
            //$('#displayTabTable').append(`<tfoot><tr><td><span class="page-number">Page</span></td></tr></tfoot>`);
            $('#displayTabTable').append(`<tfoot></tfoot>`);
        }
//<tfoot><tr><td></td></tr><td colspan="4">Table footer</td></tfoot>
        sortName("Ascending");
        $('#nameSort').click(function() {
            var sort = $(this).val();
            sortName(sort);
        });
        $('#dateSort').click(function() {
            var sort = $(this).val();
            sortDate(sort);
        });
    })
    .catch(error => console.error(error));	
}
function sortDate(sort) {
  var table, tbody, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("displayTabTable");
  tbody = table.getElementsByTagName("tbody")[0];
  switching = true;
  while (switching) {
    switching = false;
    rows = tbody.rows;
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[3];
      y = rows[i + 1].getElementsByTagName("td")[3];
      if (sort == "Ascending") {
        if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (new Date(x.innerHTML) < new Date(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}


function sortName(sort) {
  var table, tbody, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("displayTabTable");
  tbody = table.getElementsByTagName("tbody")[0];
  switching = true;
  while (switching) {
    switching = false;
    rows = tbody.rows;
    for (i = 0; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];
      if (sort == "Ascending") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }

  }
  

}

/*
function randomData(){

    const reasons = ['Lost', 'Forgot', 'Did not process ID yet', 'ID lost, on process for renewal',
     'Misplaced', 'Confiscated', 'Deposited'];

    const departments = ['College of Information Technology and Computer Science', 'College of Accountancy', 'College of Teacher Education', 
    'College of Criminal Justice Education', 'College of Arts and Sciences', 'College of Business Administration', 'College of Engineering and Architecture',
    'College of Hospitality and Tourism Management', 'College of Nursing', 'College of Law',
    ];
    const firstNames = ['Alice', 'Benjamin', 'Caroline', 'David', 'Emily', 'Frank', 'Grace', 'Henry', 'Isabel', 'Jacob', 'Katherine', 'Lucas', 'Megan', 'Nathan', 'Olivia', 'Peter', 'Quentin', 'Rachel', 'Samantha', 'Thomas', 'Ursula', 'Victoria', 'William', 'Xander', 'Yvonne', 'Zachary'];

    const lastNames = ['Adams', 'Baker', 'Carter', 'Davis', 'Evans', 'Fisher', 'Gomez', 'Harris', 'Ingram', 'Johnson', 'Khan', 'Lee', 'Mitchell', 'Nguyen', 'Olsen', 'Perez', 'Quinn', 'Robinson', 'Sato', 'Thompson', 'Underwood', 'Valdez', 'Williams', 'Xu', 'Yang', 'Zhang'];

    const lnameIndex = Math.floor(Math.random() * lastNames.length);
    const lastName = lastNames[lnameIndex];

    const fnameIndex = Math.floor(Math.random() * firstNames.length);
    const firstName = firstNames[fnameIndex];

    const reasonIndex = Math.floor(Math.random() * reasons.length);
    const reason = reasons[reasonIndex];

    const departmentIndex = Math.floor(Math.random() * departments.length);
    const department= departments[departmentIndex];
    
    let startDate = new Date(2023, 0, 1); // January 1, 2022
    let endDate = new Date(2023, 11, 31); // December 31, 2022
    
    let randomDates = randomDate(startDate, endDate);
    const formattedDate = randomDates.toISOString().slice(0, 10);
    console.log(formattedDate);
    
    return { date: formattedDate, reason: reason, department: department, lname: lastName, fname: firstName};
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

 

for(let i = 0; i< 200; i++){
    addToDB(""+randomData().fname+", "+randomData().lname+"", "18-1690-714", randomData().reason, randomData().date, randomData().department);
}
*/