const menu = document.getElementById('menu');
const navbar = document.getElementById('navbar');
const header = document.getElementById('header');
const scrollIcon = document.getElementById('scrollIcon');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header .navbar a');


function stickyNav(){
    if(window.scrollY > 0){
        header.classList.add('sticky');
        if(scrollIcon != null) scrollIcon.style.display = "block"
    } else{
        header.classList.remove('sticky');
        scrollIcon.style.display = "none";
    }
}


menu?.addEventListener('click', () => {
    menu?.classList.toggle('fa-times');
    navbar?.classList.toggle('nav-toggle')
});



window.addEventListener("scroll", () => {

    menu?.classList.remove('fa-times');
    navbar?.classList.remove('nav-toggle')

    stickyNav();


    sections?.forEach(section => {
        let top = window.scrollY;
        let height = section.offsetHeight;
        let offset = section.offsetTop - 150;
        let id = section.getAttribute('id');

        if(top >= offset  &&  top < offset + height){
            navLinks?.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header .navbar a[href*='+ id +']').classList.add('active');
            })
        }
    })


    

});



