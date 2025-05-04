let allVenues;
let listSlots = []
const detailCon = document.querySelector('.detail-container')
const headMid = document.querySelector('.head-middle')
const headDown = document.querySelector('.head-down')
const venCon = document.querySelector(".venues-container")

let favVenues;
let venue_id;
let venueName;
let priceEach;

const divContainer = document.querySelector(".venues-div")

let currentDateValue = new Date();
let dayPart = String(currentDateValue.getDate()).padStart(2, '0');
let monthPart = String(currentDateValue.getMonth() + 1).padStart(2, '0');
let currentDate = `${dayPart}.${monthPart}`;

console.log("CurrentDAte", currentDate);  // Example: '17.04'




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
    displayVenues(allVenues)
}
function displayVenues(venuelar){

    let div = ``
    if(venuelar.length == 0){
        divContainer.innerHTML = `
            <h1 style="color: gray; font-size: 35px; width:100%;text-align:center;">There is no such venue</h1>
        `
    }else{
        venuelar.forEach(venue => {
            div += `
                <div class="venue-card" id="${venue.id}">
                        <div class="img-div">
                            <img src="${venue.images[0]}" alt="">
                        </div>
                        <div class="details">
                            <div class="details-one">
                                <div class="left">
                                    <label class="name-venue" for="">${venue.name}</label>
                                    <label class="type-venue" for="">${venue.type}</label>
                                    <label class="rating-venue" for="">${venue.rating} &#9733</label>
                                </div>
                                <div class="right">
                                    <label class="address-venue">📍${venue.location}</label><br><br>
                                    <label class="price-venue"><b>${venue.pricePerHour}</b> &#8376/hour</label>
                                </div>
                            </div>
                            <div  class="details-two">
                                <button>Book</button>
                            </div>
                        </div>
                </div>
            `

        });
        divContainer.innerHTML = div
    }

    displayDetail()
    monitorDays()

}



document.addEventListener('DOMContentLoaded', function() {
    console.log("ADD");

});


// Function to get day and month formatted as "Thu 17.04"
function formatDate(date) {
    const options = { weekday: 'short' }; // "Thu"
    const weekday = date.toLocaleDateString('en-US', options);
    const day = String(date.getDate()).padStart(2, '0'); // "17"
    const month = String(date.getMonth() + 1).padStart(2, '0'); // "04"
    return `${weekday} ${day}.${month}`;
}
const today = new Date();

function getDaysOfSlots(){
    let needVen = allVenues.find(v => v.id == venue_id)
    let workingDays = needVen.working_days.split(':')
    let workingWeekDays = []

    workingDays.forEach(wd => {
        if(wd == '1'){
            workingWeekDays.push("Mon")
        }else if(wd == '2'){
            workingWeekDays.push("Tue")
        }else if(wd == '3'){
            workingWeekDays.push("Wed")
        }else if(wd == '4'){
            workingWeekDays.push("Thu")
        }else if(wd == '5'){
            workingWeekDays.push("Fri")
        }else if(wd == '6'){
            workingWeekDays.push("Sat")
        }else if(wd == '7'){
            workingWeekDays.push("Sun")
        }
    })

    let daysInSelect = []
    document.querySelector('.date-row').innerHTML = ''
    let until = 7 + (7-workingWeekDays.length);
    console.log(until)
    for (let i = 0; i <= until; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i); // Add i days
        if(workingWeekDays.includes(formatDate(nextDay).slice(0, 3))){
            daysInSelect.push(formatDate(nextDay))
            document.querySelector('.date-row').innerHTML+= `<span class="date">${formatDate(nextDay)}</span>`
        }

    }
    monitorDaysClick();
    monitorDays(daysInSelect)


}


