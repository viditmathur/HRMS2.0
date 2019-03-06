var array=[];
var userId="1";
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

function getEmployeeDetail(){
    $.ajax({
        url:'https://'+'emphrms.herokuapp.com'+'/employee/'+userId,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            console.log(data);
            document.getElementById("fname").value = data.FirstName;
            document.getElementById("lname").value = data.LastName;
            document.getElementById("nname").value = data.FirstName;
            document.getElementById("email").value = data.Email;
            document.getElementById("location").value = data.Location;
            document.getElementById("experience").value = data.PastExperience;
            document.getElementById("designation").value = data.Designation;
            document.getElementById("division").value = data.Department;
            document.getElementById("DOB").value = formatDate(data.DateOfBirth);
            document.getElementById("DOJ").value = formatDate(data.DateOfJoining);
        }
    });

    $.ajax({
        type: 'GET',
        url: 'https://'+'emphrms.herokuapp.com'+'/skill/getAll',  
        success: function (data) {
            console.log(data);
            for (i = 0; i < data.length; i++) {
                $("#skilldrop").append(
                    '<option value="' + data[i].Id + '">' + data[i].Name + '</option>' 
                );
            }       
        }
    });

    $.ajax({
        url: 'https://'+'emphrms.herokuapp.com'+'/techStack/'+userId,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            for(i=0; i<data.length;i++){
                $.ajax({
                    url: 'https://'+'emphrms.herokuapp.com'+'/skills/'+data[i].SkillId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){
                        $('#skills').append(
                            '<tr><td>' + data[0].Name+
                            '</td><td>' + data[0].Category+ 
                            '</td><td><a onclick="deleteSkills(this.id)" href="javascript:void(0)" id="'+data[0].Id+'"><i class="far fa-trash" aria-hidden="true"></i></a>'+
                            '</td></tr>'
                        );
                    }
                });
            }
        }
    });
}

function skillupdate(){
    var newskilldata = {    
        "SkillId" : Number(document.getElementById("skilldrop").value)
    };
    console.log(newskilldata);
    $.ajax({
        type: 'POST',
        url: 'https://'+'emphrms.herokuapp.com'+'/addskillbyid/' + userId,    
        data: newskilldata,
        success: function (data) {
            location.reload();
        },
        error: function(err){
            console.log(err);
        }
    })
}

function updatedetails(){
    var nname = document.getElementById("nname").value;
    var dob = document.getElementById("DOB").value;
    var experience = document.getElementById("experience").value;
    if(nname==''||dob==''||experience==''){
        alert('Fill all records!!!');
    }
    else{
        var dataToSend={
            "NickName":nname,
            "DateOfBirth":dob,
            "Experience":experience
        }
    $.ajax({
        url:'https://'+'emphrms.herokuapp.com'+'/employee/update/'+userId,
        type: 'PATCH',
        data:dataToSend,
        success: function(data){
            location.reload();
        },
        error:function(err){
            console.log(err);
        }
    });
}

function deleteSkills(skillId){
    $.ajax({
        url:'https://'+'emphrms.herokuapp.com'+'/techStack/'+userId+"/"+skillId,
        type: 'DELETE',
        success: function(data){
            location.reload();
        },
        error:function(err){
            console.log(err);
        }
    });
}