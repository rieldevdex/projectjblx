/* ================================================================
   JBLX — values.js  (v2)
   8 categories: Vehicle · Spoiler · Texture · Color · Rim · Drift · Horn · Furniture
   Change badges: value, duped, demand, trend
   Live "Updated" timer using updatedAt epoch timestamp
================================================================ */

const PAGE_SIZE = 20;

// Reference point: Feb 19 2026 00:00 UTC ≈ 1771459200000 ms
// Used to back-calculate item timestamps from known relative ages.
const _R = 1771459200000;
const _H = 3600000, _D = 86400000;
function _ago(h=0, d=0) { return _R - h*_H - d*_D; }

// ── ITEM DATA ─────────────────────────────────────────────────
// Fields:
//   change      → cash value delta   "+500,000" / "-200,000" / ""
//   dupeChange  → duped value delta  "+300,000" / ""  / null (no duped)
//   demandChange→ previous demand    "↓ Decent" / "↑ Low" / ""
//   trendChange → previous trend     "was Stable" / ""
//   updatedAt   → Unix ms timestamp  — drives the live timer

const ITEMS = [

  // ════════════ VEHICLES ════════════════════════════════════════
  {
    name:"Javelin",      type:"Vehicle",
    value:50000000,      duped:null,
    demand:"High",       trend:"Stable",
    change:"+500,000",   dupeChange:null,  demandChange:"",          trendChange:"",
    description:"Limited seasonal vehicle from Season 2. Sleek aerodynamic design and early-season origin make it one of the most coveted vehicles in the trading scene.",
    tags:"Limited",           updatedAt:_ago(0,7),
    image:"assets/item-images/vehicles/javelin.webp"
  },
  {
    name:"Torpedo",      type:"Vehicle",
    value:49000000,      duped:44000000,
    demand:"Decent",     trend:"Stable",
    change:"+1,000,000", dupeChange:"+500,000", demandChange:"",     trendChange:"",
    description:"High-performance vehicle from Season 6. Streamlined chassis and sustained resale demand among veteran traders.",
    tags:"S2",           updatedAt:_ago(0,4),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5q1g0nfmULCjKkJaSXLEo7SM0yyEl5VZyzqZPc3fXVw4HPxZ1HygydEzziDk3cDJ6uU4gIWfuQFHEdJqaeInko6zc9QIy_0fdDmtofNUipBuJJcj9W6PodZGrtC_LBlnVednXS3tN4GxuSc5m-Me9F5yxLhlQ2E2BCczb6pjQzEmBkn6WeswHWvfeXq3N/s614/Torpedo.jpg"
  },
  {
    name:"Beignet",      type:"Vehicle",
    value:40000000,      duped:37000000,
    demand:"High",       trend:"Stable",
    change:"+500,000",   dupeChange:"+300,000", demandChange:"",     trendChange:"",
    description:"Fan-favourite novelty vehicle from Season 8. Unique appearance and high-level requirement make it a rare find in active trades.",
    tags:"S8 · L10",     updatedAt:_ago(0,28),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjFyqwIeAI21wapBfNhCjPO_sAwv5NjrArpmGkTt6iaaXEm7TfFfZja4Bc9PGfgibMPOGUWnjoBoyNMVauUDT9nGLaI9YS6q9UlNn7XB7sOFuTkbaSdsVv14RRUXCRRyPUWyW0NxXV7TOEurB18_aAypxy4BExZXzECXKABQWBSc1Km3RW1dz8zMPHoEXHV/s800/Beignet.jpg"
  },
  {
    name:"Celsior",      type:"Vehicle",
    value:33000000,      duped:31000000,
    demand:"Medium",     trend:"Stable",
    change:"-500,000",   dupeChange:"-300,000", demandChange:"↓ was Decent", trendChange:"",
    description:"Refined luxury vehicle from Season 14. Facing a slight downtrend as newer seasonal releases compete for trader attention.",
    tags:"S14 · L10",    updatedAt:_ago(0,6),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGIZaPmMDb0C5v0sRtJUqRxVJ31ys4fcTRyyH5kSd1i1lH6ZulbkeKYCIJspDKSYBMW7tzpBnq0n_ADzauMS14NDBwyp__MydqeTXVEBX0fVXNWFNLGENr0-g03iHJ5X0S4U32sunUtTq4EF_oD8y85B7Qw7c2KK8mCEWrCO2mRcmThRi0Qknv50YF1zRw/s974/Celsior.jpg"
  },
  {
    name:"Proto-8",      type:"Vehicle",
    value:30000000,      duped:null,
    demand:"High",       trend:"Stable",
    change:"+500,000",   dupeChange:null, demandChange:"",           trendChange:"",
    description:"Futuristic concept vehicle from Season 17. High demand sustained by its unique aesthetic and clean trade history.",
    tags:"S17 · L10",    updatedAt:_ago(0,21),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgINxDHzFRtNfLUzJfvkpFLXGxesu73SLaW_nQQaKkAAZEmkR4S92I0ffaZ6A90DskKVinKUWY7nVJhFY7IC2zOtHYCIsE2qzxENhFDQTVc6T2lp9Ny1UVTI_vSJthdovV_ptenXv2fa89n9GIOcWoK-pBU7zJI4HVxUHg5jaMbhdPM98RqvKNREaL1BWRg/s873/Proto-08.jpg"
  },
  {
    name:"Power 1",      type:"Vehicle",
    value:23000000,      duped:null,
    demand:"High",       trend:"Stable",
    change:"+500,000",   dupeChange:null, demandChange:"",           trendChange:"",
    description:"Exclusive high-performance vehicle from Season 17. Features the most detailed interior and exterior of any vehicle in Jailbreak.",
    tags:"S17 · L10",    updatedAt:_ago(0,28),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhdJSkSRMt6payrtbDoJu3wNCj7cEAhqvRoTsl4n_-hS7-RHEb58UZe1dRS1j3X_6WKzbkxpz4Rvqrg0fsI0jQiLyBYXeMxC0WYQTQ79dbjxTAghc1b1Q_6N3lxMuyjoDeu6Uu7BAw0uDWdlveLXnaTf3jelv3KdzwXT-W-g1_6Ea9pjVmWEsUDO4mmUjpC/s835/Power-1.png"
  },
  {
    name:"Arachnid",     type:"Vehicle",
    value:21000000,      duped:18000000,
    demand:"Medium",     trend:"Stable",
    change:"+500,000",   dupeChange:"", demandChange:"",             trendChange:"",
    description:"Spider-themed vehicle from Season 2 with a distinctive multi-legged visual design.",
    tags:"S2",           updatedAt:_ago(0,7),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgT88_JjOX43hM-_6e_pwdzgoJ1g4D1Ko2L34VtlbGTkUsyWo7olYyRupXzJTbkxp_8fgDw1NbHSX4-7PIpHyWBAQ4hO7iL0fHSu1uLMeH7lV6d68zCKhNYg2vdVZUhyuyYcd0jQ5kt7_YGy8btKaXH-TaTi4BG2BbH0PBN52Enu3uM0S7tXJdh7AKWIikK/s672/Arachnid.jpg"
  },
  {
    name:"Icebreaker",   type:"Vehicle",
    value:20000000,      duped:17000000,
    demand:"Decent",     trend:"Stable",
    change:"+500,000",   dupeChange:"", demandChange:"",             trendChange:"",
    description:"Winter-themed vehicle from Season 1. One of the earliest seasonal vehicles, giving it nostalgic value.",
    tags:"S1 · L10",     updatedAt:_ago(0,60),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYErgc8t1GhlzEh5Ipfej1YvjbqMLh7Cru2SQdmzwP6oPc0WIwPX7QGz7AZXkcRsulW6hyXB5By7S4j-QmD_U3imhZWF-vP24dKdz7ZK4BZviZwzl1oTwvPDmJlYVFOgL5uo8sDT71GSXsj_BTPAnGLkw2udAmSn-c3yACvjr7I9jTBanGVoPd5kj0LL8T/s805/Icebreaker.jpg"
  },
  {
    name:"Beam Hybrid",  type:"Vehicle",
    value:19000000,      duped:16000000,
    demand:"Decent",     trend:"Stable",
    change:"+500,000",   dupeChange:"", demandChange:"",             trendChange:"",
    description:"Eco-styled hybrid vehicle from Season 1: New Beginnings.",
    tags:"S1 · L10",     updatedAt:_ago(0,90),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjpEjbVGU65jp1FriymupigbSp08dqoEgSgBcUKlpiAGtBJ_tvrA3-ugW6MUt592bHbUmC6EE6g0Acj3Oni6pHAynDk-U2hKqZ3nLFdind-iLuTOZdgPa78U2zv9EwCN1SDZVbmWV2DGCoizH14lFEokL8SszzL3gXGiXrJ4ONK3XR_fQ7XX_XxMNc1nTrd/s755/Beam%20Hybrid.jpg"
  },
  {
    name:"Banana Car",   type:"Vehicle",
    value:17000000,      duped:null,
    demand:"Decent",     trend:"Hyped",
    change:"+1,000,000", dupeChange:null, demandChange:"",           trendChange:"was Stable",
    description:"Grand prize of Season 5: Let The Memes Begin. Leaves a banana trail, high top speed but lacks traction.",
    tags:"S5 · L10",     updatedAt:_ago(19,0),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhj4pwYQXZSkEnEvtbtbIiKY1TsFM66rdJPSQsd6XpOyihEOqq1h6iyQ_z8zgJUGgUKA4WoiB-3tLjFF-1mRwNKXPWrEdY3AS_7aUDqNKxN8ZMCK8iSun7N34MZzvjiT85aKlnZXNfKhQMu-HSKNqxTEZ60YlUPNFtD82gmaf26flBsMkULyOtput2zkq82/s764/Banana%20Car.jpg"
  },
  {
    name:"Molten M12",   type:"Vehicle",
    value:15000000,      duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"A limited 5-day vehicle with an original cost of $599,000.",
    tags:"",             updatedAt:_ago(19,0),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXT3rgxrQiTBE933nditqcAXdW1QyAlvRSTCFqcXK-g1FtRxT1RDvYEZYxR1fFFwJkqi7JmfjG7hrN5ZapwSLQ35g7n6G6hFcl3QxyD126WJr3c3fENVkTlcYRSVCAfhcsSK3YN1rIrNvvctMqw4FTZE7h4b5weJsoe0uj_LvzFs7adMw-N89MAUdmsG71/s884/Molten%20M12.jpg"
  },
  {
    name:"Stallion",     type:"Vehicle",
    value:200000,        duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"A powerful muscle car with classic American styling.",
    tags:"",             updatedAt:_ago(0,7),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNK4NZmRBOO8W43hfrTaM00kR8lYbPUfFXH8hodlF5vjslql5XDBlAq8npzfEeEpjpMBeE2oFsKzJwvwlGYWMviRZcOWXjHDrPs_1TFFPX8pC8CuKrRG2hsKidvCko-tdWCCAk1MPinQQELxI-n7QCzMTFmkrZLmeoJN5zQNhpVpJNn-d3oK5yVGWVszWI/s533/Stallion.jpg"
  },
  {
    name:"Brulee",       type:"Vehicle",
    value:3000000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"A retired vehicle, later replaced with the Eclaire. Second-fastest vehicle in the game.",
    tags:"",             updatedAt:_ago(0,14),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiS52CZQTjHIeTtc_RMHGWei42sFlCFFcvzxHpxM9IxIMX2N8U2xv_eBGA4zVG-yW_k_8guxCpEt2yJaxN_Ah9x9qJMTxB2Mexptuo4lh77txoZV4J5JFTPMS1ePj4UNjTFyJ83xZB0Vy2OBVV3VzEzqdqrhYGjfdwYSd8fn5NCsORl-QEP8IG3wnhWe0L/s579/Brulee.jpg"
  },
  {
    name:"Rattler",      type:"Vehicle",
    value:4000000,       duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"A customized Hot-Rod from Season 4: 'Epic Adventures'.",
    tags:"S4 · L10",     updatedAt:_ago(0,21),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghdJEe2ZB-u7Y0bssDI4FYo1cSkrKKfBF11z3AWS4NlCGrTP1vKS2HUBngBcGBx_bo-2ox4sRUhGcdxyxEAGBh4_Ab-1GAGJWHbOH8OwBgJ57jX9i2dMznGTUH7z36Wy-FLDgjxwEAn3DdlDWPL0cvWO1iyRR65PA9XNs021yInSWCgKieTzjzfP5ABzmn/s805/Rattler.jpg"
  },
  {
    name:"Raptor",       type:"Vehicle",
    value:11000000,      duped:null,
    demand:"Low",        trend:"Stable",
    change:"-500,000",   dupeChange:null, demandChange:"↓ was Medium", trendChange:"",
    description:"Rugged off-road vehicle from Season 3. Falling demand as newer offerings attract trader attention.",
    tags:"S3",           updatedAt:_ago(0,2),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-zOoDE0ClSgoKDjbbxY5ldQiSa1X7-dtoHaK0JStpGG0GoUENxFFBSoh8CQZZZ1ncN1dyeZpWzUDPMmuN_5Y7a9kaztAGTuqF9swWaRtUdaoovBSKeCf-IJUnC0XN6hUhw3Yz_ddFtq71s3In2CTobGRSHhcAKexzg8QYjCUR3CLkIlt6JkzgGdAb-MPv/s643/Raptor.jpg"
  },
  {
    name:"Volt 4x4",     type:"Vehicle",
    value:10000000,      duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Electric off-road SUV from Season 2. Fan favourite for its versatility and clean aesthetic.",
    tags:"S2 · L10",     updatedAt:_ago(0,3),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfbeDIoRIjn9QxWRxZqjrZ8kKU87mWVGTJXgu1n1RNr2bzexj80UfuFSeGvmbJvG3YhN5tdd9L_abeV0-nirXdDLxM2DEPTpXgZLisSRxpSnAxQ9ePaBSU2ttmq-BxeXz96drWZW2ekjvakiiZOc3qT6LkEbEHlt4lDl8J6PKRYGxfHHIJp4kU2L43zhNr/s800/Volt%204x4.jpg"
  },
  {
    name:"Crew Capsule", type:"Vehicle",
    value:9500000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"-500,000",   dupeChange:null, demandChange:"↓ was Low",  trendChange:"",
    description:"Space-themed from Season 2: Out Of This World. Famous for its egg-shape and Pro Garage spawnability.",
    tags:"S2",           updatedAt:_ago(0,1),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL0iBeX6U74E5LXhJuNDwMC5s4po2jtppUVitFr7UV7MOwLKi2KnKDBVTZgbalGdOz2PtFsB9QzDLkUHy57G03fdzcuL6QEOWY7vtW5h4iDpLSTPBUkrDcbVEV1DePLhV0xIdN4yBupLmXJsrwcwC6iQRv4A1AZM3jFwzduUm20ovXxEFbDK2XnX_kEyDN/s1280/Crew%20Capsule.jpg"
  },
  {
    name:"Parisian",     type:"Vehicle",
    value:9000000,       duped:null,
    demand:"High",       trend:"Stable",
    change:"+500,000",   dupeChange:null, demandChange:"",           trendChange:"",
    description:"Stylish European-inspired vehicle with a loyal collector base.",
    tags:"",             updatedAt:_ago(19,0),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLaiFJbjxzgJZ4WxMbwa5wpiRskkfN2FCut-3Mljma6Kz5RlTVJaZPswOnLom_J2YRZB5Uiei3bR057N8qgSsx8TVLtJSR8cX5m-oTpN0k1nfI5Tib6Xgo8VvOmacxrtJnHffM8dkDDhqtIKRl4s_4G7erXm0XT7cLC6kpUYqISmk9u51jJ1r-CkJAJ0lH/s689/Parisian.jpg"
  },
  {
    name:"Aperture",     type:"Vehicle",
    value:7500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Sleek tech-themed vehicle from Season 15. Distinctive lens-shaped design.",
    tags:"S15 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiz_IjRp_wVHSmLJ1XPjwfwvBqs2J4H-PeBcHr3-zk38YYBt1ltYbUp3vtjHrkbWjaPwtQanavpASfvGM7wNjnLpMJLXSUKDHpxH5RgiOOqIuHL5mcH5Nagw99qqevzfd1lzuTFnovLXixk2AiBR9kmAx3qYQVWZ4hfZiK5boCqSUX9jnCx1_82J-We5A_a/s659/Aperture.jpg"
  },
  {
    name:"Shogun",       type:"Vehicle",
    value:6500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Samurai-inspired vehicle with strong visual identity.",
    tags:"",             updatedAt:_ago(0,90),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-OSg_itUw4MKAryMi9F3C4SMyG9Jz-JAecBdmyKjWbN0zBqTC06N37coEBOfBwAIIsckG0paTfAPDLmTL4CBnlLJ14X3kAJS08JPouUpMqbehaPeWF1XKWtUEJnp2gp0aNhc2Xd1PcMePq7_b6r4Lhta_mTcNfhxV8JfqpHahF8ssYretTauO1tUqfsm5/s825/Shogun.jpg"
  },
  {
    name:"Scorpion",     type:"Vehicle",
    value:6000000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Aggressive-styled sports vehicle with broad appeal.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEio9bcdfGjhMpLfGxxkYhJekypRcalCvXed5BiDE2fm-239MFlAH6O7tXHmFNuTZ5-8xVO_4iQpV4t1m8BQ-c7CmKLlVtSvpJhPEKg5cl-c4q3csflHs_HGWMqlxmfUVqt3_aWhCRSmsTY2vkuX1e2qPm7ZHBjWWZVQ2rWlcVpLplIkq5K_kGknBGYt17dO/s1032/Scorpion.jpg"
  },
  {
    name:"Carbonara",    type:"Vehicle",
    value:5500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Food-themed novelty vehicle from Season 10. Part of the culinary series.",
    tags:"S10 · L10",    updatedAt:_ago(19,0),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuFWcpBCUt1ZAyL3dxCiC7aodcDC42BsH0Kt_oP403ytKD9JoTcWuO6uM0HTjZh7vfSgtfmwrulcWvbKCAbw7dAkfITwYx5OCGTU1pfUbmPOMOYglUsn6mXy3zV8-YA-PQoGHrSd860tUZ6-oJ_bf4JQ3qEE2Z53LvVYhRuiaaHDzL55wDpW0cG5_9HLxf/s711/Carbonara.jpg"
  },
  {
    name:"Macaron",      type:"Vehicle",
    value:5500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Pastel-coloured confectionery vehicle. Novelty appeal.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ_dVJqfIrZ6_kFK7Qa_aaudbKhsxTv3mTobIB6HmSv1vvGgHcOSeOVcMCdrlkV-TYnsOfizsRsZS0CBwRPKw32EWXeXsEtxv5kwAiVMKr_SaUVbJgIew97kLEWtsT1ZSmZGA0-lX6ffz2_GqtlcfIfChoEw63OyvS9BIN5XkER_B6UV0D0TYGXFdmt44y/s825/Macaron.jpg"
  },
  {
    name:"Roadster",     type:"Vehicle",
    value:600000,        duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Obtainable vehicle. Low demand.",
    tags:"",             updatedAt:_ago(0,90),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-DkSAQaRc2t0Hyfyi3nqxb4YbSRoMXfldGoJ_Fico-vHIeWX0oRgR-yJRBjIeDiEdMesqM6rszlQ3CK2qKZrtIISoIZNASCWWvds8e2t5gFVdN6zPVzDVwdXBK_-4trodRh24LZDKUvl3etHS_SwHupv9QTwbZpF92-18qKfEPwYPs8Q0W7W4DIu793I5/s523/Roadster.jpg"
  },
  {
    name:"JB8",          type:"Vehicle",
    value:3500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"The Criminal Grand Prize from OG Season 3. Low value due to its abysmal stats.",
    tags:"S3",           updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQM6Q_rADEL5auKDSybICCQAWH4WYxP7RJLf9WsO-Wt1d3q1S9eTDXWx2sgPdPt4CC_QaQNnt98892hTDqGQ09cCs19uPQLM7X1fG9G0MsVtsk363omIFMqyPqGuP2CJtnUEQMDJbxl85jN2blP7gzjSay8mGSCYChumvjWXfvWfr0zrKx-Mwy_C6gVpPa/s669/JB8.jpg"
  },
  {
    name:"Iceborn",      type:"Vehicle",
    value:3500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Ice-themed vehicle from a limited event. Rare but low trading interest.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5zmzwoiqnkXRQQpT9NS6A0SSLweaMucAo-azhyphenhyphen0GJa0CBzy1eq3KcTQgdspJfH9pvV8lAikLJ3q8zYJ9kjrVWYBbjy0KJy4UzSU9Ia_0h5PsgDi91nvg2g_CBx385DuLemN6M_As_5gFdxLNyCObwSbAr4LjUjlKT6H5-qwFhGW5jLpqYAw8u58GruePq/s1174/Iceborn.jpg"
  },
  {
    name:"Snake",        type:"Vehicle",
    value:3500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"A limited vehicle with original cost of $349,000, commonly known as the 'god of handling'.",
    tags:"S16 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSWR9_K7dXx4UrAq7Lz8Nq7C-WkS20PEX0hIayWvH_MGss-OimoMT_rqb2vqCZsH2CguGumgLpMoBCCJJ54TqF3JhCV-6fMY2grZpQjrV56GcxVZ5RAwKtkiHxBfv8wKTL8vq8Fca0nLm2GfizdE4RXAITYAXDAb7Jb-I6cYQFWYwrHPjw2-782WPrfxM1/s619/Snake.jpg"
  },
  {
    name:"Torero",       type:"Vehicle",
    value:3500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"High-performance limited vehicle from 2021 5 Days of Vehicles.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEMdTqJD_ZMYnio3mG2x1pi2bA7JfN7Qvc3WPRSE4ufr3SUgAcgeA4sBxLjSENW57ytPtWx4bk90u5Qfe5AmJwR_VS2edBDPmCthEJ-t7lI-ECGlX7eh15CSPnC2tXgoaq7S6trQHe8QBCRY4LaFw7wwiOZ0AvRfO9WExACBti5Zmb8rv3GTCf7OrJMeN0/s656/Torero.jpg"
  },
  {
    name:"Concept",      type:"Vehicle",
    value:2500000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Futuristic concept vehicle. Moderate collector interest.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3ivIQtdxAjkYV47t55zgfIw5Ct7l8aTSDPD2U8p6hWtflpE6TVU-psM5SJBSbGTUggAA39nyn06k32Z4yZt_tVemNliG31bVpCJ3BYlxSi9TwhtiOKEPScFdzW44tCtYuTGAi-3ZTBoVmcIm3qFd14csH14tCFmhOL4VBEFloT1RPOp8rYhSgYCD6qlZ1/s619/Concept.jpg"
  },
  {
    name:"Bloxy",        type:"Vehicle",
    value:2500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Blocky-themed vehicle from Season 3. Nostalgic appeal.",
    tags:"S3 · L10",     updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgs_e5dUJGHhsg8YootQGEaqPxjm7q-3AHN1ix0aE2ooex3dGGDtRXMG1Ilrow61NogGV86MZJuFdhavkyHsGuZUDDBWIunD6DL4i5qnQlu-g2dUYdJ5ldZoXSVC5IFy8IvIDm0TF1A2rv3XZA7Ps_U4JicERwwnWAzJ21M4lFgn75z_zaDGQa6mFZ8yv_W/s730/Bloxy.jpg"
  },
  {
    name:"Tiny Toy",     type:"Vehicle",
    value:3000000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Miniature toy vehicle from Season 11. Fun novelty item.",
    tags:"S11 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi57lpG7DRd3WS3Ct7_MFdQFFGQ0LAvTURkZG5CGOIyvb-aR9520J9Rre5mJk1xcHY1JX8St9XDwrI2BeDvnEO7flEypry1DR2vLMnYwYpPhfdtxC1yiBMEl05KuTB5YBdD8ryisi9yqtmvEA8dvvIcjYOtOOeZo2bY5i4zF362jZqi9JeHlA_DurhgHz6Z/s675/Tiny%20Toy.jpg"
  },
  {
    name:"Frost Crawler",type:"Vehicle",
    value:1500000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Grand prize for Season 19: 'Northern Winter.' Decent seating and tow hitch but very slow, and the season ran for 3 months.",
    tags:"S19 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuiPiZruf4ch5h3agNN59sXJkImCWI3q1UG6j39j9D4Nt9KLruvdi9afI5u9o_xunIILsT_Lg_V1FM0fYcgf4dyozYRObF-doBmlqK3dFoY6roLQOBmsqsg8s6F1vHk6uZVmMoNh-LLZLunBcvwBBhFv3l_-DbQ7CJTqafe1KeNod1BVNEE3XfymLdgPCe/s810/Frost%20Crawler.jpg"
  },
  {
    name:"Manta",        type:"Vehicle",
    value:1500000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Introduced in Season 23 as part of the Tier 5 Legendary Safe revamp.",
    tags:"S23",          updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjCB5pSmZCzN4sihdevmisp_Ndg5AUHd_fwU6bqy8daCW31HlSF6b5IN772uiQguX7VocMEa0v9qYJGIT2UxpE-rsNH_ad5ZtLpjZz_24XTDSsn_zWA_P0nJKkl-6QNGipTc-QUuX_AZ7fuE63vsoxI14r1LsWzKqnug0E_E-LXnbHIO7UQIIXpkg3HVFvw/s1143/Manta.jpg"
  },
  {
    name:"Shell Classic",type:"Vehicle",
    value:2500000,       duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Obtained from Tier 5 Legendary safes. Vintage roadster-based with unimpressive performance.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOFE1YmGsnfnyZCpJZLoiIQhduqO9eL0CavZdstPt3-Jvt2r1zS2GAR6evwTh8aeymmuTQSZt8ITlVunQgPvSH-8VEABOLIFHx3xwyXO159xE3P_rzeqJqOiaaOVr-F4-qeHfVe8GCRzqV_ri3z7vuNrozxL0nj6i6_RZlWgo8ZX9rJ5-ipEWIZFLbuqQx/s565/Shell%20Classic.jpg"
  },
  {
    name:"Jackrabbit",   type:"Vehicle",
    value:2500000,       duped:null,
    demand:"Low",        trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Level 8 reward for Season 9: 'A New Journey.' Decent off-roader but has slow top speed.",
    tags:"S9 · L8",      updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL__2pZXF_U0SCyJdvwuioqB8zPyHzJOLJdH2d160bVSkGU7z1cwzui6lDQ5bih1TYgJAyyAO-dgxuPjTBXemIPzR8buHP4jK_xVB7mQEc06_dvYDSGWVI4mReiQqlIn4Y4G_4t24hyOswbrjx5zcuXWyAUCctwquhn3PNaOn3dxjxZa7Ke6_awURK2FMI/s856/Jack%20Rabbit.jpg"
  },
  {
    name:"Longhorn",     type:"Vehicle",
    value:1500000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Grand prize for Season 18: 'Wild West.' Convertible roof but underwhelming performance.",
    tags:"S18 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwUqtixvu5mNTQg3rB09YhYi2VhdZsILd95nfCMqUHLsf0LheW6aVcslKQj-S64hOYWsQzjz8TS5IxrTDqutPB5SPtIk9tZCZfFrg6EQOQWodvDTuz07sDPckqVtrQ2SEkqauo4Nad36_Nmq0VkVFL8-KKlRQBmtjvZpZNfeNcn1Y-ErnbzZHN1oYPam2r/s795/Longhorn.jpg"
  },
  {
    name:"Maverick",     type:"Vehicle",
    value:1000000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Grand prize for Season 22: 'Made in America.' Good off-road but underwhelming otherwise.",
    tags:"S22 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0j-hOmX3grWcJtw645DrS2xE2TpsWQSwxPkYNCSkNYQzpLWewT58XvwQNu6igwH3i1ZHOVElj4Q0jy5rL1LaSfCuwswya7IjapwllZDyjlkUADcU4NVNPpbv45H489_x7JMoS0gZHxBh1Xg63otFy0FlYYJX6pQPyT6FSNZn7NN-2qWDlGv0mTJPaLVd-/s757/Maverick.jpg"
  },
  {
    name:"Megalodon",    type:"Vehicle",
    value:1250000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Purchasable for $300,000 from Dec 2017 until retired July 12, 2020.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2HwVsOC3vmEhR_PRUjOb2vwFvIf88NXThMFumzzqA291_VKwp4VeMOIk6kJ2bWpyOleNp63yl-zryanIHE8wT44jIBuusOW8vbZZjjMmoKj7Yc6fZN0zsKSPQxOMC7rRRAey4u8rmdD60nePzKAKIzn65ffZrrkF8f5VaNeHbD0-o2fxouRxmEPcwBdv9/s791/Megalodon.jpg"
  },
  {
    name:"OG Monster",   type:"Vehicle",
    value:1000000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Grand prize for Season 21: 'Rewind.' Based on the Monster Truck before its revamp.",
    tags:"S21 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDezmJYXwAbg6knOft4hLIHWoxmz1UGEz5OlS84xHF9C0ISjknvc8sqEiuznxEZWS4cEi34OPQAP2lSBOMPxVWeIsy6ZzGcZ7sRqKNw5wUkOD-MbFfcfKWVC6ESN4TwV_YuG52gyw1HWrasPB3b7zYVnCbCfafB_19Ng25mt-6-sENQcXvKbTAS7ndNlzZ/s896/OG%20Monster.jpg"
  },
  {
    name:"Striker",      type:"Vehicle",
    value:1250000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Grand prize of Season 20: 'Apocalypse.' Features a minigun on its roof.",
    tags:"S20",          updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKpbZfQV08MA_uzJz7btkk72fxahjElAs4PExVmo4J28SnWQM1gYLDLdES1NAURffPHryt_hDRIewouhaFVpTJ1pgEvuRwxAQ92lV9eexT9r07dv0scV0K93HsmNoHF5Ko5581RWWEWpiHC4ZSRnv5jvKiG2Jq7xXSPihMReE0nt-hD3jN69U5nQDqV8cf/s940/Striker.jpg"
  },
  {
    name:"Venom",        type:"Vehicle",
    value:500000,        duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Obtained from Tier IV Crime safes. Popular with new players for its design and top speed.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPG6O8l9rT_uoF0Pw_9YIZMV5ETSqvwRV0lHQbPjgSWB6TItwd4rrWHzhlquZbDBuwC0Br6dGl9lqWwXcXypXovWCyIXRBH1aeqIegArFtP6oZ1Zp9kXjd7TU__uQMOBMc5F3OEioymHLIo9sP6Ss7jKSAtQVnoVqsug0yVYazQi3Uxl1bF1-ZmQqbXx9J/s766/Venom.jpg"
  },
  {
    name:"Hammerhead",   type:"Vehicle",
    value:300000,        duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Purchasable from Tier III Police safes. Wedge-like shape usable as a ramp.",
    tags:"",             updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjj8JSs92G0kWAPVY0s81jlexpazRlgp3vcDCCOuKnyExFmngCx6dMMyWI2i3bjgbwpwMyHDy5Odf1gO1pM002EtT4vnOlO3YZALAQ5uHsDBMQooIPA1wIRNwcsmB0cIL-IAmC-fEb29JxNsa7KacYuw-PhExm4KvZV-s-CWaJUTRFWBSrU4YziN84G4uar/s759/Hammerhead.jpg"
  },
  {
    name:"Wedge",        type:"Vehicle",
    value:2500000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"A retro-themed vehicle introduced in Season 23: Back to the 80s.",
    tags:"S23 · L10",    updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjc3ErY3jzjXXh4BjUons259NGMLPCNCMAHstnT1unLuI7ahKQGLgpq31rqtJSfhSiH8Gbd8i3f75zNxuOJvD-QTZYx2ZoE256KnmyO5UI8g2weq9-JKFN0gSo0cI-2bFjqjmctsQZIRRNdfxs_NxP5MnmFkxbvKdZexpndWiafy0TQZNUXCJaalsHDM1Al/s1231/Wedge.jpg"
  },

  // ════════════ COLORS (formerly HyperChromes) ══════════════════
  {
    name:"HyperShift L5",type:"Color",
    value:356000000,     duped:312500000,
    demand:"High",     trend:"Stable",
    change:"+1,0000,000",           dupeChange:"+500,000", demandChange:"",             trendChange:"",
    description:"The rarest HyperShift obtained by collecting all Level 5 hyperchromes. Unique gradient rainbow effect.",
    tags:"Max Tier",     updatedAt:_ago(0,90),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9-__7QNY0CECkeRZfpLTSa1-Lj6ZFdAVXdFRE433E7tHAzFElQ0cXTxBEJ2f-kJ1H4lNiLIbTbfbIAO-rixEDZO2_K69HtbK2llyJ6_cKIC5iFhIQgpVKIPii0IFiWbAv-JpGobahC4woU7nnoHHIw3TJzsDz2sHfM97ZccLJ1p3qUYaHrQNspr2yWn9N/s327/Hyper%20Shift.gif"
  },
  {
    name:"HyperShift L4",type:"Color",
    value:250500000,     duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Rainbow color referencing all Level 4 HyperChromes combined.",
    tags:"L4",           updatedAt:_ago(0),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9-__7QNY0CECkeRZfpLTSa1-Lj6ZFdAVXdFRE433E7tHAzFElQ0cXTxBEJ2f-kJ1H4lNiLIbTbfbIAO-rixEDZO2_K69HtbK2llyJ6_cKIC5iFhIQgpVKIPii0IFiWbAv-JpGobahC4woU7nnoHHIw3TJzsDz2sHfM97ZccLJ1p3qUYaHrQNspr2yWn9N/s327/Hyper%20Shift.gif"
  },
  {
    name:"Hyper Diamond L5",type:"Color",
    value:70000000,      duped:60000000,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Evolved by grinding the Jewelry Store. One of the most popular hyperchrome colors.",
    tags:"L5",           updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLlOH_gR2_S3AswhEU6Flsp3tbYXPKs6AEL3gkDynmpv_Cnp1p3bmf7CIiE3ao-ficzKP7LT8I7JGtlsRBt-soeLbKQZdoJrnu0nHvo3LXs2yA2jlgq3m5HmEmOw-GwXeQJyHz15ql1jBJ-mi94vPufHEyVGKMN9EFkslX0V3KBAm592bsTzw8hWg6R5yz/s707/Diamond%20Level%20V.jpg"
  },
  {
    name:"Hyper Blue L5", type:"Color",
    value:61000000,      duped:50000000,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Evolved by grinding the Cargo Plane. Considered the most time-consuming hyperchrome.",
    tags:"L5",           updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHUgEKwO4Sa2r9JqSW4CrMNznmy6-LlSOm1hlhMfeimxFRhQ4Ouc5fPZ3BU1AC_Ka7hDEtcCABZIC6mNNkPXAifA5eRqV14jGmlfyxWnkwP9iY8aHE4o8ZL5bq4QWADNkfQLbORmfAuOIp4Zqw5BdPU16TPLub2hnktD6zygZ_1YGKy23o5Dk1rwJoQWrt/s704/Blue%20Level%20V.jpg"
  },
  {
    name:"Hyper Pink L5", type:"Color",
    value:58000000,      duped:51000000,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Evolved by grinding the Casino. Straightforward but time-consuming.",
    tags:"L5",           updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvB-O1wGpg2MvoXdITMTheE7kubRLhyphenhyphenBBjtF8PE61RIdUsYGsczO4OYSlbowl4ZEl_6s6ndbb0tuGcnKd9c4r4q4cSjcFLLwmtviyulBYDqG70N7Bdyu39EHDkf6y4tGYjqSBk9GM7jNLjMUdGl4W3LB7Kft90Lroil-f_cNshM7mFhp83DvZPsMseJink/s659/Pink%20Level%205.jpg"
  },
  {
    name:"Hyper Blue L4", type:"Color",
    value:51000000,      duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Mid-tier blue hyperchrome with intense metallic sheen.",
    tags:"L4",           updatedAt:_ago(0,7),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlz0KlbsM6alsiS0zPCTSODxpOHKz_pyfJX4hicK9MP6gU6OGr8wlZcnqNUwF4Ae91lRjYG4CqUJog0clUUHe8zD617n0u6ubQU9OD0lasBV7KcnXVFFrFqzsVyPPqkTrhAD0PQI7nKQDtd_VcQ507u5WFW3pP464A4GOiuAXhu_3V4RdT-tckSvBMrMoO/s751/Blue%20Level%20IV.jpg"
  },
  {
    name:"Hyper Red L5",  type:"Color",
    value:45000000,      duped:39000000,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"High-tier red hyperchrome with intense metallic sheen.",
    tags:"L5",           updatedAt:_ago(0,7),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2I02zlhDLkpxsns6wAfCaIqXdYoCBHMJcVeUyxTeGDYbARYnwOErwD7msKvNys02s7-N6nU00WsPKHsVOoIAg9p6ZwHF4tjMeU3ihbEZEwzor-vMli-ewrR6z5UJIYwqS-dq_-GvkhBDGTKGQk-2BcPdnoNVRkrJTLTxA8OvFkUFx0yVERXF6D5po6B07/s679/Red%20Level%205.jpg"
  },
  {
    name:"Hyper Purple L5",type:"Color",
    value:43000000,      duped:40000000,
    demand:"High",       trend:"Rising",
    change:"+500,000",   dupeChange:"+300,000", demandChange:"↑ was Decent", trendChange:"was Stable",
    description:"Purple hyperchrome with rich violet shift, gaining popularity.",
    tags:"L5",           updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvTv3uPw2mg5fERhSYE3RhyphenhypheniNI93drup2q9p7fgFZGGkWIPW5rfcoLfUyGnR8FCI6Rcb0Y74eIV1arn5ONn_hXDJj04eZzcuyb1_UXEqh4fpHERs5IGWHXsjHnc68R5kjP67cHdlVKkLp09TgmUT33JZy1Bh9CPNxjwzaM2TBBkc_w_0zD8y-uaays-hiS/s675/Purple%20Level%205.jpg"
  },
  {
    name:"Hyper Pink L4", type:"Color",
    value:42000000,      duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Mid-high tier pink hyperchrome, stepping stone to L5.",
    tags:"L4",           updatedAt:_ago(0,14),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQMkcoZjFPwd1hW_IKtxhA9mqfn3iaV72rBh84MZ_Cye89efcE6Pjku4BUzdKmRxEEMiDdse_EKmMmTDezKYS_CiJlvb0r1vUVAaodGOA81Lu49NRgRkqbLtJG-rIQlPvcB8qHaDcASYxaPYrfJa4f3RT7WXjUnR6i81YSapAj-rwdNe1amRClA4eGNdbJ/s738/Pink%20Level%204.jpg"
  },
  {
    name:"Hyper Orange L5",type:"Color",
    value:34000000,      duped:31500000,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"High-tier orange hyperchrome with intense metallic sheen.",
    tags:"L5",           updatedAt:_ago(0,14),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL00osIT1uR1OL4JRL2ln3VdInP-6dcna0QLN0jVXcI5K-LvYjjRr7sXgfOL1WCEXi-AF-G7d0gFCFuT9tygLvdT4UxhlBf1o_sWfXvsXkciF1X9og6h_K1Zm1U9GBMOxyAIvadf2P0WpWv1Yjubvo3y4GaxsyzQZGCMbwMthu_CeXWYCMtBCXzUO2dGPR/s656/Orange%20Level%205.jpg"
  },
  {
    name:"Hyper Purple L4",type:"Color",
    value:32000000,      duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Mid-high tier purple hyperchrome, stepping stone to L5.",
    tags:"L4",           updatedAt:_ago(0,14),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRDRQfpzd9rQDvZ_PHJDHxtKx49fCLwTtOruWGKmoh-wemXdxH75f89b3vsCvCy9Vt2PV7tmhojVJMTcaKaDu72bS3fUkY_TN5-WMnSYBypsT50A33pNt8wYkvFKK1dTerhbDCax1FkjVi08B1jRhru-QCbM98Yc2hcSs3CxVPTF-pB2jU_NZvKdPxD-GX/s759/Purple%20Level%204.jpg"
  },
  {
    name:"Hyper Red L4",  type:"Color",
    value:26500000,      duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Mid-high tier red hyperchrome, stepping stone to L5.",
    tags:"L4",           updatedAt:_ago(0,14),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrWH0BLjXL7i24uwFZ8k8bylQ0DLLTJnVyEDznUzlIumGWZTj9sY-tirHUlIR3qw7QTwdjdTXTKrR2tA4D4zxXpQpYaInt2SDEmSwaVWf1vNCwe4Bvq5K_PUtY-HZlli2-EGhBK0qq0_fS3QET36hFW71goChKOL7WWvoxHtraq5JYq5YPEQHSO7NaWNRU/s751/Red%20Level%204.jpg"
  },
  {
    name:"Hyper Green L5",type:"Color",
    value:25000000,      duped:23000000,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"High-tier green hyperchrome with intense metallic sheen.",
    tags:"L5",           updatedAt:_ago(0,14),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1FhyphenhyphenNgThBqnPC4YmmHza0vKtlbKrOhbPUeIkVKXcNYF66fh-e84hpHHTBUvgKYc_Yvcwszj-IiD37NuQ3xEzh-4g5_vN55DKCKZyrkxEveV5MfB996FsnXdKAXanaEQeJ8J94mYzKob7lsWVJuPGNMIqPcuCzPXzrXwUWgamSOzacwhbE7fcyPGoSj_KU/s640/Green%20Level%205.jpg"
  },

  // ════════════ SPOILERS ════════════════════════════════════════
  {
    name:"Thrusters",    type:"Spoiler",
    value:40000000,      duped:37000000,
    demand:"High",       trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"One of the first animated spoilers in Jailbreak. Only obtainable in Season 2 — collectors frequently overpay.",
    tags:"S2 · L9",      updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOLKfDsF5xCRZ-q0NuUiKp7sSMfOT9-gztw8qak0D96eAcsmn-EYbgWclLtYG_RK2e4HHvP4Ow0hzV0bhFxemG6HaR6VCyAK0xxz2WfMIJHg0DGirrRjYZ67s2Ij6Fz3SnVE2GMHbkjMQ9_LuaIiFxVWArk3wFpuIOJLPr1dtSxUV6y_NnuTMDYaHgSrVU/s1003/Rocket%20Thrusters.jpg"
  },
  {
    name:"Snow Shovel",  type:"Spoiler",
    value:8500000,       duped:8000000,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Snow shovel spoiler from Season 7. Medium demand among seasonal collectors.",
    tags:"S7 · L7",      updatedAt:_ago(0,11),
    image:""
  },
  {
    name:"2 Billion",    type:"Spoiler",
    value:6500000,       duped:6000000,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Spoiler from the 2 Billion Visits event. Exclusive and medium demand.",
    tags:"Event",        updatedAt:_ago(0,30),
    image:""
  },

  // ════════════ TEXTURES ════════════════════════════════════════
  {
    name:"Checker",      type:"Texture",
    value:41000000,      duped:38000000,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Obtained via Badimo's Vehicle Testing game for 25 Robux. That game is now private — permanently unobtainable.",
    tags:"Retired",      updatedAt:_ago(0,7),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4OqQKApH2son9SvtsTFKZ-BmmB9r086jDZz8gP5mI6uc6YDRYTVARa-nOAcSEvUQLt4jvPZQhh0TX0ywu0aeutgcmRPMy48hjAtePqwN7n6yknUZKQKnD1cF7w9Hz3NnwaHnL64d_MDksA7D2AWTMQ36hWDYnws7IL5U2WuJPr6ydYI_lGzmj47b4ZVDM/s625/Checker.jpg"
  },
  {
    name:"Drip",         type:"Texture",
    value:20000000,      duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Supreme-inspired texture from Season 5 Level 8 reward. Considered a meme item.",
    tags:"S5 · L8",      updatedAt:_ago(0,30),
    image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtAS2R4QwJ3FD2AV0bcOhM3ktQfX3MLk0cls7pc8fNLUzr4sVQAVBo_Lb7yThpDGnVHq8sqVYFcQENl81Kc3NgOaCIFk2pVb_-oD9BcfxXTPQjRsN4O6e5E4PdVY6pfldF53R589UWciIgFpy0NdbAGU-X3SUfA2R3oBeQU2i8ZxtLpe8ADLZAXS2_h08a/s693/Drip.jpg"
  },
  {
    name:"Snowstorm",    type:"Texture",
    value:7500000,       duped:null,
    demand:"Low",        trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Season-limited snowstorm texture. Low ongoing demand.",
    tags:"Season Limited",updatedAt:_ago(0,30),
    image:""
  },

  // ════════════ RIMS ════════════════════════════════════════════
  {
    name:"Void",         type:"Rim",
    value:47000000,      duped:42000000,
    demand:"High",       trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Seasonal rim now only obtainable through trading. Subjective value — primarily collector-driven.",
    tags:"",             updatedAt:_ago(7,0),
    image:"https://blogger.googleusercontent.com/img/a/AVvXsEjjMNcMzrK80PSCJeQ_S8JJ7bxz-7whglPH00kmtyndq_ceA1d-oMAOl9JcHU-A4tsMcGa0d8zEsjHKOm45fC60t1COirRvUfJO5V7fI3UkFk0ubJBs8LxqrH7coI9Wvn6X7MUHvysYzZWnj75dZ_26BgbRTaL6jmzLBU5juwLFqsyPQTcKSGRjtdhz7IQu"
  },

  // ════════════ FURNITURE ═══════════════════════════════════════
  {
    name:"Hot Tub",      type:"Furniture",
    value:12000000,      duped:null,
    demand:"High",       trend:"Stable",
    change:"+500,000",   dupeChange:null, demandChange:"",           trendChange:"",
    description:"A luxury hot tub for your apartment. One of the most in-demand furniture items.",
    tags:"",             updatedAt:_ago(0,14),
    image:""
  },
  {
    name:"Pool Table",   type:"Furniture",
    value:9000000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Full-size pool table. Rare apartment decoration with steady demand.",
    tags:"",             updatedAt:_ago(0,21),
    image:""
  },
  {
    name:"Fireplace",    type:"Furniture",
    value:5000000,       duped:null,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Decorative fireplace. Warm aesthetic with moderate collector value.",
    tags:"",             updatedAt:_ago(0,30),
    image:""
  },
  {
    name:"Sci-fi Kitchen",type:"Furniture",
    value:4000000,       duped:3500000,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Futuristic kitchen set for apartments. Niche décor piece with weak liquidity.",
    tags:"",             updatedAt:_ago(0,30),
    image:""
  },
  {
    name:"Trapped Bookshelf",type:"Furniture",
    value:3500000,       duped:null,
    demand:"Low",        trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Wall-mounted bookshelf. Low demand but a clean addition to any apartment.",
    tags:"",             updatedAt:_ago(0,60),
    image:""
  },
  {
    name:"Flat Screen TV",type:"Furniture",
    value:3000000,       duped:null,
    demand:"Low",        trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Large flat-screen TV for your apartment wall. Common with limited trading appeal.",
    tags:"",             updatedAt:_ago(0,60),
    image:""
  },
  {
    name:"Piano",        type:"Furniture",
    value:1000000,       duped:null,
    demand:"Decent",     trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Grand piano apartment item. Prestigious furniture piece.",
    tags:"",             updatedAt:_ago(0,30),
    image:""
  },
  {
    name:"Missile Bed",  type:"Furniture",
    value:1250000,       duped:1000000,
    demand:"Medium",     trend:"Stable",
    change:"",           dupeChange:"", demandChange:"",             trendChange:"",
    description:"Missile-themed bed. Niche décor piece.",
    tags:"",             updatedAt:_ago(0,14),
    image:""
  },
  {
    name:"Couch",        type:"Furniture",
    value:2000000,       duped:null,
    demand:"Very Low",   trend:"Stable",
    change:"",           dupeChange:null, demandChange:"",           trendChange:"",
    description:"Standard apartment couch. Common drop with minimal trader interest.",
    tags:"",             updatedAt:_ago(0,90),
    image:""
  },
  {
    name:"Coffee Table", type:"Furniture",
    value:1500000,       duped:null,
    demand:"Very Low",   trend:"Falling",
    change:"-100,000",   dupeChange:null, demandChange:"",           trendChange:"was Stable",
    description:"Basic apartment accessory. Very low demand — mostly acquired passively.",
    tags:"",             updatedAt:_ago(0,90),
    image:""
  },

  // ════════════ DRIFTS / HORNS (placeholders — add items as data arrives)
  // { name:"Example Drift", type:"Drift", value:1000000, duped:null,
  //   demand:"Medium", trend:"Stable", change:"", dupeChange:null,
  //   demandChange:"", trendChange:"", description:"...", tags:"", updatedAt:_ago(0,30), image:"" },
];