function selectSlots(){
    const allSlot = document.querySelectorAll('.time-slot')
    const slotList = document.querySelector('.slot-list')
    const totalPrice = document.querySelector('.totalPrice')
    priceHour = document.querySelector('.priceHour')
    const allSelectedSlots = document.querySelectorAll('.slot-list a')

    let total = 0
    allSlot.forEach(slot => {
        slot.addEventListener('click', ()=>{
            console.log(slot.style.backgroundColor);

            if(slot.style.backgroundColor == "rgb(30, 58, 138)"){
                listSlots = listSlots.filter(sl => sl != slot.textContent)
                console.log(slot.textContent);

                slot.style.backgroundColor = "white"
                slot.style.color = "black"

                const removeSlot = document.getElementById(slot.textContent)
                removeSlot.textContent = ""

                total -= parseInt(priceHour.textContent)
                totalPrice.innerHTML = total +  " &#8376"

            }else{
                total += parseInt(priceHour.textContent)
                listSlots.push(slot.textContent)
                slot.style.backgroundColor = "#1E3A8A"
                slot.style.color = "white"
                totalPrice.innerHTML = total +  " &#8376"

                if(slotList.textContent.length < 1){
                    slotList.innerHTML += `<a id="${slot.textContent}" href="#">[${slot.textContent}]</a> `
                }else if(listSlots.length % 2 != 0){
                    slotList.innerHTML += `<a id="${slot.textContent}" href="#">[${slot.textContent}]</a> `
                }else{
                    slotList.innerHTML += `<a id="${slot.textContent}" href="#">[ ${slot.textContent}]</a>`
                }
            }
            console.log("list slots:",listSlots);
        })
    })
}
async function AvailableSlots(venue_id){
    getDaysOfSlots()
    console.log("SLOOT");
    try {
        const res = await fetch(`/venues/api/bookings/${venue_id}/`);
        const data = await res.json();


        showAvailableSlots(data)


    } catch (error) {
        console.log("Error:", error);
    }

}

function showAvailableSlots(data) {
    let needVen = allVenues.find(v => v.id == venue_id)
    console.log("NEED VENUE:",needVen)
    let venueStart = needVen.start
    let venueEnd = needVen.end
    let workingDays = needVen.working_days



    const availableSlots = [];

    let [startHour, startMinute] = venueStart.split(':').map(Number);
    let [endHour, endMinute] = venueEnd.split(':').map(Number);

    let currentHour = startHour;

    while (currentHour < endHour) {
        const nextHour = (currentHour + 1) % 24;

        const slot = `${String(currentHour).padStart(2, '0')}:00 - ${String(nextHour).padStart(2, '0')}:00`;
        availableSlots.push(slot);

        currentHour++;
    }
    console.log("Available slots:", availableSlots)

    let today;
    let bookedSlots;
    if(currentDate == ''){
        today = new Date();

        const todayDate = today.toISOString().split('T')[0];  // "2025-04-16"

        // Filter out the bookings for today
        bookedSlots = data.filter(booking => {
            const bookingDate = new Date(booking.start_time).toISOString().split('T')[0];
            return bookingDate == todayDate;
        });
    }else{
        const [day, month] = currentDate.split('.');

        // Filter by matching day and month
        bookedSlots = data.filter(booking => {
            const date = new Date(booking.start_time);
            const bookingDay = String(date.getDate()).padStart(2, '0');
            const bookingMonth = String(date.getMonth() + 1).padStart(2, '0');
            return bookingDay === day && bookingMonth === month;
        });
    }



    console.log("booked:", bookedSlots, currentDate)
    bookedSlots.forEach(slot => {
        const startTime = new Date(slot.start_time);
        startTime.setHours(startTime.getHours()); // Adjust to Almaty time (UTC+5)

        const hours = String(startTime.getHours()).padStart(2, '0'); // "19"
        const nextHour = String((startTime.getHours() + 1) % 24).padStart(2, '0'); // handles wrap to "00"
        const slotToRemove = `${hours}:00 - ${nextHour}:00`; // "19:00 - 20:00"
        const index = availableSlots.indexOf(slotToRemove);

        if (index !== -1) {
            availableSlots.splice(index, 1); // Remove the booked slot
        }
    });
    document.querySelector('.time-slots').innerHTML = ''
    availableSlots.forEach(eachSlot => {
        document.querySelector('.time-slots').innerHTML +=
            `
            <button class="time-slot">${eachSlot}</button>
        `
    })
    selectSlots()
}

function monitorDaysClick() {
    const daysBtn = document.querySelectorAll('.date-row .date');

    daysBtn.forEach(dayBtn => {
        dayBtn.addEventListener('click', () => {
            // Remove from all first
            daysBtn.forEach(btn => btn.classList.remove('active-day'));

            // Then add to the clicked one
            dayBtn.classList.add('active-day');

            // Optional: update currentDate
            currentDate = dayBtn.textContent.slice(4); // if your format is like "Mon 30.04"
        });
    });
}


