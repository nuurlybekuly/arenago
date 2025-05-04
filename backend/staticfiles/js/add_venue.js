document.querySelectorAll('.image-container').forEach(container => {
    const img = container.querySelector('img');
    const input = container.querySelector('.add_image_input');
    const deleteBtn = container.querySelector('button:nth-of-type(2)');

    // When file is selected, update the image preview
    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Optional: Reset image to default on Delete
    deleteBtn.addEventListener('click', () => {
        img.src = "https://tdkep.ru/images/yootheme/pages/features/panel01.jpg";
        input.value = "";
    });
});


const mainContainer = document.querySelector('.main-image-container');
const mainImg = mainContainer.querySelector('img');
const mainInput = mainContainer.querySelector('.add_image_input');
const changeMain = mainContainer.querySelector('.mainChange');
const deleteMain = mainContainer.querySelector('.mainDelete');

// Trigger file input when clicking "Change"
changeMain.addEventListener('click', () => {
    mainInput.click();
});

// Update image preview when file is selected
mainInput.addEventListener('change', () => {
    const file = mainInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            mainImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Reset to default image on "Delete"
deleteMain.addEventListener('click', () => {
    mainImg.src = "https://tdkep.ru/images/yootheme/pages/features/panel01.jpg";
    mainInput.value = "";
});


const allDays = document.querySelectorAll('.day-btn')

let daysArr = [];

allDays.forEach(day => {
    day.addEventListener('click', () => {
        const dayId = parseInt(day.id);

        if (day.classList.contains('active')) {
            console.log("REM");
            day.classList.remove('active');
            // Remove from array
            daysArr = daysArr.filter(id => id !== dayId);
        } else {
            console.log("ACT");
            day.classList.add('active');
            // Add to array
            daysArr.push(dayId);
        }
        console.log(daysArr); // Always updated array
    });
});

const fromInput = document.querySelector('.from-input');
const tillInput = document.querySelector('.till-input');

// Get selected values
const startTime = fromInput.value;
const endTime = tillInput.value;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('venueForm');

    form.addEventListener('submit', function (e) {
        // The form will submit normally вЂ” no need to preventDefault
        // We just send extra fields separately before it
        const fromInput = document.querySelector('.from-input');
        const tillInput = document.querySelector('.till-input');

        const startTime = fromInput.value;
        const endTime = tillInput.value;

        const selectedDays = Array.from(document.querySelectorAll('.day-btn.active'))
            .map(day => day.id)
            .join(':');

        // Set the values into hidden fields before submit
        document.getElementById('startInput').value = startTime;
        document.getElementById('endInput').value = endTime;
        document.getElementById('workingDaysInput').value = selectedDays;
    });
});