// ── STATE ─────────────────────────────────────────────────────
const state = {
  mode:'card', search:'', type:'', demand:'', trend:'',
  sortKey:'value', sortDir:'desc', page:1
};

// ── HELPERS ───────────────────────────────────────────────────
function fmtValue(n) {
  if (n === null || n === undefined) return null;
  if (n >= 1_000_000) { const v = n/1_000_000; return (Number.isInteger(v)?v:+v.toFixed(1))+'M'; }
  if (n >= 1_000)     { const v = n/1_000;     return (Number.isInteger(v)?v:+v.toFixed(1))+'K'; }
  return n.toLocaleString();
}

const DEMAND_ORDER = { High:5, Decent:4, Medium:3, Low:2, 'Very Low':1 };
function demandClass(d) {
  return {High:'d-high',Decent:'d-decent',Medium:'d-medium',Low:'d-low','Very Low':'d-verylow'}[d]||'';
}
function trendClass(t) {
  return {Stable:'t-stable',Hyped:'t-hyped',Rising:'t-rising',Falling:'t-falling'}[t]||'';
}
function typeClass(t) {
  return {
    Vehicle:'type-vehicle', Spoiler:'type-spoiler', Texture:'type-texture',
    Color:'type-color',     Rim:'type-rim',          Drift:'type-drift',
    Horn:'type-horn',       Furniture:'type-furniture'
  }[t]||'';
}

