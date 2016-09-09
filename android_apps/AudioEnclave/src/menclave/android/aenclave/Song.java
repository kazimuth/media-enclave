package menclave.android.aenclave;

public class Song {
  private final String title;
  private final String album;
  private final String artist;
  //private int track;
  //private int time;

  public Song() {
    this("", "", "");
  }

  public Song(String title, String album, String artist) {
    this.title = title;
    this.album = album;
    this.artist = artist;
  }

  public String getTitle() {
    return title;
  }

  public String getAlbum() {
    return album;
  }

  public String getArtist() {
    return artist;
  }
}
