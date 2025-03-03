window.onload = () => {
    let apiURL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?';
    let apiKey = 'KfnFqggt6uHPlWAXrfEiqUVrs%2F%2FZqaxSjlhuwdQK5mHccyS2rt2A1c44p7qq6o7l4%2BieviPEAIt%2BeP1tumunDg%3D%3D';
    var today = new Date();

    // var time = ('0' + today.getHours()).slice(-2) + '00';
    var time = "0500";
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