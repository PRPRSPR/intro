setInterval(() => {
    let datetime = new Date();

    let hours = String(datetime.getHours()).padStart(2, '0');
    let minutes = String(datetime.getMinutes()).padStart(2, '0');
    let seconds = String(datetime.getSeconds()).padStart(2, '0');

    let time = `${hours}:${minutes}:${seconds}`;

    let obj = document.querySelector("#time");
    obj.innerHTML = time
}, 1000);

let fvPic = document.querySelector("#fvPic");
let pic = document.querySelectorAll(".pic");
for (let i = 0; i < pic.length; i++) {
    pic[i].onclick = function (e) {
        let temp = this.src;
        this.src = fvPic.src;
        fvPic.src = temp;
    }
};

let kakao = document.getElementById("kakao");
let insta = document.getElementById("insta");
let steam = document.getElementById("steam");
let wtWindow = document.getElementById("wtWindow");
let mode = document.querySelector("#mode");
let body = document.body;
mode.onclick = function (e) {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    if (body.classList.contains('dark')) {
        kakao.src = "../media/kakaotalkdark.png";
        insta.src = "../media/instagramdark.png";
        steam.src = "../media/steamdark.png";
        wtWindow.src = "../media/catflowerdark.png";
    } else {
        kakao.src = "../media/kakaotalk.png";
        insta.src = "../media/instagram.png";
        steam.src = "../media/steam.png";
        wtWindow.src = "../media/catflower.png";
    }
};

$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 250) {
            $('#topBtn').fadeIn();
        } else {
            $('#topBtn').fadeOut();
        }
    });

    $("#topBtn").click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
});

function createRandomImage() {
    const images = [
        "../media/icon-discord 1.png",
        "../media/icon-discord 2.png",
        "../media/icon-discord 3.png",
        "../media/icon-discord 4.png",
        "../media/icon-discord 5.png",
        "../media/icon-discord 6.png",
        "../media/icon-discord 7.png"
    ];

    const fixedLink = "https://discord.gg/agsejEMmvx";
    const randomImageSrc = images[Math.floor(Math.random() * images.length)];

    const linkElement = document.createElement("a");
    linkElement.href = fixedLink;
    linkElement.target = "_blank";

    const imgElement = document.createElement("img");
    imgElement.classList.add("random-image");
    imgElement.src = randomImageSrc;

    const x = Math.random() * (window.innerWidth - 50);
    const y = Math.random() * (window.innerHeight - 50);
    linkElement.style.position = "fixed";
    linkElement.style.left = `${x}px`;
    linkElement.style.top = `${y}px`;

    linkElement.appendChild(imgElement);
    document.body.appendChild(linkElement);

    setTimeout(() => {
        imgElement.style.opacity = "0";
        imgElement.style.transform = "scale(1.5)";
        setTimeout(() => linkElement.remove(), 500);
    }, 2000);
};

setInterval(createRandomImage, 2000);