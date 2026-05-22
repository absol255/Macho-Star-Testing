const cards = document.querySelectorAll(".card");

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