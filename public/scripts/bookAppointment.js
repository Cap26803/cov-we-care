const bookingForm = document.getElementById('booking-form');
const overlay = document.getElementById('modalOverlay');
const closeIcon = document.getElementById('close');
const closeBtn = document.getElementById('closeBtn');
let count = 0;


const showModal = (title = "", content = "") => {
    overlay.style.display = "flex";

    const modalHeader = document.querySelector('#modal-card-header h4');
    modalHeader.textContent = title;

    const modalContent = document.querySelector('#modal-card-content p');
    modalContent.textContent = content;
}


const showAppointmentStatusModal = (title, content, btnText = "OKAY") => {
    overlay.style.display = "flex";

    const modalHeader = document.querySelector('#modal-card-header h4');
    modalHeader.textContent = title;

    const modalContent = document.querySelector('#modal-card-content p');
    modalContent.textContent = content;

    closeBtn.textContent = btnText;
}


const showAdminModal = (title = "", content = "", btnText = "") => {
    overlay.style.display = "flex";

    const modalHeader = document.querySelector('#modal-card-header h4');
    modalHeader.textContent = title;

    const modalContent = document.querySelector('#modal-card-content p');
    modalContent.textContent = content;

    const actions = document.querySelector('.modal-card-actions');
    
    // To create the decline button only once
    if(count === 0){
        const declineBtn = document.createElement('button');
        declineBtn.setAttribute('id', 'declineBtn');
        actions.appendChild(declineBtn);
        declineBtn.textContent = "DECLINE";
        declineBtn.addEventListener('click', () => {
            overlay.style.display = "none";
        });
    }
    closeBtn.textContent = btnText;
    count++;    // Incrementing count after first creation of decline button

    const actionBtns = document.querySelectorAll('.modal-card-actions button');
    actions.style.display = 'flex';
    actions.style.justifyContent = "space-evenly";
    actions.style.alignItems = 'center';
    actions.style.position = "absolute";
    actions.style.bottom = "15px";
    actions.style.left = "33px";
    actions.style.width = "90%"

    actionBtns.forEach(btn => {
        btn.style.position = "static";
        btn.style.width = "40%";
    });
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
        const age = document.getElementById('age').value;
        

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
            document.getElementById('booking-form').reset();
            showModal("Thank You", "Your appointment will be granted soon, please check appointmnt status");
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