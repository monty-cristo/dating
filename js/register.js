"use strict";

import { html, render, Component } from "../vendor/js/preact.js";
import { playWebcam, createPicture, uploadPicture } from "./methods/webcam.js";
import getDropdownArray from "./methods/getDropdownArray.js";

class Webcam extends Component {
  async componentDidMount() {
    await playWebcam(this.videoRef);
  }

  //unmount webcam

  snap = e => {
    const src = createPicture(this.videoRef, this.canvasRef);
    this.setState({
      src
    });
    this.imageRef.src = src;
  };

  confirmPicture = async e => {
    e.preventDefault();
    if (this.state.src) {
      const fileName = await uploadPicture("webcam", this.state.src);
      this.props.confirmPicture(fileName);
      this.props.toggleWebcam();
    }
  };

  toggleWebcam = e => {
    this.props.toggleWebcam(e);
  };

  render() {
    return html`
      <video
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
      <input type="button" value="Dit is 'em!" onclick=${this.confirmPicture} />
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

  onNickname = async ({ target }) => {
    target.setCustomValidity("");
    //check if the nickname is already taken.
    const url = "https://scrumserver.tenobe.org/scrum/api/profiel/exists.php";

    const data = {
      nickname: target.value
    };

    this.setState({
      nickname: target.value
    });

    const request = new Request(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });

    try {
      if (target.value) {
        const response = await fetch(request);
        const { message } = await response.json();
        //FUCKING WHY DOES THIS NOT RETURN A FUCKING BOOLEAN????????????!!!!!!!!!!!!!!.
        if (message !== "Profiel nickname beschikbaar") {
          target.setCustomValidity("Nickname is already taken");
        }
      }
    } catch ({ message }) {
      alert(message);
    }
  };

  onInput = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    });
  };

  onWachtwoordCheck = ({ target }) => {
    target.setCustomValidity("");
    if (this.state.wachtwoord !== target.value) {
      target.setCustomValidity("Passwords must be the same!");
    }
  };

  createUser = async () => {
    //TODO: put data in a data object so you don't have to extract this shit
    const { hairColors, eyeColors, show, ...rest } = this.state;

    const data = {
      sexe: "",
      haarkleur: "",
      oogkleur: "",
      gewicht: 0,
      grootte: 0,
      beroep: "",
      foto: "no_image.png",
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
      window.location.href = "/zoekpagina.html";
    } catch ({ message }) {
      alert(message);
    }
  };

  onsubmit = async e => {
    e.preventDefault();

    await this.createUser();
  };

  toggleWebcam = e => {
    this.setState(prev => ({
      show: !prev.show
    }));
  };

  confirmPicture = fileName => {
    this.setState({
      foto: fileName
    });
  };

  render({}, state) {
    if (state.show) {
      return html`
        <${Webcam}
          toggleWebcam=${this.toggleWebcam}
          confirmPicture=${this.confirmPicture}
        />
      `;
    }

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
            <div>
            <label for="geboortedatum"><h6>Geboortedatum</h6></label>
            <input
              type="date"
              value=${state.geboortedatum}
              oninput=${this.onInput}
              name="geboortedatum"
              id="geboortedatum"
              required
            />
            </div>
            ${this.state.foto &&
              html`
                <img
                  src="https://scrumserver.tenobe.org/scrum/img/${this.state
                    .foto}"
                  alt="profiel foto"
                />
              `}
            <input
              type="button"
              value="Trek een foto"
              onclick=${this.toggleWebcam}
            />
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
              oninput=${this.onNickname}
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
