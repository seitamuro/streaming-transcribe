https://github.com/aws-samples/amazon-transcribe-streaming-example-webapp-audiostream

を参考にストリーミングされている音声に英語と日本語が含まれているときに適切に文字起こしされるようにカスタマイズしました。

# Get Started

```
pnpm install
pnpm run cdk:deploy
pnpm run web:dev
```

# 環境変数について

文字起こしの音声ソースは環境変数でマイクか画面キャプチャーにするかを選択することができます。
この設定は`setup-env.sh`の`VITE_TRANSCRIBE_AUDIO_SOURCE`の値を変更することで選択できます。
