"use strict";

import { html, render, Component } from "../vendor/js/preact.js";

class Favorite extends Component {
  state = {
    user: {
      nickname: "",
      foto: "",
      id: ""
    }
  };

  componentDidMount() {
    this.getUser(this.props.favorite.anderId);
  }

  getUser = async id => {
    try {
      const url = `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${id}`;

      const response = await fetch(url);
      const user = await response.json();

      this.setState({ user });
    } catch ({ message }) {
      console.log({ message });
    }
  };

  render({}, { user: { nickname, foto, id } }) {
    return html`
      <li class="favorite">
        <img
          src="https://scrumserver.tenobe.org/scrum/img/${foto}"
          alt="profiel foto ${nickname}"
        />
        <p>${nickname}</p>
        <a href="/profielAnderePersoon.html?id=${id}">Profiel</a>
        <a href="/chat.html?id=${id}">Chat</a>
      </li>
    `;
  }
}

class App extends Component {
  componentDidMount() {
    this.getFavorites();
  }

  getFavorites = async () => {
    try {
      const id = sessionStorage.getItem("user");
      const url = `https://scrumserver.tenobe.org/scrum/api/favoriet/read.php?profielId=${id}`;

      const response = await fetch(url);
      const favorites = await response.json();
      this.setState({ favorites });
    } catch ({ message }) {
      console.log({ message });
    }
  };

  render({}, { favorites = [] }) {
    return html`
      <h1>Favorites</h1>
      <ul class="favorites">
        ${favorites.map(
          favorite =>
            html`
              <${Favorite} favorite=${favorite}/>
            `
        )}
      </ul>
    `;
  }
}

render(
  html`
    <${App} />
  `,
  document.getElementById("app")
);
