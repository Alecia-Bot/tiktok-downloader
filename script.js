const videoBtn = document.getElementById('download-video');
const mp3Btn = document.getElementById('download-mp3');
const linkInput = document.getElementById('tiktok-link');
const resultDiv = document.getElementById('result');

// Helper function to clear result
function clearResult() {
    resultDiv.innerHTML = '';
}

// Helper function to show error
function showError(message) {
    clearResult();
    const errorElem = document.createElement('p');
    errorElem.style.color = 'red';
    errorElem.textContent = message;
    resultDiv.appendChild(errorElem);
}

async function fetchDownloadLink(tiktokUrl, type) {
    // type: 'video' or 'audio'
    try {
        // Using TikWM API for TikTok download
        // API endpoint: https://www.tikwm.com/api?url=...
        const response = await fetch(`https://www.tikwm.com/api?url=${encodeURIComponent(tiktokUrl)}`);
        if (!response.ok) {
            throw new Error('Gagal mengambil data dari API');
        }
        const data = await response.json();

        if (!data || !data.data) {
            throw new Error('Data dari API tidak valid');
        }

        if (type === 'video') {
            if (data.data.play) {
                return data.data.play;
            } else {
                throw new Error('Link video tidak ditemukan');
            }
        } else if (type === 'audio') {
            if (data.data.music && data.data.music.play_url) {
                return data.data.music.play_url;
            } else {
                throw new Error('Link audio tidak ditemukan');
            }
        }
    } catch (error) {
        throw error;
    }
}

// Handle video download
async function handleVideoDownload() {
    const url = linkInput.value.trim();
    if (!url) {
        showError('Silakan masukkan link TikTok');
        return;
    }
    clearResult();
    const loading = document.createElement('p');
    loading.textContent = 'Memuat video...';
    resultDiv.appendChild(loading);

    try {
        const videoUrl = await fetchDownloadLink(url, 'video');
        clearResult();
        const videoElem = document.createElement('video');
        videoElem.src = videoUrl;
        videoElem.controls = true;
        resultDiv.appendChild(videoElem);

        const downloadLink = document.createElement('a');
        downloadLink.href = videoUrl;
        downloadLink.download = 'tiktok-video.mp4';
        downloadLink.textContent = 'Download Video';
        downloadLink.className = 'download-btn';
        resultDiv.appendChild(downloadLink);
    } catch (error) {
        clearResult();
        showError(error.message);
    }
}

// Handle MP3 download
async function handleMp3Download() {
    const url = linkInput.value.trim();
    if (!url) {
        showError('Silakan masukkan link TikTok');
        return;
    }
    clearResult();
    const loading = document.createElement('p');
    loading.textContent = 'Memuat audio...';
    resultDiv.appendChild(loading);

    try {
        const audioUrl = await fetchDownloadLink(url, 'audio');
        clearResult();
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.download = 'tiktok-audio.mp3';
        downloadLink.textContent = 'Download MP3';
        downloadLink.className = 'download-btn';
        resultDiv.appendChild(downloadLink);
    } catch (error) {
        clearResult();
        showError(error.message);
    }
}

videoBtn.addEventListener('click', handleVideoDownload);
mp3Btn.addEventListener('click', handleMp3Download);
