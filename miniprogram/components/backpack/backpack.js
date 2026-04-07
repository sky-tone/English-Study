/**
 * backpack.js - 词汇背包组件
 */
Component({
  properties: {
    words: {
      type: Array,
      value: []
    }
  },

  data: {
    expanded: false,
    activeCategory: 'all',
    filteredWords: []
  },

  observers: {
    'words': function(words) {
      this.filterWords();
    }
  },

  lifetimes: {
    attached() {
      this.filterWords();
    }
  },

  methods: {
    toggleExpand() {
      this.setData({ expanded: !this.data.expanded });
    },

    switchCategory(e) {
      const category = e.currentTarget.dataset.category;
      this.setData({ activeCategory: category });
      this.filterWords();
    },

    filterWords() {
      const words = this.properties.words;
      const category = this.data.activeCategory;

      let filtered = words;
      if (category === 'nouns') {
        filtered = words.filter(w =>
          !['will', 'going to', 'am', 'is', 'are', 'first', 'next', 'then', 'finally'].includes(w.word.toLowerCase()) &&
          !w.word.match(/^(travel|visit|swim|go|eat|take|climb|draw|cut)/i)
        );
      } else if (category === 'verbs') {
        filtered = words.filter(w =>
          w.word.match(/^(travel|visit|swim|go|eat|take|climb|draw|cut)/i)
        );
      } else if (category === 'others') {
        filtered = words.filter(w =>
          ['will', 'going to', 'first', 'next', 'then', 'finally'].includes(w.word.toLowerCase())
        );
      }

      this.setData({ filteredWords: filtered });
    },

    onWordTap(e) {
      const word = e.currentTarget.dataset.word;
      this.triggerEvent('wordtap', { word });
    }
  }
});
