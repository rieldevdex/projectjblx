/* ================================================================
   JBLX — values.js
   Item data, filtering, sorting, pagination, card/list rendering
================================================================ */

const PAGE_SIZE = 20;

// ── IMAGE PATH HELPERS ────────────────────────────────────────
// Item images live in assets/item-images/{type}/{filename}
// Set image: "" to use the auto-generated initials fallback.
// TODO: Add image filenames as assets are dropped into the folders.

// ── ITEM DATA ─────────────────────────────────────────────────
const ITEMS = [

  // ════════════ VEHICLES ════════════════════════════════════════
  {
    name: "Javelin",       type: "Vehicle",
    value: 50000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Limited seasonal vehicle from Season 2. Sleek aerodynamic design and early-season origin make it one of the most coveted vehicles in the trading scene.",
    notes: "S2 · Updated 1 week ago",
    image: "assets/item-images/vehicles/javelin.webp"
  },
  {
    name: "Torpedo",       type: "Vehicle",
    value: 49000000,       duped: 44000000,
    demand: "Decent",      trend: "Stable",     change: "+1,000,000",
    description: "High-performance vehicle from Season 6. Streamlined chassis and sustained resale demand among veteran traders.",
    notes: "S6 · Updated 4 days ago",
    image: "assets/item-images/vehicles/torpedo.png"
  },
  {
    name: "Beignet",       type: "Vehicle",
    value: 40000000,       duped: 37000000,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Fan-favourite novelty vehicle from Season 8. Unique appearance and high-level requirement make it a rare find in active trades.",
    notes: "S8 · L10 · Updated 4 weeks ago",
    image: "assets/item-images/vehicles/beignet.png"
  },
  {
    name: "Celsior",       type: "Vehicle",
    value: 33000000,       duped: 31000000,
    demand: "Medium",      trend: "Stable",     change: "-500,000",
    description: "Refined luxury vehicle from Season 14. Facing a slight downtrend as newer seasonal releases compete for trader attention.",
    notes: "S14 · L10 · Updated 6 days ago",
    image: "assets/item-images/vehicles/celsior.png"
  },
  {
    name: "Proto-8",       type: "Vehicle",
    value: 30000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Futuristic concept vehicle from Season 17. High demand sustained by its unique aesthetic and clean trade history.",
    notes: "S14 · L10 · Updated 3 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgINxDHzFRtNfLUzJfvkpFLXGxesu73SLaW_nQQaKkAAZEmkR4S92I0ffaZ6A90DskKVinKUWY7nVJhFY7IC2zOtHYCIsE2qzxENhFDQTVc6T2lp9Ny1UVTI_vSJthdovV_ptenXv2fa89n9GIOcWoK-pBU7zJI4HVxUHg5jaMbhdPM98RqvKNREaL1BWRg/s873/Proto-08.jpg"
  },
  {
    name: "Power 1",       type: "Vehicle",
    value: 23000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Exclusive high-performance vehicle from Season 17. Features the most detailed interior and exterior of any vehicle in Jailbreak. Early-season origin contributes significantly to its maintained trading value.",
    notes: "S17 · L10 · Updated 4 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhdJSkSRMt6payrtbDoJu3wNCj7cEAhqvRoTsl4n_-hS7-RHEb58UZe1dRS1j3X_6WKzbkxpz4Rvqrg0fsI0jQiLyBYXeMxC0WYQTQ79dbjxTAghc1b1Q_6N3lxMuyjoDeu6Uu7BAw0uDWdlveLXnaTf3jelv3KdzwXT-W-g1_6Ea9pjVmWEsUDO4mmUjpC/s835/Power-1.png"
  },
  {
    name: "Arachnid",      type: "Vehicle",
    value: 21000000,       duped: 18000000,
    demand: "Medium",      trend: "Stable",     change: "+500,000",
    description: "Spider-themed vehicle from Season 2 with a distinctive multi-legged visual design. Moderate demand with a notable duped value spread.",
    notes: "S2 · Updated 1 week ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgT88_JjOX43hM-_6e_pwdzgoJ1g4D1Ko2L34VtlbGTkUsyWo7olYyRupXzJTbkxp_8fgDw1NbHSX4-7PIpHyWBAQ4hO7iL0fHSu1uLMeH7lV6d68zCKhNYg2vdVZUhyuyYcd0jQ5kt7_YGy8btKaXH-TaTi4BG2BbH0PBN52Enu3uM0S7tXJdh7AKWIikK/s672/Arachnid.jpg"
  },
  {
    name: "Icebreaker",    type: "Vehicle",
    value: 20000000,       duped: 17000000,
    demand: "Decent",      trend: "Stable",     change: "+500,000",
    description: "Winter-themed vehicle from Season 1. One of the earliest seasonal vehicles, giving it nostalgic value and consistent trading activity.",
    notes: "S1 · L10 · Updated 2 months ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYErgc8t1GhlzEh5Ipfej1YvjbqMLh7Cru2SQdmzwP6oPc0WIwPX7QGz7AZXkcRsulW6hyXB5By7S4j-QmD_U3imhZWF-vP24dKdz7ZK4BZviZwzl1oTwvPDmJlYVFOgL5uo8sDT71GSXsj_BTPAnGLkw2udAmSn-c3yACvjr7I9jTBanGVoPd5kj0LL8T/s805/Icebreaker.jpg"
  },
  {
    name: "Beam Hybrid",   type: "Vehicle",
    value: 19000000,       duped: 16000000,
    demand: "Decent",      trend: "Stable",     change: "+500,000",
    description: "Eco-styled hybrid vehicle from Season 1: New Beginnings. Clean design and level-locked status make it a mid-tier staple in most trade lists.",
    notes: "S1 · L10 · Updated 3 months ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjpEjbVGU65jp1FriymupigbSp08dqoEgSgBcUKlpiAGtBJ_tvrA3-ugW6MUt592bHbUmC6EE6g0Acj3Oni6pHAynDk-U2hKqZ3nLFdind-iLuTOZdgPa78U2zv9EwCN1SDZVbmWV2DGCoizH14lFEokL8SszzL3gXGiXrJ4ONK3XR_fQ7XX_XxMNc1nTrd/s755/Beam%20Hybrid.jpg"
  },
  {
    name: "Banana Car",    type: "Vehicle",
    value: 17000000,       duped: null,
    demand: "Decent",      trend: "Hyped",      change: "+1,000,000",
    description: "Grand prize of Season 5: Let The Memes Begin. It leaves a Banana trail when it drives, boasts high top speed and stats but lacks on traction.",
    notes: "S5 · L10 · Updated 19 hours ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhj4pwYQXZSkEnEvtbtbIiKY1TsFM66rdJPSQsd6XpOyihEOqq1h6iyQ_z8zgJUGgUKA4WoiB-3tLjFF-1mRwNKXPWrEdY3AS_7aUDqNKxN8ZMCK8iSun7N34MZzvjiT85aKlnZXNfKhQMu-HSKNqxTEZ60YlUPNFtD82gmaf26flBsMkULyOtput2zkq82/s764/Banana%20Car.jpg"
  },
  {
    name: "Molten M12",    type: "Vehicle",
    value: 15000000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "A limited 5-day vehicle with the original cost of $599000. Maintains steady trading volume with consistent mid-tier demand.",
    notes: "Updated 19 hours ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXT3rgxrQiTBE933nditqcAXdW1QyAlvRSTCFqcXK-g1FtRxT1RDvYEZYxR1fFFwJkqi7JmfjG7hrN5ZapwSLQ35g7n6G6hFcl3QxyD126WJr3c3fENVkTlcYRSVCAfhcsSK3YN1rIrNvvctMqw4FTZE7h4b5weJsoe0uj_LvzFs7adMw-N89MAUdmsG71/s884/Molten%20M12.jpg"
  },
  {
    name: "Stallion",      type: "Vehicle",
    value: 200000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "+500,000",
    description: "A powerful muscle car with classic American styling.",
    notes: "Updated 1 week ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNK4NZmRBOO8W43hfrTaM00kR8lYbPUfFXH8hodlF5vjslql5XDBlAq8npzfEeEpjpMBeE2oFsKzJwvwlGYWMviRZcOWXjHDrPs_1TFFPX8pC8CuKrRG2hsKidvCko-tdWCCAk1MPinQQELxI-n7QCzMTFmkrZLmeoJN5zQNhpVpJNn-d3oK5yVGWVszWI/s533/Stallion.jpg"
  },
  {
    name: "Brulee",        type: "Vehicle",
    value: 3000000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "A retired vehicle, later replaced with the Eclaire. Second-fastest vehicle in the game.",
    notes: "Updated 2 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiS52CZQTjHIeTtc_RMHGWei42sFlCFFcvzxHpxM9IxIMX2N8U2xv_eBGA4zVG-yW_k_8guxCpEt2yJaxN_Ah9x9qJMTxB2Mexptuo4lh77txoZV4J5JFTPMS1ePj4UNjTFyJ83xZB0Vy2OBVV3VzEzqdqrhYGjfdwYSd8fn5NCsORl-QEP8IG3wnhWe0L/s579/Brulee.jpg"
  },
  {
    name: "Rattler",       type: "Vehicle",
    value: 4000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "A customized Hot-Rod version from Season 4: 'Epic Adventures'.",
    notes: "S4 · L10 · Updated 3 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghdJEe2ZB-u7Y0bssDI4FYo1cSkrKKfBF11z3AWS4NlCGrTP1vKS2HUBngBcGBx_bo-2ox4sRUhGcdxyxEAGBh4_Ab-1GAGJWHbOH8OwBgJ57jX9i2dMznGTUH7z36Wy-FLDgjxwEAn3DdlDWPL0cvWO1iyRR65PA9XNs021yInSWCgKieTzjzfP5ABzmn/s805/Rattler.jpg"
  },
  {
    name: "Raptor",        type: "Vehicle",
    value: 11000000,       duped: null,
    demand: "Low",         trend: "Stable",     change: "-500,000",
    description: "Rugged off-road vehicle from Season 3. Falling demand as newer offerings attract trader attention.",
    notes: "S3 · Updated 2 days ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-zOoDE0ClSgoKDjbbxY5ldQiSa1X7-dtoHaK0JStpGG0GoUENxFFBSoh8CQZZZ1ncN1dyeZpWzUDPMmuN_5Y7a9kaztAGTuqF9swWaRtUdaoovBSKeCf-IJUnC0XN6hUhw3Yz_ddFtq71s3In2CTobGRSHhcAKexzg8QYjCUR3CLkIlt6JkzgGdAb-MPv/s643/Raptor.jpg"
  },
  {
    name: "Volt 4x4",      type: "Vehicle",
    value: 10000000,       duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Electric off-road SUV from Season 2. Fan favourite for its versatility and clean aesthetic.",
    notes: "S2 · L10 · Updated 3 days ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfbeDIoRIjn9QxWRxZqjrZ8kKU87mWVGTJXgu1n1RNr2bzexj80UfuFSeGvmbJvG3YhN5tdd9L_abeV0-nirXdDLxM2DEPTpXgZLisSRxpSnAxQ9ePaBSU2ttmq-BxeXz96drWZW2ekjvakiiZOc3qT6LkEbEHlt4lDl8J6PKRYGxfHHIJp4kU2L43zhNr/s800/Volt%204x4.jpg"
  },
  {
    name: "Crew Capsule",  type: "Vehicle",
    value: 9500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "-500,000",
    description: "Space-themed from Season 2: Out Of This World. Famous for its egg-shape and spawnability with Pro Garage",
    notes: "Updated 1 day ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL0iBeX6U74E5LXhJuNDwMC5s4po2jtppUVitFr7UV7MOwLKi2KnKDBVTZgbalGdOz2PtFsB9QzDLkUHy57G03fdzcuL6QEOWY7vtW5h4iDpLSTPBUkrDcbVEV1DePLhV0xIdN4yBupLmXJsrwcwC6iQRv4A1AZM3jFwzduUm20ovXxEFbDK2XnX_kEyDN/s1280/Crew%20Capsule.jpg"
  },
  {
    name: "Parisian",      type: "Vehicle",
    value: 9000000,        duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "Stylish European-inspired vehicle with a loyal collector base. High demand relative to its value tier.",
    notes: "Updated 19 hours ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLaiFJbjxzgJZ4WxMbwa5wpiRskkfN2FCut-3Mljma6Kz5RlTVJaZPswOnLom_J2YRZB5Uiei3bR057N8qgSsx8TVLtJSR8cX5m-oTpN0k1nfI5Tib6Xgo8VvOmacxrtJnHffM8dkDDhqtIKRl4s_4G7erXm0XT7cLC6kpUYqISmk9u51jJ1r-CkJAJ0lH/s689/Parisian.jpg"
  },
  {
    name: "Aperture",      type: "Vehicle",
    value: 7500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Sleek tech-themed vehicle from Season 15. Distinctive lens-shaped design with steady collector demand.",
    notes: "S15 · L10 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiz_IjRp_wVHSmLJ1XPjwfwvBqs2J4H-PeBcHr3-zk38YYBt1ltYbUp3vtjHrkbWjaPwtQanavpASfvGM7wNjnLpMJLXSUKDHpxH5RgiOOqIuHL5mcH5Nagw99qqevzfd1lzuTFnovLXixk2AiBR9kmAx3qYQVWZ4hfZiK5boCqSUX9jnCx1_82J-We5A_a/s659/Aperture.jpg"
  },
  {
    name: "Shogun",        type: "Vehicle",
    value: 6500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Samurai-inspired vehicle with strong visual identity. Consistent trading activity across multiple market cycles.",
    notes: "Updated 3 months ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-OSg_itUw4MKAryMi9F3C4SMyG9Jz-JAecBdmyKjWbN0zBqTC06N37coEBOfBwAIIsckG0paTfAPDLmTL4CBnlLJ14X3kAJS08JPouUpMqbehaPeWF1XKWtUEJnp2gp0aNhc2Xd1PcMePq7_b6r4Lhta_mTcNfhxV8JfqpHahF8ssYretTauO1tUqfsm5/s825/Shogun.jpg"
  },
  {
    name: "Scorpion",      type: "Vehicle",
    value: 6000000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Aggressive-styled sports vehicle. Recognisable design and broad appeal keep it active in casual trading.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEio9bcdfGjhMpLfGxxkYhJekypRcalCvXed5BiDE2fm-239MFlAH6O7tXHmFNuTZ5-8xVO_4iQpV4t1m8BQ-c7CmKLlVtSvpJhPEKg5cl-c4q3csflHs_HGWMqlxmfUVqt3_aWhCRSmsTY2vkuX1e2qPm7ZHBjWWZVQ2rWlcVpLplIkq5K_kGknBGYt17dO/s1032/Scorpion.jpg"
  },
  {
    name: "Carbonara",     type: "Vehicle",
    value: 5500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Food-themed novelty vehicle from Season 10. Part of the culinary series with consistent collector interest.",
    notes: "S10 · L10 · Updated 19 hours ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuFWcpBCUt1ZAyL3dxCiC7aodcDC42BsH0Kt_oP403ytKD9JoTcWuO6uM0HTjZh7vfSgtfmwrulcWvbKCAbw7dAkfITwYx5OCGTU1pfUbmPOMOYglUsn6mXy3zV8-YA-PQoGHrSd860tUZ6-oJ_bf4JQ3qEE2Z53LvVYhRuiaaHDzL55wDpW0cG5_9HLxf/s711/Carbonara.jpg"
  },
  {
    name: "Macaron",       type: "Vehicle",
    value: 5500000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Pastel-coloured confectionery vehicle. Novelty appeal sustains its position in the lower value bracket.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ_dVJqfIrZ6_kFK7Qa_aaudbKhsxTv3mTobIB6HmSv1vvGgHcOSeOVcMCdrlkV-TYnsOfizsRsZS0CBwRPKw32EWXeXsEtxv5kwAiVMKr_SaUVbJgIew97kLEWtsT1ZSmZGA0-lX6ffz2_GqtlcfIfChoEw63OyvS9BIN5XkER_B6UV0D0TYGXFdmt44y/s825/Macaron.jpg"
  },
  {
    name: "Roadster",      type: "Vehicle",
    value: 600000,        duped: null,
    demand: "Very Low",         trend: "Stable",     change: "",
    description: "Obtainable vehicle.",
    notes: "Updated 3 months ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-DkSAQaRc2t0Hyfyi3nqxb4YbSRoMXfldGoJ_Fico-vHIeWX0oRgR-yJRBjIeDiEdMesqM6rszlQ3CK2qKZrtIISoIZNASCWWvds8e2t5gFVdN6zPVzDVwdXBK_-4trodRh24LZDKUvl3etHS_SwHupv9QTwbZpF92-18qKfEPwYPs8Q0W7W4DIu793I5/s523/Roadster.jpg"
  },
  {
    name: "JB8",           type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "The Criminal Grand Prize from OG Season 3. Low value due to its' abysmal stats and looks.",
    notes: "S3 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQM6Q_rADEL5auKDSybICCQAWH4WYxP7RJLf9WsO-Wt1d3q1S9eTDXWx2sgPdPt4CC_QaQNnt98892hTDqGQ09cCs19uPQLM7X1fG9G0MsVtsk363omIFMqyPqGuP2CJtnUEQMDJbxl85jN2blP7gzjSay8mGSCYChumvjWXfvWfr0zrKx-Mwy_C6gVpPa/s669/JB8.jpg"
  },
  {
    name: "Iceborn",       type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "Ice-themed vehicle from limited event. Rare but low trading interest.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5zmzwoiqnkXRQQpT9NS6A0SSLweaMucAo-azhyphenhyphen0GJa0CBzy1eq3KcTQgdspJfH9pvV8lAikLJ3q8zYJ9kjrVWYBbjy0KJy4UzSU9Ia_0h5PsgDi91nvg2g_CBx385DuLemN6M_As_5gFdxLNyCObwSbAr4LjUjlKT6H5-qwFhGW5jLpqYAw8u58GruePq/s1174/Iceborn.jpg"
  },
  {
    name: "Snake",         type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "A limited vehicle with the original cost of $349.000, commonly known as the 'god of handling'.",
    notes: "S16 · L10 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSWR9_K7dXx4UrAq7Lz8Nq7C-WkS20PEX0hIayWvH_MGss-OimoMT_rqb2vqCZsH2CguGumgLpMoBCCJJ54TqF3JhCV-6fMY2grZpQjrV56GcxVZ5RAwKtkiHxBfv8wKTL8vq8Fca0nLm2GfizdE4RXAITYAXDAb7Jb-I6cYQFWYwrHPjw2-782WPrfxM1/s619/Snake.jpg"
  },
  {
    name: "Torero",        type: "Vehicle",
    value: 3500000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "High-performance limited vehicle from 2021 5 Days of Vehicles. Steady low-tier value.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEMdTqJD_ZMYnio3mG2x1pi2bA7JfN7Qvc3WPRSE4ufr3SUgAcgeA4sBxLjSENW57ytPtWx4bk90u5Qfe5AmJwR_VS2edBDPmCthEJ-t7lI-ECGlX7eh15CSPnC2tXgoaq7S6trQHe8QBCRY4LaFw7wwiOZ0AvRfO9WExACBti5Zmb8rv3GTCf7OrJMeN0/s656/Torero.jpg"
  },
  {
    name: "Concept",       type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Very Low",         trend: "Stable",     change: "",
    description: "Futuristic concept vehicle. Moderate collector interest.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3ivIQtdxAjkYV47t55zgfIw5Ct7l8aTSDPD2U8p6hWtflpE6TVU-psM5SJBSbGTUggAA39nyn06k32Z4yZt_tVemNliG31bVpCJ3BYlxSi9TwhtiOKEPScFdzW44tCtYuTGAi-3ZTBoVmcIm3qFd14csH14tCFmhOL4VBEFloT1RPOp8rYhSgYCD6qlZ1/s619/Concept.jpg"
  },
  {
    name: "Bloxy",         type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "Blocky-themed vehicle from Season 3. Nostalgic appeal.",
    notes: "S3 · L10 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgs_e5dUJGHhsg8YootQGEaqPxjm7q-3AHN1ix0aE2ooex3dGGDtRXMG1Ilrow61NogGV86MZJuFdhavkyHsGuZUDDBWIunD6DL4i5qnQlu-g2dUYdJ5ldZoXSVC5IFy8IvIDm0TF1A2rv3XZA7Ps_U4JicERwwnWAzJ21M4lFgn75z_zaDGQa6mFZ8yv_W/s730/Bloxy.jpg"
  },
  {
    name: "Tiny Toy",      type: "Vehicle",
    value: 3000000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "Miniature toy vehicle from Season 11. Fun novelty item.",
    notes: "S11 · L10 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi57lpG7DRd3WS3Ct7_MFdQFFGQ0LAvTURkZG5CGOIyvb-aR9520J9Rre5mJk1xcHY1JX8St9XDwrI2BeDvnEO7flEypry1DR2vLMnYwYpPhfdtxC1yiBMEl05KuTB5YBdD8ryisi9yqtmvEA8dvvIcjYOtOOeZo2bY5i4zF362jZqi9JeHlA_DurhgHz6Z/s675/Tiny%20Toy.jpg"
  },
  {
    name: "Frost Crawler", type: "Vehicle",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Frost Crawler was the grand prize for Season 19: ‘Northern Winter,’ having decent seating capacity and the tow hitch ability. Despite this, the vehicle is slow, and the season was 3 months long.",
    notes: "S19 - L10 - Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuiPiZruf4ch5h3agNN59sXJkImCWI3q1UG6j39j9D4Nt9KLruvdi9afI5u9o_xunIILsT_Lg_V1FM0fYcgf4dyozYRObF-doBmlqK3dFoY6roLQOBmsqsg8s6F1vHk6uZVmMoNh-LLZLunBcvwBBhFv3l_-DbQ7CJTqafe1KeNod1BVNEE3XfymLdgPCe/s810/Frost%20Crawler.jpg"
  },
  {
    name: "Manta",         type: "Vehicle",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Manta was introduced in Season 23 as part of the Tier 5 Legendary Safe revamp. Obtaining it requires spending several million. It has respectable performance and acceptable handling.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjCB5pSmZCzN4sihdevmisp_Ndg5AUHd_fwU6bqy8daCW31HlSF6b5IN772uiQguX7VocMEa0v9qYJGIT2UxpE-rsNH_ad5ZtLpjZz_24XTDSsn_zWA_P0nJKkl-6QNGipTc-QUuX_AZ7fuE63vsoxI14r1LsWzKqnug0E_E-LXnbHIO7UQIIXpkg3HVFvw/s1143/Manta.jpg"
  },
  {
    name: "Shell Classic", type: "Vehicle",
    value: 2000000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "The Shell Classic can be obtained from Tier 5 Legendary safes. The Shell Classic is based on a vintage roadster, but has rather unimpressive performance, making its demand extremely low.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOFE1YmGsnfnyZCpJZLoiIQhduqO9eL0CavZdstPt3-Jvt2r1zS2GAR6evwTh8aeymmuTQSZt8ITlVunQgPvSH-8VEABOLIFHx3xwyXO159xE3P_rzeqJqOiaaOVr-F4-qeHfVe8GCRzqV_ri3z7vuNrozxL0nj6i6_RZlWgo8ZX9rJ5-ipEWIZFLbuqQx/s565/Shell%20Classic.jpg"
  },
  {
    name: "Jackrabbit",    type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "The Jackrabbit was the Level 8 reward for Season 9: ‘A New Journey’ and was very poorly received, with only fair performance. The car is decent for off-roading, but has slow top speed.",
    notes: "S9 · L8 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL__2pZXF_U0SCyJdvwuioqB8zPyHzJOLJdH2d160bVSkGU7z1cwzui6lDQ5bih1TYgJAyyAO-dgxuPjTBXemIPzR8buHP4jK_xVB7mQEc06_dvYDSGWVI4mReiQqlIn4Y4G_4t24hyOswbrjx5zcuXWyAUCctwquhn3PNaOn3dxjxZa7Ke6_awURK2FMI/s856/Jack%20Rabbit.jpg"
  },
  {
    name: "Longhorn",      type: "Vehicle",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Longhorn was the grand prize for Season 18: ‘Wild West’ and has a convertible rooftop feature. However, the car has underwhelming performance and was not well-received by players.",
    notes: "S18 - L10 - Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwUqtixvu5mNTQg3rB09YhYi2VhdZsILd95nfCMqUHLsf0LheW6aVcslKQj-S64hOYWsQzjz8TS5IxrTDqutPB5SPtIk9tZCZfFrg6EQOQWodvDTuz07sDPckqVtrQ2SEkqauo4Nad36_Nmq0VkVFL8-KKlRQBmtjvZpZNfeNcn1Y-ErnbzZHN1oYPam2r/s795/Longhorn.jpg"
  },
  {
    name: "Maverick",      type: "Vehicle",
    value: 1000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Maverick was the grand prize for Season 22: ‘Made in America,’ having good off-road performance. This vehicle is underwhelming in various other characteristics, making it a low-demanded car.",
    notes: "S22 - L10 - Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0j-hOmX3grWcJtw645DrS2xE2TpsWQSwxPkYNCSkNYQzpLWewT58XvwQNu6igwH3i1ZHOVElj4Q0jy5rL1LaSfCuwswya7IjapwllZDyjlkUADcU4NVNPpbv45H489_x7JMoS0gZHxBh1Xg63otFy0FlYYJX6pQPyT6FSNZn7NN-2qWDlGv0mTJPaLVd-/s757/Maverick.jpg"
  },
  {
    name: "Megalodon",     type: "Vehicle",
    value: 1250000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Megalodon was purchasable for $300,000 from December 23rd, 2017, until officially being retired on July 12th, 2020.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2HwVsOC3vmEhR_PRUjOb2vwFvIf88NXThMFumzzqA291_VKwp4VeMOIk6kJ2bWpyOleNp63yl-zryanIHE8wT44jIBuusOW8vbZZjjMmoKj7Yc6fZN0zsKSPQxOMC7rRRAey4u8rmdD60nePzKAKIzn65ffZrrkF8f5VaNeHbD0-o2fxouRxmEPcwBdv9/s791/Megalodon.jpg"
  },
  {
    name: "OG Monster",    type: "Vehicle",
    value: 1000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Original monster truck. Nostalgic but low value. The OG Monster Truck was the grand prize for Season 21: ‘Rewind’ and is based on the Monster Truck before its revamp.",
    notes: "S21 - L10 - Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDezmJYXwAbg6knOft4hLIHWoxmz1UGEz5OlS84xHF9C0ISjknvc8sqEiuznxEZWS4cEi34OPQAP2lSBOMPxVWeIsy6ZzGcZ7sRqKNw5wUkOD-MbFfcfKWVC6ESN4TwV_YuG52gyw1HWrasPB3b7zYVnCbCfafB_19Ng25mt-6-sENQcXvKbTAS7ndNlzZ/s896/OG%20Monster.jpg"
  },
  {
    name: "Striker",       type: "Vehicle",
    value: 1250000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Striker was the grand prize of Season 20: ‘Apocalypse’ and has the unique weapon of a minigun on its roof.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKpbZfQV08MA_uzJz7btkk72fxahjElAs4PExVmo4J28SnWQM1gYLDLdES1NAURffPHryt_hDRIewouhaFVpTJ1pgEvuRwxAQ92lV9eexT9r07dv0scV0K93HsmNoHF5Ko5581RWWEWpiHC4ZSRnv5jvKiG2Jq7xXSPihMReE0nt-hD3jN69U5nQDqV8cf/s940/Striker.jpg"
  },
  {
    name: "Venom",         type: "Vehicle",
    value: 500000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Venom can be obtained from Tier IV Crime safes and has reasonable performance. This vehicle is fairly niche, but tends to appeal to many new players due to its design and good top speed.",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPG6O8l9rT_uoF0Pw_9YIZMV5ETSqvwRV0lHQbPjgSWB6TItwd4rrWHzhlquZbDBuwC0Br6dGl9lqWwXcXypXovWCyIXRBH1aeqIegArFtP6oZ1Zp9kXjd7TU__uQMOBMc5F3OEioymHLIo9sP6Ss7jKSAtQVnoVqsug0yVYazQi3Uxl1bF1-ZmQqbXx9J/s766/Venom.jpg"
  },
  {
    name: "Hammerhead",    type: "Vehicle",
    value: 300000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "The Hammerhead is purchasable from Tier III Police safes. This vehicle has a wedge-like shape that can be used as a ramp. ",
    notes: "Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjj8JSs92G0kWAPVY0s81jlexpazRlgp3vcDCCOuKnyExFmngCx6dMMyWI2i3bjgbwpwMyHDy5Odf1gO1pM002EtT4vnOlO3YZALAQ5uHsDBMQooIPA1wIRNwcsmB0cIL-IAmC-fEb29JxNsa7KacYuw-PhExm4KvZV-s-CWaJUTRFWBSrU4YziN84G4uar/s759/Hammerhead.jpg"
  },
  {
    name: "Wedge",         type: "Vehicle",
    value: 2500000,        duped: null,
    demand: "Decent",         trend: "Stable",     change: "",
    description: "A retro-themed vehicle introduced in Season 23: Back to the 80s.",
    notes: "S23 - L10 - Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjc3ErY3jzjXXh4BjUons259NGMLPCNCMAHstnT1unLuI7ahKQGLgpq31rqtJSfhSiH8Gbd8i3f75zNxuOJvD-QTZYx2ZoE256KnmyO5UI8g2weq9-JKFN0gSo0cI-2bFjqjmctsQZIRRNdfxs_NxP5MnmFkxbvKdZexpndWiafy0TQZNUXCJaalsHDM1Al/s1231/Wedge.jpg"
  },

  // ════════════ HYPERCHROMES ════════════════════════════════════
  {
    name: "HyperShift Level 5", type: "HyperChrome",
    value: 356000000,       duped: 312500000,
    demand: "Decent",        trend: "Stable",     change: "",
    description: "The rarest HyperShift obtained by collecting all Level 5 hyperchromes. Unique gradient color-changing rainbow effect.",
    notes: "Max tier · Updated 3 months ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9-__7QNY0CECkeRZfpLTSa1-Lj6ZFdAVXdFRE433E7tHAzFElQ0cXTxBEJ2f-kJ1H4lNiLIbTbfbIAO-rixEDZO2_K69HtbK2llyJ6_cKIC5iFhIQgpVKIPii0IFiWbAv-JpGobahC4woU7nnoHHIw3TJzsDz2sHfM97ZccLJ1p3qUYaHrQNspr2yWn9N/s327/Hyper%20Shift.gif"
  },
 {
    name: "HyperShift Level 4", type: "HyperChrome",
    value: 250500000,       duped: null,
    demand: "Very Low",        trend: "Stable",     change: "",
    description: "This color is a reference to all the different colors of HyperChromes at Level 4",
    notes: "Max tier · Updated 3 months ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9-__7QNY0CECkeRZfpLTSa1-Lj6ZFdAVXdFRE433E7tHAzFElQ0cXTxBEJ2f-kJ1H4lNiLIbTbfbIAO-rixEDZO2_K69HtbK2llyJ6_cKIC5iFhIQgpVKIPii0IFiWbAv-JpGobahC4woU7nnoHHIw3TJzsDz2sHfM97ZccLJ1p3qUYaHrQNspr2yWn9N/s327/Hyper%20Shift.gif"
  },
  {
    name: "Hyper Diamond Level 5", type: "HyperChrome",
    value: 70000000,       duped: 60000000,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Hyper Diamond is progressively evolved by grinding the Jewelry Store; one of the most popular hyperchrome colors.",
    notes: "L5 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLlOH_gR2_S3AswhEU6Flsp3tbYXPKs6AEL3gkDynmpv_Cnp1p3bmf7CIiE3ao-ficzKP7LT8I7JGtlsRBt-soeLbKQZdoJrnu0nHvo3LXs2yA2jlgq3m5HmEmOw-GwXeQJyHz15ql1jBJ-mi94vPufHEyVGKMN9EFkslX0V3KBAm592bsTzw8hWg6R5yz/s707/Diamond%20Level%20V.jpg"
  },
  {
    name: "Hyper Blue Level 5", type: "HyperChrome",
    value: 61000000,       duped: 50000000,
    demand: "Decent",        trend: "Stable",     change: "",
    description: "Hyper Blue is progressively evolved by grinding the Cargo Plane; considered the most time-consuming hyperchrome.",
    notes: "L5 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHUgEKwO4Sa2r9JqSW4CrMNznmy6-LlSOm1hlhMfeimxFRhQ4Ouc5fPZ3BU1AC_Ka7hDEtcCABZIC6mNNkPXAifA5eRqV14jGmlfyxWnkwP9iY8aHE4o8ZL5bq4QWADNkfQLbORmfAuOIp4Zqw5BdPU16TPLub2hnktD6zygZ_1YGKy23o5Dk1rwJoQWrt/s704/Blue%20Level%20V.jpg"
  },
  {
    name: "Hyper Pink Level 5", type: "HyperChrome",
    value: 58000000,       duped: 51000000,
    demand: "Decent",        trend: "Stable",     change: "",
    description: "Hyper Pink is progressively evolved by grinding the Casino; straightforward but time-consuming.",
    notes: "L5 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvB-O1wGpg2MvoXdITMTheE7kubRLhyphenhyphenBBjtF8PE61RIdUsYGsczO4OYSlbowl4ZEl_6s6ndbb0tuGcnKd9c4r4q4cSjcFLLwmtviyulBYDqG70N7Bdyu39EHDkf6y4tGYjqSBk9GM7jNLjMUdGl4W3LB7Kft90Lroil-f_cNshM7mFhp83DvZPsMseJink/s659/Pink%20Level%205.jpg"
  },
  {
    name: "Hyper Blue Level 4", type: "HyperChrome",
    value: 51000000,       duped: null,
    demand: "Very Low",      trend: "Stable",     change: "",
    description: "Mid-tier blue hyperchrome with intense metallic sheen.",
    notes: "L4 · Updated 1 week ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlz0KlbsM6alsiS0zPCTSODxpOHKz_pyfJX4hicK9MP6gU6OGr8wlZcnqNUwF4Ae91lRjYG4CqUJog0clUUHe8zD617n0u6ubQU9OD0lasBV7KcnXVFFrFqzsVyPPqkTrhAD0PQI7nKQDtd_VcQ507u5WFW3pP464A4GOiuAXhu_3V4RdT-tckSvBMrMoO/s751/Blue%20Level%20IV.jpg"
  },
  {
    name: "Hyper Red Level 5", type: "HyperChrome",
    value: 45000000,       duped: 39000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "High-tier red hyperchrome with intense metallic sheen.",
    notes: "L5 · Updated 1 week ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2I02zlhDLkpxsns6wAfCaIqXdYoCBHMJcVeUyxTeGDYbARYnwOErwD7msKvNys02s7-N6nU00WsPKHsVOoIAg9p6ZwHF4tjMeU3ihbEZEwzor-vMli-ewrR6z5UJIYwqS-dq_-GvkhBDGTKGQk-2BcPdnoNVRkrJTLTxA8OvFkUFx0yVERXF6D5po6B07/s679/Red%20Level%205.jpg"
  },
  {
    name: "Hyper Purple Level 5", type: "HyperChrome",
    value: 43000000,       duped: 40000000,
    demand: "High",        trend: "Rising",     change: "+500,000",
    description: "Purple hyperchrome with rich violet shift, gaining popularity.",
    notes: "L5 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvTv3uPw2mg5fERhSYE3RhyphenhypheniNI93drup2q9p7fgFZGGkWIPW5rfcoLfUyGnR8FCI6Rcb0Y74eIV1arn5ONn_hXDJj04eZzcuyb1_UXEqh4fpHERs5IGWHXsjHnc68R5kjP67cHdlVKkLp09TgmUT33JZy1Bh9CPNxjwzaM2TBBkc_w_0zD8y-uaays-hiS/s675/Purple%20Level%205.jpg"
  },
  {
    name: "Hyper Pink Level 4", type: "HyperChrome",
    value: 42000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Mid-high tier pink hyperchrome, stepping stone to L5.",
    notes: "L4 · Updated 2 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQMkcoZjFPwd1hW_IKtxhA9mqfn3iaV72rBh84MZ_Cye89efcE6Pjku4BUzdKmRxEEMiDdse_EKmMmTDezKYS_CiJlvb0r1vUVAaodGOA81Lu49NRgRkqbLtJG-rIQlPvcB8qHaDcASYxaPYrfJa4f3RT7WXjUnR6i81YSapAj-rwdNe1amRClA4eGNdbJ/s738/Pink%20Level%204.jpg"
  },
  {
    name: "Hyper Orange Level 5", type: "HyperChrome",
    value: 34000000,       duped: 31500000,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "High-tier orange hyperchrome with intense metallic sheen.",
    notes: "L5 · Updated 2 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL00osIT1uR1OL4JRL2ln3VdInP-6dcna0QLN0jVXcI5K-LvYjjRr7sXgfOL1WCEXi-AF-G7d0gFCFuT9tygLvdT4UxhlBf1o_sWfXvsXkciF1X9og6h_K1Zm1U9GBMOxyAIvadf2P0WpWv1Yjubvo3y4GaxsyzQZGCMbwMthu_CeXWYCMtBCXzUO2dGPR/s656/Orange%20Level%205.jpg"
  },
  {
    name: "Hyper Purple Level 4", type: "HyperChrome",
    value: 32000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Mid-high tier purple hyperchrome, stepping stone to L5.",
    notes: "L4 · Updated 2 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRDRQfpzd9rQDvZ_PHJDHxtKx49fCLwTtOruWGKmoh-wemXdxH75f89b3vsCvCy9Vt2PV7tmhojVJMTcaKaDu72bS3fUkY_TN5-WMnSYBypsT50A33pNt8wYkvFKK1dTerhbDCax1FkjVi08B1jRhru-QCbM98Yc2hcSs3CxVPTF-pB2jU_NZvKdPxD-GX/s759/Purple%20Level%204.jpg"
  },
  {
    name: "Hyper Red Level 4", type: "HyperChrome",
    value: 26500000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Mid-high tier red hyperchrome, stepping stone to L5.",
    notes: "L4 · Updated 2 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrWH0BLjXL7i24uwFZ8k8bylQ0DLLTJnVyEDznUzlIumGWZTj9sY-tirHUlIR3qw7QTwdjdTXTKrR2tA4D4zxXpQpYaInt2SDEmSwaVWf1vNCwe4Bvq5K_PUtY-HZlli2-EGhBK0qq0_fS3QET36hFW71goChKOL7WWvoxHtraq5JYq5YPEQHSO7NaWNRU/s751/Red%20Level%204.jpg"
  },
  {
    name: "Hyper Green Level 5", type: "HyperChrome",
    value: 25000000,       duped: 23000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "High-tier green hyperchrome with intense metallic sheen.",
    notes: "L5 · Updated 2 weeks ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1FhyphenhyphenNgThBqnPC4YmmHza0vKtlbKrOhbPUeIkVKXcNYF66fh-e84hpHHTBUvgKYc_Yvcwszj-IiD37NuQ3xEzh-4g5_vN55DKCKZyrkxEveV5MfB996FsnXdKAXanaEQeJ8J94mYzKob7lsWVJuPGNMIqPcuCzPXzrXwUWgamSOzacwhbE7fcyPGoSj_KU/s640/Green%20Level%205.jpg"
  },
  // Add more hyperchromes as needed from the data

  // ════════════ FURNITURE ═══════════════════════════════════════
  {
    name: "Hot Tub",       type: "Furniture",
    value: 12000000,       duped: null,
    demand: "High",        trend: "Stable",     change: "+500,000",
    description: "A luxury hot tub for your apartment. One of the most in-demand furniture items due to its rarity and aesthetic appeal.",
    notes: "Updated 2 weeks ago",
    image: ""
  },
  {
    name: "Pool Table",    type: "Furniture",
    value: 9000000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Full-size pool table furniture item. Rare apartment decoration with steady demand among interior collectors.",
    notes: "Updated 3 weeks ago",
    image: ""
  },
  {
    name: "Piano",         type: "Furniture",
    value: 1000000,        duped: null,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "Grand piano apartment item. A prestigious furniture piece that signals high-level collector status.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Fireplace",     type: "Furniture",
    value: 5000000,        duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Decorative fireplace for your base. Adds a warm aesthetic touch and holds moderate collector value.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Trapped Bookshelf",     type: "Furniture",
    value: 3500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Wall-mounted bookshelf furniture. Low demand but a clean addition to any apartment setup.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Flat Screen TV",type: "Furniture",
    value: 3000000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Large flat-screen TV for your apartment wall. Common furniture item with limited trading appeal.",
    notes: "Updated 2 months ago",
    image: ""
  },
  {
    name: "Couch",         type: "Furniture",
    value: 2000000,        duped: null,
    demand: "Very Low",    trend: "Stable",     change: "",
    description: "Standard apartment couch. One of the more common furniture drops with minimal trader interest.",
    notes: "Updated 3 months ago",
    image: ""
  },
  {
    name: "Coffee Table",  type: "Furniture",
    value: 1500000,        duped: null,
    demand: "Very Low",    trend: "Falling",    change: "-100,000",
    description: "Basic apartment accessory. Very low demand — mostly acquired passively rather than traded for.",
    notes: "Updated 3 months ago",
    image: ""
  },
  {
    name: "Sci-fi Kitchen", type: "Furniture",
    value: 4000000,        duped: 3500000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Futuristic kitchen set for apartments. Niche décor piece with weak liquidity.",
    notes: "Updated 1 month ago",
    image: ""
  },
  {
    name: "Missile Bed",   type: "Furniture",
    value: 1250000,        duped: 1000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Missile-themed bed. Trade reality lags its price, treated as niche décor.",
    notes: "Updated 2 weeks ago",
    image: ""
  },

  // ════════════ Cosmetics ═══════════════════════════════════════
  {
    name: "Thrusters",     type: "Spoiler",
    value: 40000000,       duped: 37000000,
    demand: "High",        trend: "Stable",     change: "",
    description: "Thruster spoiler from Season 2. High demand due to exclusivity.",
    notes: "S2 · L9 · Updated 1 month ago",
    image: ""
  },
  
  {
    name: "Snow Shovel",   type: "Spoiler",
    value: 8500000,        duped: 8000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Snow shovel spoiler from Season 7. Medium demand for seasonal collectors.",
    notes: "S7 · L7 · Updated 11 days ago",
    image: ""
  },
  {
    name: "2 Billion",     type: "Spoiler",
    value: 6500000,        duped: 6000000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Spoiler from 2 Billion Event. Medium demand.",
    notes: "Event Exclusive · Updated 1 month ago",
    image: ""
  },
  // Add more spoilers from the list...

  // Add Textures as type "Texture"
  {
    name: "Checker",       type: "Texture",
    value: 42500000,       duped: 38000000,
    demand: "Decent",      trend: "Stable",     change: "",
    description: "The Checkers Texture could be obtained by purchasing access to Badimo's Vehicle Testing game for 25 Robux. The game has become private, and this texture is no longer obtainable.",
    notes: "Retired · Updated 1 week ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4OqQKApH2son9SvtsTFKZ-BmmB9r086jDZz8gP5mI6uc6YDRYTVARa-nOAcSEvUQLt4jvPZQhh0TX0ywu0aeutgcmRPMy48hjAtePqwN7n6yknUZKQKnD1cF7w9Hz3NnwaHnL64d_MDksA7D2AWTMQ36hWDYnws7IL5U2WuJPr6ydYI_lGzmj47b4ZVDM/s625/Checker.jpg"
  },
  {
    name: "Drip",          type: "Texture",
    value: 20000000,       duped: null,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "The Drip Texture is styled as a nod to the brand Supreme, with the same font being used, spelling out Jailbreak. This texture was part of Season 5 as the level 8 reward, considered as a meme item.",
    notes: "S5 · L8 · Updated 1 month ago",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtAS2R4QwJ3FD2AV0bcOhM3ktQfX3MLk0cls7pc8fNLUzr4sVQAVBo_Lb7yThpDGnVHq8sqVYFcQENl81Kc3NgOaCIFk2pVb_-oD9BcfxXTPQjRsN4O6e5E4PdVY6pfldF53R589UWciIgFpy0NdbAGU-X3SUfA2R3oBeQU2i8ZxtLpe8ADLZAXS2_h08a/s693/Drip.jpg"
  },
  {
    name: "Snowstorm",     type: "Texture",
    value: 7500000,        duped: null,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Snowstorm texture. Season limited with low demand.",
    notes: "Season Limited · Updated 1 month ago",
    image: ""
  },
  // Add more textures...

  // Add Rims as type "Rim"
  {
    name: "Void",          type: "Rim",
    value: 47000000,       duped: 42000000,
    demand: "High",        trend: "Stable",     change: "",
    description: "This rim was obtainable during a season and can now only be traded for. The value of this rim is subjective and might vary, as this item will likely only receive offers from collectors.",
    notes: "Updated 7 hours ago",
    image: "https://blogger.googleusercontent.com/img/a/AVvXsEjjMNcMzrK80PSCJeQ_S8JJ7bxz-7whglPH00kmtyndq_ceA1d-oMAOl9JcHU-A4tsMcGa0d8zEsjHKOm45fC60t1COirRvUfJO5V7fI3UkFk0ubJBs8LxqrH7coI9Wvn6X7MUHvysYzZWnj75dZ_26BgbRTaL6jmzLBU5juwLFqsyPQTcKSGRjtdhz7IQu"
  },
  // Add more if data available

  // Add Tire Stickers as type "Tire Sticker"
  {
    name: "Blue 50",       type: "Tire Sticker",
    value: 9000000,        duped: 8500000,
    demand: "Low",         trend: "Stable",     change: "",
    description: "Blue 50 tire sticker from Season 3. Low demand.",
    notes: "S3 · L50 · Updated 1 month ago",
    image: ""
  },
  {
    name: "Spiked",        type: "Tire Sticker",
    value: 8000000,        duped: 7500000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Spiked tire sticker from Season 20. Medium demand.",
    notes: "S20 · L9 · Updated 14 days ago",
    image: ""
  },
  {
    name: "Brickset",      type: "Tire Sticker",
    value: 5000000,        duped: 4750000,
    demand: "Medium",      trend: "Stable",     change: "",
    description: "Brickset tire sticker. Obtainable with medium demand.",
    notes: "Updated 3 days ago",
    image: ""
  },
  // Add more tire stickers...

];

