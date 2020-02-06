"use strict";
import { html, render, Component } from "../vendor/js/preact.js";

if(document.referrer != window.location && performance.navigation.type != 1) {
  sessionStorage.removeItem("selectedUser");
}

class ContactItem extends Component {
  changeContact = selectedUser => {
    this.props.changeContact(selectedUser);
  };

  render({ contact: { familienaam, voornaam, foto, email }, index, selected }) {
    return html`
      <li
        class="contactItem ${selected == 1 ? "selected" : ""}"
        onclick=${() => this.changeContact(index)}
      >
        <img src=https://scrumserver.tenobe.org/scrum/img/${foto} />
        <div>
          <span>${`${familienaam} ${voornaam}`}</span>
          <span>${email}</span>
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
              selected=${selectedUser == index}
            />
          `
        )}
      </ul>
    `;
  }
}

class Chat extends Component {
  onTextChange = e => {
    this.props.onTextChange(e);
  };

  onTextSend = async () => {
    await this.props.onTextSend();
    this.inputBoxRef.focus();
  };

  setInputBoxRef = dom => (this.inputBoxRef = dom);

  render({ conversation = [], text }) {
    return html`
      <div class="chat">
        <${Conversation} conversation=${conversation} />
        <div>
          <input
            onchange=${this.onTextChange}
            value=${text}
            type="text"
            placeholder="Stuur text..."
            ref=${this.setInputBoxRef}
          />
          <button onclick=${this.onTextSend} type="button">Send</button>
        </div>
      </div>
    `;
  }
}

class Conversation extends Component {
  render({ conversation }) {
    return html`
      <ul class="conversation" ref=${this.setChatBoxRef}>
        ${conversation.map(
          ({ bericht, benIkZender }, index) =>
            html`
              <${Message}
                message=${bericht}
                benIkZender=${benIkZender}
                isLast=${index === conversation.length - 1}
              />
            `
        )}
      </ul>
    `;
  }
}

class Message extends Component {
  componentDidMount() {
    if (this.props.isLast) this.chatBoxRef.scrollIntoView();
  }

  componentDidUpdate() {
    if (this.props.isLast) this.chatBoxRef.scrollIntoView();
  }

  setChatBoxRef = dom => (this.chatBoxRef = dom);

  render({ message, benIkZender, isLast }) {
    if (isLast) {
      return html`
        <li
          class="message ${benIkZender == 1 ? "zender" : ""}"
          ref=${this.setChatBoxRef}
        >
          ${message}
        </li>
      `;
    }

    return html`
      <li class="message ${benIkZender == 1 ? "zender" : ""}">
        ${message}
      </li>
    `;
  }
}

class App extends Component {
  state = {
    text: "",
    selectedUser: 0
  };

  constructor() {
    super();
    //Check to see if the user has a selected user in session.
    this.checkSessionUser();
  }

  async componentDidMount() {
    const initialConversations = await this.getConversations();

    let initialUserIds = initialConversations.map(
      ([{ partnerId }]) => partnerId
    );

    const [conversations, selectedUser, userIds] = this.createNewConversation(
      initialConversations,
      initialUserIds
    );

    const contacts = await this.getContacts(userIds);

    this.setState({
      conversations,
      contacts,
      selectedUser
    });
  }

  checkSessionUser = () => {
    if (sessionStorage.getItem("selectedUser")) {
      this.state = {
        ...this.state,
        selectedUser: sessionStorage.getItem("selectedUser")
      };
    }
  };

  getConversations = async () => {
    const id = sessionStorage.getItem("user");

    try {
      const response = await fetch(
        `https://scrumserver.tenobe.org/scrum/api/bericht/read.php?profielId=${id}`
      );

      return await response.json();
    } catch ({ message }) {
      console.log(message);
    }
  };

  createNewConversation = (initialConversations, initialUserIds) => {
    const url = new URL(window.location.href);
    let selectedUser = this.state.selectedUser;
    let conversations = initialConversations;
    let userIds = initialUserIds;

    //TODO: Should probable use a statemachine for this one.....
    // Check if the user was linked to the chat
    if (url.searchParams.has("id")) {
      const contactId = url.searchParams.get("id");

      //check if there is already a selected user in session.
      if (sessionStorage.getItem("selectedUser")) {
        const sessionSelectedUser = sessionStorage.getItem("selectedUser");
        // Get the id of the user
        const sessionUserId = userIds[sessionSelectedUser];
        // Compare ids
        if (sessionUserId == contactId) {
          selectedUser = sessionSelectedUser;
        }
      } else {
        if (userIds.includes(contactId)) {
          selectedUser = userIds.indexOf(contactId);
        } else {
          //Add him to the end of the user list
          userIds = [...userIds, url.searchParams.get("id")];

          userIds.sort((a, b) => a - b);

          //Selecte the new user
          selectedUser = userIds.indexOf(contactId);

          //Add empty conversation to list.
          conversations = [
            ...conversations.slice(0, selectedUser),
            [],
            ...conversations.slice(selectedUser)
          ];
        }
      }
    }

    return [conversations, selectedUser, userIds];
  };

  getContacts = async userIds => {
    //TODO: Probably can clean this up a bit.
    const contacts = await Promise.all(
      userIds.map(async id => {
        const response = await fetch(
          `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${id}`
        );
        return response.json();
      })
    );

    return contacts.map(({ familienaam, voornaam, foto, id, email }) => ({
      familienaam,
      voornaam,
      foto,
      id,
      email
    }));
  };

  changeContact = selectedUser => {
    sessionStorage.setItem("selectedUser", selectedUser);

    this.setState({ selectedUser });
  };

  onTextChange = e => {
    this.setState({ text: e.target.value });
  };

  onTextSend = async () => {
    const { text, contacts, selectedUser } = this.state;
    const url = "https://scrumserver.tenobe.org/scrum/api/bericht/post.php";

    const vanId = sessionStorage.getItem("user");
    const naarId = contacts[selectedUser].id;
    const bericht = text;

    const data = {
      vanId,
      naarId,
      bericht
    };

    const request = new Request(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });

    try {
      await fetch(request);
      const conversations = await this.getConversations();

      this.setState({ text: "", conversations });
    } catch ({ message }) {
      alert(message);
    }
  };

  render({}, { contacts = [], conversations = [], selectedUser, text }) {
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
        <${Chat}
          conversation=${conversations[selectedUser]}
          onTextChange=${this.onTextChange}
          onTextSend=${this.onTextSend}
          text=${text}
        />
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
