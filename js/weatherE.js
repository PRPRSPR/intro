const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const snowflakes = [];
const numSnowflakes = 50;

for (let i = 0; i < numSnowflakes; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.5
    });
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snowflakes.length; i++) {
        let s = snowflakes[i];

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();
        ctx.closePath();

        s.y += s.speed;

        if (s.y > canvas.height) {
            s.y = -s.radius;
            s.x = Math.random() * canvas.width;
        }
    }

    requestAnimationFrame(drawSnowflakes);
    
};


function drawRaindrops() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const drops = [];

    canvas.width = 450;
    canvas.height = 300;

    for (let i = 0; i < 100; i++) {
        drops.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 4 + 2,
            length: Math.random() * 10 + 10
        });
    }

    function animateRain() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(220, 228, 236, 0.8)";
        ctx.lineWidth = 2;

        drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > canvas.height) {
                drop.y = 0;
                drop.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animateRain);
    }

    animateRain();
};