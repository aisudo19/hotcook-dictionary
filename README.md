### 概要

### ターゲットユーザー

### 画面遷移図 figma

### ER 図
![image](https://github.com/user-attachments/assets/90f57f25-6508-4d96-8abe-cfe096bf614c)

### サイト URL

### 技術スタック

### 苦労した点

### 流れ

Python の Selenium を使って Web 上のレシピを取得しました。
その際には、サーバに負荷をかけないよう一定程度の時間をおいてリクエストを送るようにしました。

取得できた CSV を json に変換し、Express.js で簡易なサーバを構築しました。
