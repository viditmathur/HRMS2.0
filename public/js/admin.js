var updateId="";
function validateEmail(emailField){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField.value) == false) {
        return false;
    }
    return true;
}
$(document).ready(function(){ 
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    String.prototype.stripSlashes = function(){
        return this.replace(/\\(.)/mg, "$1");
    }

    function validateData(data){
        data = data.trim();
        data = data.stripSlashes();
        data = escapeHtml(data);
        return data;
    }
    $("#bt1").click(submission);
    function submission(){
        var first_name= document.getElementById("fname").value;
        var last_name= document.getElementById("lname").value;
        var nick_name= document.getElementById("fname").value;
        var location= document.getElementById("location").value;
        var email= document.getElementById("email").value;
        var designation = document.getElementById("designation").value;  
        var department = document.getElementById("department").value;
        var doj = document.getElementById("DOJ").value;
        var password = document.getElementById("password").value;
        if(first_name=='' || last_name=='' || nick_name==''||location==''||email==''||designation==''||department==''||doj==''||password==''){
            alert('Fill all records!!!');
        }
        else{ 
            if(validateEmail(document.getElementById("email").value)){
                alert("Not a valid email");
            }
            else{
                if ((password.length < 4) || (password.length > 8))
                {
                    alert("Your Password must be 4 to 8 Character");
                }
                else{
                    var dataToSend={
                        "FirstName": first_name,
                        "LastName": last_name,
                        "NickName":nick_name,
                        "Location": location,
                        "Email": email,
                        "Role": designation,                
                        "Department" :department,
                        "DateOfJoining":doj,
                        "Password":password,
                        "Status":"Active"
                    };
                    $.ajax({
                        url: 'https://emphrms.herokuapp.com/employee',
                        data: dataToSend,
                        type:'POST',
                        dataType:'json',
                        success:function(res){
                            alert("User added!!!");
                            location.reload();
                        }
                    });
                }
            }
        }
    }
    $("#userTable1").click(getemployee);
    function getemployee(){
        limit=2;
        $.ajax({
            type:'GET',
            url: 'https://emphrms.herokuapp.com/count',
            headers:{
                "limit":limit
            },
            success: function(data){
                var pages = Math.ceil(data.recordset[0].count/limit);
                console.log(data);
                if(pages>0){
                    $("#pagination_nav").empty();
                    for(i = 1; i <= pages; i++){
                        $("#pagination_nav").append(
                            "<div id='btn_div' style = 'display: table-cell'>" +
                            '<button><a onclick="loadPageData(this.id)" href="javascript:void(0);" id="'+i+'">' + i + '</a></button>' +
                            "</div>"
                        );
                    }
                    $.ajax({
                        type: 'GET',
                        url: 'https://emphrms.herokuapp.com/employee',   
                        headers:{
                            "pagenumber":1,
                            "limit":2
                        },
                        success: function(data) {
                            $("#user_table").empty();
                            console.log(data);
                            $("#user_table").append('<tr><th>Name</th><th>Email</th><th>Status</th><th>Update</th><th>Delete</th></tr>');
                            for (i = 0; i < data.recordset.length; i++) {
                                console.log(data.recordset[i].FirstName);
                                if(data.recordset[i].Status=='Inactive'){
                                    $("#user_table").append(
                                        '<tr><td id = "name">' +data.recordset[i].FirstName +" "+ data.recordset[i].LastName+
                                        '</td><td id = "Email">' + data.recordset[i].Email +
                                        '</td><td id = "Status">' + data.recordset[i].Status +
                                        '</td></tr>'
                                    );
                                }
                                else{
                                    $("#user_table").append(
                                        '<tr><td id = "name">' +data.recordset[i].FirstName +" "+ data.recordset[i].LastName+
                                        '</td><td id = "Email">' + data.recordset[i].Email +
                                        '</td><td id = "Status">' + data.recordset[i].Status +
                                        '</td><td id = "Status"><button type="submit" class="btn btn-primary " id="'+ data.recordset[i].EmployeeId+'"  data-toggle="modal" data-target="#updateuser" onclick="loadDataForUpdate(this.id);">Update</button> ' +
                                        '</td><td id = "Status"><button type="submit" class="btn btn-primary " id="'+ data.recordset[i].EmployeeId+'" onclick="changeStatus(this.id)">Delete</button> ' +
                                        '</td></tr>'
                                    );
                                }
                            } 
                        }  
                    });
                }
            }
        });
    }

    $("#skillTable1").click(getskills);
    function getskills(){
        limit=5;
        $.ajax({
            type:'GET',
            url: 'https://emphrms.herokuapp.com/count2',
            headers:{
                "limit":limit
            },
            success: function(data){
                var pages = Math.ceil(data.recordset[0].count/limit);
                console.log(data);
                if(pages>0){
                    $("#pagination_nav2").empty();
                    for(i = 1; i <= pages; i++){
                        $("#pagination_nav2").append(
                            "<div id='btn_div' style = 'display: table-cell'>" +
                            '<button><a onclick="loadPageData2(this.id)" href="javascript:void(0);" id="'+i+'">' + i + '</a></button>' +
                            "</div>"
                        );
                    }
                    $.ajax({
                        type: 'GET',
                        url: 'https://emphrms.herokuapp.com/skills', 
                        dataType:'json',
                        headers:{
                            "pagenumber":1,
                            "limit":5
                        },
                        success: function(data) {
                            $("#skills").empty();
                            $('#skills').append('<tr><th>Skill</th><th>Implementation</th></tr>');
                            for(i=0; i<data.recordset.length;i++){
                                console.log(data.recordset[i].Name);
                                $('#skills').append(
                                    '<tr><td id="name">' + data.recordset[i].Name+
                                    '</td><td id="category">' + data.recordset[i].Category+
                                    '</td></tr>'
                                );
                            }  
                        }  
                    });
                }
            }
        });
    }
});

