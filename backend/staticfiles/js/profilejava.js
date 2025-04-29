const navButtons = document.querySelectorAll('.menu li')

// SWITCH PAGES
let allUsers;
let userData;
const page1 = document.querySelector('.user-info')
const page2 = document.querySelector('.fav')
const page3 = document.querySelector('.detail')
const page4 = document.querySelector('.user-info')
const page5 = document.querySelector('.notifications')


navButtons.forEach(navButton => {
    navButton.addEventListener('click', ()=> {
        currNav = document.querySelector('.active')
        currNav.querySelector('img').src = currNav.querySelector('img').src.slice(0, -9) + ".png"
        currNav.classList.remove('active')

        navButton.classList.add('active')
        console.log(navButton.querySelector('img').getAttribute('alt'));

        navButton.querySelector('img').src = navButton.querySelector('img').src.slice(0, -4) + "Black.png"
        if(navButton.querySelector('img').getAttribute('alt') == "User Info"){
            page1.style.display = "block"
            page2.style.display = "none"
            page3.style.display = "none"
            page4.style.display = "block"
            page5.style.display = "none"
        }else if(navButton.querySelector('img').getAttribute('alt') == "Favorites"){
            page1.style.display = "none"
            page2.style.display = "block"
            page3.style.display = "none"
            page4.style.display = "none"
            page5.style.display = "none"

        }else if(navButton.querySelector('img').getAttribute('alt') == "History"){
            page1.style.display = "none"
            page2.style.display = "none"
            page3.style.display = "block"
            page4.style.display = "none"
            page5.style.display = "none"
        }else if(navButton.querySelector('img').getAttribute('alt') == "Setting"){
            page1.style.display = "none"
            page2.style.display = "none"
            page3.style.display = "none"
            page4.style.display = "block"
            page5.style.display = "none"
        }else{
            page1.style.display = "none"
            page2.style.display = "none"
            page3.style.display = "none"
            page4.style.display = "none"
            page5.style.display = "block"
        }
    })
});






// USER INFO
const editBtn = document.querySelector('.editBtn')
const fn = document.querySelector('.fn-input')
const ln = document.querySelector('.ln-input')
const us = document.querySelector('.us-input')
const em = document.querySelector('.em-input')


const afterEdit = document.querySelector('.afterEdit')
const deleteAccount = document.querySelector('.delete-acc-btn')
const saveBtn = document.querySelector('.saveBtn')

function editClicked(){
    fn.removeAttribute('readonly')
    ln.removeAttribute('readonly')
    us.removeAttribute('readonly')
//    em.removeAttribute('readonly')
    editBtn.style.display = "none"
    afterEdit.style.display = "flex"
    page1.style.opacity = "100%"
}

document.addEventListener("DOMContentLoaded", ()=> {
    fetchUserInfo()
    fetchAllUsers()
})

// EDITING USER INFO

async function fetchUserInfo() {
    try {
        let res = await fetch("/api/user-info/");
        let data = await res.json()
        userData = data;
        console.log(userData);
        userDisplay()
    } catch (error) {
        console.log("ERROR OCCURED");
    }

}

async function fetchAllUsers(){
    try {
        let res = await fetch("/api/all-usernames/");
        let data = await res.json()
        allUsers = data.usernames;
        console.log("fetch res:", allUsers);
    } catch (error) {
        console.log("ERROR OCCURED");
    }
}

    let nameh3 = document.querySelector('.name-h3')
    let usernameP = document.querySelector('.username-p')
function userDisplay(){
    nameh3.textContent = userData.first_name + " " + userData.last_name
    usernameP.textContent = "@" + userData.username
    fn.value = userData.first_name
    ln.value = userData.last_name
    us.value = userData.username
    em.value = userData.email
}

let warnMessage = document.querySelector('.user-info-warn')

function fnEdit(){
    if(fn.value.length < 2){
        warnMessage.style.color = "red"
        warnMessage.textContent = "First Name must have at least 3 characters"
    }else{
        warnMessage.textContent = ""
    }
    console.log("55454")

}
function lnEdit(){
    if(ln.value.length < 2){
        warnMessage.style.color = "red"
        warnMessage.textContent = "Last Name must have at least 3 characters"
    }else{
        warnMessage.textContent = ""
    }
}
function usEdit(){
    if (us.value.length < 3){
            warnMessage.style.color = "red"
            warnMessage.textContent = "Username must contain at least 3 character"
            return
    }else{
        console.log(allUsers.includes(us.value))
        if(allUsers.includes(us.value)){
            console.log("++++")
            warnMessage.style.color = "red"
            warnMessage.textContent = "Such username already exists"
            return
        }

    }

    warnMessage.textContent = "This username is valid"
    warnMessage.style.color = "green"
}

async function updateUserInfo() {

    if (warnMessage.textContent == "This username is valid" || warnMessage.textContent == ""){
            const firstName = document.querySelector('.fn-input').value;
            const lastName = document.querySelector('.ln-input').value;
            const username = document.querySelector('.us-input').value;
            const email = document.querySelector('.em-input').value;
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            try {
                const response = await fetch('/profile/update-user/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                        email: email
                    })
                });

                const result = await response.json();
                console.log("krdi")
                if (result.status === "success") {
                console.log("URA")
                    alert("User info updated!");
                } else {
                    alert("❌ " + result.message);
                }
            } catch (error) {
                console.error("Update failed", error);
                alert("❌ Something went wrong.");
            }

                editBtn.style.display = "block"
                afterEdit.style.display = "none"
    }else{
        return
    }

}
