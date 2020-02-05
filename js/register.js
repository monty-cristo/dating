"use strict";

import { html, render, Component } from "../vendor/js/preact.js";
import { playWebcam, createPicture, uploadPicture } from "./methods/webcam.js";
import getDropdownArray from "./methods/getDropdownArray.js";

class Webcam extends Component {
  async componentDidMount() {
    //await playWebcam(this.videoRef);
  }

  //unmount webcam

  snap = e => {
    const src = createPicture(this.videoRef, this.canvasRef);
    this.imageRef.src = src;
  };

  toggleWebcam = e => {
    this.props.toggleWebcam(e);
  };

  render() {
    return html`
      <video
        src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
        id="video"
        width="300"
        autoplay
        ref=${c => (this.videoRef = c)}
      ></video>
      <img
        src="https://scrumserver.tenobe.org/scrum/img/no_image.png"
        id="foto"
        alt="webcam foto"
        width="300"
        ref=${c => (this.imageRef = c)}
      />
      <canvas id="canvas" ref=${c => (this.canvasRef = c)}></canvas>
      <input type="button" value="Snap!" onclick=${this.snap} />
      <input type="button" value="Dit is 'em!" />
      <input type="button" value="Terug" onclick=${this.toggleWebcam} />
    `;
  }
}

class App extends Component {
  state = {
    hairColors: [],
    eyeColors: [],
    show: false
  };

  componentDidMount() {
    this.getOptions();
  }

  getOptions = async () => {
    const [hairColors, eyeColors] = await getDropdownArray();
    this.setState({
      hairColors,
      eyeColors
    });
  };

  onInput = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };

  onWachtwoordCheck = ({ target }) => {
    this.wachtwoordRef.setCustomValidity("");
    if (this.state.wachtwoord !== target.value) {
      this.wachtwoordRef.setCustomValidity("Passwords must be the same!");
    }
  };

  createUser = async () => {
    const { hairColors, eyeColors, show, ...rest } = this.state;

    const data = {
      sexe: "",
      haarkleur: "",
      oogkleur: "",
      gewicht: 0,
      grootte: 0,
      beroep: "",
      foto: "no_image.jpg",
      lovecoins: "3",
      ...rest
    };

    const url = "https://scrumserver.tenobe.org/scrum/api/profiel/create.php";

    const request = new Request(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });

    try {
      const response = await fetch(request);
      const { id } = await response.json();
      sessionStorage.setItem("user", id);
      window.location.href = "/";
    } catch ({ message }) {
      alert(message);
    }
  };

  onPhotoClick = async e => {};

  onsubmit = async e => {
    e.preventDefault();

    await this.createUser();
  };

  toggleWebcam = e => {
    e.preventDefault();
    this.setState(prev => ({
      show: !prev.show
    }));
  };

  render({}, state) {
    if (state.show) {
      return html`
        <${Webcam} toggleWebcam=${this.toggleWebcam} />
      `;
    }

    //check if user has a webcam or camera
    const md = navigator.mediaDevices;
    const hasWebcam = !md || !md.enumerateDevices;

    return html`
      <h1>Registreer</h1>
      <form onsubmit=${this.onsubmit}>
        <div class="inputs">
          <div>
            <h2>Persoonlijk</h2>
            <input
              type="text"
              value=${state.familienaam}
              oninput=${this.onInput}
              name="familienaam"
              maxlength="1000"
              placeholder="Familienaam"
              required
            />
            <input
              type="text"
              value=${state.voornaam}
              oninput=${this.onInput}
              name="voornaam"
              maxlength="1000"
              placeholder="Voornaam"
              required
            />
            <input
              type="date"
              value=${state.geboortedatum}
              oninput=${this.onInput}
              name="geboortedatum"
              required
            />
            ${hasWebcam &&
              html`
                <input
                  type="button"
                  value="Trek een foto"
                  onclick=${this.toggleWebcam}
                />
              `}
          </div>
          <div>
            <h2>Kenmerken</h2>
            <select
              value=${state.sexe}
              oninput=${this.onInput}
              name="sexe"
              required
            >
              <option value="" disabled selected>Sex</option>
              <option value="m">m</option>
              <option value="v">v</option>
              <option value="x">x</option>
            </select>
            <select
              value=${state.haarkleur}
              oninput=${this.onInput}
              name="haarkleur"
            >
              <option value="" disabled selected>Haar Kleur</option>
              ${state.hairColors.map(
                color => html`
                  <option value=${color}>${color}</option>
                `
              )}
            </select>
            <select
              value=${state.oogkleur}
              oninput=${this.onInput}
              name="oogkleur"
            >
              <option value="" disabled selected>Oog Kleur</option>
              ${state.eyeColors.map(
                color => html`
                  <option value=${color}>${color}</option>
                `
              )}
            </select>
            <input
              type="number"
              value=${state.gewicht}
              oninput=${this.onInput}
              name="gewicht"
              placeholder="Gewicht"
              min="30"
              max="635"
            />
            <input
              type="number"
              value=${state.grootte}
              oninput=${this.onInput}
              name="grootte"
              placeholder="Grootte"
              min="55"
              max="272"
            />
            <input
              type="text"
              value=${state.beroep}
              oninput=${this.onInput}
              name="beroep"
              placeholder="Beroep"
            />
          </div>
          <div>
            <h2>Account</h2>
            <input
              type="text"
              value=${state.nickname}
              oninput=${this.onInput}
              name="nickname"
              placeholder="Nickname"
              required
            />
            <input
              type="email"
              value=${state.email}
              oninput=${this.onInput}
              name="email"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value=${state.wachtwoord}
              oninput=${this.onInput}
              name="wachtwoord"
              placeholder="Wachtwoord"
              required
              maxlength="1000"
            />
            <input
              type="password"
              oninput=${this.onWachtwoordCheck}
              ref=${c => (this.wachtwoordRef = c)}
              name="wachtwoordCheck"
              placeholder="Wachtwoord Check"
              required
              maxlength="1000"
            />
            <input type="submit" value="Registreer" />
          </div>
        </div>
      </form>
    `;
  }
}

render(
  html`
    <${App} />
  `,
  document.getElementById("app")
);
