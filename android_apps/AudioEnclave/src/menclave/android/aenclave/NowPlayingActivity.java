package menclave.android.aenclave;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

public class NowPlayingActivity extends Activity {
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    TextView text = new TextView(this);
    text.setText("now playing");
    setContentView(text);
  }
}
