*under construction

# potato (beta)

> "Be excellent to each other." ~ Bill S. Preston, Esq.

## concept

A simple chat app for a small group that can cherry-pick APIs and services and the ability to manage them in a way to serve the group's goal or purpose. Think of a fully interactive and customizable news feed, but also a communication channel in one.

> dev priorities (sorted)
* data security and identity protection, (user permissions, tos, etc.)
* regulations & ethics
* client solution (basic understanding of user space and environment)
* industry best practices (declaritive, top-down data flow, idempotent operations)

#### 0: state - auth & context

Consider a stripped down representation of two functions that live inside Potato's top-level context. Potato values a fully isolated authentication process which creates a redeemable session available when revisiting the site.

`onAuthStateChanged()` is a special listener inside the app's highest level context provider. It's tasked for handling all changes to the listener's callback, `user` - the auth state object which responds to a set of well-defined and comprehensive auth state changes.

```javascript
// src/SessionProvider.js
componentDidMount() {
  . . .
  const unsubscribe = firebase.auth()
    .onAuthStateChanged(async user => {
      if (user != null) {
        const { providerData, ...rest } = user;
        . . .
        if (userConfig) {
          // initialize with existing user
          this.initializeApp();
        } else {
          // initialize with newly-created config fetched from cloud
          const payload = await api.createNewUser();
          this.initializeApp();
        }
      } else {
        firebase.auth().signOut();
      }
    });
};
```

```javascript
// src/SessionProvider.js
initializeApp = async () => {
  . . .
  // sequence of "blocked" async reduction towards initial state
  // considering memoization?
  this.setState({}, () => {
    // you're going to see these conditions throughout the app.
    // please practice building idempontent operations
    if (user) this.setListeners();
    if (user) this.initNotifications();
  });
};
```
In theory this approach limits to one redraw on initialization, and _only_ reacts to a healthy auth `state` object (by healthy I mean is well-formed or is null) which destructures down to the respective "global-like" context fields: `userConfig`,
`userConfigs`, `activeRoom`, `fcmToken`, `subscribedRooms`, `messages`, `user`.

> `fcmToken` and `user` will likely be cut in favor of a more secure approach. In fact, a revisit to _all_ levels of state is required to sniff out any adjacent sources of truth that have been overlooked.

There is some complexity that can be removed here, but the context's state redundancies that _will_ remain are minimal and the convenience has been worth it so far. The largest benefit is the help that it provides in avoiding "prop drilling" which ultimately limits the number of redraws throughout the DOM and further described in other sections. Makes for a cool cpu :)

### state - state consumption & efficiency

The most frequently consumed resource is a message which are created via the standard .map() technique in any functional or class component. This is _potentially_ the most brittle part of the application, but sufficient precautions have been made of which the most noteworthy are listed as the following.

###### todo
