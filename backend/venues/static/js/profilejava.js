const navButtons = document.querySelectorAll('.menu li')
let allVenues;

// SWITCH PAGES
let allUsers;
let userData;
let bookingData;
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
        const bookingKoi = document.querySelector('.booking-history-page')
        bookingKoi.style.display = "none";

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

document.addEventListener("DOMContentLoaded", () => {
    fetchVenues()
});


async function fetchVenues(){
    console.log("JOINED")
    try {
        let response = await fetch("/venues/api/venues/")

        let data = await response.json()

        allVenues = data.venues

        console.log("VENULAR", allVenues)

    } catch (error) {
        console.log(error);
    }
    console.log("all venues", allVenues)
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
        bookingData = await res.json();
        console.log("bookings",bookingData)
        const tbody = document.getElementById("booking-table-body");



        bookingData.bookings.forEach(booking => {
                const row = document.createElement("tr");
                row.classList.add("each-booking");
                row.id = `${booking.id}`

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
    monitorClickBooking()
});


function monitorClickBooking(){
    const allBookings = document.querySelectorAll('.each-booking')
    allBookings.forEach(booking_row => {
        booking_row.addEventListener('click', ()=> {
            page3.style.display = 'none';
            let curr_id = booking_row.id;
            bookingData.bookings.forEach(searchBooking => {
                let curr_address;
                if(searchBooking.id == curr_id){
                    allVenues.forEach(cv => {
                        if(cv.id == searchBooking.venue_id){
                            curr_address = cv.location;
                        }
                    })
                    console.log("Address", curr_address)
                    if(searchBooking.status_text == 'Ended'){
                        const bookingHP = document.querySelector('.booking-history-page')
                        bookingHP.style.display = "flex";
                        bookingHP.style.flexDirection = "column";
                        bookingHP.innerHTML = `
                                <div class="booking-card">
                                    <div class="booking-card-details">
                                        <div class="back-btn"><</div>
                                        <div class="venue-label">Venue name</div>
                                        <div class="venue-name">${searchBooking.venue}</div>
                                        <div class="venue-address">
                                            <span class="label">Address:</span>
                                            <span class="value">${curr_address}</span>
                                        </div>
                                        <div class="venue-datetime">
                                            <span class="label">Date &amp; time:</span>
                                            <span class="value">${searchBooking.time}</span>
                                        </div>
                                        <div class="venue-total">
                                            <span class="label">Total:</span>
                                            <span class="value total-price">${searchBooking.price}</span>
                                        </div>
                                        <div class="venue-status">
                                            <span class="label">Status:</span>
                                            <span class="status"><span class="status-dot orange"></span>${searchBooking.status_text}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="venue-rating-form">
                                    <div class="venue-rating-title">How do you rate this venue?</div>
                                    <div class="venue-stars">
                                        <span class="star">&#9733;</span>
                                        <span class="star">&#9733;</span>
                                        <span class="star">&#9733;</span>
                                        <span class="star">&#9733;</span>
                                        <span class="star">&#9733;</span>
                                    </div>
                                    <textarea class="venue-feedback-input" rows="3" placeholder = "Write feedback here"></textarea>
                                    <button class="venue-feedback-send">Send</button>
                                </div>
                        `
                        monitorRating()
                        document.querySelector('.venue-feedback-send').addEventListener('click', async function() {
                            // Get the selected rating
                            const stars = document.querySelectorAll('.venue-stars .star');
                            let rating = 0;
                            stars.forEach((star, idx) => {
                                if (star.classList.contains('selected')) {
                                    rating = idx + 1;
                                }
                            });

                            // Get the feedback text
                            const feedback = document.querySelector('.venue-feedback-input').value;

                            // Get other details (you may need to adjust these based on your data structure)
                            const venue_id = searchBooking.venue_id; // Make sure this is available in your searchBooking object

                            // Call the async function to send data
                            await sendRating({venue_id, rating, feedback});
                        });

                        document.querySelector('.back-btn').addEventListener('click', ()=> {
                            page3.style.display = 'block';
                            bookingHP.style.display = 'none';
                        })
                    }else{
                        const bookingHP = document.querySelector('.booking-history-page')
                        bookingHP.style.display = "flex";
                        bookingHP.style.flexDirection = "column";
                        bookingHP.innerHTML = `
                                <div class="booking-card">
                                    <div class="booking-card-details">
                                        <div class="back-btn"><</div>
                                        <div class="venue-label">Venue name</div>
                                        <div class="venue-name">${searchBooking.venue}</div>
                                        <div class="venue-address">
                                            <span class="label">Address:</span>
                                            <span class="value">${searchBooking.venue}</span>
                                        </div>
                                        <div class="venue-datetime">
                                            <span class="label">Date &amp; time:</span>
                                            <span class="value">${searchBooking.time}</span>
                                        </div>
                                        <div class="venue-total">
                                            <span class="label">Total:</span>
                                            <span class="value total-price">${searchBooking.price}</span>
                                        </div>
                                        <div class="venue-status">
                                            <span class="label">Status:</span>
                                            <span class="status-active"><span class="status-dot green"></span>${searchBooking.status_text}</span>
                                        </div>
                                        <button class="cancel-booking-btn">Cancel booking</button>
                                    </div>
                                </div>
                        `
                        document.querySelector('.cancel-booking-btn').addEventListener('click', ()=> {
                            cancelBooking(curr_id)
                        })

                        document.querySelector('.back-btn').addEventListener('click', ()=> {
                            page3.style.display = 'block';
                            bookingHP.style.display = 'none';
                        })
                    }
                    }


            })

        })
    })
}

async function sendRating({venue_id, rating, feedback}) {
    document.querySelector('.venue-feedback-send').textContent = 'Sending...'
    try {
        const response = await fetch('/venues/add-rating/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `venue_id=${encodeURIComponent(venue_id)}&rating=${encodeURIComponent(rating)}&feedback=${encodeURIComponent(feedback)}`
        });
        const data = await response.json();
        if (data.success) {
            showToastAndReload("Thank you for your feedback!");
            window.location.href = "/";
        } else {
            alert(data.error)
        }
    } catch (error) {
        alert(data.error)
    }
}

