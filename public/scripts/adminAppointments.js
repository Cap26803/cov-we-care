const contentBlocks = document.getElementsByClassName('appointment-content');

const logOutLink = document.getElementById('sidebar-logout');

Array.from(contentBlocks).forEach(content => {
    content.addEventListener('click', () => {
        const patientName = content.children[0].textContent;
        const ailment = content.children[1].textContent;

        showAdminModal(patientName, ailment, "APPROVE");
    });
});


logOutLink && logOutLink.addEventListener('click', () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    location.pathname = '/signIn';
})