// ── STATE ─────────────────────────────────────────────────────
const state = {
  mode:    'card',
  search:  '',
  type:    '',
  demand:  '',
  trend:   '',
  sortKey: 'value',
  sortDir: 'desc',
  page:    1
};

// ── HELPERS ───────────────────────────────────────────────────
function fmtValue(n) {
  if (n === null || n === undefined) return null;
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return (Number.isInteger(v) ? v : +v.toFixed(1)) + 'M';
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return (Number.isInteger(v) ? v : +v.toFixed(1)) + 'K';
  }
  return n.toLocaleString();
}

const DEMAND_ORDER = { High: 5, Decent: 4, Medium: 3, Low: 2, 'Very Low': 1 };

function demandClass(d) {
  return { High:'d-high', Decent:'d-decent', Medium:'d-medium', Low:'d-low', 'Very Low':'d-verylow' }[d] || '';
}
function trendClass(t) {
  return { Stable:'t-stable', Hyped:'t-hyped', Rising:'t-rising', Falling:'t-falling' }[t] || '';
}
// Mapping type string → CSS class suffix (no spaces, lowercase)
function typeClass(t) {
  return { Vehicle:'type-vehicle', HyperChrome:'type-hyperchrome', Furniture:'type-furniture', Cosmetics:'type-cosmetics', Texture:'type-texture', Spoiler:'type-spoiler', Rim:'type-rim', 'Tire Sticker':'type-tiresticker' }[t] || '';
}

