const radios = document.querySelectorAll(".exclusive");

radios.forEach(radio => {
    radio.addEventListener("change", () => {
        radios.forEach(r => {
            if (r !== radio) {
                r.checked = false;
            }
        });
    });
});