function monitorDays(){
    console.log("COMES")
    let daysBtn = document.querySelectorAll('.date-row span')
    daysBtn.forEach(dayBtn => {
        dayBtn.addEventListener('click', (e) => {
            // 1. Get clicked button
            const clickedBtn = e.target;

            // 2. Update currentDate
            currentDate = clickedBtn.textContent.slice(4);
            AvailableSlots(venue_id);

        });
    });
    console.log("COMES",currentDate)
}

async function getFavVenues(){
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try{
        const res = await fetch('/venues/api/favorites/', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,  // Include CSRF token if necessary
            },
        })

        const data = await res.json();
        favVenues = data;
        console.log("FAV", favVenues)
    }catch(error){
        console.log("Error")
    }
}

function displayDetail(){
    getFavVenues();
    const allCards = document.querySelectorAll('.venue-card');
    allCards.forEach(card => {

        card.addEventListener('click', ()=>{

            headMid.style.display = "none"
            headDown.style.display = "none"
            detailCon.style.display = "block"
            venCon.style.display = "none"
            document.querySelector('header').style.height = "15vh"
            document.querySelector('.head-up').style.height = "90%"

            let c = allVenues.filter(crd => crd.id == card.id)[0]

            document.querySelector('.detail-content').innerHTML =
                `
                <div class="left-div">
                    <img class="carousel-img" src="${c.images[0]}" alt="">

                </div>
                <div class="middle-div">
                    <div class="middle-up">
                        <img class="save-icon" style = "width: 40%" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Font_Awesome_5_regular_bookmark.svg/640px-Font_Awesome_5_regular_bookmark.svg.png" alt="">
                    </div>
                    <div class="middle-down">
                        <img class ="arrow-right" src="https://www.pngitem.com/pimgs/m/534-5345932_left-arrow-prev-hd-png-download.png" alt="">
                        <img class ="arrow-left" src="https://www.pngitem.com/pimgs/m/534-5345932_left-arrow-prev-hd-png-download.png" style="transform: rotate(180deg);" alt="">
                    </div>
                </div>
                <div class="right-div">
                    <h3>${c.type}</h3>
                    <h1>${c.name}</h1>
                    <div class="content">
                        <p><b class="priceHour">${c.pricePerHour}</b> &#8376/hour</p>
                        <div>${c.rating} &#9733</div>
                    </div>
                    <p>Description: <br>
                        ${c.description}
                    </p>
                    <p>Address: <br>
                        ${c.location} <a href="https://2gis.kz/almaty/geo/9430047375018127/76.935200,43.252014" target="_blank">on the map</a>
                    </p>
                </div>
            `

            priceEach = c.pricePerHour
            venueName = c.name
            venue_id = c.id
            AvailableSlots(card.id)
            console.log("STEP TUR")


            favVenues.favorite_venues_ids.forEach(fav_id => {
                console.log("fav:", fav_id, "curr:", venue_id)
                if(fav_id == venue_id){
                    document.querySelector('.save-icon').src = "https://cdn3.iconfinder.com/data/icons/user-interface-glyph-3/32/bookmark-1024.png"
                    document.querySelector('.save-icon').style.width = "60%"
                }
            })
            AddingFavoriteVenue(c.id)
            FavMonitor()

        })
    })
}
function FavMonitor(){
    let imageUrls = [];
    allVenues.forEach(venue => {
        if(venue.id == venue_id){
            venue.images.forEach(suret => {
                console.log("SURET", suret)
                if(suret != "none"){
                    imageUrls.push(suret)
                }
            })

        }
    })

    const mainImage = document.querySelector(".carousel-img");
    let currentIndex = 0;

    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    function updateImage(newIndex) {
        mainImage.classList.add("fade-out");
        setTimeout(() => {
            currentIndex = newIndex;
            mainImage.src = imageUrls[currentIndex];
            mainImage.classList.remove("fade-out");
        }, 150);
    }

    leftArrow.addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
        updateImage(newIndex);
    });

    rightArrow.addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % imageUrls.length;
        updateImage(newIndex);
    });

    // Set initial image
    mainImage.src = imageUrls[currentIndex];
}



const searchField = document.querySelector('.search-div input')

function searchVenue(){
    let searchWord = searchField.value
    console.log(searchField);

    let needVenues = allVenues.filter(ven => ven.name.toLowerCase().includes(searchWord.toLowerCase()));

    displayVenues(needVenues)

}


