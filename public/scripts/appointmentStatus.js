const userHome = document.getElementById('user-home');

if(userHome !== null){
    const appointmentStatusBtn = document.getElementById('appointment-status');
    
    appointmentStatusBtn.addEventListener('click', () => {
        showModal('Appointment Status', `Congratulations Omkar! Your Appointment has been approved`);
    })

}