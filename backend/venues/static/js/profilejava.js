const navButtons = document.querySelectorAll('.menu li')

// SWITCH PAGES
let allUsers;
let userData;
const page1 = document.querySelector('.user-info')
const page2 = document.querySelector('.fav')
const page3 = document.querySelector('.detail')
const page4 = document.querySelector('.settingUser')
const page5 = document.querySelector('.notifications')


navButtons.forEach(navButton => {
    navButton.addEventListener('click', ()=> {
         if(navButton.querySelector('img').getAttribute('alt') == "Logout"){
            return
        }
        console.log("This js")
        currNav = document.querySelector('.active')
        currNav.querySelector('img').src = currNav.querySelector('img').src.slice(0, -9) + ".png"
        currNav.classList.remove('active')

        navButton.classList.add('active')
//        console.log(navButton.querySelector('img').getAttribute('alt'));

        navButton.querySelector('img').src = navButton.querySelector('img').src.slice(0, -4) + "Black.png"
        if(navButton.querySelector('img').getAttribute('alt') == "User Info"){
            page1.style.display = "block"
            page2.style.display = "none"
            page3.style.display = "none"
            page4.style.display = "none"
            page5.style.display = "none"
        }else if(navButton.querySelector('img').getAttribute('alt') == "Favorites"){
            page1.style.display = "none"
            page2.style.display = "block"
            page3.style.display = "none"
            page4.style.display = "none"
            page5.style.display = "none"
            showFavVenues();
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
            showClientsOfVenue();
        }else{
            page1.style.display = "none"
            page2.style.display = "none"
            page3.style.display = "none"
            page4.style.display = "none"
            page5.style.display = "block"
            showCurrentNotif()
        }
    })
});




function togglePasswordForm() {
    const form = document.getElementById("passwordForm");
    const arrow = document.getElementById("arrowIcon");

    form.classList.toggle("active");
    arrow.classList.toggle("arrow-rotate");

}


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
window.addEventListener("beforeunload", function () {
    navigator.sendBeacon("/logout/");
});


document.addEventListener("DOMContentLoaded", async function () {
    try{
        const res = await fetch("/venues/api/user-bookings/")
        const data = await res.json();
        console.log("bookings",data)
        const tbody = document.getElementById("booking-table-body");

        data.bookings.forEach(booking => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td><strong>${booking.venue}</strong></td>
                    <td>${booking.price}</td>
                    <td class="status">
                        <span class="status-dot ${booking.status_color}"></span>
                        <span class="${booking.status_text.toLowerCase()}">${booking.status_text}</span>
                    </td>
                `;

                tbody.appendChild(row);
            });

    }catch(error){
        console.log("Errof Fethcing")
    }
});


async function showFavVenues(){
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    try{
        const res = await fetch('/venues/api/favorites/profile/', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,  // Include CSRF token
            },
        })
        const data = await res.json();
        console.log(data)

        const div = document.querySelector('.fav-venue-dives')
        div.innerHTML = '';  // Clear existing content

        data.venue_details.forEach(ven => {
            div.innerHTML +=
            `
                <div>
                    <img src="${ven.image}" alt="">
                    <div class="venue-detail">
                        <h3>${ven.name}</h3>
                        <p>${ven.category} * ${ven.location}  * ${ven.price_per_hour} &#8376 / hour</p>                    </div>
                    <img class="ven${ven.id}" onclick="delFav(${ven.id})" src="https://cdn3.iconfinder.com/data/icons/user-interface-glyph-3/32/bookmark-1024.png" alt="">
                </div>
            `
            console.log("DIV",div.innerHTML)
        })

    }catch{
           console.log("Fav alynbady")
    }
}
function addFav(ven_id){
    const csrfToken = getCookie("csrftoken");

    fetch(`/venues/add_favorite/${ven_id}/`, {
            method: 'POST', // Use POST for secure submission
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken, // Include CSRF token in header
            },
        })
        .then(response => response.json())
        .then(data => {
//            alert(data.message); // Show message based on the response from Django
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function delFav(ven_id){

    let img = document.querySelector('.ven'+ven_id)
    if(img.src == "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Font_Awesome_5_regular_bookmark.svg/640px-Font_Awesome_5_regular_bookmark.svg.png"){
        img.src = "https://cdn3.iconfinder.com/data/icons/user-interface-glyph-3/32/bookmark-1024.png"
        img.style.width = "8%"
        img.style.marginRight = "0%"
        addFav(ven_id)
    }else{
        img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Font_Awesome_5_regular_bookmark.svg/640px-Font_Awesome_5_regular_bookmark.svg.png"
        img.style.width = "4%"
        img.style.marginRight = "2%"
        const csrfToken = getCookie("csrftoken");

    console.log("Keldi")

    fetch(`/venues/remove_favorite/${ven_id}/`, {
            method: 'POST', // Use POST for secure submission
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken, // Include CSRF token in header
            },
        })
        .then(response => response.json())
        .then(data => {
//            alert(data.message); // Show message based on the response from DjangoTemplates
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }



}

function showLogoutPopup() {
    document.getElementById("logoutPopup").style.display = "block";
}

function hideLogoutPopup() {
    document.getElementById("logoutPopup").style.display = "none";
}

function confirmLogout() {
    window.location.href = "{% url 'logout' %}";  // Django logout URL
}


async function showClientsOfVenue(){
        try {
        const res = await fetch('/venues/get-owner-bookings/');
        const bookings = await res.json();

        const listContainer = document.querySelector('.list-container');
        listContainer.innerHTML = '';  // Clear previous content

        // Group bookings by date
        const groupedByDate = {};

        bookings.forEach(booking => {
            const date = booking.date;

            if (!groupedByDate[date]) {
                groupedByDate[date] = [];
            }

            groupedByDate[date].push(booking);
        });

        // Loop through each day and generate HTML blocks
        for (const [date, bookingsOfDay] of Object.entries(groupedByDate)) {
            let rows = '';

            bookingsOfDay.forEach(booking => {
                rows += `
                    <tr>
                        <td>${booking.time}</td>
                        <td>${booking.name}</td>
                        <td>${booking.price} &#8376;</td>
                    </tr>
                `;
            });

            const dayBlockHTML = `
                <div class="day-block">
                    <h2>${date}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            `;

            listContainer.innerHTML += dayBlockHTML;
        }

    } catch (error) {
        console.log("Error fetching bookings:", error);
    }
}

async function showCurrentNotif(){
    let notifContent = document.querySelector('.notif-content');
    notifContent.innerHTML = ''
    try{
        const res = await fetch('/venues/api/notifications/');
        const data = await res.json();
        console.log(data)
        data.forEach(not => {
            not.created_at = (timeAgo(not.created_at))

            notifContent.innerHTML +=
            `
                <div class="notif-card">
                    <div class="checked">
                        &#10004
                    </div>
                    <div>
                        <h2 class="notif-title">${not.title}</h2>
                        <p class="notif-time">${not.created_at}</p>
                        <p class="notif-desc">${not.content }</p>
                    </div>
                </div>
            `
        })
    }catch{

    }
}

function timeAgo(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(diffMs / 1000 / 60 / 60);
  const days = Math.floor(diffMs / 1000 / 60 / 60 / 24);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}