const TREND_ICON = {Stable:'—', Hyped:'🔥', Rising:'▲', Falling:'▼'};

function changeBadge(c) {
  if (!c) return '';
  const cls = c.startsWith('+') ? 'change-up' : 'change-down';
  return `<span class="change-badge ${cls}">${c}</span>`;
}
function prevBadge(c) {
  if (!c) return '';
  return `<span class="change-prev">${c}</span>`;
}

function initials(name) { return name.replace(/[^A-Z0-9]/gi,'').slice(0,3).toUpperCase(); }

// ── LIVE RELATIVE TIME ────────────────────────────────────────
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff/1000);
  if (s < 60)  return 'just now';
  const m = Math.floor(s/60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h/24);
  if (d < 7)   return `${d}d ago`;
  const w = Math.floor(d/7);
  if (w < 5)   return `${w}w ago`;
  const mo = Math.floor(d/30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo/12)}y ago`;
}

function updatedBadge(ts) {
  return `<span class="updated-time"><span class="upd-icon">🕐</span>${relativeTime(ts)}</span>`;
}

// Refresh all live timestamps every 60s
function refreshTimestamps() {
  document.querySelectorAll('[data-ts]').forEach(el => {
    el.textContent = relativeTime(+el.dataset.ts);
  });
}
setInterval(refreshTimestamps, 60000);

// ── IMAGES ────────────────────────────────────────────────────
function cardImgHTML(item) {
  const fb = initials(item.name);
  if (item.image) return `<img src="${item.image}" alt="${item.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="card-img-fallback" style="display:none;">${fb}</div>`;
  return `<div class="card-img-fallback">${fb}</div>`;
}
function rowImgHTML(item) {
  const fb = initials(item.name);
  if (item.image) return `<img src="${item.image}" alt="${item.name}" loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="row-img-fallback" style="display:none;">${fb}</div>`;
  return `<div class="row-img-fallback">${fb}</div>`;
}

