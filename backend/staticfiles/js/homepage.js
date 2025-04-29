let allVenues;
let listSlots = []
const detailCon = document.querySelector('.detail-container')
const headMid = document.querySelector('.head-middle')
const headDown = document.querySelector('.head-down')
const venCon = document.querySelector(".venues-container")


const divContainer = document.querySelector(".venues-div")




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
                            <img src="${venue.image_url}" alt="">
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
}

//const searchBtn = document.querySelector('.down-search')
//
//searchBtn.addEventListener('click', ()=>{
//
//    const fromValue = document.querySelector('.from-div input').value
//    const toValue = document.querySelector('.to-div input').value
//
//    if(fromValue > toValue){
//        fromValue = toValue
//    }
//
//    let halfFiltered = allVenues.filter(venue => venue.pricePerHour >= fromValue)
//    let filteredVenues = halfFiltered.filter(venue => venue.pricePerHour <= toValue)
//    console.log(filteredVenues);
//
//    displayVenues(filteredVenues)
//})

document.addEventListener('DOMContentLoaded', function() {
    console.log("ADD");

});



function selectSlots(){
    const allSlot = document.querySelectorAll('.time-slot')
    const slotList = document.querySelector('.slot-list')
    const totalPrice = document.querySelector('.totalPrice')
    const priceHour = document.querySelector('.priceHour')
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
            console.log(listSlots);




        })
    })
}

function displayDetail(){
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
                    <img src="${c.image_url}" alt="">
//                    <div class="other-photo">
//                        <img src="https://i.pinimg.com/736x/49/54/95/4954951f9a28245402a1ecca5e33ff01.jpg" alt="">
//                        <img src="https://i.pinimg.com/736x/49/54/95/4954951f9a28245402a1ecca5e33ff01.jpg" alt="">
//                        <img src="https://i.pinimg.com/736x/49/54/95/4954951f9a28245402a1ecca5e33ff01.jpg" alt="">
//                        <img src="https://i.pinimg.com/736x/49/54/95/4954951f9a28245402a1ecca5e33ff01.jpg" alt="">
//                    </div>
                </div>
                <div class="middle-div">
                    <div class="middle-up">
                        <img src="{% static 'images/download.png' %}" alt="">
                        <img class="save-icon" src="{% static 'images/save.png' %}" alt="">
                    </div>
                    <div class="middle-down">
                        <img src="{% static 'images/arrow_to_left.png' %}" alt="">
                        <img src="{% static 'images/arrow_to_right.png' %}" alt="">
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
            selectSlots()
            AddingFavoriteVenue(c.id)
        })
    })
}


const searchField = document.querySelector('.search-div input')

function searchVenue(){
    let searchWord = searchField.value
    console.log(searchField);

    let needVenues = allVenues.filter(ven => ven.name.toLowerCase().includes(searchWord.toLowerCase()));

    displayVenues(needVenues)

}


document.querySelector(".book-btn").addEventListener("click", () => {
    let confirmationBox = document.getElementById("confirmation");
    let body = document.body;

    // Blur background and show confirmation box
    body.classList.add("blurred");
    confirmationBox.classList.add("show");

    // After 2 seconds, fade out and redirect
    setTimeout(() => {
        confirmationBox.style.opacity = "0"; // Fade out effect
        body.classList.remove("blurred");

        setTimeout(() => {
            window.location.href = "{% url 'home_page' %}"; // Redirect
        }, 500); // Small delay for smooth transition
    }, 1300);
});


// Head Down


const sportBtn = document.querySelector('.curr-sport')
const otherSport = document.querySelectorAll('.other-sports div')



sportBtn.addEventListener('click', ()=>{
    document.querySelector('.other-sports').style.display = "flex"

})

otherSport.forEach(element => {
    element.addEventListener('click', ()=>{
        filterByType(element.textContent)
        document.querySelector('.curr-sport').innerHTML = `
        <img src="{% static 'images/footballSign.png' %}" alt="">
                                    ${element.textContent}
        `
        document.querySelector('.other-sports').style.display = "none"
    })


});

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
    let addFavBtn = document.querySelector('.addFavBtn')
    addFavBtn.addEventListener('click', ()=>{
        if(addFavBtn.src.slice(-8) == "save.png"){
            addFavBtn.src = "{% static 'images/saveBlack.png'%}"
            AddFavVenue(venue_id)
        }else{
            addFavBtn.src = "/{% static 'images/save.png'%}"
//            removeFavVenue(venue_id)
        }
    })
}

async function AddFavVenue(venue_id){
    const csrfToken = getCookie("csrftoken");

    try {
        const response = await fetch("/add-favorite/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            },
            body: new URLSearchParams({
                venue_id: venueId
            })
        });

        const data = await response.json();

        if (data.status === "success") {
            alert("✅ Venue added to favorites!");
        } else if (data.status === "exists") {
            alert("⚠️ Already in favorites");
        } else {
            alert("❌ " + data.message);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Something went wrong");
    }
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
