"use strict";
import { html, render, Component } from "../vendor/js/preact.js";

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
    //TODO: clear text from chat input
  };

  render({ conversation = [], text = "" }) {
    return html`
      <div class="chat">
        <${Conversation} conversation=${conversation} />
        <div>
          <input
            onchange=${this.onTextChange}
            value=${text}
            type="text"
            placeholder="Stuur text..."
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
  constructor() {
    super();

    const state = {
      text: "",
      contacts: []
    };

    //Check to see if the user has a selected user in session.
    if (sessionStorage.getItem("selectedUser")) {
      this.state = {
        ...state,
        selectedUser: sessionStorage.getItem("selectedUser")
      };
    } else {
      this.state = {
        ...state,
        selectedUser: 0
      };
    }
  }

  componentDidMount() {
    this.getConversations();
  }

  getConversations = async () => {
    const id = sessionStorage.getItem("user");
    const url = new URL(window.location.href);
    let selectedUser = this.state.selectedUser;

    try {
      const response = await fetch(
        `https://scrumserver.tenobe.org/scrum/api/bericht/read.php?profielId=${id}`
      );
      const conversations = await response.json();

      //TODO: split this up in functions
      let userIds = conversations.map(([{ partnerId }]) => partnerId);
      
      //Do we need to make a new conversation?
      if (url.searchParams.has("id")) {
        //check if we aren't already talking to this person
        const contactId = url.searchParams.get("id");
        console.log(userIds);
        if(userIds.includes(contactId)) {
          selectedUser = userIds.indexOf(contactId);
          this.changeContact(selectedUser);
          console.log(selectedUser);
        } else {
          //Add him to the end of the list
          userIds = [userIds, url.searchParams.get("id")];
        }
      }

      let contacts = await Promise.all(
        userIds.map(async id => {
          const response = await fetch(
            `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${id}`
          );
          return response.json();
        })
      );

      contacts = contacts.map(({ familienaam, voornaam, foto, id }) => ({
        familienaam,
        voornaam,
        foto,
        id
      }));

      this.setState({
        conversations,
        conversation: conversations[selectedUser],
        contacts
      });

      //TODO:scroll to the bottom of the chat.
      //element.scrollIntoView(false);
    } catch ({ message }) {
      console.log(message);
    }
  };

  changeContact = selectedUser => {
    sessionStorage.setItem("selectedUser", selectedUser);

    this.setState(({ conversations }) => ({
      selectedUser,
      conversation: conversations[parseInt(selectedUser)]
    }));
  };

  onTextChange = e => {
    this.setState({ text: e.target.value });
  };

  onTextSend = async () => {
    //send text.
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
      const response = await fetch(request);

      //Clear text
      this.setState({ text: "" });
      this.getConversations();
      //console.log(`message: ${message} | id=${id}`);
    } catch ({ message }) {
      alert(message);
    }
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
        <${Chat}
          conversation=${conversation}
          onTextChange=${this.onTextChange}
          onTextSend=${this.onTextSend}
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
