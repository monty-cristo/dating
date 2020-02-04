"use strict";
import {
  html,
  render,
  Component
} from "https://unpkg.com/htm/preact/standalone.module.js";

// class Message extends Component {
//   render() {
//     return html``;
//   }
// }

class UserItem extends Component {
  render({ user: { nickname, foto } }) {
      
    return html`
      <li><img src=https://scrumserver.tenobe.org/scrum/img/${foto} /><span>${nickname}</span></li>
    `;
  }
}

class ConversationList extends Component {
  render({ users = [] }) {
    return html`
      <ul>
        ${users.map(
          user => html`
            <${UserItem} user=${user} />
          `
        )}
      </ul>
    `;
  }
}

class Chat extends Component {
  render() {
    return html`
      <h1>Chat</h1>
    `;
  }
}

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.getConversations();
  }

  getConversations = async () => {
    const id = sessionStorage.getItem("user");

    try {
      const response = await fetch(
        `https://scrumserver.tenobe.org/scrum/api/bericht/read.php?profielId=${id}`
      );
      const conversations = await response.json();

      const userIds = conversations.map(([{ partnerId }]) => partnerId);

      let users = await Promise.all(
        userIds.map(async id => {
          const response = await fetch(
            `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${id}`
          );
          return response.json();
        })
      );

      users = users.map(({ nickname, foto }) => ({
        nickname,
        foto
      }));

      this.setState({
        conversations,
        users
      });
    } catch ({ message }) {
      console.log(message);
    }
  };

  render({}, { users = [] }) {
    return html`
      <div class="app">
        <${ConversationList} users=${users} />
        <${Chat} />
      </div>
    `;
  }
}

render(
  html`
    <${App} />
  `,
  document.body
);
