# ToDo App
第1弾→第2弾へ機能を段階的に拡張した学習プロジェクト。

ブラウザだけで動くシンプルな ToDo。  
**編集 / フィルタ / オートセーブ / 一括削除 / URLで状態保存** に対応。

## デモ
- GitHub Pages: （公開後ここにURL）

## 主な機能
- 追加・削除（削除はフェードアニメ）
- ダブルクリックで編集（Enter確定 / Escキャンセル / フォーカス外れても確定）
- フィルタ：All / Active / Done（URLハッシュで状態保持）
- オートセーブ（localStorage）
- Clear completed（完了一括削除）
- 件数バッジ（Done / Total）

## 使い方
1. テキストを入力して **追加**
2. チェックで完了
3. テキストをダブルクリックで編集
4. フィルタで絞り込み / `Clear completed` で完了一括削除

## 技術メモ
- 純粋な HTML/CSS/JS
- 状態は DOM + localStorage
- フィルタは `location.hash` 同期（戻る/進む対応）

## スクリーンショット
img/img1.png
