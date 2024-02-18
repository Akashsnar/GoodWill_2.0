const form = document.getElementById("blog-signin-form");
const email = document.getElementById("exampleInputEmail1");
const password = document.getElementById("exampleInputPassword1");
const errMessages = document.getElementsByClassName("err-message");
errMessages[0].style.display = "none";
email.addEventListener("change", (e) => { 
    errMessages[0].style.display = "none";
})
password.addEventListener("change", (e) => { 
    errMessages[0].style.display = "none";
})
form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(email.value, password.value);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log("success");
            window.location.href = "http://localhost:3000/bloghome";
        }
        if (this.readyState === 4 && this.status === 404) {
            console.log("user doesn't exists");
            errMessages[0].style.display = "block";
        }
    }
    xhr.open("POST", "http://localhost:3000/bloguser/signin");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`email=${email.value}&password=${password.value}`);
})