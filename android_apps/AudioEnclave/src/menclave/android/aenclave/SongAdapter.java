package menclave.android.aenclave;

import java.util.List;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;


class SongAdapter extends ArrayAdapter<Song> {
  private Activity context;

  SongAdapter(Activity context, List<Song> songs) {
    super(context, R.layout.song, R.id.songName, songs);
    this.context = context;
  }

  public View getView(int position, View convertView, ViewGroup parent) {
    Song song = getItem(position);
    View songView = context.getLayoutInflater().inflate(R.layout.song, null);
    TextView songName = (TextView)songView.findViewById(R.id.songName);
    songName.setText(song.getTitle());
    TextView artistName = (TextView)songView.findViewById(R.id.artistName);
    artistName.setText(song.getArtist());
    return songView;
  }
}
