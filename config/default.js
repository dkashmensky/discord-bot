module.exports = {
  token: '', // Bot secret token
  channel: '', // Discord channel ID
  botId: '', // Bot ID
  chatName: '', // In-game chat name
  filepath: '', // chatlog.txt file path relative to project dir
  backupPath: '', // backup file path, folder should exist
  toGameFilePath: '', // Path to file where discord pushes message to game chat
  filesizeLimit: 1.0, // size limit when chatlog.txt backed up and cleaned up
  mentions: { // mentions config
    users: [
      {
        alias: '',
        id: '',
      },
    ],
    roles: [
      {
        alias: '',
        id: '',
      },
    ],
    all: '',
  },
};
