const bookingForm = document.getElementById('booking-form');
const overlay = document.getElementById('modalOverlay');
const closeIcon = document.getElementById('close');
const closeBtn = document.getElementById('closeBtn');


const showModal = (title = "", content = "") => {
    overlay.style.display = "flex";

    const modalHeader = document.querySelector('#modal-card-header h4');
    modalHeader.textContent = title;

    const modalContent = document.querySelector('#modal-card-content p');
    modalContent.textContent = content;
}


if(bookingForm != null){
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const healthCenter = document.getElementById('healthCenter').value;
        const genderVal = document.querySelector("input[type='radio'][name=gender]:checked").value;
        const address = document.getElementById('address').value;
        const age = parseInt(document.getElementById('age').value.slice(0, 2));
        

        const data = {
            fullName: name, 
            gender: genderVal,
            phoneNum: phone, 
            email,
            date,
            healthCenter,
            address,
            age,
            userId: localStorage.getItem('user')
        }
        
        const response = await fetch('/api/data/appointments/new', {
            method: "POST",
            headers:{
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();

        
        if(resData.success){
            showModal();
        }

    })
}



closeIcon.addEventListener('click', () => {
    overlay.style.display = "none";
});

closeBtn.addEventListener('click', () => {
    overlay.style.display = "none";
});


window.addEventListener('click', (e) => {
    if(e.target == overlay){
        overlay.style.display = "none";
    }
})