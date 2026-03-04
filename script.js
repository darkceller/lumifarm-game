/**
 * 食物森林共生引擎 (Food Forest Guild Engine)
 * 功能：計算植物間的距離與屬性加成
 */

// 模擬從 plants_data.json 載入後的資料 (簡化版)
const plantDatabase = [
  { id: "mango_01", name: "芒果", layer: 1, provides: ["shade"], needs: ["full_sun"] },
  { id: "pigeon_pea_01", name: "樹豆", layer: 3, provides: ["nitrogen"], needs: ["full_sun"] },
  { id: "turmeric_01", name: "薑黃", layer: 6, provides: [], needs: ["shade"] },
  { id: "sweet_potato_01", name: "地瓜葉", layer: 5, provides: ["ground_cover"], needs: ["partial_shade"] }
];

// 遊戲地圖上的實例 (Instance)
// x, y 代表座標
const gardenMap = [
  { x: 10, y: 10, ...plantDatabase[0] }, // 芒果樹在 (10,10)
  { x: 11, y: 10, ...plantDatabase[2] }  // 薑黃種在它旁邊 (11,10)
];

/**
 * 計算兩點之間的距離
 */
function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * 核心邏輯：計算特定植物獲得的共生加成
 * @param {Object} targetPlant - 目標植物實例
 * @param {Array} allPlants - 地圖上所有植物
 */
function calculateSynergy(targetPlant, allPlants) {
  let score = 0;
  let activeBonuses = [];
  const EFFECTIVE_RANGE = 3; // 定義影響範圍為 3 個單位

  allPlants.forEach(otherPlant => {
    // 排除自己
    if (targetPlant === otherPlant) return;

    const dist = getDistance(targetPlant, otherPlant);

    // 如果在影響範圍內
    if (dist <= EFFECTIVE_RANGE) {
      
      // 邏輯 A：檢查遮蔭需求 (Shade Synergy)
      if (targetPlant.needs.includes("shade") && otherPlant.provides.includes("shade")) {
        score += 20;
        activeBonuses.push(`來自 ${otherPlant.name} 的遮蔭加成`);
      }

      // 邏輯 B：檢查氮肥需求 (Nitrogen Fixation)
      if (otherPlant.provides.includes("nitrogen")) {
        score += 15;
        activeBonuses.push(`來自 ${otherPlant.name} 的固氮肥力`);
      }

      // 邏輯 C：地被保護 (Soil Moisture)
      if (otherPlant.provides.includes("ground_cover")) {
        score += 10;
        activeBonuses.push(`來自 ${otherPlant.name} 的土壤保濕`);
      }
    }
  });

  return {
    finalScore: score,
    details: activeBonuses
  };
}

// --- 測試執行 ---
const myTurmeric = gardenMap[1]; // 選取薑黃
const result = calculateSynergy(myTurmeric, gardenMap);

console.log(`植物：${myTurmeric.name}`);
console.log(`健康評分：${result.finalScore}`);
console.log(`獲得加成：`, result.details.join(", ") || "無");