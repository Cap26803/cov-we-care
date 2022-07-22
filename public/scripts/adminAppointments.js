const contentBlocks = document.getElementsByClassName('appointment-content');

const logOutLink = document.getElementById('sidebar-logout');

Array.from(contentBlocks).forEach(content => {
    content.addEventListener('click', () => {
        showAdminModal('John Doe', `Heavy Fever since two weeks. Typhoid risk`, "APPROVE");
    });
});


logOutLink && logOutLink.addEventListener('click', () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    location.pathname = '/signIn';
})