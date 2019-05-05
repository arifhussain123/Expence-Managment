const db = firebase.firestore();
let currentUser;
firebase.auth().onAuthStateChanged(user => {
    db.collection('users').doc(user.uid).get()
        .then(doc => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                currentUser = doc.data()
                document.getElementById("userName").innerHTML = currentUser.userName;
                db.collection('users').doc(user.uid)
                    .onSnapshot((userdata) => { 
                        currentUser = {...userdata.data(), uid: user.uid};
                        generateTableRows()
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
});

let generateTableRows = () => {
    var tableData = currentUser.tasks.map((task, index) => (
    `
        <tr>
            <td>${task.description}</td>
            <td>${task.priority}</td>
            <td>
            <button class="btn btn-success" data-toggle="modal" data-target="#exampleModal" onclick="edittsk(${index})">Edit</button>
            <button class="btn btn-danger" onclick="deletTsk(${index})">Delet</button>
            </td>
            
        </tr>
    `
    )).join('');
      
    var tbody = document.querySelector('#body');
    tbody.innerHTML = tableData;
} 


function deletTsk(dd){
    let filtertask = currentUser.tasks.filter((taks, index)=>{
        return index !== dd
    })
    // console.log(currentUser);
    firebase.firestore().collection("users").doc(currentUser.uid).update({
        tasks: filtertask
    })
}

function edittsk(index)
{
    let modelBody = document.getElementById('modelBody');
    modelBody.innerHTML = `
        <form onsubmit="updateTask(event,${index})">
            <div class="form-group">
                <label class="control-label" for="description">Description:</label>
                <input type="text" class="form-control" value="${currentUser.tasks[index].description}" id="description" placeholder="Enter Description"
                    value="" data-field="description" required="">
            </div>
            <div class="form-group">
                <label class="control-label" for="priority">Priority:</label>
                <select class="form-control" id="priority" data-field="priority" required="">
                    <option value="Low" ${ currentUser.tasks[index].priority === "Low" ? "Selected" : ""} >Low</option>
                    <option value="High" ${ currentUser.tasks[index].priority === "High" ? "Selected" : ""} >High</option>
                </select>
            </div>
            <div class="d-flex flex-column">
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    `
}

function updateTask(e, index)
{
    e.preventDefault();
    e.stopPropagation();

    let description = document.getElementById("description").value;
    let priority = document.getElementById("priority").value;

    let currentUserTask =  currentUser.tasks[index];
    // console.log("Current task", currentUserTask)
     currentUserTask = { ...currentUserTask };
        currentUserTask.description = description;
        currentUserTask.priority = priority;

    var tasks = currentUser.tasks
        tasks[index] = currentUserTask;
    firebase.firestore().collection('users').doc(currentUser.uid).update({tasks})
    .then(() =>{
        alert("Update successfull");
        $('#exampleModal').modal('hide');
    })
    .catch((error) =>{
        alert("Error: " + error.message)
    })
}

let logout = () => {
    firebase.auth().signOut()
        .then(function(data) {
            console.log('data :', data)
            window.location = "/index.html"
        })
}
let addTask = () => {
    window.location = "../task/task.html"
}