function addskills(){
    var name= document.getElementById("skillname").value;
    var category= document.getElementById("implementation").value;
    if(name==''||category==''){
        alert("Fill all records!!!");
    }
    else{
        var dataToSend={
            "SkillName":name,
            "Category":category,
        };
        $.ajax({
            url: 'https://emphrms.herokuapp.com/skill',
            data: dataToSend,
            type:'POST',
            dataType:'json',
            success:function(res){
                alert("New Skill Added!!!");
            }
        });
    }
}

function changeStatus(userId){
    $.ajax({
        type:'PATCH',
        url:'https://emphrms.herokuapp.com/delete/'+userId,
        success:function(data){
            document.getElementById(userId).disabled=true;
            alert("employee removed!!!");
        },
        error:function(err){
            console.log(err);
        }
    });
}

function loadPageData2(page){
    var pageNumber = page;
    $.ajax({
        type: 'GET',
        url: 'https://emphrms.herokuapp.com/skills', 
        dataType:'json',
        headers:{
            "pagenumber":pageNumber,
            "limit":5
        },
        success: function(data) {
            $("#skills").empty();
            $('#skills').append('<tr><th>Skill</th><th>Implementation</th></tr>');
            for(i=0; i<data.recordset.length;i++){
                console.log(data.recordset[i].Name);
                $('#skills').append(
                    '<tr><td id="name">' + data.recordset[i].Name+
                    '</td><td id="category">' + data.recordset[i].Category+
                    '</td></tr>'
                );
            }  
        }  
    });
}

function loadPageData(page){
    var pageNumber = page;
    $.ajax({
        type: 'GET',
        url: 'https://emphrms.herokuapp.com/employee', 
        dataType:'json',
        headers:{
            "pagenumber":pageNumber,
            "limit":2
        },
        success: function(data) {
            $("#user_table").empty();
            console.log(data);
            $("#user_table").append('<tr><th>Name</th><th>Email</th><th>Status</th><th>Update</th><th>Delete</th></tr>');
            for (i = 0; i < data.recordset.length; i++) {
                console.log(data.recordset[i].FirstName);
                if(data.recordset[i].Status=='Inactive'){
                    $("#user_table").append(
                        '<tr><td id = "name">' +data.recordset[i].FirstName +" "+ data.recordset[i].LastName+
                        '</td><td id = "Email">' + data.recordset[i].Email +
                        '</td><td id = "Status">' + data.recordset[i].Status +
                        '</td><td id = "Status"><button type="submit" class="btn btn-primary disabled>Delete</button> ' +
                        '</td></tr>'
                    );
                }
                else{
                    $("#user_table").append(
                        '<tr><td id = "name">' +data.recordset[i].FirstName +" "+ data.recordset[i].LastName+
                        '</td><td id = "Email">' + data.recordset[i].Email +
                        '</td><td id = "Status">' + data.recordset[i].Status +
                        '</td><td id = "Status"><button type="submit" class="btn btn-primary " id="'+ data.recordset[i].EmployeeId+'"  data-toggle="modal" data-target="#updateuser" onclick="loadDataForUpdate(this.id)" data-toggle ="modal" data-target = "#updateuser">Update</button></td><td><button type="submit" class="btn btn-primary " id="'+ data.recordset[i].EmployeeId+'" onclick="changeStatus(this.id)">Delete</button> ' +
                        '</td></tr>'
                    );
                }
            }  
        }  
    });
}

function formatDate(date){
    var today = new Date(date); 
    var dd = today.getDate(); 
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear(); 
    if(dd<10){dd='0'+dd} 
    if(mm<10){mm='0'+mm}
    var formattedDate = yyyy+"-"+mm+"-"+dd;
    return formattedDate;
}

function loadDataForUpdate(user){
    updateId = user;
    $.ajax({
        type:'GET',
        url:'https://emphrms.herokuapp.com/employee/'+user,
        success:function(data){
            document.getElementById('fname_update').value = data.FirstName;
            document.getElementById('lname_update').value = data.LastName;
            document.getElementById('nname_update').value = data.NickName;
            document.getElementById('location_update').value = data.Location;
            document.getElementById('email_update').value = data.Email;
            document.getElementById('designation_update').value = data.Designation;
            document.getElementById('department_update').value = data.Department;
            document.getElementById('DOJ_update').value = formatDate(data.DateOfJoining);
        }
    });
}

function updateEmployee(){
    var fname=document.getElementById('fname_update').value;
    var lname=document.getElementById('lname_update').value;
    var nname=document.getElementById('nname_update').value;
    var location = document.getElementById('location_update').value;
    var email = document.getElementById('email_update').value;
    var designation = document.getElementById('designation_update').value;
    var department = document.getElementById('department_update').value;
    var doj = document.getElementById('DOJ_update').value;
    if(fname==''||lname==''||nname==''||location==''||email==''||designation==''||department==''||doj==''){
        alert("Please fill all records!!!");
    }
    else{
        if(validateEmail(email)){
            alert("Please fill a valid email!!!");
        }
        else{
            var dataToSend={
                "FirstName":fname,
                "LastName":lname,
                "NickName":nname,
                "Location":location,
                "Email":email,
                "Designation":designation,
                "Department":department,
                "DateOfJoining":doj
            }
            console.log(dataToSend);
            $.ajax({
                type:'PATCH',
                url:'https://emphrms.herokuapp.com/employee/'+updateId,
                data:dataToSend,
                success:function(data){
                    alert(data);
                }
            });
        }
    }
}