// ── FILTER + SORT ─────────────────────────────────────────────
function getFiltered() {
  let list = [...ITEMS];
  if (state.search) { const q=state.search.toLowerCase(); list=list.filter(i=>i.name.toLowerCase().includes(q)); }
  if (state.type)   list = list.filter(i=>i.type===state.type);
  if (state.demand) list = list.filter(i=>i.demand===state.demand);
  if (state.trend)  list = list.filter(i=>i.trend===state.trend);
  list.sort((a,b)=>{
    let av,bv;
    if      (state.sortKey==='name')   {av=a.name.toLowerCase();      bv=b.name.toLowerCase();}
    else if (state.sortKey==='value')  {av=a.value;                   bv=b.value;}
    else if (state.sortKey==='demand') {av=DEMAND_ORDER[a.demand]||0; bv=DEMAND_ORDER[b.demand]||0;}
    else if (state.sortKey==='type')   {av=a.type.toLowerCase();      bv=b.type.toLowerCase();}
    else return 0;
    if (av<bv) return state.sortDir==='asc'?-1:1;
    if (av>bv) return state.sortDir==='asc'?1:-1;
    return 0;
  });
  return list;
}

// ── PAGINATION ────────────────────────────────────────────────
function renderPagination(total) {
  const el = document.getElementById('pagination');
  if (!el) return;
  const totalPages = Math.ceil(total/PAGE_SIZE);
  if (totalPages<=1) { el.innerHTML=''; return; }
  el.innerHTML=`
    <button class="page-btn" id="pg-prev" ${state.page<=1?'disabled':''}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>Prev
    </button>
    <span class="page-info">Page ${state.page} / ${totalPages}</span>
    <button class="page-btn" id="pg-next" ${state.page>=totalPages?'disabled':''}>
      Next<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>`;
  document.getElementById('pg-prev').addEventListener('click',()=>{if(state.page>1){state.page--;render();scrollTo({top:0,behavior:'smooth'});}});
  document.getElementById('pg-next').addEventListener('click',()=>{if(state.page<totalPages){state.page++;render();scrollTo({top:0,behavior:'smooth'});}});
}

