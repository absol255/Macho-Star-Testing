(function () {
    const setScoreUsername = document.getElementById("setscoreusername");
    const newSetScore = document.getElementById("newsetscore");
    const setScoreButton = document.getElementById("setscorebutton");
    const adminMsg = document.getElementById("adminmsg");
    const listEl = document.getElementById("list");

    function message(text) {
        adminMsg.textContent = text;
    };

    function load() {
        fetch("/api/admin/applicants", { credentials: "include" })
            .then(function (r) {
                if (r.status === 401) {
                    window.location.href = "/login";
                    return null;
                }
                return r.json();
            })
            .then(function (applicants) {
                if (!applicants) return;
    
                if (!applicants.length) {
                    listEl.innerHTML = "<p>No applicants yet.</p>";
                    return;
                }
    
                listEl.innerHTML = applicants.map(function (applicant) {
                    return (
                        '<div class="user">' +
                        '<div style="flex:1">' +
    
                        '<input type="text" value="' + applicant.username + '" data-id="' + applicant.id + '" data-field="username">' +
    
                        '<input type="number" value="' + applicant.score + '" data-id="' + applicant.id + '" data-field="score">' +
    
                        "</div>" +
    
                        '<button class="button" data-save="' + applicant.id + '" type="button">Save</button>' +
    
                        "</div>"
                    );
                }).join("");
    
                listEl.querySelectorAll("[data-save]").forEach(function (btn) {
    
                    btn.addEventListener("click", function () {
    
                        const id = btn.getAttribute("data-save");
    
                        const row = btn.closest(".user");
    
                        const usernameInput = row.querySelector('[data-field="username"]');
    
                        const scoreInput = row.querySelector('[data-field="score"]');
    
                        fetch("/api/admin/setscore", {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
    
                            body: JSON.stringify({
                                username: usernameInput.value.trim(),
                                score: parseInt(scoreInput.value, 10),
                            }),
                        })
                        .then(function (r) {
                            return r.json();
                        })
                        .then(function () {
                            message("Saved.");
                            loadScores();
                        });
    
                    });
    
                });
    
            });
    }

    setScoreButton.addEventListener('click', function() {
        const username = String(setScoreUsername.value)
        const score = parseInt(newSetScore.value, 10);
        if (!username) return;
        if (!score) return;

        fetch("/api/admin/setscore", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: username, score: score || 0 }),
        })
            .then(async function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
            .then(function (res) {
                if (!res.ok) {
                    message(res.d.error || "Could not set score");
                    return;
                }
                message("Set scores.");
                load();
            });
    });
})();