document.querySelector(".book-btn").addEventListener("click", () => {

    submitBooking(listSlots)
    let confirmationBox = document.getElementById("confirmation");
    let body = document.body;

    // Blur background and show confirmation box
    body.classList.add("blurred");
    confirmationBox.classList.add("show");

    // After 2 seconds, fade out and redirect
    setTimeout((e) => {
        e.preventDefault();
        confirmationBox.style.opacity = "0"; // Fade out effect
        body.classList.remove("blurred");

        setTimeout(() => {
            window.location.href = "{% url 'home_page' %}"; // Redirect
        }, 500); // Small delay for smooth transition
    }, 1300);
});


// Head Down


const sportBtn = document.querySelector('.selected-sport')
const otherSport = document.querySelectorAll('.other-sports div')



sportBtn.addEventListener('mouseover', ()=>{
    document.querySelector('.other-sports').style.display = "flex"
    selectSport();
})
sportBtn.addEventListener('mouseout', ()=>{
    document.querySelector('.other-sports').style.display = "none"
})

function selectSport(){
    otherSport.forEach(element => {
        element.addEventListener('click', ()=>{
            filterByType(element.textContent)
            document.querySelector('.curr-sport').innerHTML = `
        <img src="{% static 'images/footballSign.png' %}" alt="">
                                    ${element.textContent}
        `
            document.querySelector('.other-sports').style.display = "none"
            if(element.textContent == "All sports"){
                fetchVenues()
            }
        })
    });
}


function filterByType(needType){
    let venueByType = allVenues.filter(venue => venue.type == needType)
    displayVenues(venueByType)
}

function filterVenues(){
    console.log("KIRDI")
    let fromValue = document.querySelector('.from-div input').value
    let toValue = document.querySelector('.to-div input').value

    if(fromValue > toValue){
        fromValue = toValue

//        console.log(fromValue)
//        console.log(toValue)
    }

    let halfFiltered = allVenues.filter(venue => parseInt(venue.pricePerHour) >= fromValue)
    let filteredVenues = halfFiltered.filter(venue => parseInt(venue.pricePerHour) <= toValue)



    displayVenues(filteredVenues)
    console.log(filteredVenues)
}


//  SAVE TO FAV


// ADD TO FAV
function AddingFavoriteVenue(venue_id){
    let addFavBtn = document.querySelector('.save-icon')
    addFavBtn.addEventListener('click', ()=>{
        if(addFavBtn.src == "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Font_Awesome_5_regular_bookmark.svg/640px-Font_Awesome_5_regular_bookmark.svg.png"){
            addFavBtn.src = "https://cdn3.iconfinder.com/data/icons/user-interface-glyph-3/32/bookmark-1024.png"
            addFavBtn.style.width = "60%"
            AddFavVenue(venue_id)
        }else{
            addFavBtn.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Font_Awesome_5_regular_bookmark.svg/640px-Font_Awesome_5_regular_bookmark.svg.png"
            addFavBtn.style.width = "40%"
            removeFavVenue(venue_id)
        }
    })
}

async function AddFavVenue(venue_id){
    const csrfToken = getCookie("csrftoken");

    fetch(`/venues/add_favorite/${venue_id}/`, {
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
async function removeFavVenue(venue_id){
    const csrfToken = getCookie("csrftoken");

    fetch(`/venues/remove_favorite/${venue_id}/`, {
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

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//function clickBtnDay(clickedId){
//
//    let daysBtn = document.querySelectorAll('.date')
//    daysBtn[clickedId].classList.add("active-day");
//
//}
async function submitBooking(listSlots) {

    // or get dynamically
    const slots = listSlots;  // ['10:00 - 11:00', '11:00 - 12:00']
    let selectedDate = currentDate
//    slots = listSlots.map(slot => slot.trim());


    if (selectedDate.includes('.')) {
        const [day, month] = selectedDate.split('.');  // Split 'DD.MM' into day and month
        const year = new Date().getFullYear();  // Get the current year
        selectedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;  // Format it to 'YYYY-MM-DD'
    }
    console.log("CURRSAVE",)
    const response = await fetch('/venues/book/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // For CSRF protection
        },
        body: JSON.stringify({
            venue_id: venue_id,
            slots: slots,
            date: selectedDate,
            price: parseFloat(priceEach),
            venue_name: venueName
        })
    });



    const data = await response.json();
    console.log("Ketti");
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
window.addEventListener("beforeunload", function () {
    navigator.sendBeacon("/logout/");
});
function toggleMenu() {
    const menu = document.querySelector('.menu-content');
    menu.classList.toggle('active');
}
