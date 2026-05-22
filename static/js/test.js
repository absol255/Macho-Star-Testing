const cards = document.querySelectorAll(".card");
const form = document.querySelector("form");

cards.forEach(card => {
    const radios = card.querySelectorAll(".exclusive");

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            radios.forEach(r => {
                if (r !== radio) {
                    r.checked = false;
                }
            });
        });
    });
});

form.addEventListener("submit", (e) => {

    const cards = document.querySelectorAll(".card");

    let allAnswered = true;

    cards.forEach(card => {
        const radios = card.querySelectorAll('input[type="radio"]');

        let answered = false;

        radios.forEach(radio => {
            if (radio.checked) {
                answered = true;
            }
        });

        if (!answered) {
            allAnswered = false;
            card.style.border = "2px solid red"; // optional visual warning
        } else {
            card.style.border = "";
        }
    });

    if (!allAnswered) {
        e.preventDefault();
        alert("You must answer every question!");
    }

});