// ── RENDER CARDS ──────────────────────────────────────────────
function renderCards(items) {
  const wrap = document.getElementById('card-view');
  if (!items.length) { wrap.innerHTML=`<div class="empty-state" style="grid-column:1/-1">No items match your filters.</div>`; return; }
  const page = items.slice((state.page-1)*PAGE_SIZE, state.page*PAGE_SIZE);
  wrap.innerHTML = page.map((item,i) => `
    <div class="item-card" style="animation-delay:${Math.min(i,15)*0.03}s">
      <div class="card-img-wrap">${cardImgHTML(item)}</div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div style="margin-bottom:6px;"><span class="badge-type ${typeClass(item.type)}">${item.type}</span></div>
        <div class="card-stats">
          <div class="card-stat-row">
            <span class="stat-lbl">Value</span>
            <span class="stat-val">${fmtValue(item.value)}${changeBadge(item.change)}</span>
          </div>
          <div class="card-stat-row">
            <span class="stat-lbl">Duped</span>
            ${item.duped!==null
              ? `<span class="stat-val" style="color:var(--text-dim)">${fmtValue(item.duped)}${changeBadge(item.dupeChange)}</span>`
              : `<span class="stat-na">N/A</span>`}
          </div>
          <div class="card-stat-row">
            <span class="stat-lbl">Demand</span>
            <span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span>${prevBadge(item.demandChange)}
          </div>
        </div>
        ${updatedBadge(item.updatedAt)}
      </div>
      <div class="card-hover-overlay">
        <button class="show-details-btn" data-name="${item.name}">Show Details</button>
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.show-details-btn').forEach(btn=>
    btn.addEventListener('click',e=>{e.stopPropagation();openModal(btn.dataset.name);}));
}

// ── RENDER LIST ───────────────────────────────────────────────
function renderList(items) {
  const tbody = document.querySelector('#list-view tbody');
  if (!items.length) { tbody.innerHTML=`<tr><td colspan="9" class="empty-state">No items match your filters.</td></tr>`; return; }
  const page = items.slice((state.page-1)*PAGE_SIZE, state.page*PAGE_SIZE);
  tbody.innerHTML = page.map(item => `
    <tr data-name="${item.name}">
      <td class="td-img"><div class="row-img-wrap">${rowImgHTML(item)}</div></td>
      <td><span class="td-name">${item.name}</span></td>
      <td><span class="badge-type ${typeClass(item.type)}">${item.type}</span></td>
      <td><span class="td-value">${fmtValue(item.value)}${changeBadge(item.change)}</span></td>
      <td>${item.duped!==null
          ?`<span class="td-duped">${fmtValue(item.duped)}${changeBadge(item.dupeChange)}</span>`
          :`<span class="stat-na">N/A</span>`}</td>
      <td><span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span>${prevBadge(item.demandChange)}</td>
      <td><span class="badge-trend ${trendClass(item.trend)}">${TREND_ICON[item.trend]||'—'} ${item.trend}</span>${prevBadge(item.trendChange)}</td>
      <td><span class="td-notes">${item.tags}</span></td>
      <td><span class="updated-time"><span class="upd-icon">🕐</span><span data-ts="${item.updatedAt}">${relativeTime(item.updatedAt)}</span></span></td>
    </tr>`).join('');
  tbody.querySelectorAll('tr').forEach(row=>row.addEventListener('click',()=>openModal(row.dataset.name)));
}

// ── MAIN RENDER ───────────────────────────────────────────────
function render() {
  const items = getFiltered();
  const countEl = document.getElementById('item-count');
  if (countEl) countEl.textContent = `${items.length} / ${ITEMS.length} items`;
  if (state.mode==='card') {
    document.getElementById('card-view').style.display='grid';
    document.getElementById('list-view').style.display='none';
    renderCards(items);
  } else {
    document.getElementById('card-view').style.display='none';
    document.getElementById('list-view').style.display='block';
    renderList(items);
  }
  renderPagination(items.length);
}

// ── MODAL ─────────────────────────────────────────────────────
function openModal(name) {
  const item = ITEMS.find(i=>i.name===name);
  if (!item) return;
  const overlay = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalFb  = document.getElementById('modal-img-fallback');

  modalFb.textContent = initials(item.name);
  if (item.image) { modalImg.src=item.image; modalImg.style.display='block'; modalImg.onerror=()=>{modalImg.style.display='none';}; }
  else { modalImg.src=''; modalImg.style.display='none'; }

  document.getElementById('modal-name').textContent = item.name;

  const typeEl = document.getElementById('modal-type');
  typeEl.textContent = item.type;
  typeEl.className = `modal-type badge-type ${typeClass(item.type)}`;

  // Value + change
  const valEl = document.getElementById('modal-value');
  valEl.innerHTML = fmtValue(item.value) + changeBadge(item.change);

  // Duped + dupeChange
  const dupedEl = document.getElementById('modal-duped');
  if (item.duped!==null) {
    dupedEl.innerHTML = fmtValue(item.duped) + changeBadge(item.dupeChange);
    dupedEl.className = 'modal-stat-value';
  } else {
    dupedEl.textContent = 'N/A';
    dupedEl.className = 'modal-stat-value na';
  }

  // Demand + demandChange
  const demandEl = document.getElementById('modal-demand');
  demandEl.innerHTML = `<span class="badge-demand ${demandClass(item.demand)}">${item.demand}</span>${prevBadge(item.demandChange)}`;

  // Trend + trendChange
  const trendEl = document.getElementById('modal-trend');
  trendEl.innerHTML = `<span class="badge-trend ${trendClass(item.trend)}">${TREND_ICON[item.trend]||'—'} ${item.trend}</span>${prevBadge(item.trendChange)}`;

  document.getElementById('modal-desc').textContent  = item.description||'—';

  // Tags + live timestamp
  const notesEl = document.getElementById('modal-notes');
  notesEl.textContent = item.tags||'';

  // Live updated row
  const updEl = document.getElementById('modal-updated-time');
  if (updEl) { updEl.dataset.ts = item.updatedAt; updEl.textContent = relativeTime(item.updatedAt); }

  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow='';
}

// ── SORT HEADERS ──────────────────────────────────────────────
function initSortHeaders() {
  document.querySelectorAll('.values-table th.sortable').forEach(th=>{
    th.addEventListener('click',()=>{
      const key=th.dataset.sort;
      if (state.sortKey===key) { state.sortDir=state.sortDir==='asc'?'desc':'asc'; }
      else { state.sortKey=key; state.sortDir=(key==='name'||key==='type')?'asc':'desc'; }
      document.querySelectorAll('.values-table th.sortable').forEach(t=>{
        t.classList.remove('sorted');
        const sa=t.querySelector('.sort-arrow'); if(sa) sa.textContent='↕';
      });
      th.classList.add('sorted');
      const arrow=th.querySelector('.sort-arrow'); if(arrow) arrow.textContent=state.sortDir==='asc'?'↑':'↓';
      state.page=1; render();
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.mode-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      state.mode=btn.dataset.mode; state.page=1;
      document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
      render();
    });
  });

  const searchEl=document.getElementById('search-input');
  if(searchEl) searchEl.addEventListener('input',e=>{state.search=e.target.value.trim();state.page=1;render();});

  ['type','demand','trend'].forEach(id=>{
    const el=document.getElementById(`${id}-filter`);
    if(el) el.addEventListener('change',e=>{state[id]=e.target.value;state.page=1;render();});
  });

  const overlay=document.getElementById('modal-overlay');
  if(overlay){
    document.getElementById('modal-close').addEventListener('click',closeModal);
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeModal();});
  }

  initSortHeaders();
  render();
});