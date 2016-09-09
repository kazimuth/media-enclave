package menclave.android.aenclave;

import android.app.TabActivity;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.widget.TabHost;


public class AudioEnclaveActivity extends TabActivity {
  /** Called when the activity is first created. */
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);

    Resources res = getResources();
    TabHost tabHost = getTabHost();
    TabHost.TabSpec spec;
    Intent intent;

    // Register now playing intent.
    intent = new Intent().setClass(this, NowPlayingActivity.class);
    spec = tabHost.newTabSpec("nowplaying");
    spec.setIndicator("Now Playing", res.getDrawable(R.drawable.ic_tab_search));
    spec.setContent(intent);
    tabHost.addTab(spec);

    // Register playlists intent.
    intent = new Intent().setClass(this, PlaylistsActivity.class);
    spec = tabHost.newTabSpec("playlists");
    spec.setIndicator("Playlists", res.getDrawable(R.drawable.ic_tab_search));
    spec.setContent(intent);
    tabHost.addTab(spec);

    //// Register search intent.
    //intent = new Intent().setClass(this, SearchActivity.class);
    //spec = tabHost.newTabSpec("search");
    //spec.setIndicator("Search", res.getDrawable(R.drawable.ic_tab_search));
    //spec.setContent(intent);
    //tabHost.addTab(spec);

    //// Register roulette intent.
    //intent = new Intent().setClass(this, RouletteActivity.class);
    //spec = tabHost.newTabSpec("roulette");
    //spec.setIndicator("Roulette", res.getDrawable(R.drawable.ic_tab_search));
    //spec.setContent(intent);
    //tabHost.addTab(spec);
  }
}