const TREND_ICON = { Stable: '—', Hyped: '🔥', Rising: '▲', Falling: '▼' };

function changeBadge(c) {
  if (!c) return '';
  const cls = c.startsWith('+') ? 'change-up' : 'change-down';
  return `<span class="change-badge ${cls}">${c}</span>`;
}

// Build initials from name
function initials(name) { return name.replace(/[^A-Z0-9]/gi, '').slice(0, 3).toUpperCase(); }

// Image HTML — uses existing CSS class names (row-img-fallback / card-img-fallback)
function cardImgHTML(item) {
  const fb = initials(item.name);
  if (item.image) {
    return `<img src="${item.image}" alt="${item.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="card-img-fallback" style="display:none;">${fb}</div>`;
  }
  return `<div class="card-img-fallback">${fb}</div>`;
}

function rowImgHTML(item) {
  const fb = initials(item.name);
  if (item.image) {
    return `<img src="${item.image}" alt="${item.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="row-img-fallback" style="display:none;">${fb}</div>`;
  }
  return `<div class="row-img-fallback">${fb}</div>`;
}

// ── FILTER + SORT ─────────────────────────────────────────────
function getFiltered() {
  let list = [...ITEMS];
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(i => i.name.toLowerCase().includes(q));
  }
  if (state.type)   list = list.filter(i => i.type === state.type);
  if (state.demand) list = list.filter(i => i.demand === state.demand);
  if (state.trend)  list = list.filter(i => i.trend  === state.trend);

  list.sort((a, b) => {
    let av, bv;
    if      (state.sortKey === 'name')   { av = a.name.toLowerCase();     bv = b.name.toLowerCase(); }
    else if (state.sortKey === 'value')  { av = a.value;                  bv = b.value; }
    else if (state.sortKey === 'demand') { av = DEMAND_ORDER[a.demand]||0; bv = DEMAND_ORDER[b.demand]||0; }
    else if (state.sortKey === 'type')   { av = a.type.toLowerCase();     bv = b.type.toLowerCase(); }
    else return 0;
    if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return state.sortDir === 'asc' ?  1 : -1;
    return 0;
  });
  return list;
}

