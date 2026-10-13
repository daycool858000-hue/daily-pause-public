// 80 fully reviewed cards: 40 original life notes + 40 carefully attributed thought reflections.
// Scripts load in order from index.html. Previous generic decks are not added.
window.freshCards = [...(window.pauseOriginalCards || []), ...(window.pauseSourcedCards || [])];
