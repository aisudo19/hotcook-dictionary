from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import json
import time

class RecipeScraper:
    def __init__(self):
        self.base_url = "https://cocoroplus.jp.sharp/kitchen/recipe/hotcook/KN-HW24H/"
        # Chrome オプションの設定
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')  # ヘッドレスモードで実行
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)  # 暗黙的な待機時間を設定

    def get_recipe_data(self, recipe_id):
        url = f"{self.base_url}{recipe_id}"
        try:
            self.driver.get(url)

            # ページの主要要素が読み込まれるまで待機
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "recipeName"))
            )

            # レシピ情報を取得
            recipe_data = {
                'id': recipe_id,
                'title': self._get_title(),
                'ingredients': self._get_ingredients(),
                'instructions': self._get_instructions(),
                'cooking_time': self._get_cooking_time(),
                'servings': self._get_servings()
            }

            return recipe_data

        except Exception as e:
            print(f"Error fetching recipe {recipe_id}: {str(e)}")
            return None

    def _get_title(self):
        try:
            return self.driver.find_element(By.CLASS_NAME, "recipeName").text.strip()
        except NoSuchElementException:
            return None

    def _get_ingredients(self):
        ingredients = []
        try:
            ingredients_list = self.driver.find_elements(By.CLASS_NAME, "tableSeparatedByDottedLines")
            for item in ingredients_list:
                name = item.find_element(By.CLASS_NAME, "tableSeparatedByDottedLines_dt").text.strip()
                amount = item.find_element(By.CLASS_NAME, "tableSeparatedByDottedLines_dd").text.strip()
                ingredients.append({
                    'name': name,
                    'amount': amount
                })
        except NoSuchElementException:
            pass
        return ingredients

    def _get_instructions(self):
        instructions = []
        try:
            steps = self.driver.find_elements(By.CSS_SELECTOR, ".OrederedList li")
            for step in steps:
                text = step.find_element(By.CLASS_NAME, "OrederedList_text").text.strip()
                instructions.append(text)
        except NoSuchElementException:
            pass
        return instructions

    def _get_cooking_time(self):
        try:
            time_items = self.driver.find_elements(By.CLASS_NAME, "TimeKcalSaltList_item")
            for item in time_items:
                if '分' in item.text:
                    return item.text.strip()
        except NoSuchElementException:
            pass
        return None

    def _get_servings(self):
        try:
            title_element = self.driver.find_element(By.CLASS_NAME, "ObiTitle")
            text = title_element.text.strip()
            if '人分' in text:
                return text
        except NoSuchElementException:
            pass
        return None

    def scrape_multiple_recipes(self, recipe_ids):
        recipes = []
        for recipe_id in recipe_ids:
            print(f"Processing recipe: {recipe_id}")
            recipe_data = self.get_recipe_data(recipe_id)
            if recipe_data:
                recipes.append(recipe_data)
                print(f"Successfully scraped recipe: {recipe_id}")
            # サーバーに負荷をかけないよう待機
            time.sleep(2)
        return recipes

    def save_to_json(self, recipes, filename='recipes.json'):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(recipes, f, ensure_ascii=False, indent=2)

    def close(self):
        self.driver.quit()

