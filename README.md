### 概要

ホットクックという自動調理鍋を持っていますが、より調理において効率化ができればと思いました。
投稿したメニューの中から1週間の献立を自動作成したり、自分で献立にメニューを追加することができ、
食材リストを抽出できます。
このアプリを使えば買い物は1週間に1度で大丈夫になります。
Google認証を使用しており、ログインすることでレシピの投稿・閲覧・編集・削除が可能です。
Firebaseを使用しています。

### 画面
![image](https://github.com/user-attachments/assets/8dcab6cd-600f-4fb3-818d-33fc125cee3a)


### ER 図

%% https://mermaid-js.github.io/mermaid-live-editor/

```mermaid
erDiagram
  users ||--o{ user_recipes : has
  recipes ||--o{ user_recipes : referenced_by
  recipes ||--o{ recipe_ingredients : contains
  recipes ||--|| recipe_details : has

  users {
      string uid PK
      string displayName
      string email
      timestamp createdAt
      timestamp updatedAt
  }

  recipes {
      string recipeId PK
      string title
      string deviceName
      string category
      text memo
      timestamp createdAt
      timestamp updatedAt
  }

  user_recipes {
      string id PK
      string userId FK
      string recipeId FK
      boolean hasCooked
      boolean wantToCook
      int cookCount
      timestamp lastCookedAt
      timestamp createdAt
      timestamp updatedAt
  }

  recipe_ingredients {
      string id PK
      string recipeId FK
      string ingredientName
      string amount
      int order
  }

  recipe_details {
      string id PK
      string recipeId FK
      string title
      string cooking_time
      string servings
      array ingredients
      array instructions
  }
```

### アプリ URL

https://hotcook-dictionary-je8p6t6z7-aisudo19s-projects.vercel.app/

### 技術スタック
React 18
Firebase
React Testing Library

### 苦労した点
複数のコンポーネントでFirebaseからのデータを共有する際の設計や、
ユーザが保存したレシピを取得するために、Firestoreのuser_recipesとrecipesコレクションを連結させる点など

