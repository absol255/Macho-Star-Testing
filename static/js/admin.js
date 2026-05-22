(function () {
    const setScoreUsername = document.getElementById("set-stock-username");
    const newSetScore = document.getElementById("new-set-score");
    const setScoreButton = document.getElementById("set-score-button");
    const adminMsg = document.getElementById("admin-msg");

    function message(text) {
        adminMsg.textContent = text;
    };

    setScoreButton.addEventListener('click', function() {
        const username = String(setScoreUsername.value)
        const score = parseInt(newSetScore.value, 10);
        if (!stockId) return;
        if (!username) return;

        fetch("/api/admin/setscore", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: username, score: score || 0 }),
        })
            .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
            .then(function (res) {
                if (!res.ok) {
                    message(res.d.error || "Could not set score");
                    return;
                }
                newName.value = "";
                newValue.value = "";
                message("Set scores.");
                load();
            });
    });
})();