const userHome = document.getElementById('user-home');

if(userHome !== null){
    const appointmentStatusBtn = document.getElementById('appointment-status');
    
    appointmentStatusBtn.addEventListener('click', () => {
        showAppointmentStatusModal('Congrats!!', `Your appointment in Usha Health center has been approved!`);
    });

}