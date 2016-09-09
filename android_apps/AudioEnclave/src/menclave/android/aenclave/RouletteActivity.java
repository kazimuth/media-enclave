package menclave.android.aenclave;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;

public class RouletteActivity extends Activity {
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    TextView text = new TextView(this);
    text.setText("roulette");
    setContentView(text);
  }
}
