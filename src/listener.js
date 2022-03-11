class Listener {
  constructor(playlistsService, playlistSongsService, mailSender) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const requestedPlaylist = await this._playlistsService.getPlaylistById(playlistId);
      const songsOfRequestedPlaylist = await this._playlistSongsService
        .getPlaylistSongs(playlistId);
      const playlist = { ...requestedPlaylist, songs: songsOfRequestedPlaylist };
      const content = { playlist };

      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(content));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
