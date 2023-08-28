use: "strict";

console.log("hello");

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    // You have access to the microphone stream (MediaStream object)
  })
  .catch(function (error) {
    console.error("Error accessing microphone:", error);
  });

const audioContext = new AudioContext();
const mediaStreamSource = audioContext.createMediaStreamSource(stream);

const mediaRecorder = new MediaRecorder(stream);
const recordedChunks = [];

mediaRecorder.ondataavailable = function (event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
};

mediaRecorder.onstop = function () {
  const audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
  // You can do something with the audioBlob, like playing, saving, or uploading it
};

// Start recording
mediaRecorder.start();

// Stop recording after a certain duration, or based on user action
setTimeout(function () {
  mediaRecorder.stop();
}, recordingDuration);

const recordedBuffer = await audioContext.decodeAudioData(
  await audioBlob.arrayBuffer()
);
const playbackSource = audioContext.createBufferSource();
playbackSource.buffer = recordedBuffer;
playbackSource.connect(audioContext.destination);
playbackSource.start();
