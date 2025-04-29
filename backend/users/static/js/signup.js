const closedEyes = document.querySelectorAll('.closed-eye')
const passwordInput = document.getElementById('password-input')
const passwordCInput = document.getElementById('passwordC-input')

closedEyes.forEach(closedEye => {
    closedEye.addEventListener('click', ()=>{
        console.log("joined");
        console.log(closedEye.src);

        if(closedEye.src == includes("closedEyeSign.png")){
            closedEyes.forEach(eye => {
                eye.src = "../images/openedEyeSign.png"
            })
            passwordInput.type = "text"
            passwordCInput.type = "text"
        }else{
            closedEyes.forEach(eye => {
                eye.src = "../images/closedEyeSign.png"
            })
            passwordInput.type = "password"
            passwordCInput.type = "password"
        }
    })
})


const redLevel = document.getElementById('redLevel')
const yellowLevel = document.getElementById('yellowLevel')
const greenLevel = document.getElementById('greenLevel')

const levelWord = document.querySelector('.passwordC-and-eye p')

function checkPassword(){
    let currentPass = passwordInput.value
    console.log(currentPass);

    if(currentPass.length == 0){
        console.log("length 0");

        redLevel.style.backgroundColor = "white"
        levelWord.textContent = ""
    }
    if(currentPass.length < 8){
        redLevel.style.backgroundColor = "grey"
        levelWord.textContent = "Inconsistent"
    }
    if(currentPass.length > 8 && /[^a-zA-Z]/.test(currentPass) && /[^a-zA-Z0-9]/.test(currentPass)){
        greenLevel.style.backgroundColor = "grey";
        yellowLevel.style.backgroundColor = "grey";
        levelWord.textContent = "Strong password"
    }else {
        greenLevel.style.backgroundColor = "white"
        levelWord.textContent = "Partially consistent"
    }
    if((currentPass.length > 8 && /[^a-zA-Z0-9]/.test(currentPass)) || (currentPass.length > 8 && /[^a-zA-Z]/.test(currentPass))){
        yellowLevel.style.backgroundColor = "grey";
        levelWord.textContent = "Partially consistent"
    }else{
        yellowLevel.style.backgroundColor = "white"
        levelWord.textContent = "Inconsistent"
    }
}

//const signupBtn = document.querySelector('.signup-button')
//
//signupBtn.addEventListener('click',()=>{
//event.preventDefault();
//    document.querySelector('.verification-container').style.display = "block"
//})
