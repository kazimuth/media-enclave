package menclave.android.aenclave;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

import android.app.ListActivity;
import android.app.SearchManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


public class SearchActivity extends ListActivity {
  /** Called when the activity is first created. */
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Intent intent = getIntent();
    List<Song> songs;
    if (Intent.ACTION_SEARCH.equals(intent.getAction())) {
      String query = intent.getStringExtra(SearchManager.QUERY);
      Type type = new TypeToken<List<Song>>(){}.getType();
      songs = new Gson().fromJson(SONGS_JSON, type);
      songs = filterSongsByQuery(songs, query);
    } else {
      songs = Arrays.asList(new Song("No search query", "", ""));
    }

    final SongAdapter adapter = new SongAdapter(this, songs);
    setListAdapter(adapter);
    getListView().setOnItemClickListener(new OnItemClickListener() {
      public void onItemClick(AdapterView<?> parent, View view, int position,
                              long id) {
        Toast.makeText(getApplicationContext(),
                       adapter.getItem(position).getTitle(),
                       Toast.LENGTH_SHORT).show();
      }
    });
  }

  private List<Song> filterSongsByQuery(List<Song> songs, String query) {
    List<Song> results = new ArrayList<Song>();
    String[] words = query.split("\\s");
    for (Song song : songs) {
      boolean skip = false;
      for (String word : words) {
        word = word.toLowerCase();
        if (!(song.getTitle().toLowerCase().contains(word) ||
              song.getArtist().toLowerCase().contains(word) ||
              song.getAlbum().toLowerCase().contains(word))) {
          skip = true;
          break;
        }
      }
      if (skip) {
        continue;
      }
      results.add(song);
    }
    return results;
  }

  static final String SONGS_JSON = "[" +
      "{'title': 'Glorious Dawn',       'album': '', 'artist': 'Carl Sagan'}," +
      "{'title': 'Semi-Charmed',        'album': '', 'artist': 'Third Eye Blind'}," +
      "{'title': 'Rainbow Stalin',      'album': '', 'artist': 'The Similou'}," +
      "{'title': 'Double Rainbow Song', 'album': '', 'artist': 'Double Rainbow Guy'}," +
      "{'title': 'Rapist Song',         'album': '', 'artist': 'Antoine Dodson'}" +
      "]";
}
