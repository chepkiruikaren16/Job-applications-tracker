

let applications = JSON.parse(
    localStorage.getItem("applications")
) || [];



function saveApplications(){

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}







const form = document.getElementById("applicationForm");


if(form){


    let editId = localStorage.getItem("editId");



   

    if(editId){


        let app =
        applications.find(
            item => item.id == editId
        );



        if(app){


            document.getElementById("company").value =
            app.company || "";


            document.getElementById("position").value =
            app.position || "";


            document.getElementById("location").value =
            app.location || "";


            document.getElementById("salary").value =
            app.salary || "";


            document.getElementById("applicationDate").value =
            app.applicationDate || "";


            document.getElementById("applicationDeadline").value =
            app.applicationDeadline || "";


            document.getElementById("interviewDate").value =
            app.interviewDate || "";


            document.getElementById("status").value =
            app.status || "";


            document.getElementById("notes").value =
            app.notes || "";


        }


    }





    form.addEventListener(
    "submit",
    function(e){


        e.preventDefault();



        const application = {


            id:

            editId
            ?
            Number(editId)
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





        if(
            application.company === "" ||
            application.position === ""
        ){

            alert(
            "Please enter company name and job position"
            );

            return;

        }





        if(editId){


            applications =
            applications.map(
                item =>
                item.id == editId
                ?
                application
                :
                item
            );


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









const applicationList =
document.getElementById("applicationList");



function displayApplications(){


    if(!applicationList){

        return;

    }



    applicationList.innerHTML = "";



    if(applications.length === 0){


        applicationList.innerHTML =
        "<h3>No Applications Added</h3>";


        return;

    }




    applications.forEach(app => {



        let card =
        document.createElement("div");



        card.className =
        "application-card";



        card.innerHTML = `


        <h3>
        ${app.position}
        </h3>



        <p>
        <strong>Company Name:</strong>
        ${app.company || "Not provided"}
        </p>



        <p>
        <strong>Location:</strong>
        ${app.location || "Not provided"}
        </p>



        <p>
        <strong>Salary:</strong>
        ${app.salary || "Not provided"}
        </p>



        <p>
        <strong>Application Date:</strong>
        ${app.applicationDate || "Not set"}
        </p>



        <p>
        <strong>Application Deadline:</strong>
        ${app.applicationDeadline || "Not set"}
        </p>



        <p>
        <strong>Interview Date:</strong>
        ${app.interviewDate || "Not scheduled"}
        </p>



        <p>
        <strong>Status:</strong>
        ${app.status}
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









function editApplication(id){


    localStorage.setItem(
        "editId",
        id
    );



    window.location.href =
    "add-application.html";


}










function deleteApplication(id){


    if(confirm("Delete this application?")){


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










function updateDashboard(){


    const total =
    document.getElementById("totalApplications");


    const interviews =
    document.getElementById("interviews");


    const offers =
    document.getElementById("offers");


    const rejected =
    document.getElementById("rejections");



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









const search =
document.getElementById("search");



if(search){


search.addEventListener(
"input",
function(){


let value =
search.value.toLowerCase();



let filtered =
applications.filter(
app =>

app.company.toLowerCase()
.includes(value)

||

app.position.toLowerCase()
.includes(value)

);



applicationList.innerHTML="";



filtered.forEach(app=>{


let div =
document.createElement("div");


div.className =
"application-card";


div.innerHTML = `

<h3>${app.position}</h3>

<p>
<strong>Company:</strong>
${app.company}
</p>

<p>
<strong>Status:</strong>
${app.status}
</p>

`;


applicationList.appendChild(div);


});


});


}






/* ===== LOAD PAGE ===== */


displayApplications();

updateDashboard();


console.log(
"Job Applications Tracker Loaded"
);