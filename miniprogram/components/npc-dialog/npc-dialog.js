/**
 * npc-dialog.js - NPC 情景对话组件
 */
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    npcName: {
      type: String,
      value: 'Aki'
    },
    message: {
      type: String,
      value: ''
    },
    subMessage: {
      type: String,
      value: ''
    },
    npcId: {
      type: String,
      value: 'aki'
    }
  },

  data: {
    avatarEmoji: '👽',
    avatarColor: '#9B59B6'
  },

  observers: {
    'npcId': function(id) {
      this.updateAvatar(id);
    }
  },

  lifetimes: {
    attached() {
      this.updateAvatar(this.properties.npcId);
    }
  },

  methods: {
    updateAvatar(npcId) {
      const avatars = {
        aki: { emoji: '👽', color: '#9B59B6' },
        ben: { emoji: '👦', color: '#3498DB' }
      };
      const avatar = avatars[npcId] || avatars.aki;
      this.setData({
        avatarEmoji: avatar.emoji,
        avatarColor: avatar.color
      });
    },

    onDismiss() {
      this.triggerEvent('dismiss');
    }
  }
});
