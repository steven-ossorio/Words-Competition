# Words

A fun and fast paced word game using react.js on the frontend while using firebase useful websocket to keep track of changes in the game.

## Contents

1. [Overview](#overview)
1. [DataStructure][#datastructure]
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

Once the data has been parsed successfully, a collection of JSON was returned. The reason for using a Set Data Structure instead of a Hash table was due to not needing a key -> value pair. The search speed in a Set is exactly like a Hash table at O(1) time.

## DataStructure

## TODO

- Implent a ranking page of the top 10 highest scores of all time.
- Add playable music for entertainment.
- Allow up to only 4 players per room.
- Opportunity to create an account in order to keep track of scores.
- Follow DRY principle by refactoring reusable code.
- Make game visually compatible across all borwsers.

## License

<a rel="license" href="http://www.wtfpl.net/">WTFPL</a>
