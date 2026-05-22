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

async function checkLogin() {
    const res = await fetch("/api/testing/me");

    if (res.ok) {
        // logged in
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("testContent").style.display = "block";
    } else {
        // not logged in
        document.getElementById("loginBox").style.display = "block";
        document.getElementById("testContent").style.display = "none";
    }
}

async function login() {
    const username = document.getElementById("username").value;
    const bank = document.getElementById("bank").value;

    const res = await fetch("/api/testing/session", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username,
            bank_account_number: bank
        })
    });

    if (res.ok) {
        checkLogin(); // instantly switch UI
    } else {
        const data = await res.json();
        alert(data.error);
    }
}

checkLogin();