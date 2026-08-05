/* =====================================
   JOB APPLICATIONS TRACKER
   FULL SCRIPT
===================================== */


/* =========================
   GET SAVED DATA
========================= */

let applications = JSON.parse(
    localStorage.getItem("applications")
) || [];



function saveApplications(){

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}




/* =========================
   ADD / EDIT APPLICATION
========================= */


const form = document.getElementById("applicationForm");


if(form){


    const editId =
    localStorage.getItem("editId");



    if(editId){


        const oldApplication =
        applications.find(
            app => app.id == editId
        );



        if(oldApplication){


            document.getElementById("company").value =
            oldApplication.company || "";


            document.getElementById("position").value =
            oldApplication.position || "";


            document.getElementById("location").value =
            oldApplication.location || "";


            document.getElementById("salary").value =
            oldApplication.salary || "";


            document.getElementById("applicationDate").value =
            oldApplication.applicationDate || "";


            document.getElementById("applicationDeadline").value =
            oldApplication.applicationDeadline || "";


            document.getElementById("interviewDate").value =
            oldApplication.interviewDate || "";


            document.getElementById("status").value =
            oldApplication.status || "";


            document.getElementById("notes").value =
            oldApplication.notes || "";


        }


    }





form.addEventListener(
"submit",
function(e){


e.preventDefault();



const application = {


id:

localStorage.getItem("editId")
?
Number(localStorage.getItem("editId"))
:
Date.now(),



company:

document.getElementById("company").value.trim(),



position:

document.getElementById("position").value.trim(),



location:

document.getElementById("location").value.trim(),



salary:

document.getElementById("salary").value.trim(),



applicationDate:

document.getElementById("applicationDate").value,



applicationDeadline:

document.getElementById("applicationDeadline").value,



interviewDate:

document.getElementById("interviewDate").value,



status:

document.getElementById("status").value,



notes:

document.getElementById("notes").value.trim()



};




if(application.company === "" ||
application.position === ""){


alert(
"Please enter company name and position"
);


return;


}





const existingIndex =
applications.findIndex(
app => app.id === application.id
);




if(existingIndex !== -1){


applications[existingIndex] =
application;


}
else{


applications.push(application);


}




saveApplications();



localStorage.removeItem("editId");



alert(
"Application saved successfully!"
);



form.reset();



window.location.href =
"applications.html";



});


}






/* =========================
   DISPLAY APPLICATIONS
========================= */


const applicationList =
document.getElementById("applicationList");



function displayApplications(list = applications){



if(!applicationList){

return;

}



applicationList.innerHTML = "";




if(list.length === 0){


applicationList.innerHTML = `

<h3>No Applications Added</h3>

`;

return;


}




list.forEach(app => {



const card =
document.createElement("div");



card.className =
"application-card";



card.innerHTML = `


<h3>
${app.position}
</h3>


<p>
<strong>Company Name:</strong>
${app.company}
</p>


<p>
<strong>Location:</strong>
${app.location || "Not provided"}
</p>


<p>
<strong>Status:</strong>
${app.status}
</p>


<p>
<strong>Application Date:</strong>
${app.applicationDate}
</p>


<p>
<strong>Notes:</strong>
${app.notes || "No notes"}
</p>



<button 
class="edit-btn"
onclick="editApplication(${app.id})">

Edit

</button>



<button 
class="delete-btn"
onclick="deleteApplication(${app.id})">

Delete

</button>


`;



applicationList.appendChild(card);



});


}







/* =========================
   EDIT APPLICATION
========================= */


function editApplication(id){


localStorage.setItem(
"editId",
id
);



window.location.href =
"add-application.html";


}







/* =========================
   DELETE APPLICATION
========================= */


function deleteApplication(id){


const confirmDelete =
confirm(
"Delete this application?"
);



if(confirmDelete){


applications =
applications.filter(
app =>
app.id !== id
);



saveApplications();



displayApplications();



updateDashboard();


}


}






/* =========================
   DASHBOARD COUNTERS
========================= */


function updateDashboard(){



const total =
document.getElementById(
"totalApplications"
);



const interviews =
document.getElementById(
"interviews"
);



const offers =
document.getElementById(
"offers"
);



const rejected =
document.getElementById(
"rejections"
);





if(total){

total.textContent =
applications.length;

}



if(interviews){

interviews.textContent =
applications.filter(
app =>
app.status === "Interview Scheduled"
).length;

}



if(offers){

offers.textContent =
applications.filter(
app =>
app.status === "Offer Received"
).length;

}



if(rejected){

rejected.textContent =
applications.filter(
app =>
app.status === "Rejected"
).length;

}



}







/* =========================
   SEARCH
========================= */


const search =
document.getElementById("search");



if(search){


search.addEventListener(
"input",
function(){


const value =
search.value.toLowerCase();



const filtered =
applications.filter(
app =>

app.company
.toLowerCase()
.includes(value)

||

app.position
.toLowerCase()
.includes(value)

);



displayApplications(filtered);



});


}







/* =========================
   STATUS FILTER
========================= */


const filter =
document.getElementById(
"statusFilter"
);



if(filter){


filter.addEventListener(
"change",
function(){


if(filter.value === "All"){


displayApplications();


}

else{


displayApplications(

applications.filter(
app =>
app.status === filter.value
)

);


}


});


}






/* =========================
   LOAD PAGE
========================= */


displayApplications();


updateDashboard();



console.log(
"Job Applications Tracker Loaded"
);