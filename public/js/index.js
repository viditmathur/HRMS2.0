var array=[];
function checkForNull(item){
    if(item.value==""){

    }
    else{

    }
}
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
        url:'https://'+process.env.URL+'/employee/'+userId,
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
        url: 'https://'+process.env.URL+'/skill/getAll',  
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
        url: 'https://'+process.env.URL+'/techStack/'+userId,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            for(i=0; i<data.length;i++){
                $.ajax({
                    url: 'https://'+process.env.URL+'/skills/'+data[i].SkillId,
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
        url: 'https://'+process.env.URL+'/addskillbyid/' + userId,    
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
    var dataToSend={
        "NickName":document.getElementById("nname").value,
        "DateOfBirth":document.getElementById("DOB").value,
        "Experience":document.getElementById("experience").value
    }
    $.ajax({
        url:'https://'+process.env.URL+'/employee/update/'+userId,
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
        url:'https://'+process.env.URL+'/techStack/'+userId+"/"+skillId,
        type: 'DELETE',
        success: function(data){
            location.reload();
        },
        error:function(err){
            console.log(err);
        }
    });
}