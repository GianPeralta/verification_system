const token = localStorage.getItem('userToken');
if(token != null){
    checkTokenValidity(token);
}else{
    window.location.replace('login.html');
}

function checkTokenValidity(token) {
    fetch('../server/token_check.php', {
        method: 'POST',
        body: new URLSearchParams({
        token: token,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Response not OK');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.replace('login.html');
    });
}
  
$('#userTab').append('<h2 style="padding-left:15px;">'+ localStorage.getItem('userPos') +' '+ localStorage.getItem('userName') +'</h2>');

$('#logout').on('click', function() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmpID');
    localStorage.removeItem('userPos');
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
        $UI =$(this).attr('ui');
        fetchStudentsDetails($UI);
        setTimeout(() => {
            clickProcessed = false;
        }, 3000); 
    }		
});	

function getFormattedDateTime() {
    const date = new Date();
  
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  
    const unformattedDate = date.toISOString().slice(0, 10);
  
    const unformattedTimeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const unformattedTime = date.toLocaleTimeString('en-US', unformattedTimeOptions);
  
    return { date: formattedDate, time: formattedTime, unFoDate: unformattedDate, unFoTime: unformattedTime };
  }
  

function fetchStudentsDetails(ui) {
    fetch('../server/stud_det_server.php', {
      method: 'POST',
      body: new URLSearchParams({
        str: ui
      }),
    })
    .then(response => response.json())
        .then(student => {
            console.log(student);
            $('#search-load').css('display', 'none');
            $verified = '<tr><td width="30%">Name:</td><td width="40%">' + student['res'][0][0].lname + ', ' + student['res'][0][0].fname + ' ' + student['res'][0][0].mname + '</td><td rowspan="8" width="30%"><img src="../client/img/uc_seal.png" alt="" width="100%" height="100%"></td></tr><tr><td>ID#:</td><td>' + student['res'][0][0].id_number + '</td></tr><tr><td>Dept.:</td><td>' + student['res'][0][0].c_name + '</td></tr><tr><td>Course:</td><td>' + student['res'][0][0].course_code + '</td></tr><tr><td>Year Level:</td><td>' + student['res'][0][0].year_level + '</td></tr><tr><td>Sex:</td><td>' + (student['res'][0][0].gender == 'F' ? 'Female':'Male') + '</td></tr><tr><td>Last Enrollment:</td><td>'+ toOrdinalNumber(student['res'][0][0].semester) + ' Trimester ' + student['res'][0][0].sy_from + '-' + student['res'][0][0].sy_to + '</td></tr><tr><td>Year Graduated:</td><td>' + student['res'][0][0].grad_year + '</td></tr><tr><td colspan="3"><div style="display: flex; justify-content: center;"><button id="confirm" style="width:50%; padding:5px; margin:0; background-color:#00b0f0;border:none;cursor:pointer" onmouseover=\'this.style.backgroundColor="#0080c0"\' onmouseout=\'this.style.backgroundColor="#00b0f0"\' >Confirm</button></div></td></tr><tr><td colspan="2">Reason:<br>';
            $confirmed = '<tr style="position:relative"> <td colspan="2"> <img src="./img/logo.png" alt="" width="90px" style="padding-left:5px"> <span style="position:absolute;bottom:5px;right:2px;font-size:8px;font-weight:700">OCCUPATIONAL SAFETY AND HEALTH OFFICE</span> </td></tr><tr class="grey"> <td colspan="2" style="font-weight:700;text-align:center">STUDENT TEMPORARY GATE PASS</td></tr><tr> <td>Date: ' + getFormattedDateTime().date + '</td><td>Entry Time: ' + getFormattedDateTime().time + '</td></tr><tr> <td colspan="2">Name: '+ student['res'][0][0].lname + ', ' + student['res'][0][0].fname + ' ' + student['res'][0][0].mname +' </td></tr><tr> <td colspan="2">Course & Year Level: ' + student['res'][0][0].course_code + ' ' + student['res'][0][0].year_level + ' </td></tr><tr class="grey"> <td colspan="2" style="font-weight:700;text-align:center">Reason</td></tr><tr> <td style="width:50%">';
            
            var reasonsLeft = '';
            var reasonsRight = '';
            var reasons = student['res'][1];
            var halfLength = Math.ceil(reasons.length / 2);

            for (var i = 0; i < reasons.length; i++) {
                var reason = reasons[i];
                if(reason['r_index'] !== '999'){
                    var reasonHtml = '<input type="checkbox" id="checkbox' + reason['r_index'] + '" name="checkbox' + reason['r_index'] + '" value="' + reason['description'] + '"> <label for="checkbox' + reason['r_index'] + '">' + reason['description'] + '</label> <br>';
                
                    if (i < halfLength) {
                        reasonsLeft += reasonHtml;
                    } else {
                        reasonsRight += reasonHtml;
                    }

                    $reason2 = '<input type="radio" name="option" value="'+ reason['description'] +'" id="' + reason['r_index'] + '"><label for="' + reason['r_index'] + '">'+ reason['description'] +'</label><br>';
                    $verified += $reason2;
                }
            }
            $verified += '<input type="radio" name="option" value="Others" id="999"><label for="999">Others:</label><input type="text" name="other_option" id="other_option" style="width:100%;float:right" placeholder="Input other reason" maxlength="28"></td><td style="padding: 20px;"><button style="width:100%; background-color: #00b0f0; height:90px; cursor: pointer; border-radius: 8px;" id="print-btn" onmouseover=\'this.style.backgroundColor="#0080c0"\' onmouseout=\'this.style.backgroundColor="#00b0f0"\' >Print</button><p style="color:red; text-align: center;" id="opt-err"></p></td></tr><tr><td colspan="3">Issuing Officer: '+ localStorage.getItem('userPos') +' '+ localStorage.getItem('userName') +'</td></tr>';
            $('#studentDetailsTable').append($verified);

            $recordhist='<tr><th colspan="3"><h3>Past Temporary Gate Pass Issuances</h3></th></tr><tr style="background-color: #e4fbe3;"><th>Reason</th><th>Date</th><th>Issued By</th></tr>';
            var records = student['res'][2];
            if(records.length !== 0){
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    $recordhist +='<tr><td>'+ record['reason'] +'</td><td>'+ record['create_dt'] +'</td><td>'+ record['name'] +'</td></tr>'; 
                }
            }else{
                $recordhist +='<tr><td colspan="3" style="text-align: center;">No previous issuances</td></tr>'; 
            }
            $('#studentRecordsTable').append($recordhist);
            
            $('#studentDetails').fadeIn(1500);
            
            $confirmed += reasonsLeft + '</td><td style="padding-right:20px;width:50%">' + reasonsRight + '<input type="checkbox" id="checkbox999" name="checkbox999" value="Others"> <label for="checkbox999">Others:</label> <br><input type="text" id="others" style="border:none;font-size:9px;border-bottom:1px solid #000;width:100%;background-color:transparent"> </td></tr><tr> <td colspan="2" style="font-style:italic;font-weight:700;text-align:center;">Note: This Student Temporary Gate pass is valid 1 day only</td></tr><tr> <td colspan="2"> <div style="width:70%;margin:0 auto;text-align:center;padding-top:15px;"> <hr> <span style="font-weight:700">Student Signature</span> </div></td></tr><tr> <td colspan="2"> <div style="margin:0 auto;text-align:center; padding-top: 15px;padding-bottom: 4px;"> <span style="text-decoration-line:underline; font-size:10px;">' + localStorage.getItem('userPos') + ' ' + localStorage.getItem('userName') + ' / ' + getFormattedDateTime().date + '</span> <br><span style="font-weight:700;font-size:8px;">Issuing Officer</span> <br><span style="font-size:8px;">(Name | Signature | Date)</span> </div></td></tr><tr> <td colspan="2" style="padding:0 0 0 3px;">UC-OSH-FORM-03 <br>May 26, 2022 Rev.01 </td></tr>';
            $('#gatePass').append($confirmed);

            $('#searchResults').hide();
          
            $('#other_option').prop('disabled', true);
            $('#studentDetailsTable tr:last-child, #studentDetailsTable tr:nth-last-child(2)').hide();
            $('#confirm').on('click', function() {
                $('#studentDetailsTable tr:last-child, #studentDetailsTable tr:nth-last-child(2)').show(1000);
                $('#studentDetailsTable tr:nth-last-child(3)').hide();
            });
            $('#print-btn').prop('disabled', true);
          
            $reason = '';
            $('input[type="radio"], #other_option').on('change', function() {
                $('input[type="checkbox"]').prop('checked', false);
                if($('input[type="radio"]:checked').attr('id') == "999"){
                    $('#other_option').prop('disabled', false);
                }else{
                    $('#other_option').prop('disabled', true);
                    $('#other_option').val('');
                }
                
                $('#opt-err').text("");
                $('#others').val('');
                forPrinting();
            });
             
            $('#print-btn').on('click', () => {
                var create_dt = getFormattedDateTime().unFoDate+' '+getFormattedDateTime().unFoTime;
                var created_by = localStorage.getItem('userEmpID');
                var user_index = student['res'][0][0].user_index;
                var reason_index = $('input[type="radio"]:checked').attr('id');
                $('#others').val($('#other_option').val().trim());
                var reason_others = $('#others').val();
                $("#checkbox" + $('input[type="radio"]:checked').attr('id')).prop("checked", true);
                if($('input[type="radio"]:checked').val() === 'Others'){
                    if($('#others').val().trim() === ''){
                        $('#opt-err').text("Input reason for 'Other' option");
                    }else{
                        window.print();
                        addToDB(create_dt, created_by, user_index, reason_index, reason_others);
                    }
                }else{
                    $('#others').val('');
                    window.print();
                    addToDB(create_dt, created_by, user_index, reason_index, null);
                }
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
    $('#studentRecordsTable').empty();
    $('#search-load').css('display', 'block');			
    if(ui.length>=2){
        fetch('../server/stud_list_server.php', {
            method: 'POST',
            body: new URLSearchParams({
                str: ui
            }),
        })
        .then(response => response.json())
        .then(studentResult => {
            		
            if ($('#studentDetails').is(':visible')) {
                $('#studentDetails').slideUp(500);
                $('#searchResults').slideDown(1000);
            } else {
                $('#searchResults').slideDown(1000);
            }
            if (studentResult['res'].length == 0) {
                $('#searchResultsTable').empty();
                $verified = '<tr><td style="text-align: center; font-weight:bold; background-color: #ff0000;">No Record Found</td></tr>';
                $('#studentDetailsTable').append($verified);
                $('#studentDetails').fadeIn(1500);
                $('#search-load').css('display', 'none');
            }else if (studentResult['res'].length == 1){
                fetchStudentsDetails(studentResult['res'][0].user_index);
            }else {
                $('#search-load').css('display', 'none');
                $('#searchResultsTable').empty();
                $('#searchErrorMessage').empty();
                $('#searchResultsTable').append("<tr class='dth'><th width='70%'>Name</th><th width='20%'>ID Number</th><th width='10%'>Gender</th></tr>");
                studentResult['res'].forEach(function(student) {
                    console.log(student);
                    $studentResultDisplay = '<tr ui="' + student.user_index + '"><td>' + student.lname + ', ' + student.fname + ' ' + student.mname +'</td><td>' + student.id_number + '</td><td>' + student.gender + '</td></tr>';
                    $('#searchResultsTable').append($studentResultDisplay);
                });
            }
        })
        .catch(error => console.error(error));
    }else{
        $('#searchResultsTable').empty();
        $('#searchErrorMessage').empty();
    }			
}
function addToDB(create_dt, created_by, user_index, reason_index, reason_others) {
    fetch('../server/insert_rec_server.php', {
        method: 'POST',
        body: new URLSearchParams({
            create_dt: create_dt,
            created_by: created_by,
            user_index: user_index,
            reason_index: reason_index,
            reason_others: reason_others
        }),
    })
    .then(response => {
        if (response.ok) {
            $('style[media="print"]').remove();
            $('#gatePass').empty();
            $('#studentDetailsTable').empty();	
            $('#studentRecordsTable').empty();
            $('#searchInput').val('');
        } else {
            console.log("Fetch unsuccessful");
        }
    })
    .catch(error => console.error(error));		
}
const monthList = document.getElementById("monthList");

function toOrdinalNumber(numberString) {
    var number = parseInt(numberString);
    var suffix = "";
  
    if (isNaN(number)) {
      return "Invalid number";
    }
  
    var lastDigit = number % 10;
    var secondLastDigit = Math.floor((number / 10) % 10);
  
    if (secondLastDigit === 1) {
      suffix = "th";
    } else {
      if (lastDigit === 1) {
        suffix = "st";
      } else if (lastDigit === 2) {
        suffix = "nd";
      } else if (lastDigit === 3) {
        suffix = "rd";
      } else {
        suffix = "th";
      }
    }
  
    return numberString + suffix;
  }

/*

function randomData(){

    const reasons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const firstNames = [131522, 128406, 126185, 127944, 131231, 188123, 128406];

    const fnameIndex = Math.floor(Math.random() * firstNames.length);
    const firstName = firstNames[fnameIndex];

    const reasonIndex = Math.floor(Math.random() * reasons.length);
    const reason = reasons[reasonIndex];

    var datetimes = generateDateTime();
    
    return { reason: reason, fname: firstName, datetime: datetimes};
}
console.log(randomData());

function generateDateTime() {
    var startDate = new Date('2023-06-25');
    var endDate = new Date('2023-06-29');
  
    var randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    var randomDate = new Date(randomTime);
  
    var year = randomDate.getFullYear();
    var month = String(randomDate.getMonth() + 1).padStart(2, '0');
    var day = String(randomDate.getDate()).padStart(2, '0');
    var hours = String(randomDate.getHours()).padStart(2, '0');
    var minutes = String(randomDate.getMinutes()).padStart(2, '0');
    var seconds = String(randomDate.getSeconds()).padStart(2, '0');
  
    var datetime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  
    return datetime;
  }
for(let i = 0; i< 200; i++){

    addToDB(randomData().datetime, 301900, randomData().fname, randomData().reason, null);
}
*/
