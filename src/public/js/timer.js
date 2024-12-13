let startTime;
let timerInterval;
let isRunning = false;
let isPaused = false;

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        startTime = new Date();
        
        fetch('/api/timer/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startTime })
        });

        timerInterval = setInterval(updateTimer, 1000);
        updateButtonStates();
    }
}

function pauseTimer() {
    if (isRunning && !isPaused) {
        isPaused = true;
        clearInterval(timerInterval);
        
        fetch('/api/timer/pause', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        updateButtonStates();
    } else if (isPaused) {
        isPaused = false;
        timerInterval = setInterval(updateTimer, 1000);
        updateButtonStates();
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        isPaused = false;
        clearInterval(timerInterval);
        
        fetch('/api/timer/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        updateButtonStates();
    }
}

function sendManualNotification() {
    fetch('/api/timer/send-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const notification = document.getElementById('notification');
        if (data.success) {
            notification.textContent = 'Notificación enviada correctamente';
            notification.className = 'notification success';
        } else {
            notification.textContent = data.error || 'Error al enviar la notificación';
            notification.className = 'notification error';
        }
        setTimeout(() => {
            notification.textContent = '';
            notification.className = 'notification';
        }, 3000);
    });
}

function updateTimer() {
    const now = new Date();
    const diff = now - startTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (hours >= 8) {
        stopTimer();
    }
}

function updateButtonStates() {
    document.querySelector('.start').disabled = isRunning;
    document.querySelector('.pause').disabled = !isRunning;
    document.querySelector('.stop').disabled = !isRunning;
    document.querySelector('.pause').textContent = isPaused ? 'Reanudar' : 'Pausar';
}