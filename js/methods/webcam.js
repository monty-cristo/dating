"use strict";
export async function playWebcam(videoElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    videoElement.srcObject = stream;
    videoElement.play();
  } catch ({ message }) {
    console.log(message);
  }
}

export function createPicture(video, canvas) {
  const context = canvas.getContext("2d");
  const height = video.videoHeight / (video.videoWidth / video.width);
  canvas.setAttribute("width", video.width);
  canvas.setAttribute("height", height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png", 100);
}

export async function uploadPicture(name, picture) {
  const url = "https://scrumserver.tenobe.org/scrum/api/image/upload.php";

  const data = {
    naam: name,
    afbeelding: picture
  };

  const request = new Request(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  });

  try {
    const response = await fetch(request);
    const { fileURL } = await response.json();
    console.log(fileURL);

    return fileURL;
  } catch ({ message }) {
    alert(message);
  }
}
