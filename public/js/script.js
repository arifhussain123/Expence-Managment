const onLogin = e => {
  e.preventDefault();
  e.stopPropagation();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  
  // Sign in existing user
  firebase.auth().signInWithEmailAndPassword(email, password)  
    .then(function(data) {
      // console.log('data :', data)
      swal({
        title: "Congurlation!",
        text: "Successfuly .logIn",
        icon: "success",
      });
      // alert("successfuly LogIn")
      window.location.assign("/src/dashboard/dashboard.html")
    })
    .catch(function (error) {
         // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // console.log('error :', errorMessage);
        swal("Error", "Check Yuor Data");
      })
};
