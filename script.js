function setCookie(name, value) {
    document.cookie = name + "=" + encodeURIComponent(value) +
        "; max-age=31536000; path=/; SameSite=Lax";
}

function getCookie(name) {
    const item = document.cookie.split("; ")
        .find(c => c.startsWith(name + "="));

    return item
        ? decodeURIComponent(item.substring(name.length + 1))
        : null;
}

let likes = Number(getCookie("likes") ?? 100);
let dislikes = Number(getCookie("dislikes") ?? 20);
let comments = JSON.parse(getCookie("comments") || "[]");

const like = document.getElementById("like");
const dislike = document.getElementById("dislike");
const input = document.getElementById("input");
const form = document.getElementById("form");
const clear = document.getElementById("clear");
const commentsArea = document.getElementById("comments");

function update() {
    document.getElementById("likes").textContent = likes;
    document.getElementById("dislikes").textContent = dislikes;

    commentsArea.replaceChildren();

    comments.forEach(text => {
        const p = document.createElement("p");
        p.className = "comment";
        p.textContent = text;
        commentsArea.appendChild(p);
    });

    const voted = getCookie("vote") !== null;
    const commented = getCookie("commented") === "yes";

    like.disabled = voted;
    dislike.disabled = voted;
    input.disabled = commented;
    form.querySelector('[type="submit"]').disabled = commented;
}

like.addEventListener("click", function () {
    if (getCookie("vote")) return;

    likes++;
    setCookie("likes", likes);
    setCookie("vote", "like");
    update();
});

dislike.addEventListener("click", function () {
    if (getCookie("vote")) return;

    dislikes++;
    setCookie("dislikes", dislikes);
    setCookie("vote", "dislike");
    update();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = input.value.trim();

    if (!text || getCookie("commented") === "yes") return;

    comments.push(text);
    setCookie("comments", JSON.stringify(comments));
    setCookie("commented", "yes");

    input.value = "";
    update();
});

clear.addEventListener("click", function () {
    ["likes", "dislikes", "comments", "vote", "commented"]
        .forEach(name => {
            document.cookie = name +
                "=; max-age=0; path=/; SameSite=Lax";
        });

    likes = 100;
    dislikes = 20;
    comments = [];
    input.value = "";

    update();
});

update();