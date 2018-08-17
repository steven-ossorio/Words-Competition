# Words

A fun and fast paced word game using react.js on the frontend while using firebase useful websocket to keep track of changes in the game.

## Contents

1. [Overview](#overview)
1. [TODO](#todo)
1. [License](#license)

## Overview

Words is a fast pace solo/multi player game, where each individual tries to create as many words as possible. Through the generation of 9 random
letters, a person must use those letters to think of a word.

### Rules

- If a word has already been written, you can't create that word.
- Point given to the first person who sends it.
- A dictionary will check for valid English words (spanding over 100,000 words).

### Dictionary

The 100,000+ words were compiled into a single CSV. In order to parse such a file, an NPM package Papa Parse was used. It is the fastest in-browser CSV parser for JavaScript and highly used in the community with 86,000 weekly downloads.

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

Once the data has been parsed successfully, JSON was returned. The reason for using a Set Data Structure instead of a Hash table was due to not needing a key -> value pair. The search speed in a Set is exactly like a Hash table at O(1) time.

### Firebase

Since Words allow multiple players to play at the same time, data must constantly be changing live. This is where Firebase comes in, it's known for it's realtime database which allows us to connect through websockets. An example of data being listened for changes can be found in the words component

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

The on within Firebase creats a connection to the backend where it'll constantly be listening for changes to occur. This connection allows for each user to listen and see changes occur as React components are updated due to changes in the state. There are two data structures used for this solution, an array and a hash table. Normally, unshift wouldn't be a good idea do to it's O(n) time in adding an element as it needs to shift every element a space to the right. Though that is the case, for this scenario we can see it as O(1) due to the low amount of words that will be within the array within 60 seconds. Second is the Hash table, upon looking at the solution, a Set could have been used as well since a key:value pair wasn't required. Both provide an O(1) search. This is important for when we want to make sure the word hasn't been used thus far.

#### Firebase Bug

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
- Follow DRY principle by refactoring reusable code.
- Make game visually compatible across all borwsers.

## License

<a rel="license" href="http://www.wtfpl.net/">WTFPL</a>
