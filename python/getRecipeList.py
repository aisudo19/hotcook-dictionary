import logging
from typing import List, Dict
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd
import time
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SharpRecipeScraper:
    def __init__(self):
        # Chromeドライバーの設定
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')  # ヘッドレスモードで実行
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        # ChromeDriverManagerを使用して最新のドライバーを自動でダウンロード
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        # スクレイピングするURLを変更するには、80行目を修正すること。このURLは?を含むクエリパラメータは入れられない
        self.base_url = "https://cocoroplus.jp.sharp/kitchen/recipe/searchresults/"

    def get_recipe_items(self, page_source: str) -> List[Dict]:
        """レシピ情報を抽出する"""
        soup = BeautifulSoup(page_source, 'html.parser')
        recipe_items = []

        # レシピアイテムの取得
        articles = soup.find_all('article', class_='articleWrap')
        logger.info(f"Found {len(articles)} articles")

        for article in articles:
            try:
                # サムネイル画像のURL
                a_tag = article.find('a')
                if not a_tag:
                    continue

                img_tag = article.find('img', class_='thumbnail')
                if not img_tag:
                    continue

                recipe_title = img_tag.get('alt', '')
                thumbnail_url = img_tag.get('src', '')

                # 対応機器アイコンの取得
                icons = []
                icon_list = article.find('ul', class_='rightTopIconList')
                if icon_list:
                    if icon_list.find('svg', class_='icon-healsiodeli'):
                        icons.append('ヘルシオデリ')
                    if icon_list.find('svg', class_='icon-hotcook'):
                        icons.append('ホットクック')

                recipe_items.append({
                    'title': recipe_title,
                    'thumbnail_url': thumbnail_url,
                    'supported_devices': ','.join(icons)
                })

            except Exception as e:
                logger.error(f"Recipe parsing error: {str(e)}")
                continue

        return recipe_items

    def scrape_recipes(self, max_recipes: int = 100) -> pd.DataFrame:
        """レシピ情報をスクレイピングしてDataFrameで返す"""
        all_recipes = []
        offset = 0
        limit = 20

        try:
            while len(all_recipes) < max_recipes:
                url = f"{self.base_url}?offset={offset}&limit={limit}&search=&models=KN-HW24G&cooktime=&reservation=false&ignore_text=&categories=煮物"
                logger.info(f"Accessing URL: {url}")

                self.driver.get(url)

                # ページの読み込みを待機
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "articleWrap"))
                )

                # スクロールしてコンテンツを読み込む
                last_height = self.driver.execute_script("return document.body.scrollHeight")
                while True:
                    self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)
                    new_height = self.driver.execute_script("return document.body.scrollHeight")
                    if new_height == last_height:
                        break
                    last_height = new_height

                # レシピ情報を抽出
                recipes = self.get_recipe_items(self.driver.page_source)
                if not recipes:
                    break

                all_recipes.extend(recipes)
                logger.info(f"Total recipes collected: {len(all_recipes)}")

                offset += limit

                # 少し待機してサーバーに負荷をかけないようにする
                time.sleep(2)

            # DataFrameに変換
            df = pd.DataFrame(all_recipes)

            # CSVファイルとして保存
            output_file = 'sharp_recipes.csv'
            df.to_csv(output_file, index=False, encoding='utf-8-sig')
            logger.info(f"Saved recipes to {output_file}")

            return df

        except Exception as e:
            logger.error(f"Scraping error: {str(e)}")
            return pd.DataFrame()

        finally:
            self.driver.quit()

def main():
    scraper = SharpRecipeScraper()
    results = scraper.scrape_recipes(max_recipes=100)  # 最大100件のレシピを取得

    if not results.empty:
        print("\nScraping completed successfully")
        print(f"Total recipes collected: {len(results)}")
        print("\nFirst 5 recipes:")
        print(results.head())
    else:
        print("\nFailed to collect recipes")

if __name__ == "__main__":
    main()