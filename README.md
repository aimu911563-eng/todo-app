# Todo App

シンプルでアクセシブルなToDoアプリ。  
**デモ:** https://aimu911563-eng.github.io/todo-app/

## 概要
- タスクの追加 / 編集 / 削除 / 完了切替
- フィルタ（all / active / done）
- 未完了カウント表示
- 入力バリデーション（空白のみ禁止）
- localStorage による保存・復元
- アクセシビリティ対応（`aria-pressed`、操作ボタンに `aria-label` など）

## 画面イメージ
- トップ画面  
  ![トップ画面](docs/images/top.png)
- タスク追加・編集・削除  
  ![タスク追加](docs/images/task-added.png)
- フィルタ切替  
  ![フィルタ](docs/images/filter.png)

## 使い方（ローカル）
```bash
git clone https://github.com/aimu911563-eng/todo-app.git
cd todo-app
```
# ブラウザで index.html を開くだけで動作

## 技術スタック
- HTML / CSS / JavaScript（Vanilla JS）
- GitHub Pages（ホスティング）

## 今後の予定
- タスクに期限を設定
- タグ / カテゴリ分け
- ダークモード対応
