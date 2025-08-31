const voiceBtn = document.getElementById("voice-btn");

function voiceSearch(searchInput) {
  document.addEventListener("DOMContentLoaded", () => {
    const voiceBtn = document.getElementById("voice-btn");
    if (!voiceBtn || !searchInput) return;

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "vi-VN"; 
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let isListening = false;

      voiceBtn.addEventListener("click", () => {
        if (!isListening) {
          recognition.start();
          isListening = true;
          voiceBtn.textContent = "🎙️ Đang nghe (nhấn để dừng)";
          console.log("🔊 Voice search: bắt đầu nghe...");
        } else {
          recognition.stop();
          isListening = false;
          voiceBtn.textContent = "🎤";
          console.log("⏹️ Voice search: đã dừng nghe (người dùng nhấn nút).");
        }
      });

      recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("✅ Nhận dạng:", transcript);
        searchInput.value = transcript;
        searchInput.dispatchEvent(new Event("input"));
      });

      recognition.addEventListener("end", () => {
        if (isListening) {
          // Nếu API tự end (không phải do người dùng nhấn nút), restart
          recognition.start();
        } else {
          voiceBtn.textContent = "🎤";
        }
      });

      recognition.addEventListener("error", (e) => {
        console.error("❌ Lỗi voice search:", e.error);
        isListening = false;
        voiceBtn.textContent = "🎤";
      });
    } else {
      console.warn("⚠️ Trình duyệt không hỗ trợ Web Speech API");
    }
  });
}