// ── PAGINATION ────────────────────────────────────────────────
function renderPagination(total) {
  const el = document.getElementById('pagination');
  if (!el) return;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <button class="page-btn" id="pg-prev" ${state.page <= 1 ? 'disabled' : ''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      Prev
    </button>
    <span class="page-info">Page ${state.page} / ${totalPages}</span>
    <button class="page-btn" id="pg-next" ${state.page >= totalPages ? 'disabled' : ''}>
      Next
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>`;

  document.getElementById('pg-prev').addEventListener('click', () => {
    if (state.page > 1) { state.page--; render(); scrollTo({ top: 0, behavior: 'smooth' }); }
  });
  document.getElementById('pg-next').addEventListener('click', () => {
    if (state.page < totalPages) { state.page++; render(); scrollTo({ top: 0, behavior: 'smooth' }); }
  });
}

// ── RENDER CARDS ──────────────────────────────────────────────
function renderCards(items) {
  const wrap = document.getElementById('card-view');
  if (!items.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No items match your filters.</div>`;
    return;
  }
  const page = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  wrap.innerHTML = page.map((item, i) => `
    <div class="item-card" style="animation-delay:${Math.min(i,15)*0.03}s">
      <div class="card-img-wrap">${cardImgHTML(item)}</div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div style="margin-bottom:7px;">
          <span class="badge-type ${typeClass(item.type)}">${item.type}</span>
        </div>
        <div class="card-stats">
          <div class="card-stat-row">
            <span class="stat-lbl">Value</span>
            <span class="stat-val">${fmtValue(item.value)}${changeBadge(item.change)}</span>
          </div>
          <div class="card-stat-row">
            <span class="stat-lbl">Duped</span>
            ${item.duped !== null
              ? `<span class="stat-val" style="color:var(--text-dim)">${fmtValue(item.duped)}</span>`
              : `<span class="stat-na">N/A</span>`}
          </div>
          <div class="card-stat-row">
            <span class="stat-lbl">Demand</span>
            <span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span>
          </div>
        </div>
      </div>
      <div class="card-hover-overlay">
        <button class="show-details-btn" data-name="${item.name}">Show Details</button>
      </div>
    </div>`).join('');

  wrap.querySelectorAll('.show-details-btn').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.name); })
  );
}

