const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.querySelector(".progress-container");
const trackTitle = document.getElementById("track-title");

const tracks = [
    { title: "🎵 Ujabes - Kafka On The Shore", file: "../media/Ujabes - Kafka On The Shore.mp3" },
    { title: "🎵 Ujabes - Rio", file: "../media/Ujabes - Rio.mp3" },
    { title: "🎵 Ujabes - Alice", file: "../media/I dreamed about you last night.mp3" }
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
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';

    let apiURL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?';
    let apiKey = 'KfnFqggt6uHPlWAXrfEiqUVrs%2F%2FZqaxSjlhuwdQK5mHccyS2rt2A1c44p7qq6o7l4%2BieviPEAIt%2BeP1tumunDg%3D%3D';

    var today = new Date();
    var hours = today.getHours();

    // 만약 현재 시간이 00:00~01:59 이면, 어제 날짜를 사용
    if (hours < 2) {
        today.setDate(today.getDate() - 1);
    }

    // 날짜 포맷 (YYYYMMDD)
    var todayFormat = today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2) + ('0' + today.getDate()).slice(-2);

    // 최신 base_time부터 요청하도록 순서를 변경
    const baseTimes = ["0200", "0500", "0800", "1100", "1400", "1700", "2000", "2300"].reverse();

    // XML 데이터를 파싱하는 함수 (위치 확인 필수!)
    function parseXML(xmlDOM) {
        let resultCode = xmlDOM.getElementsByTagName("resultCode")[0]?.textContent;
        if (resultCode !== "00") {
            console.error("❌ API 응답 오류:", resultCode);
            return;
        }

        let category = xmlDOM.getElementsByTagName("category");
        let obsrValue = xmlDOM.getElementsByTagName("obsrValue");

        if (category.length === 0 || obsrValue.length === 0) {
            console.error("⚠️ API 데이터가 비어 있습니다.");
            return;
        }

        for (let i = 0; i < category.length; i++) {
            let cat = category[i].textContent;
            let value = obsrValue[i].textContent;

            if (cat === 'PTY') {
                let weatherIcons = {
                    "0": "🌤️", // 맑음
                    "1": "☔",  // 비
                    "2": "🌨️", // 비+눈
                    "3": "☃️",  // 눈
                    "4": "🌦️"   // 소나기
                };
                document.querySelector('#weather-PTY').innerHTML = weatherIcons[value] || "❓";
            } else if (cat === 'T1H') {
                document.querySelector('#weather-T1H').innerHTML = value + "°C ";
            } else if (cat === 'REH') {
                document.querySelector('#weather-REH').innerHTML = value + "%";
            }
        }
    }

    function retryFetch(baseTimeIndex = 0) {
        if (baseTimeIndex >= baseTimes.length) {
            console.error("⚠️ 모든 base_time에서 데이터가 없습니다.");
            return;
        }

        let baseTime = baseTimes[baseTimeIndex];
        let url = `${apiURL}serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=xml&base_date=${todayFormat}&base_time=${baseTime}&nx=55&ny=125`;

        console.log(`📡 요청: ${url}`);

        $.ajax({
            url: url,
            type: "GET",
            dataType: "xml",
            async: true,
            success: function (response) {
                console.log(`✅ ${baseTime} 응답 수신`);
                console.log(response);

                let resultCode = response.getElementsByTagName("resultCode")[0]?.textContent;
                if (resultCode === "03") {
                    console.warn(`⚠️ ${baseTime} 데이터 없음, 이전 base_time(${baseTimes[baseTimeIndex + 1]}) 재시도`);
                    retryFetch(baseTimeIndex + 1);
                } else {
                    console.log(`✅ ${baseTime} 데이터 정상 수신`);
                    parseXML(response);  // ✅ 이제 오류 없이 호출됨!
                }
            },
            error: function (xhr, status, error) {
                console.error(`❌ API 요청 실패 (${baseTime}):`, status, error);
                retryFetch(baseTimeIndex + 1);
            }
        });
    }

    // 실행
    retryFetch(0);


}


