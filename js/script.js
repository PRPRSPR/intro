const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.querySelector(".progress-container");
const trackTitle = document.getElementById("track-title");

const tracks = [
    { title: "🎵 Ujabes - Rio", file: "../media/Ujabes - Rio.mp3" },
    { title: "🎵 Ujabes - Alice", file: "../media/I dreamed about you last night.mp3" },
    { title: "🎵 Ujabes - Kafka On The Shore", file: "../media/Ujabes - Kafka On The Shore.mp3" }
];

let currentTrack = 0;

function loadTrack(index) {
    audio.src = tracks[index].file;
    trackTitle.innerText = tracks[index].title;
    audio.load();
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

prevBtn.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

nextBtn.addEventListener("click", nextTrack);

audio.addEventListener("timeupdate", () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener("ended", nextTrack);

window.onload = () => {
    loadTrack(currentTrack);
    audio.volume = 0.3;
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';

    let apiURL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?';
    let apiKey = 'KfnFqggt6uHPlWAXrfEiqUVrs%2F%2FZqaxSjlhuwdQK5mHccyS2rt2A1c44p7qq6o7l4%2BieviPEAIt%2BeP1tumunDg%3D%3D';
    var today = new Date();

    var time = ('0' + today.getHours()).slice(-2) + '00';
    // var time = "0500";
    var todayFormat = today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);

    function parseXML(xmlDOM) {
        let resultCode = xmlDOM.getElementsByTagName("resultCode");
        if (resultCode.length > 0) {
            resultCode = resultCode[0].childNodes[0].nodeValue;
        } else {
            console.error("API 응답에서 resultCode가 없음.");
            return;
        }

        let category = xmlDOM.getElementsByTagName("category");
        let obsrValue = xmlDOM.getElementsByTagName("obsrValue");

        if (category.length === 0 || obsrValue.length === 0) {
            console.error("API 데이터가 비어 있습니다.");
            return;
        }

        if (parseInt(resultCode) === 0) {
            for (let i = 0; i < category.length; i++) {
                let cat = category[i].childNodes[0].nodeValue;
                let value = obsrValue[i].childNodes[0].nodeValue;
                // let value = "2";

                if (cat === 'PTY') {
                    let weatherIcons = {
                        "0": "🌤️", // 맑음
                        "1": "☔",  // 비
                        "2": "🌨️", // 비+눈
                        "3": "☃️",  // 눈
                        "4": "🌦️"   // 소나기
                    };
                    document.querySelector('#weather-PTY').innerHTML = weatherIcons[value] || "❓";
                    console.log(value);
                    if (value === "2" || value === "3") {
                        drawSnowflakes();
                    } else if (value === "1" || value === "4") {
                        drawRaindrops();
                    }
                } else if (cat === 'T1H') {
                    document.querySelector('#weather-T1H').innerHTML = value + "°C ";
                } else if (cat === 'REH') {
                    document.querySelector('#weather-REH').innerHTML = value + "%";
                }

            }
        } else {
            document.querySelector('#weather-PTY').innerHTML = "";
            document.querySelector('#weather-T1H').innerHTML = "❌";
            document.querySelector('#weather-REH').innerHTML = "";
        }
    }

    let url = `${apiURL}serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=xml&base_date=${todayFormat}&base_time=${time}&nx=55&ny=125`;

    function ajtest() {
        $.ajax({
            url: url,
            type: "GET",
            data: {},
            async: true,
            success: function (response) {
                parseXML(response);
            }
        })
    };

    ajtest();
}


