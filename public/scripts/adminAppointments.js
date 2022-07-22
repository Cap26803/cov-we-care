const contentBlocks = document.getElementsByClassName('appointment-content');

const logOutLink = document.getElementById('sidebar-logout');

Array.from(contentBlocks).forEach(content => {
    content.addEventListener('click', () => {
        showModal('Title', `Displaying some content. Right now demo thing`);
    });
});


logOutLink && logOutLink.addEventListener('click', () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    location.pathname = '/signIn';
})