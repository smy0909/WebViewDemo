package demo.baidu.com.webviewdemo;

import android.graphics.Bitmap;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ValueCallback;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    String jsStr = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        LinearLayout line=findViewById(R.id.line);
        webView=new WebView(this);
        readJs();
        Log.e("javascript",jsStr);
        ViewGroup.LayoutParams params=new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        final ProgressBar progressBar=new ProgressBar(this);
        progressBar.setLayoutParams(params);
//        line.addView(progressBar);
        line.addView(webView,params);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
//                view.loadUrl(url);
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e("error",error.getErrorCode()+"");
            }

            @Override
            public void onPageFinished(WebView view, String url) {//页面加载完成
                webView.loadUrl("javascript:" + jsStr);
//                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {//页面开始加载
//                progressBar.setVisibility(View.VISIBLE);
                Log.e("onPageStarted", "value=" + url);
                if (Build.VERSION.SDK_INT >= 19) {
                    webView.evaluateJavascript(jsStr, new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {//js与native交互的回调函数
                            Log.e("onPageStarted", "value=" + value);
                        }
                    });

                }
            }



        });
//        webView.loadUrl("https://www.baidu.com/");
        webView.requestFocus(View.FOCUS_DOWN);




    }

    public void readJs(){

        try {
            InputStream in = getAssets().open("Script_2.js");
            byte buff[] = new byte[1024];
            ByteArrayOutputStream fromFile = new ByteArrayOutputStream();
            do {
                int numRead = in.read(buff);
                if (numRead <= 0) {
                    break;
                }
                fromFile.write(buff, 0, numRead);
            } while (true);
            jsStr = fromFile.toString();
            in.close();
            fromFile.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.i("ansen","是否有上一个页面:"+webView.canGoBack());
        if (webView.canGoBack() && keyCode == KeyEvent.KEYCODE_BACK){//点击返回按钮的时候判断有没有上一页
            webView.goBack(); // goBack()表示返回webView的上一页面
            return true;
        }
        return super.onKeyDown(keyCode,event);
    }

}
