"use strict";
import {
  html,
  render,
  Component
} from "https://unpkg.com/htm/preact/standalone.module.js";

class ContactItem extends Component {
  changeContact = selectedUser => {
    this.props.changeContact(selectedUser);
  };

  render({ contact: { familienaam, voornaam, foto }, index, selected }) {
    return html`
      <li
        class="contactItem ${selected == 1 ? "selected" : ""}"
        onclick=${() => this.changeContact(index)}
      >
        <img src=https://scrumserver.tenobe.org/scrum/img/${foto} />
        <div>
          <span>${`${familienaam} ${voornaam}`}</span>
          <span>gisteren</span>
        </div>
      </li>
    `;
  }
}

class ContactList extends Component {
  render({ contacts = [], selectedUser }) {
    return html`
      <ul class="contactList">
        ${contacts.map(
          (contact, index) => html`
            <${ContactItem}
              contact=${contact}
              changeContact=${this.props.changeContact}
              index=${index}
              selected=${selectedUser === index}
            />
          `
        )}
      </ul>
    `;
  }
}

class Chat extends Component {
  render({ conversation = [] }) {
    return html`
      <d class="chat">
        <${Conversation} conversation=${conversation} />
        <div>
          <input type="text" placeholder="Stuur text..." />
          <button type="button">Send</button>
        </div>
      </d>
    `;
  }
}

class Conversation extends Component {
  render({ conversation }) {
    return html`
      <ul class="conversation">
        ${conversation.map(
          ({ bericht, benIkZender }) =>
            html`
              <${Message} message=${bericht} benIkZender=${benIkZender} />
            `
        )}
      </ul>
    `;
  }
}

class Message extends Component {
  render({ message, benIkZender }) {
    return html`
      <li class="message ${benIkZender == 1 ? "zender" : ""}">${message}</li>
    `;
  }
}

class App extends Component {
  state = {
    selectedUser: 0
  };

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

      //TODO: split this up in functions
      const userIds = conversations.map(([{ partnerId }]) => partnerId);

      let contacts = await Promise.all(
        userIds.map(async id => {
          const response = await fetch(
            `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${id}`
          );
          return response.json();
        })
      );

      contacts = contacts.map(({ familienaam, voornaam, foto }) => ({
        familienaam,
        voornaam,
        foto
      }));

      console.log(conversations);

      this.setState({
        conversations,
        conversation: conversations[0],
        contacts
      });
    } catch ({ message }) {
      console.log(message);
    }
  };

  changeContact = selectedUser => {
    this.setState(({ conversations }) => ({
      selectedUser,
      conversation: conversations[selectedUser]
    }));
  };

  render(
    {},
    { contacts = [], conversations = [], conversation = [], selectedUser }
  ) {
    if (conversations.length === 0) {
      return html`
        <div class="verlegen">
          <h1>Psst, wees niet verlegen!</h1>
        </div>
      `;
    }

    return html`
      <div class="app">
        <${ContactList}
          contacts=${contacts}
          changeContact=${this.changeContact}
          selectedUser=${selectedUser}
        />
        <${Chat} conversation=${conversation} />
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