// ── RENDER LIST ───────────────────────────────────────────────
function renderList(items) {
  const tbody = document.querySelector('#list-view tbody');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No items match your filters.</td></tr>`;
    return;
  }
  const page = items.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

  tbody.innerHTML = page.map(item => `
    <tr data-name="${item.name}">
      <td class="td-img">
        <div class="row-img-wrap">${rowImgHTML(item)}</div>
      </td>
      <td><span class="td-name">${item.name}</span></td>
      <td><span class="badge-type ${typeClass(item.type)}">${item.type}</span></td>
      <td><span class="td-value">${fmtValue(item.value)}${changeBadge(item.change)}</span></td>
      <td>${item.duped !== null
          ? `<span class="td-duped">${fmtValue(item.duped)}</span>`
          : `<span class="stat-na">N/A</span>`}</td>
      <td><span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span></td>
      <td><span class="badge-trend ${trendClass(item.trend)}">${TREND_ICON[item.trend]||'—'} ${item.trend}</span></td>
      <td><span class="td-notes">${item.notes}</span></td>
    </tr>`).join('');

  tbody.querySelectorAll('tr').forEach(row =>
    row.addEventListener('click', () => openModal(row.dataset.name))
  );
}

// ── MAIN RENDER ───────────────────────────────────────────────
function render() {
  const items = getFiltered();
  const countEl = document.getElementById('item-count');
  if (countEl) countEl.textContent = `${items.length} / ${ITEMS.length} items`;

  if (state.mode === 'card') {
    document.getElementById('card-view').style.display = 'grid';
    document.getElementById('list-view').style.display = 'none';
    renderCards(items);
  } else {
    document.getElementById('card-view').style.display = 'none';
    document.getElementById('list-view').style.display = 'block';
    renderList(items);
  }
  renderPagination(items.length);
}

// ── MODAL ─────────────────────────────────────────────────────
function openModal(name) {
  const item = ITEMS.find(i => i.name === name);
  if (!item) return;

  const overlay  = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalFb  = document.getElementById('modal-img-fallback');

  modalFb.textContent = initials(item.name);
  if (item.image) {
    modalImg.src = item.image;
    modalImg.style.display = 'block';
    modalImg.onerror = () => { modalImg.style.display = 'none'; };
  } else {
    modalImg.src = '';
    modalImg.style.display = 'none';
  }

  document.getElementById('modal-name').textContent = item.name;

  const typeEl = document.getElementById('modal-type');
  typeEl.textContent = item.type;
  typeEl.className = `modal-type badge-type ${typeClass(item.type)}`;

  document.getElementById('modal-value').textContent = fmtValue(item.value);

  const dupedEl = document.getElementById('modal-duped');
  if (item.duped !== null) {
    dupedEl.textContent = fmtValue(item.duped);
    dupedEl.classList.remove('na');
  } else {
    dupedEl.textContent = 'N/A';
    dupedEl.classList.add('na');
  }

  const demandEl = document.getElementById('modal-demand');
  demandEl.textContent  = item.demand;
  demandEl.className    = `badge-demand ${demandClass(item.demand)}`;

  const trendEl = document.getElementById('modal-trend');
  trendEl.textContent = `${TREND_ICON[item.trend]||'—'} ${item.trend}`;
  trendEl.className   = `badge-trend ${trendClass(item.trend)}`;

  document.getElementById('modal-desc').textContent  = item.description || '—';
  document.getElementById('modal-notes').textContent = item.notes || '—';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── SORT HEADERS ──────────────────────────────────────────────
function initSortHeaders() {
  document.querySelectorAll('.values-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortKey = key;
        state.sortDir = (key === 'name' || key === 'type') ? 'asc' : 'desc';
      }
      document.querySelectorAll('.values-table th.sortable').forEach(t => {
        t.classList.remove('sorted');
        const sa = t.querySelector('.sort-arrow');
        if (sa) sa.textContent = '↕';
      });
      th.classList.add('sorted');
      const arrow = th.querySelector('.sort-arrow');
      if (arrow) arrow.textContent = state.sortDir === 'asc' ? '↑' : '↓';
      state.page = 1;
      render();
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      state.page = 1;
      document.querySelectorAll('.mode-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.mode === state.mode));
      render();
    });
  });

  const searchEl = document.getElementById('search-input');
  if (searchEl) searchEl.addEventListener('input', e => {
    state.search = e.target.value.trim(); state.page = 1; render();
  });

  const typeEl = document.getElementById('type-filter');
  if (typeEl) typeEl.addEventListener('change', e => {
    state.type = e.target.value; state.page = 1; render();
  });

  const demandEl = document.getElementById('demand-filter');
  if (demandEl) demandEl.addEventListener('change', e => {
    state.demand = e.target.value; state.page = 1; render();
  });

  const trendEl = document.getElementById('trend-filter');
  if (trendEl) trendEl.addEventListener('change', e => {
    state.trend = e.target.value; state.page = 1; render();
  });

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    document.getElementById('modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  }

  initSortHeaders();
  render();
});