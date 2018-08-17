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

Once changes do occur and update are done within React. The DOM will automatically be updated to show the changes that have occured. Within this function, two different types of data structures can be found, an Array and a Hash Table. One can normally see unshift as not optimal without a ring buffer since it'll produce an O(n) as each word needs to be shifted one to the right before places a new element to the front. Though that is the case, for this scenario we can see it as O(1) since a newly created game will at most have 20-30 words generated within 60 seconds and we wanted to keep track of words being in order. A replacement data structure for this scenario would have been a Linked List due to its O(1) pushing to the front and same O(n) look up. Second is the Hash Table, which could have been replaced with a Set due to the unrequired need of a value. Though that is the case, the functionality still words the same where we use it's O(1) look up to check if a word has already been used. Reason for not using an Array is because it'll be O(n)

#### Firebase minor issue when Unmounting a component (React)

Much similar to when we "subscribe" to listening/connecting to the backend in order to recieve realtime data, one must also not forget to disconnect when a component is unmounting. Such a solution is very simple by just providing the off function onto our previous reference.

```javascript
  componentWillUnmount() {
    this.setState({ isMounted: false });
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).off("value");
  }
```

If a person forgets to disconnect, it'll produce an error such as

```javascript
Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the _class component
```

## TODO

- Implent a ranking page of the top 10 highest scores of all time.
- Add playable music for entertainment.
- Allow up to only 4 players per room.
- Opportunity to create an account in order to keep track of scores.
- Make game visually compatible across all borwsers.

## License

<a rel="license" href="http://www.wtfpl.net/">WTFPL</a>