# 使用例
if __name__ == "__main__":
    recipe_ids = [
        "R4019",
        "R4352",
        "R4106",
        "R4533",
        "R4355",
        "R4107",
        "R4450",
        "R4354",
        "R100000000020",
        "R100000000040",
        "R4210",
        "R4363",
        "R4537",
        "R4020",
        "R4021",
        "R4211",
        "R4191",
        "R4223",
        "R4022",
        "R4513",
        "R4234",
        "R4023",
        "R4534",
        "R4535",
        "R4238",
        "R4131",
        "R4153",
        "R4216",
        "R4132",
        "R4468",
        "R4217",
        "R4384",
        "R4463",
        "R4133",
        "R4538",
        "R4471",
        "R4439",
        "R4332",
        "R101000000168",
        "R101000000122",
        "R4473",
        "R4012",
        "R100000000019",
        "R4108",
        "R4283",
        "R4392",
        "R4541",
        "R4309",
        "R4305",
        "R4209",
        "R4208",
        "R4225",
        "R4389",
        "R4227",
        "R4379",
        "R4135",
        "R4136",
        "R4003",
        "R4025",
        "R4380",
        "R4149",
        "R4430",
        "R4026",
        "R4478",
        "R4206",
        "R4548",
        "R4449",
        "R4192",
        "R4313",
        "R4314",
        "R4310",
        "R4311",
        "R4739",
        "R4027",
        "R4312",
        "R4235",
        "R4236",
        "R4028",
        "R4243",
        "R4475",
        "R4031",
        "R4015",
        "R4477",
        "R4008",
        "R4159",
        "R4029",
        "R4370",
        "R4371",
        "R4529",
        "R4528",
        "R4503",
        "R4530",
        "R4291",
        "R4030",
        "R4366",
        "R4410",
        "R4033",
        "R4009",
        "R4110",
        "R4018",
        "R4398",
        "R101000000177",
        "R4032",
        "R4034",
        "R4200",
        "R4035",
        "R4751",
        "R4325",
        "R4382",
        "R4037",
        "R4321",
        "R4320",
        "R4322",
        "R4381",
        "R4039",
        "R4040",
        "R4455",
        "R4036",
        "R4743",
        "R101000000006",
        "R101000000021",
        "R4416",
        "R100000000025",
        "R4476",
        "R4038",
        "R4318",
        "R4350",
        "R4359",
        "R4417",
        "R100000000006",
        "R4265",
        "R4245",
        "R4441",
        "R4239",
        "R4545",
        "R4113",
        "R4041",
        "R4004",
        "R4539",
        "R4531",
        "R4732",
        "R4731",
        "R4042",
        "R4043",
        "R4280",
        "R4201",
        "R4016",
        "R4044",
        "R4058",
        "R4481",
        "R4112",
        "R4114",
        "R4254",
        "R4435",
        "R4308",
        "R4467",
        "R4140",
        "R4090",
        "R4287",
        "R4511",
        "R4045",
        "R4259",
        "R4260",
        "R4119",
        "R4344",
        "R4456",
        "R4744",
        "R4203",
        "R4728",
        "R4502",
        "R4258",
        "R4141",
        "R4465",
        "R4284",
        "R4011",
        "R4257",
        "R4205",
        "R4193",
        "R4222",
        "R101000000156",
        "R101000000127",
        "R4282",
        "R101000000033",
        "R100000000043",
        "R4046",
        "R4092",
        "R4093",
        "R4047",
        "R4347",
        "R100000000003",
        "R4048",
        "R4536",
        "R4194",
        "R4143",
        "R4154",
        "R101000000185",
        "R4317",
        "R4299",
        "R4049",
        "R4319",
        "R4440",
        "R4383",
        "R4242",
        "R100000000007",
        "R4121",
        "R4330",
        "R4479",
        "R4007",
        "R4230",
        "R100000000001",
        "R4002",
        "R4543",
        "R4315",
        "R4546",
        "R4096",
        "R100000000021",
        "R4098",
        "R4504",
        "R4050",
        "R4547",
        "R4527",
        "R4729",
        "R4281",
        "R4240",
        "R4296",
        "R4434",
        "R4123",
        "R4124",
        "R4306",
        "R4498",
        "R4750",
        "R4233",
        "R4051",
        "R4377",
        "R4302",
        "R4385",
        "R4360",
        "R4295",
        "R100000000005",
        "R4505",
        "R4460",
        "R101000000142",
        "R4412",
        "R4053",
        "R4451",
        "R4472",
        "R4055",
        "R4419",
        "R4364",
        "R4418",
        "R4056",
        "R4057",
        "R4327",
        "R4532",
        "R4415",
        "R4420",
        "R4333",
        "R4212",
        "R4740",
        "R4730",
        "R4375",
        "R4150",
        "R4372",
        "R4727",
        "R101000000049",
        "R4334",
        "R4054",
        "R4443",
        "R4219",
        "R4307",
        "R4373",
        "R4001",
        "R4469",
        "R100000000002",
        "R4393",
        "R4261",
        "R4017",
        "R4146",
        "R4462",
        "R4293",
        "R4286",
        "R4147",
        "R4125",
        "R4298",
        "R4288",
        "R4542",
        "R100000000014",
        "R4195",
        "R100000000029",
        "R4346",
        "R4060",
        "R4061",
        "R4006",
        "R4549",
        "R4406",
        "R4326",
        "R4059",
        "R4752",
        "R4062",
        "R4474",
        "R4303",
        "R4014",
        "R100000000024",
        "R4063",
        "R4010",
        "R4345",
        "R4064",
        "R101000000005",
        "R4065",
        "R100000000030",
        "R4072",
        "R4066",
        "R4604",
        "R100000000013",
        "R4386",
        "R4603",
        "R4405",
        "R4551",
        "R4067",
        "R4602",
        "R4068",
        "R4442",
        "R4005",
        "R4432",
        "R4408",
        "R4218",
        "R4070",
        "R4294",
        "R4071",
        "R4367",
        "R4069",
        "R101000000070",
        "R4746",
        "R101000000165",
        "R101000000145",
        "R101000000141",
        "R101000000136",
        "R101000000146",
        "R101000000125",
        "R101000000107",
        "R4396",
        "R4397",
        "R4399",
        "R4297",
        "R4073",
        "R4300",
        "R101000000182",
        "R101000000181",
        "R4292",
        "R4075",
        "R4446",
        "R4734",
        "R4447",
        "R4353",
        "R4077",
        "R4374",
        "R4196",
        "R4076",
        "R4388",
        "R4387",
        "R4013",
        "R4368",
        "R4074",
        "R4753",
        "R101000000176",
        "R4482",
        "R4601",
        "R4220",
        "R4343",
        "R4078",
        "R4427",
        "R4316",
        "R4301",
        "R100000000004",
        "R4079",
        "R100000000022",
        "R4501",
        "R4461",
        "R4253",
        "R4241",
        "R4453",
        "R4151",
        "R4207",
        "R4438",
        "R4544",
        "R4400",
        "R4423",
        "R4425",
        "R4080",
        "R4081",
        "R4509",
        "R4454",
        "R4540",
        "R4262",
        "R4470",
        "R4331",
        "R4351",
        "R4431",
        "R4129",
        "R4082",
        "R4512",
        "R4483",
        "R4221",
        "R4736",
        "R4199",
        "R4411",
        "R4278",
        "R4279",
        "R4083",
        "R4357",
        "R4304",
        "R4378",
        "R101000000034"
    ]

    scraper = RecipeScraper()
    try:
        recipes = scraper.scrape_multiple_recipes(recipe_ids)
        scraper.save_to_json(recipes)
        print("Scraping completed and saved to recipes.json")
    finally:
        scraper.close()