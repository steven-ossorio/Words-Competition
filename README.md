# Words

A fun, fast and competative game which expects users to create as many words as possible within 60 seconds. Words front end was build with the use of [React.JS][https://reactjs.org/] and it's backend through the use of [Firebase][https://firebase.google.com/docs/].

## Contents

1. [Overview](#overview)
1. [TODO](#todo)
1. [License](#license)

## Overview

Words can be enjoyed by playing a solo round or inviting friends through an access code given to you upon creating a game.

### Rules

The rules are simple and as follows:

- Only the creator will be able to start the game.
- Once a word is in the word box, it can't be written again.
- A point will be given to each word approved and send.
  - First condition is the word follows the rule of only using the generated letters.
  - Second condition is it exist within the dictionary as a valid word.
  - Last condition is to check wheather the word has already been used or not.

### Dictionary

In order to make sure a word is valid, a CSV file consisting of over 120,000 english words was used. In order to parse a CSV file into JSON, a package known as Papa Parse was used. It's has been known as being "the fastest in-browser CSV parse for JavaScript" and has an active download of 86,000 weekly.

```javascript
  setHash() {
    let dictionary = this.state.dictionary;
    let set = new Set();
    for (let i = 0; i < dictionary.length; i++) {
      set.add(dictionary[i]["aa"]);
    }
    this.setState({ dictionary: set });
  }
```

Upon parsing the data successfully, JSON is returned. In order to make sure we are able to look up a word as quickly as possible, a Set data structure was used. A Set, can be seen as similar to a Hash Table in regards to O(1) look up, but doesn't require us to place a key:value pairing.

### Firebase

Words, allows for players to either play solo or with muliple friends at the same time. In order for all players to receive live data, websockets were required for this application. This is where Firebase comes in, it's known for being the future of how we retreive data for it's realtime database. This realtime data base allows us to simply listen into a section of the backend and provides us with any changes that occur. An example use is as follow:

```javascript
wordCollection() {
    let words = [];
    let wordsObj = {};
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      words = [];
      let collection = snapshot.val();
      let wordsCollection = collection["words"];

      if (wordsCollection) {
        Object.keys(wordsCollection).forEach(wordKey => {
          words.unshift(wordsCollection[wordKey]);
          wordsObj[wordsCollection[wordKey]] = true;
        });
      }

      this.setState({
        words,
        wordsObj
      });
    });
  }
```

The function _on_ which is seen on line 5 is used in order to create a websocket that will constantly listen to changes. In this example, the on is listening to any changes occuring within Room/${gameID}. Visualy we can see this as:

- Room
  - GameID
    - Any changes from here

Once changes do occur and update are done within React. The DOM will automatically be updated to show the changes that have occured. Within this function, two different types of data structures can be found, an Array and a Hash Table. One can normally see unshift as not optimal without a ring buffer since it'll produce an O(n) as each word needs to be shifted one to the right before places a new element to the front. Though that is the case, for this scenario we can see it as O(1) since a newly created game will at most have 20-30 words generated within 60 seconds and we wanted to keep track of words being in order. A replacement data structure for this scenario would have been a Linked List due to its O(1) pushing to the front and same O(n) look up. Second is the Hash Table, which could have been replaced with a Set due to the unrequired need of a value. Though that is the case, the functionality still words the same where we use it's O(1) look up to check if a word has already been used.

#### Firebase minor issue when Unmounting a component (React)

When using the .on function, what we are technically doing is subscribing to the backend by creating an active websocket for realtime data. This can cause an unexpected error when component unmounts which is why it's required to disconnect/close the websocket when unmounting a component. "One wouldn't fly a plane to a different destination with the door open, I hope".

```javascript
  componentWillUnmount() {
    this.setState({ isMounted: false });
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).off("value");
  }
```

Disconnect is as simple as simply changing the on to off. This will cause the websocket to stop listening right before the component has successfully unmounted. The type of error that comes without disconnecting is as follows:

```javascript
Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the _class component
```

#### Firebase Auth

Currently a user isn't allowed to make an official account. This produced a minor problem in figuring out if a user has already joined the game or not through their unique ID usually given upon signing up. Such case can be resolved though the use of Firebase Auth package. Within the package there is a function called 'signInAnonymously'.

```javascript
firebase.auth().signInAnonymously();
```

Just as the function name implies, it'll anonymously sign in a user by providing a key which we assign to the window. The key given normally exist for about an hour within a user catch but it helps for us to check whether the set user ID alreadt exist in the collection of IDs we included to the game. The randomly generated ID also allows for users to create an official account if such functionality was included.

```javascript
const loginPromise = new Promise((resolve, reject) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.user = user;
      resolve(user.uid);
    } else {
      firebase
        .auth()
        .signInAnonymously()
        .then(user => {
          resolve(user.uid);
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
});
```

In order to make sure we recieved the ID before proceeding to creating a user in the database, a promise was used. Once a user ID has been created and it's been resolved, we called then in order to use the return ID.

```javascript
loginPromise.then(id => {
      let db = firebase.database();
      let playersRef = db.ref(`Room/${this.state.accesscode}/players`);
      playersRef.child(`${id}`).set(`${this.state.username}`);
      let player = db.ref(`Room/${this.state.accesscode}/players/${id}`);
      player.onDisconnect().remove();
```

A reference is kept of the specific user. The reason for such a reference is to make sure when a user refreshes the page or loses connection, their information will be removed from the current game. This action can be seen in the last line as it checks if the user has disconnected then runs remove once successful.

### Word

A word, before it is included to the array of submitted words goes through various condition checking before it can be submitted. The first step is to check if the input doesn't break any of the error handling as follows:

```javascript
  addWord(e) {
      let word = this.state.word.toLowerCase();
      if (word === "") {
        this.setState({ errors: "Can't be blank", word: "" });
        return;
      } else if (this.state.wordsObj[word]) {
        this.setState({ errors: "Word already exists", word: "" });
        return;
      }
```

Input is checked on two different levels. First to check if the input is empty, in which case a user can't send data to the backend. The second case is if a word alreadyt exists within the an object of words collected. As mentioned earlier, a Hash Table was used due to it's O(1) look up for quick checks. Words submitted were as well converted to lowercase since all words in the dictionary are lowered cased. Should the case proceed on the next phase, it'll be within the check function.

```javascript
  checkWord(word) {
    let letterObj = {};
    this.state.letters.split(",").forEach(letter => {
      letterObj[letter] ? (letterObj[letter] += 1) : (letterObj[letter] = 1);
    });
    for (let i = 0; i < word.length; i++) {
      let letter = word[i];
      if (!letterObj[letter] || letterObj[letter] === 0) {
        return false;
      }

      letterObj[letter] -= 1;
    }

    return true;
  }
```

The main use of checkWord is to make sure the word the player is trying to submit, has valid letters. The return value is a boolean since if it actually returns false, an error is add such as "Not using given letters". Last step is to check if the word being submitted is an actual word. This is done by checking the dictionary Set created, such lookup take O(1) time complexity which is extremly fast even though we have 120,000+ words in the Set.

```javascript
  if (this.props.dictionary.has(word) && check) {
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}/words`).push(word);
    this.addAPoint();

    this.setState({
      word: "",
      errors: ""
    });
```

## TODO

- Implent a ranking page of the top 10 highest scores of all time.
- Add playable music for entertainment.
- Allow up to only 4 players per room.
- Opportunity to create an account in order to keep track of scores.
- Make game visually compatible across all borwsers.

## License

<a rel="license" href="http://www.wtfpl.net/">WTFPL</a>

```

```