async function cancelBooking(current_booking_id) {
    document.querySelector('.cancel-booking-btn').textContent = 'Is Cancelling...'
    try {

        const response = await fetch('/venues/cancel-booking/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: 'booking_id=' + encodeURIComponent(current_booking_id)
        });
        const data = await response.json();
        if (data.success) {
            showToastAndReload("Booking successfully canceled ✅");
            window.location.href = "/";
        } else {
            showToastAndReload("Error: " + data.error);
        }
    } catch (error) {
        showToastAndReload("An error occurred: " + error);
    }
}

function monitorRating(){
    const stars = document.querySelectorAll('.venue-stars .star');
    let selectedRating = 0;

    stars.forEach((star, idx) => {
        // Click event: set rating
        star.addEventListener('click', () => {
            selectedRating = idx + 1;
            updateStars();
        });

        // Mouseover: highlight up to hovered star
        star.addEventListener('mouseover', () => {
            highlightStars(idx + 1);
        });

        // Mouseout: reset to selected rating
        star.addEventListener('mouseout', () => {
            updateStars();
        });
    });

    function updateStars() {
        stars.forEach((star, i) => {
            if (i < selectedRating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    function highlightStars(rating) {
        stars.forEach((star, i) => {
            if (i < rating) {
                star.classList.add('hovered');
            } else {
                star.classList.remove('hovered');
            }
        });
    }

    // Remove hover effect when not hovering
    document.querySelector('.venue-stars').addEventListener('mouseleave', () => {
        stars.forEach(star => star.classList.remove('hovered'));
    });
}


function showToastAndReload(message) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {

        toast.classList.remove('show');
    }, 1800); // Show for 1.8 seconds
}

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