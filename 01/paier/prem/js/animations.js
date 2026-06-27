const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", ()=>{
    cards.forEach(c=>{
        let top = c.getBoundingClientRect().top;
        if(top < window.innerHeight - 100){
            c.style.opacity = 1;
            c.style.transform = "translateY(0)";
        }
    });
});