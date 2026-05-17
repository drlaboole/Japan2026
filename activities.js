/* =====================================================
   FICHES ACTIVITÉS — Voyage Japon 2026
   - Données des 40 activités
   - Modale au clic sur chaque carte
   - Photos récupérées via Wikipedia REST API
   ===================================================== */
(function () {
  // -------- Données ----------
  const ACTIVITIES = {
    "dotonbori": {
      title: "Dōtonbori",
      jp: "道頓堀",
      escale: "Osaka",
      meta: "Jour 1 — Soirée",
      wiki: "Dōtonbori",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Dotonbori_Osaka_Japan02s5.jpg/1024px-Dotonbori_Osaka_Japan02s5.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Glico_Sign_in_Osaka.jpg/1024px-Glico_Sign_in_Osaka.jpg"
      ],
      desc: [
        "Dōtonbori est l'épicentre de la nuit à Osaka. Une rue d'à peine 600 mètres, bordée d'un canal, dont les façades ploient sous le poids des enseignes lumineuses : crabe géant articulé du restaurant Kani Dōraku, dragon doré, le célèbre Glico Man qui court avec sa piste rouge depuis 1935.",
        "C'est le quartier où l'expression japonaise « kuidaore » prend tout son sens : « manger jusqu'à se ruiner ». Takoyaki (boulettes de poulpe), okonomiyaki (galette aux choux), kushikatsu (brochettes frites), ramen, fugu (poisson-globe) — toute la gastronomie d'Osaka est concentrée ici.",
        "L'ambiance bascule à la tombée de la nuit. Les néons s'allument, les petits ponts au-dessus du canal deviennent des balcons d'observation, et la foule se met en mouvement. À voir absolument après 19h, et idéalement par une chaude soirée d'été où la rue prend des allures de carnaval permanent."
      ],
      info: {
        address: "Dōtonbori, Chūō-ku, Osaka",
        hours: "Restaurants 11h-1h, animations toute la nuit",
        price: "Accès gratuit · repas ¥800-3 000",
        transport: "Métro Namba ou Nipponbashi (sortie 14), 5 min à pied"
      },
      tip: "Pour la photo iconique du Glico Man, montez sur le pont Ebisubashi et tournez-vous vers l'ouest. La lumière idéale est entre 19h30 et 21h. Évitez le week-end pour éviter la cohue."
    },
    "osaka-castle": {
      title: "Château d'Osaka",
      jp: "大阪城",
      escale: "Osaka",
      meta: "Jour 2 — Matin",
      wiki: "Château_d'Osaka",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Osaka_Castle_02bs3200.jpg/1024px-Osaka_Castle_02bs3200.jpg"
      ],
      desc: [
        "Construit en 1583 par Toyotomi Hideyoshi, le château d'Osaka fut en son temps la plus grande forteresse du Japon. Détruit puis reconstruit à plusieurs reprises — la version actuelle date de 1931 et a été restaurée en 1997 — il symbolise la résilience d'Osaka et son statut de seconde capitale historique.",
        "Le donjon principal (tenshukaku) culmine à 55 mètres sur huit étages, avec une finition externe blanche et or, des poissons-dauphins (shachihoko) dorés en couronnement. À l'intérieur, un musée parcourt la vie de Hideyoshi et l'histoire d'Osaka jusqu'à l'ère Meiji.",
        "Le parc qui l'entoure — Osaka-jō Kōen — est l'un des plus vastes espaces verts de la ville : 105 hectares, 600 cerisiers en fleurs au printemps, fossés, douves et murailles de pierre cyclopéenne. Une bouffée d'air après la frénésie urbaine."
      ],
      info: {
        address: "1-1 Ōsakajō, Chūō-ku, Osaka 540-0002",
        hours: "9h-17h (dernière entrée 16h30)",
        price: "Donjon ¥600 adulte · gratuit -15 ans",
        transport: "Métro Tanimachi 4-chōme (T23) puis 15 min à pied"
      },
      tip: "Montez tôt (avant 10h30) pour éviter la chaleur et la foule. La vue panoramique depuis le 8e étage s'ouvre sur tout l'est d'Osaka. Audioguide disponible en français."
    },
    "umeda-sky": {
      title: "Umeda Sky Building",
      jp: "梅田スカイビル",
      escale: "Osaka",
      meta: "Jour 2 — Après-midi",
      wiki: "Umeda_Sky_Building",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Umeda_Sky_Building.jpg/1024px-Umeda_Sky_Building.jpg"
      ],
      desc: [
        "Deux tours jumelles de 173 mètres reliées au sommet par une plate-forme circulaire en porte-à-faux : l'Umeda Sky Building, dessiné par l'architecte Hiroshi Hara en 1993, est l'un des immeubles les plus reconnaissables du Japon. Il a été cité dans le top 20 des plus beaux gratte-ciel du monde.",
        "L'observatoire « Floating Garden » offre une vue à 360° sur Osaka. On y accède par un escalator suspendu qui traverse le vide entre les deux tours — une expérience vertigineuse en soi. Le toit-terrasse, accessible et venté, surplombe Umeda, le port, et par temps clair le mont Ikoma.",
        "Au sous-sol, le « Takimi-koji » reconstitue une ruelle de l'ère Shōwa (années 1920-30) avec ses échoppes traditionnelles. Bon plan pour un déjeuner d'okonomiyaki dans une ambiance de carte postale."
      ],
      info: {
        address: "1-1-88 Ōyodonaka, Kita-ku, Osaka",
        hours: "9h30-22h30 (dernière entrée 22h)",
        price: "¥2 000 adulte · ¥500 enfant 4-12 ans",
        transport: "JR Osaka Station puis 9 min à pied (passage souterrain bien indiqué)"
      },
      tip: "Le meilleur moment est l'heure bleue (45 min avant le coucher du soleil) : on voit Osaka illuminée ET le ciel encore coloré. Réservation conseillée en haute saison sur le site officiel."
    },
    "usj": {
      title: "Universal Studios Japan",
      jp: "ユニバーサル・スタジオ・ジャパン",
      escale: "Osaka",
      meta: "Jour 4 — Toute la journée",
      wiki: "Universal_Studios_Japan",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Universal_Studios_Japan_entrance.jpg/1024px-Universal_Studios_Japan_entrance.jpg"
      ],
      desc: [
        "Universal Studios Japan, ouvert en 2001, est l'un des parcs à thèmes les plus visités au monde (16 millions de visiteurs par an). Il célèbre en 2026 son 25e anniversaire avec des éditions spéciales et l'événement saisonnier « Universal Cool Japan » qui croise les licences Universal avec les franchises japonaises.",
        "Les zones phares : Super Nintendo World (Mario Kart en réalité augmentée, un must), Wizarding World of Harry Potter (Poudlard reconstitué grandeur nature), Minion Park, Jurassic Park, Hollywood et la nouvelle zone Donkey Kong Country ouverte fin 2024.",
        "C'est l'une des journées les plus attendues du voyage côté enfants — et l'une des plus exigeantes côté logistique. La chaleur d'été (35°C+), l'affluence (en moyenne 2-3h d'attente pour les attractions phares sans Express Pass) et les 12 heures debout exigent une vraie préparation."
      ],
      info: {
        address: "2-1-33 Sakurajima, Konohana-ku, Osaka",
        hours: "Variable : 8h30-21h en été",
        price: "Studio Pass ¥9 800 ad. · ¥6 800 enf. + Express Pass conseillé",
        transport: "JR Yumesaki Line jusqu'à Universal-city Station (5 min à pied de l'entrée)"
      },
      tip: "Critique : billets en vente J-60 (30 mai 2026 pour le 29/7), épuisés en 24-48h en été. Acheter le 29 mai à 17h Paris pile sur usj.co.jp ou Klook. Prendre IMPÉRATIVEMENT un Express Pass 4 ou 7 — sans, prévoir 2h d'attente par grosse attraction."
    },
    "hiroshima-miyajima": {
      title: "Hiroshima + Miyajima",
      jp: "広島・宮島",
      escale: "Osaka",
      meta: "Jour 3 — Day trip",
      wiki: "Hiroshima",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Itsukushima_Gate.jpg/1024px-Itsukushima_Gate.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Hiroshima_Genbaku_Dome_2014-08_%28cropped%29.jpg/1024px-Hiroshima_Genbaku_Dome_2014-08_%28cropped%29.jpg"
      ],
      desc: [
        "Day trip dense en deux temps. Le matin à Hiroshima : le Parc du Mémorial de la Paix, le Dôme de Genbaku (seul bâtiment resté debout après le 6 août 1945, classé UNESCO), le Musée Mémorial — visite sobre, exigeante émotionnellement mais essentielle. Pour les enfants, expliquer en amont permet une visite plus apaisée.",
        "L'après-midi, ferry depuis Miyajimaguchi pour rejoindre l'île sacrée de Miyajima. Le torii flottant rouge du sanctuaire d'Itsukushima est l'une des images les plus célèbres du Japon. Lors des grandes marées, l'eau monte autour du torii et le sanctuaire semble flotter ; à marée basse, on peut marcher jusqu'à ses pieds.",
        "L'île compte aussi quelque 500 cerfs en liberté, le mont Misen (535 m, téléphérique disponible), et de nombreux artisans qui fabriquent les momiji-manju, gâteaux en forme de feuille d'érable au cœur fondant. Retour ferry+train vers Osaka pour le dîner."
      ],
      info: {
        address: "Parc Mémorial : Naka-ku, Hiroshima · Miyajima : ferry depuis Miyajimaguchi",
        hours: "Musée mémorial 8h30-18h · Sanctuaire Itsukushima 6h30-18h",
        price: "Musée ¥200 · Sanctuaire ¥300 · Ferry JR ¥360 A/R",
        transport: "Shinkansen Sakura Shin-Osaka → Hiroshima (1h30) puis JR Sanyo + Ferry"
      },
      tip: "Pas besoin de réserver le Shinkansen à l'avance : départs Shin-Osaka → Hiroshima toutes les 15-30 min. Achetez vos 8 billets au guichet vert le matin même. Consulter le calendrier des marées avant le départ — la marée haute (vue torii flottant) est la plus photogénique."
    },
    "kuromon": {
      title: "Marché Kuromon",
      jp: "黒門市場",
      escale: "Osaka",
      meta: "Si temps libre",
      wiki: "Marché_Kuromon",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kuromon_Ichiba_Market_Osaka.jpg/1024px-Kuromon_Ichiba_Market_Osaka.jpg"
      ],
      desc: [
        "Surnommé « la cuisine d'Osaka », le marché Kuromon est une galerie couverte de 580 mètres qui aligne quelque 150 boutiques de produits frais. Poissonniers, bouchers de bœuf de Kobe, marchands de fugu, primeurs, vendeurs de takoyaki — tout est là pour comprendre l'obsession d'Osaka pour la bonne chère.",
        "Au-delà du commerce de bouche traditionnel, beaucoup d'étals proposent désormais des dégustations sur place : sashimi à la commande, brochettes de wagyu grillées, oursins frais ouverts devant vous. Pour 1 500-2 500¥ par personne, un déjeuner debout sur le pouce devient un parcours gastronomique.",
        "Le marché est en activité depuis l'ère Edo (XVIIIe siècle). Ses ruelles sont étroites, parfois pleines, mais l'expérience vaut largement la marche depuis Sakuragawa."
      ],
      info: {
        address: "2-chōme Nipponbashi, Chūō-ku, Osaka 542-0073",
        hours: "9h-18h (la plupart des stands)",
        price: "Gratuit · dégustations ¥300-1 500 par bouchée",
        transport: "Métro Nipponbashi (sortie 10), 1 min à pied"
      },
      tip: "Y aller le matin (10h-11h30) : les produits sont les plus frais, l'affluence raisonnable et les vendeurs plus disposés à expliquer. Beaucoup parlent anglais simple."
    },
    "shinsekai": {
      title: "Shinsekai et Tsūtenkaku",
      jp: "新世界・通天閣",
      escale: "Osaka",
      meta: "Quartier rétro",
      wiki: "Shinsekai",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Tsutenkaku_201805.jpg/1024px-Tsutenkaku_201805.jpg"
      ],
      desc: [
        "Le « nouveau monde » d'Osaka a été conçu en 1912 sur le modèle de Paris pour sa partie sud et de Coney Island pour le nord. La tour Tsūtenkaku (« qui touche le ciel », 103 m) est sa colonne vertébrale, version moderne de 1956 imitant la tour Eiffel.",
        "Aujourd'hui, Shinsekai a un parfum de Japon des années 1960 figé dans le temps : enseignes peintes à la main, kushikatsu à tous les coins de rue (la spécialité absolue du quartier), lampions, billards et arcades de jeux d'antan. C'est l'envers décontracté de la modernité japonaise.",
        "Plus authentique en soirée. La nuit, les néons font ressembler le quartier à un décor de film de Ridley Scott — Blade Runner aurait été pertinemment tourné ici."
      ],
      info: {
        address: "Naniwa-ku, Osaka",
        hours: "Quartier : 24h/24 · Tsūtenkaku : 10h-20h",
        price: "Tsūtenkaku ¥1 000 adulte",
        transport: "Métro Dōbutsuen-mae (sortie 5) ou Ebisuchō, 3 min à pied"
      },
      tip: "Dans la rue principale, la chaîne Daruma sert le meilleur kushikatsu d'Osaka. Règle absolue : ne jamais re-tremper la brochette déjà mordue dans la sauce commune."
    },
    "sumiyoshi": {
      title: "Sumiyoshi Taisha",
      jp: "住吉大社",
      escale: "Osaka",
      meta: "Sanctuaire ancien",
      wiki: "Sumiyoshi-taisha",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sumiyoshi_taisha19s4592.jpg/1024px-Sumiyoshi_taisha19s4592.jpg"
      ],
      desc: [
        "L'un des sanctuaires shintō les plus anciens du Japon, fondé en 211. Sumiyoshi Taisha présente une architecture pré-bouddhique unique, le « sumiyoshi-zukuri » : toits droits, murs blancs et rouges, sans courbes inspirées du continent chinois. Une rareté.",
        "L'élément le plus photographié du site est le pont Sori-bashi, en bois laqué rouge, à la courbure si raide qu'il faut presque y grimper. Il était utilisé jadis pour purifier les pèlerins avant l'entrée dans l'enceinte sacrée.",
        "Le sanctuaire est dédié aux divinités de la mer et de la navigation. Les marins venaient — et viennent encore — y prier avant de partir. Atmosphère contemplative, peu touristique, idéal pour un moment hors du temps."
      ],
      info: {
        address: "2-9-89 Sumiyoshi, Sumiyoshi-ku, Osaka",
        hours: "6h-17h (en été 6h-17h)",
        price: "Gratuit",
        transport: "Train Nankai vers Sumiyoshi Taisha Station, 3 min à pied"
      },
      tip: "Plus calme que les sanctuaires de Kyoto. Combinez avec la visite de Shinsekai (5 stations de train) pour faire un après-midi thématique \"Osaka ancienne\"."
    },
    "osaka-food": {
      title: "Spécialités à goûter",
      jp: "大阪グルメ",
      escale: "Osaka",
      meta: "Cuisine locale",
      wiki: "Cuisine_d'Osaka",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Takoyaki_-_001.jpg/1024px-Takoyaki_-_001.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Okonomiyaki_by_yoppy_in_Tokyo.jpg/1024px-Okonomiyaki_by_yoppy_in_Tokyo.jpg"
      ],
      desc: [
        "Osaka se vit en mangeant. Quatre spécialités sont incontournables. Le takoyaki : boulettes de pâte cuites dans des moules sphériques avec du poulpe, de l'oignon vert et du gingembre, nappées de sauce et de bonite séchée qui ondule sous la chaleur. À déguster brûlant, dans la rue, à 8-10 boulettes la barquette (~¥600).",
        "L'okonomiyaki : « grillé comme tu veux ». Crêpe épaisse mêlant pâte, chou, viande/fruits de mer, cuite sur une plaque chauffante (teppan) au centre de la table. Mio's, Botejyu et Fukutarō sont des références. Comptez ¥1 200-1 800 par personne.",
        "Le kushikatsu : brochettes panées et frites, à tremper dans une sauce commune. Spécialité de Shinsekai. Et le yakiniku : grillade de viande au charbon sur table, dont Osaka a sa propre version, plus généreuse qu'à Tokyo. Bonus : le négikuyaki, alternative aux poireaux."
      ],
      info: {
        address: "Dōtonbori, Shinsekai, Namba pour la haute densité de restaurants",
        hours: "Plages typiques 11h-23h · izakayas jusqu'à 2h",
        price: "Repas moyens : ¥800-2 500/pers",
        transport: "Tous les quartiers principaux"
      },
      tip: "Pour les enfants : commencer par takoyaki et okonomiyaki, plus accessibles. Le fugu (poisson-globe) est une expérience à part — réservé aux adultes curieux, réservez à l'avance chez Zuboraya ou un fugu-ya certifié."
    },
    "kiyomizu": {
      title: "Kiyomizu-dera",
      jp: "清水寺",
      escale: "Kyoto",
      meta: "Jour 1 — Après-midi",
      wiki: "Kiyomizu-dera",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kiyomizu-dera_in_Kyoto-r.jpg/1024px-Kiyomizu-dera_in_Kyoto-r.jpg"
      ],
      desc: [
        "Fondé en 778, Kiyomizu-dera (« le temple de l'eau pure ») est l'un des sites les plus visités du Japon. Son hall principal se dresse sur une terrasse en bois portée par 139 piliers de cyprès assemblés sans un seul clou, suspendue à 13 mètres au-dessus de la pente boisée de la colline Otowa.",
        "L'expression « sauter de la véranda de Kiyomizu » signifiait jadis se lancer dans une décision audacieuse — la légende voulait que survivre au saut accomplisse un vœu. Statistique : 234 sauts recensés sous l'ère Edo, 85,4 % de survie. Aujourd'hui c'est strictement interdit.",
        "À ne pas manquer : la cascade Otowa (3 filets d'eau aux pouvoirs supposés — santé, longévité, succès académique — vous ne buvez qu'à un seul), le pavillon Jishu-jinja dédié à l'amour, et la vue panoramique sur la ville qui s'étale en contrebas."
      ],
      info: {
        address: "1-294 Kiyomizu, Higashiyama-ku, Kyoto",
        hours: "6h-18h (variable selon les mois)",
        price: "¥500 adulte · ¥200 enfant",
        transport: "Bus Kyoto 100 ou 206 jusqu'à Gojō-zaka, puis 10 min de montée à pied"
      },
      tip: "Y aller à l'ouverture (6h) pour avoir la terrasse pour vous. À 9h, c'est déjà très peuplé. La montée Sannenzaka qui mène au temple est elle-même un patrimoine — boutiques d'artisanat traditionnel et pâtisseries de matcha."
    },
    "gion": {
      title: "Gion",
      jp: "祇園",
      escale: "Kyoto",
      meta: "Jour 1 — Soir",
      wiki: "Gion",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Hanami-koji_at_night-3.jpg/1024px-Hanami-koji_at_night-3.jpg"
      ],
      desc: [
        "Le quartier des geishas. Ruelles pavées éclairées de lanternes, maisons de bois centenaires aux façades discrètes, allées qui semblent figées au XVIIIe siècle. Les rues Hanami-kōji et Shirakawa concentrent l'essentiel.",
        "C'est ici que vivent et travaillent les geikos (terme local pour geisha) et les maikos (apprenties). Avec un peu de chance et beaucoup de discrétion, on les croise vers 17h-19h, sur le chemin de leur premier rendez-vous du soir. Photos discrètes uniquement : la loi locale interdit désormais de les photographier dans les ruelles privées.",
        "Le sanctuaire Yasaka, à l'extrémité est de Shijō-dōri, est la porte d'entrée traditionnelle de Gion. Son hall principal est gratuit et superbement éclairé la nuit. Très belle promenade à terminer en dînant dans un kaiseki (haute gastronomie kyotote) si le budget suit."
      ],
      info: {
        address: "Higashiyama-ku, Kyoto",
        hours: "Quartier accessible 24h · animations 18h-22h",
        price: "Gratuit · kaiseki ¥10 000-30 000/pers",
        transport: "Bus Kyoto 100, 206 ou Métro Tōzai (Gion-Shijō), 5 min à pied"
      },
      tip: "Évitez les photos rapprochées des geishas (amende de ¥10 000 depuis 2024). Pour une expérience famille : assistez à un spectacle de gion-odori ou un atelier de fabrication de manju de matcha dans le quartier."
    },
    "arashiyama-bamboo": {
      title: "Forêt de bambous d'Arashiyama",
      jp: "嵐山竹林",
      escale: "Kyoto",
      meta: "Jour 2 — Matin",
      wiki: "Arashiyama",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sagano_Bamboo_forest.jpg/1024px-Sagano_Bamboo_forest.jpg"
      ],
      desc: [
        "La sagano chikurin (« bambouseraie de Sagano ») est une allée de 500 mètres qui traverse une forêt de bambous géants Mōsō. Quand le vent traverse les tiges qui peuvent atteindre 20 mètres, le froissement est si caractéristique que le ministère de l'Environnement l'a inscrit aux 100 paysages sonores du Japon.",
        "Le moment juste : 7h30-8h30, avant l'arrivée des cars de touristes. La lumière est tamisée par les bambous et crée une atmosphère vert-or unique. Plus tard, le sentier est embouteillé et l'expérience perd beaucoup.",
        "Arashiyama est aussi un quartier complet : pont Togetsukyō (« qui traverse la lune »), villa Ōkōchi-Sansō (très belle, peu fréquentée), parc à singes d'Iwatayama (300 macaques en liberté sur la colline). Une demi-journée pleine."
      ],
      info: {
        address: "Saga-Tenryūji, Ukyō-ku, Kyoto",
        hours: "Forêt : accessible 24h/24",
        price: "Gratuit",
        transport: "JR Sagano Line jusqu'à Saga-Arashiyama (15 min depuis Kyoto Station)"
      },
      tip: "Arrivez avant 8h. Combinez avec le Sagano Romantic Train (réservation J-30) au départ de la même gare pour traverser les gorges de Hozugawa."
    },
    "tenryuji": {
      title: "Tenryū-ji",
      jp: "天龍寺",
      escale: "Kyoto",
      meta: "Jour 2 — Matin",
      wiki: "Tenryū-ji",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tenryuji_Sogenchi_Garden1.JPG/1024px-Tenryuji_Sogenchi_Garden1.JPG"
      ],
      desc: [
        "Temple bouddhique zen de l'école Rinzai, fondé en 1339. Tenryū-ji (« temple du dragon céleste ») est classé UNESCO et premier des cinq grands temples de Kyoto. Son jardin Sōgenchi-teien, dessiné par Musō Soseki, est l'un des plus anciens jardins de promenade encore intacts du Japon — il a sept siècles.",
        "Le jardin tire parti du paysage emprunté (shakkei) : les collines d'Arashiyama deviennent partie intégrante de la composition, sans qu'aucun mur ne les sépare du temple. C'est l'une des plus belles applications du principe au Japon.",
        "À combiner avec la bambouseraie qui débute juste derrière le temple — la sortie nord donne directement sur le sentier des bambous."
      ],
      info: {
        address: "68 Susukinobaba-chō, Sagatenryūji, Ukyō-ku, Kyoto",
        hours: "8h30-17h (jardins fermés 16h50)",
        price: "Jardin ¥500 · jardin + bâtiments ¥800",
        transport: "JR Sagano Line jusqu'à Saga-Arashiyama, 10 min à pied"
      },
      tip: "Le repas shōjin-ryōri (cuisine bouddhique végétarienne) servi à Shigetsu, dans l'enceinte du temple, est une expérience rare. Réservation obligatoire 1 jour avant."
    },
    "fushimi-inari": {
      title: "Fushimi Inari Taisha",
      jp: "伏見稲荷大社",
      escale: "Kyoto",
      meta: "Jour 3 — Très tôt",
      wiki: "Fushimi_Inari-taisha",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Fushimi_Inari-taisha%2C_Romon-2.jpg/1024px-Fushimi_Inari-taisha%2C_Romon-2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Senbon_Torii.jpg/1024px-Senbon_Torii.jpg"
      ],
      desc: [
        "Sanctuaire shintō principal de la divinité Inari (riz, prospérité, commerce), fondé en 711. Sa singularité : un sentier d'environ 4 kilomètres ascendants à travers plus de 10 000 torii rouges qui forment un tunnel quasi-continu sur la flanc de la montagne Inari (233 m).",
        "Chaque torii est offert par un fidèle ou une entreprise dont le nom est gravé au dos. Plus on monte, moins il y a de monde — au sommet (Yotsutsuji, point de vue à mi-chemin) on est souvent seul. La boucle complète prend 2h30 à pied.",
        "Le sanctuaire reste accessible 24h/24, ce qui en fait un des rares lieux où l'on peut vivre une expérience presque spirituelle au lever du soleil — ou à la nuit, dans une atmosphère mystique où certains visiteurs racontent avoir ressenti la présence des kitsune (renards messagers d'Inari)."
      ],
      info: {
        address: "68 Fukakusa Yabunouchi-chō, Fushimi-ku, Kyoto",
        hours: "Accessible 24h/24",
        price: "Gratuit",
        transport: "JR Nara Line jusqu'à Inari Station (5 min depuis Kyoto Station)"
      },
      tip: "Y aller absolument à l'aube (5h-6h) ou en soirée (après 18h) pour échapper à la foule. Prévoir bonnes chaussures (escaliers raides, 4 km A/R) et eau. Vue panoramique sur Kyoto au point Yotsutsuji."
    },
    "nara": {
      title: "Nara — Day trip",
      jp: "奈良",
      escale: "Kyoto",
      meta: "Jour 4 — Day trip",
      wiki: "Nara",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Todaiji28cs3200.jpg/1024px-Todaiji28cs3200.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Nara_deer_park%2C_Japan.jpg/1024px-Nara_deer_park%2C_Japan.jpg"
      ],
      desc: [
        "Première capitale du Japon (710-784), Nara est l'origine de la nation et le berceau du bouddhisme japonais. À 45 minutes de train de Kyoto, son parc de 660 hectares concentre 8 sites UNESCO et environ 1 200 cerfs sika en liberté, considérés comme messagers des dieux et nullement craintifs.",
        "Le Tōdai-ji abrite le Daibutsu, statue de bronze de 15 mètres représentant Bouddha Vairocana, dans le plus grand bâtiment en bois du monde (le Daibutsuden, 57 m de long). À l'intérieur d'un des piliers, un trou aux dimensions exactes d'une narine du Bouddha : les enfants qui y passent obtiendraient l'illumination.",
        "Le sanctuaire Kasuga-taisha, fondé en 768, est célèbre pour ses milliers de lanternes en pierre et en bronze qui bordent les sentiers de la forêt. Compter une journée pleine, idéalement en commençant tôt pour éviter la chaleur (Nara, dans une cuvette, est plus chaude qu'on ne le pense)."
      ],
      info: {
        address: "Nara Park, Nara-shi, préfecture de Nara",
        hours: "Parc 24h · Tōdai-ji 7h30-17h30 · Kasuga-taisha 6h-18h",
        price: "Tōdai-ji ¥800 · Kasuga-taisha ¥700",
        transport: "JR Nara Line depuis Kyoto Station (45 min, ¥720)"
      },
      tip: "Acheter les biscuits à cerfs (¥200, vendus dans le parc) pour interagir — ils s'inclinent vraiment pour les recevoir. Mais ne pas se faire mordre les chemises : ils confondent. Visitez Nara avant 11h pour des conditions optimales."
    },
    "kinkakuji": {
      title: "Kinkaku-ji",
      jp: "金閣寺",
      escale: "Kyoto",
      meta: "Pavillon d'Or",
      wiki: "Kinkaku-ji",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Kinkaku-Ji.JPG/1024px-Kinkaku-Ji.JPG"
      ],
      desc: [
        "Le Pavillon d'Or, construit en 1397 comme retraite du shogun Ashikaga Yoshimitsu, est devenu temple zen à sa mort. Ses deux étages supérieurs sont entièrement recouverts de feuilles d'or qui se reflètent dans l'étang Kyōko-chi qui l'entoure.",
        "Incendié par un moine fanatique en 1950, le bâtiment a été reconstruit à l'identique en 1955 puis re-doré en 1987 avec 20 kilos d'or pur. Le temple ne se visite plus à l'intérieur, mais le jardin de promenade — chef-d'œuvre de l'époque Muromachi — offre une succession de points de vue calibrés au millimètre.",
        "À combiner avec Ryōan-ji (jardin de pierres zen le plus célèbre du monde, à 1 km à pied) pour une matinée complète des classiques absolus de Kyoto."
      ],
      info: {
        address: "1 Kinkakujichō, Kita-ku, Kyoto",
        hours: "9h-17h",
        price: "¥500 adulte · ¥300 enfant",
        transport: "Bus Kyoto 12 ou 59 depuis Kyoto Station (40 min) puis 5 min à pied"
      },
      tip: "Y aller le matin (9h-10h30) pour la lumière idéale sur les façades dorées. À éviter le mercredi/jeudi (jour des cars chinois). Petit conseil photo : se placer côté ouest pour avoir le reflet symétrique."
    },
    "nishiki": {
      title: "Nishiki Market",
      jp: "錦市場",
      escale: "Kyoto",
      meta: "« La cuisine de Kyoto »",
      wiki: "Marché_de_Nishiki",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nishiki_Market_in_2014-09-12.JPG/1024px-Nishiki_Market_in_2014-09-12.JPG"
      ],
      desc: [
        "Une ruelle couverte de 400 mètres au cœur du centre-ville de Kyoto, surnommée « la cuisine de Kyoto » depuis quatre siècles. 130 boutiques, presque toutes spécialisées dans un seul produit transmis de génération en génération.",
        "Les indispensables : les tsukemono (légumes fermentés, fierté kyotote), les yuba (peau de tofu, sublime quand toute fraîche), le matcha en tous formats, les sucreries traditionnelles (wagashi, dorayaki, momiji manju), les épices yuzu-koshō, et surtout le tako-tamago (petit poulpe entier farci d'un œuf de caille — étrange mais addictif).",
        "Les boutiques séculaires comme Aritsugu (couteaux forgés à la main depuis 1560) ou Yamashichi (épices) sont des destinations en soi. Une heure de promenade permet de couvrir l'essentiel."
      ],
      info: {
        address: "Nishikikōji-dōri, Nakagyō-ku, Kyoto",
        hours: "9h-18h (variable)",
        price: "Gratuit · dégustations ¥300-1 500",
        transport: "Métro Karasuma à Shijō Station (sortie 16), 3 min à pied"
      },
      tip: "À combiner avec Pontochō (à 5 min à pied) pour un dîner. Goûter absolument le yuba frais chez Yuba Cho — c'est une révélation."
    },
    "nanzenji": {
      title: "Nanzen-ji + Chemin du Philosophe",
      jp: "南禅寺・哲学の道",
      escale: "Kyoto",
      meta: "Quartier paisible",
      wiki: "Nanzen-ji",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Nanzen-ji_Sanmon%2C_Northwest_View_20120608-1.jpg/1024px-Nanzen-ji_Sanmon%2C_Northwest_View_20120608-1.jpg"
      ],
      desc: [
        "Nanzen-ji est le siège de la branche Rinzai du zen, fondé en 1291 comme résidence impériale puis transformé en temple. Son Sanmon, immense portail en bois noir de 22 mètres, est l'un des trois plus grands du Japon — on peut grimper dessus pour une vue panoramique surprenante.",
        "Derrière le temple, un aqueduc en briques rouges traverse la forêt et alimente Kyoto en eau potable depuis 1890 — un anachronisme visuel saisissant. Plus loin, le sous-temple Tenju-an et son jardin zen offrent un moment de calme presque méditatif.",
        "Le Tetsugaku-no-michi, ou Chemin du Philosophe, commence à Nanzen-ji et longe un canal bordé de 500 cerisiers sur 2 kilomètres jusqu'à Ginkaku-ji (le Pavillon d'Argent). Nommé d'après le philosophe Nishida Kitarō qui s'y promenait quotidiennement pour réfléchir. À faire à pied, en prenant son temps."
      ],
      info: {
        address: "86 Nanzenji Fukuchichō, Sakyō-ku, Kyoto",
        hours: "8h40-17h (variable)",
        price: "Nanzen-ji ¥500 · Sanmon ¥600 · sous-temples ¥400-500",
        transport: "Métro Tōzai à Keage Station (sortie 1), 7 min à pied"
      },
      tip: "Combiner Nanzen-ji + Chemin du Philosophe + Ginkaku-ji en 3-4 heures pour une après-midi superbe et peu fréquentée."
    },
    "pontocho": {
      title: "Pontochō",
      jp: "先斗町",
      escale: "Kyoto",
      meta: "Ruelle nocturne",
      wiki: "Pontochō",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Pontocho.jpg/1024px-Pontocho.jpg"
      ],
      desc: [
        "Une ruelle pavée de 500 mètres, étroite à ne pas y passer à deux de front, qui longe la rive ouest de la rivière Kamo. Pontochō concentre quelques-uns des meilleurs restaurants traditionnels de Kyoto sur des terrasses en bois suspendues au-dessus de l'eau, appelées « yuka », ouvertes seulement en été.",
        "La ruelle est éclairée de lanternes rouges et conserve une atmosphère du Japon ancien. Du printemps à l'été, dîner sur une yuka pendant que la rivière coule en dessous est l'une des expériences les plus mémorables qu'offre Kyoto.",
        "Les prix varient énormément (¥3 000 à ¥30 000/pers). Plusieurs adresses sont accessibles à des budgets familiaux — il faut juste choisir avec soin. Réservation obligatoire pour les yuka en été."
      ],
      info: {
        address: "Pontochō-dōri, Nakagyō-ku, Kyoto",
        hours: "Restaurants 17h-23h (souvent 1 sitting)",
        price: "Dîner ¥3 000-10 000/pers",
        transport: "Métro Sanjō Keihan ou Kawaramachi, 5 min à pied"
      },
      tip: "Pour une yuka en été, réserver 1 mois à l'avance via le concierge du logement. Pour un budget modeste : Pontochō Robin (yakitori) ou Pontochō Saryō pour les desserts au matcha."
    },
    "owakudani": {
      title: "Vallée d'Ōwakudani",
      jp: "大涌谷",
      escale: "Hakone",
      meta: "Jour 1 — Matin",
      wiki: "Ōwakudani",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Owakudani.jpg/1024px-Owakudani.jpg"
      ],
      desc: [
        "Une vallée volcanique active formée il y a 3 000 ans lors de la dernière éruption du mont Hakone. Le sol exhale en permanence des fumerolles soufrées, l'air sent l'œuf pourri, et la végétation a abdiqué. Le téléphérique Hakone Ropeway survole cet enfer miniature à 130 mètres d'altitude — sensation unique.",
        "La spécialité du lieu : les œufs noirs « kuro-tamago », cuits dans les sources volcaniques. Leur coquille noircit au contact du soufre. Selon la légende, un œuf rallonge la vie de 7 ans. Vendus par sachets de cinq.",
        "Le téléphérique peut être suspendu en cas d'activité volcanique soudaine — vérifier le statut le matin même sur le site officiel. En cas de fermeture, des bus de remplacement font le trajet."
      ],
      info: {
        address: "1251 Sengokuhara, Hakone, préfecture de Kanagawa",
        hours: "Téléphérique 9h-16h15 (variable saison)",
        price: "Inclus dans le Hakone Free Pass",
        transport: "Hakone Tozan Cable Car puis Hakone Ropeway depuis Sōunzan"
      },
      tip: "Achetez les œufs noirs en arrivant (¥500 le sachet) avant la foule. Le point de vue sur le mont Fuji depuis la plateforme est l'un des meilleurs de tout Hakone — si le temps est dégagé."
    },
    "lake-ashi": {
      title: "Lac Ashi + Hakone-jinja",
      jp: "芦ノ湖・箱根神社",
      escale: "Hakone",
      meta: "Jour 1 — Après-midi",
      wiki: "Lac_Ashi",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Hakone_Shrine_torii.jpg/1024px-Hakone_Shrine_torii.jpg"
      ],
      desc: [
        "Le lac Ashi, formé dans la caldeira du mont Hakone il y a 3 000 ans, s'étend sur 7 km. Sa traversée se fait à bord d'un « bateau pirate » — des galions imitation XVIIIe siècle qui zigzaguent entre les ports de Tōgendai, Hakone-machi et Motohakone.",
        "À Motohakone, le torii Heiwa-no-torii (« portail de la paix ») se dresse sur les eaux, rouge vif contre les forêts vertes. C'est l'icône photographique du lac. Il marque l'entrée du sanctuaire Hakone-jinja, dont les pavillons s'étagent dans la forêt en arrière.",
        "Le sanctuaire est fondé au VIIIe siècle, dédié aux divinités protectrices des voyageurs. L'ascension des marches (env. 50) à travers les cryptomères centenaires est en soi une expérience apaisante. Vue sur le lac et, par temps clair, sur le mont Fuji depuis le « pavillon de la prière »."
      ],
      info: {
        address: "Motohakone-kōen, Hakone-machi, Ashigarashimo-gun, Kanagawa",
        hours: "Sanctuaire accessible 24h/24 · bureau du temple 8h-17h",
        price: "Sanctuaire gratuit · croisière incluse dans le Hakone Free Pass",
        transport: "Bateau pirate Tōgendai → Motohakone (30 min) ou bus depuis Hakone-Yumoto"
      },
      tip: "Pour la photo du torii flottant sans foule, y être à 7h30. La file d'attente commence dès 9h en haute saison. Combiner avec le déjeuner dans le village de Motohakone (soba traditionnels)."
    },
    "yunessun": {
      title: "Yunessun",
      jp: "ユネッサン",
      escale: "Hakone",
      meta: "Jour 1 — Soir",
      wiki: "Hakone_Kowakien_Yunessun",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hakone_Kowakien_Yunessun_03.jpg/1024px-Hakone_Kowakien_Yunessun_03.jpg"
      ],
      desc: [
        "Un parc aquatique-onsen unique au monde. La partie « Yunessun » est un complexe de bains thématiques en maillot : bain de café, bain de vin (avec une bouteille géante qui verse régulièrement du vrai vin dans la piscine), bain de thé vert, bain de saké, bain de café Coca-Cola pour les enfants, source de citrons.",
        "C'est totalement kitsch, totalement japonais, et un excellent compromis quand on voyage en famille mixte : les onsens traditionnels séparent hommes et femmes et imposent la nudité, ce qui peut gêner ou exclure les enfants. À Yunessun, tout le monde est ensemble, en maillot, et le bain devient un terrain de jeu.",
        "Le complexe a aussi une partie « Mori-no-yu » (bains traditionnels nus, séparés) pour ceux qui veulent l'expérience onsen authentique. Le pass combiné permet de faire les deux."
      ],
      info: {
        address: "1297 Ninotaira, Hakone, Kanagawa",
        hours: "10h-19h (Yunessun) · 11h-20h (Mori-no-yu)",
        price: "Yunessun ¥2 500 ad. · ¥1 400 enf. · Pass combiné ¥3 500",
        transport: "Bus depuis Hakone-Yumoto (15 min) ou 15 min à pied depuis Ninotaira"
      },
      tip: "Y aller en fin d'après-midi (16h-19h), juste avant la fermeture, pour éviter la foule familiale du midi. Apporter maillots et serviettes (sinon location ¥800)."
    },
    "open-air": {
      title: "Open-Air Museum",
      jp: "彫刻の森美術館",
      escale: "Hakone",
      meta: "Jour 2 — Optionnel",
      wiki: "Hakone_Open-Air_Museum",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Hakone_Open-Air_Museum_03.jpg/1024px-Hakone_Open-Air_Museum_03.jpg"
      ],
      desc: [
        "Premier musée d'art en plein air du Japon, ouvert en 1969. 70 000 m² de pelouses et de bois où sont disséminées 120 sculptures monumentales d'artistes du XXe siècle : Henry Moore, Carl Milles, Niki de Saint Phalle, et un pavillon Picasso de 300 œuvres uniques.",
        "Le clou pour les enfants : la « Symphonic Sculpture », une tour de vitraux de 18 mètres dans laquelle on monte par un escalier en colimaçon, et le « Woods of Net », immense filet d'escalade tissé à la main par Toshiko Horiuchi MacAdam — un labyrinthe coloré où les enfants peuvent grimper.",
        "Le musée propose aussi un bain de pieds chauds gratuit (avec serviette à acheter ¥100) — moment parfait pour décompresser après 2h de marche. La pelouse principale offre une vue dégagée sur la vallée."
      ],
      info: {
        address: "1121 Ninotaira, Hakone, Kanagawa",
        hours: "9h-17h (dernière entrée 16h30)",
        price: "¥2 000 ad. · ¥1 600 lycéen · ¥1 000 enf. (-10% Free Pass)",
        transport: "Train Hakone Tozan jusqu'à Chōkoku-no-Mori, 2 min à pied"
      },
      tip: "Au moins 2h de visite. Le café du musée a une terrasse face aux montagnes — pause idéale. À combiner avec la matinée du Round Course."
    },
    "cottage-relax": {
      title: "Détente au cottage",
      jp: "コテージでくつろぐ",
      escale: "Hakone",
      meta: "Jour 2 — Soir",
      wiki: null,
      wikiLang: "fr",
      photos: [],
      desc: [
        "Le cottage Hot Spring BBQ est privatif : 8 personnes, espace tatami, terrasse, BBQ en extérieur, et — luxe ultime — une source thermale en accès libre dans le jardin. C'est l'occasion de ralentir au milieu du voyage, après les sprints d'Osaka et Kyoto, avant l'intensité de Tokyo.",
        "Plan pour la soirée : courses au supermarché Lawson à Ninotaira (poissons crus, viande, légumes, bières Asahi), retour au cottage, BBQ sur la terrasse au crépuscule, puis bain thermal sous les étoiles. La température nocturne en montagne tombe à 22-24°C, c'est très agréable.",
        "Pour les enfants : la maison a un espace tatami suffisamment grand pour étaler des jeux. Pensez à apporter quelques cartes ou un jeu de société compact (UNO, Dobble) pour les soirées en groupe — c'est aussi l'occasion de vrais moments à deux familles."
      ],
      info: {
        address: "Ninotaira, Hakone, Kanagawa",
        hours: "Soirée libre",
        price: "BBQ ~¥3 000/pers (courses)",
        transport: "Sur place"
      },
      tip: "Le supermarché Lawson de Ninotaira ferme à 22h. Faites les courses avant 19h. Prévoyez quelques bières et yuzu-shu (liqueur de yuzu) pour les adultes — accord parfait avec le bain thermal."
    },
    "fuji-view": {
      title: "Vue Mont Fuji",
      jp: "富士山眺望",
      escale: "Hakone",
      meta: "Si beau temps",
      wiki: "Mont_Fuji",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lake_Ashi_and_Mt_Fuji.jpg/1024px-Lake_Ashi_and_Mt_Fuji.jpg"
      ],
      desc: [
        "Le mont Fuji culmine à 3 776 m. Depuis Hakone, par temps clair, il apparaît dans toute sa majesté symétrique au-dessus du lac Ashi. Mais « par temps clair » est un défi en août : la visibilité est en moyenne de 30-40 % en milieu de journée.",
        "Les meilleures fenêtres : le lever du soleil (5h30-7h00, ciel souvent dégagé), et plus rarement le coucher de soleil (18h30-19h30) quand un vent rabat les nuages. À 10h, les nuages sont presque toujours là.",
        "Trois points de vue privilégiés depuis Hakone : Ōwakudani (téléphérique), Motohakone (rive du lac avec le torii), et Hakone-Komagatake (téléphérique vers le mont Komagatake, 1 327 m, vue panoramique à 360°)."
      ],
      info: {
        address: "Visible depuis Ōwakudani, Motohakone, Komagatake",
        hours: "Visibilité optimale 5h30-9h",
        price: "Téléphérique Komagatake ¥1 800 A/R",
        transport: "Depuis Hakone Tozan + bus pour Komagatake"
      },
      tip: "Vérifiez la météo sur tenki.jp (site fiable). Le 5 août au matin, prévoyez un réveil 5h30 si le ciel s'annonce clair — c'est unique."
    },
    "pola-museum": {
      title: "Pola Museum of Art",
      jp: "ポーラ美術館",
      escale: "Hakone",
      meta: "Forêt + art",
      wiki: "Musée_d'Art_Pola",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pola_Museum_of_Art_Hakone.jpg/1024px-Pola_Museum_of_Art_Hakone.jpg"
      ],
      desc: [
        "Musée d'art inauguré en 2002, intégré dans la forêt de Sengokuhara pour minimiser son impact visuel — la moitié du bâtiment est enterrée. Architecture remarquable, prix d'architecture du Japon en 2003.",
        "La collection compte 10 000 œuvres, dont une concentration impressionnante d'impressionnistes et de post-impressionnistes français : Monet, Renoir, Van Gogh, Cézanne, Picasso. C'est la première collection de Renoir au Japon — 22 œuvres.",
        "Au-delà des galeries, un sentier de promenade (« Forest Path ») de 1 km dans la forêt environnante, ponctué de sculptures contemporaines. Atmosphère méditative, parfait contraste avec le Round Course de la veille."
      ],
      info: {
        address: "1285 Kozukayama, Sengokuhara, Hakone, Kanagawa",
        hours: "9h-17h (dernière entrée 16h30)",
        price: "¥2 200 ad. · ¥1 500 lycéen · gratuit -15 ans",
        transport: "Bus de Sengokuhara ou navette depuis Pola Museum-mae"
      },
      tip: "Café du musée avec terrasse forêt — déjeuner remarquable (~¥2 500/pers). Combinez avec le sentier Forest Path après visite."
    },
    "yumoto": {
      title: "Promenade Yumoto",
      jp: "湯本散策",
      escale: "Hakone",
      meta: "Vieille ville thermale",
      wiki: "Hakone-Yumoto",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Hakone_Yumoto%2C_Hakone_machi.jpg/1024px-Hakone_Yumoto%2C_Hakone_machi.jpg"
      ],
      desc: [
        "La plus ancienne ville thermale de Hakone, exploitée depuis l'an 757. Située à 96 m d'altitude au confluent de deux rivières, c'est la porte d'entrée historique du parc national. Beaucoup de groupes la traversent sans s'arrêter — c'est dommage.",
        "L'allée commerçante principale (« Hakone-Yumoto Shoten-gai ») est bordée de boutiques de produits régionaux : yuba, kamaboko (galettes de poisson), umeboshi, mochi grillés sur place. Plusieurs petits bains publics permettent de tremper les pieds gratuitement.",
        "À 10 minutes à pied de la gare, le temple Sōun-ji et son jardin japonais offrent un moment de calme. En soirée, plusieurs auberges accueillent les visiteurs de passage pour un « higaeri onsen » (bain à la journée, ¥1 500)."
      ],
      info: {
        address: "Yumoto, Hakone, Kanagawa",
        hours: "Boutiques 9h-18h",
        price: "Gratuit · onsen à la journée ¥1 200-2 000",
        transport: "Train Hakone Tozan jusqu'à Hakone-Yumoto"
      },
      tip: "À combiner avec votre arrivée ou départ de Hakone, plutôt qu'en jour dédié. Le omiyage local : kamaboko et yuba séché — produits du terroir uniques au Japon."
    },
    "round-course": {
      title: "Hakone Round Course",
      jp: "箱根周遊コース",
      escale: "Hakone",
      meta: "5 modes de transport",
      wiki: "Hakone",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hakone_Ropeway_in_Mt._Komagatake.JPG/1024px-Hakone_Ropeway_in_Mt._Komagatake.JPG"
      ],
      desc: [
        "Le Round Course est la grande boucle touristique de Hakone, combinant cinq moyens de transport qui sont eux-mêmes des attractions : train de montagne Hakone Tozan, funiculaire Cable Car, téléphérique Ropeway, bateau pirate sur le lac Ashi, et bus de retour vers Yumoto.",
        "Cette boucle est l'expérience emblématique de Hakone. Elle dure 6-7h en prenant son temps, avec arrêts à Ōwakudani et Motohakone. Le Hakone Free Pass inclut absolument tous les transports — pas de billet à acheter en chemin.",
        "Variations : faire la boucle dans le sens des aiguilles d'une montre (Sōunzan → Ōwakudani → Lac → Hakone-machi → Bus → Yumoto) est plus efficace en été (matin = monter au-dessus de la mer de nuages, après-midi = retour vers la chaleur)."
      ],
      info: {
        address: "Boucle depuis Hakone-Yumoto",
        hours: "9h-18h selon les transports",
        price: "Inclus dans Hakone Free Pass ¥6 100 ad. · ¥1 100 enf.",
        transport: "5 transports successifs"
      },
      tip: "Acheter le Free Pass à Odawara à l'arrivée. Vérifier le matin que le téléphérique fonctionne (parfois suspendu pour activité volcanique). Compter 1h sur place à Ōwakudani et 1h30 à Motohakone."
    },
    "sensoji": {
      title: "Sensō-ji (Asakusa)",
      jp: "浅草寺",
      escale: "Tokyo",
      meta: "Jour 1 — Après-midi",
      wiki: "Sensō-ji",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Senso-ji_at_night_2.jpg/1024px-Senso-ji_at_night_2.jpg"
      ],
      desc: [
        "Le plus ancien temple bouddhique de Tokyo, fondé en 645 selon la tradition. Sensō-ji est dédié à Kannon, déesse de la miséricorde, dont une statue dorée aurait été pêchée dans la rivière Sumida par deux frères pêcheurs.",
        "On y accède par la porte Kaminarimon (« porte du tonnerre »), reconnaissable à sa lanterne rouge géante de 700 kg et ses statues de divinités du vent et du tonnerre. Au-delà, l'allée Nakamise-dōri, longue de 250 m, aligne 90 boutiques qui vendent depuis l'ère Edo des objets traditionnels et des sucreries.",
        "Le pavillon principal du temple, reconstruit après les bombardements de 1945, abrite la salle de prière. À l'avant, le brûle-encens collectif (jōkōro) : la fumée passée sur le corps est censée soigner les maux. Devant, la pagode à cinq étages de 53 m, deuxième plus haute du Japon."
      ],
      info: {
        address: "2-3-1 Asakusa, Taitō-ku, Tokyo 111-0032",
        hours: "Temple 6h-17h · Nakamise 9h-19h",
        price: "Gratuit",
        transport: "Métro Ginza ou Asakusa Line à Asakusa, sortie 1"
      },
      tip: "Y aller tôt le matin (6h-8h) pour la sérénité, ou en soirée après 19h pour l'illumination + foule réduite. Le ningyo-yaki (gâteau-bonbon en forme animale) est à goûter chez Kimuraya, près du temple."
    },
    "harajuku": {
      title: "Harajuku",
      jp: "原宿",
      escale: "Tokyo",
      meta: "Jour 2 — Matin",
      wiki: "Harajuku",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Takeshita_Street.jpg/1024px-Takeshita_Street.jpg"
      ],
      desc: [
        "Le quartier de la jeunesse créative de Tokyo, épicentre de toutes les modes urbaines depuis les années 1980. Takeshita-dōri, rue piétonne de 400 m, est aux ados japonais ce qu'était Camden à Londres : friperies kawaii, crêperies à étages, boutiques de costumes Lolita, lieux de rendez-vous pour les youtubeurs locaux.",
        "À deux pas, le sanctuaire Meiji Jingū offre un contraste saisissant : 70 hectares de forêt en plein cœur de Tokyo, dédiés à l'empereur Meiji et à l'impératrice Shōken. C'est l'un des sanctuaires les plus visités du Japon pour les vœux du Nouvel An (3 millions de personnes en 3 jours).",
        "Pour les amateurs de design, l'avenue Omotesandō (à 5 min à pied) est une promenade architecturale unique : Prada par Herzog & de Meuron, Tod's par Toyo Ito, Dior par SANAA — la rue est un musée à ciel ouvert."
      ],
      info: {
        address: "Shibuya-ku, Tokyo",
        hours: "Boutiques 11h-20h · Meiji Jingū 6h-17h",
        price: "Gratuit",
        transport: "JR Yamanote ou métro Chiyoda à Harajuku ou Meiji-Jingumae"
      },
      tip: "Sur Takeshita, la crêperie Marion Crepes (depuis 1976) est une institution — gigantesque crêpe ¥600. Visitez Meiji Jingū avant 9h pour la sérénité."
    },
    "shibuya": {
      title: "Shibuya",
      jp: "渋谷",
      escale: "Tokyo",
      meta: "Jour 2 — Après-midi",
      wiki: "Shibuya",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Shibuya_Crossing.jpg/1024px-Shibuya_Crossing.jpg"
      ],
      desc: [
        "Shibuya Crossing — le « scramble » — est sans doute le passage piéton le plus célèbre du monde. À chaque feu vert, jusqu'à 3 000 personnes traversent simultanément dans toutes les directions. Le ballet est hypnotique, particulièrement la nuit sous les écrans géants.",
        "À la sortie nord de la gare, la statue du chien Hachikō : labrador akita qui attendit son maître à la gare chaque jour pendant 9 ans après sa mort. Symbole national de fidélité, point de rendez-vous le plus connu de Tokyo.",
        "Shibuya Sky, observatoire à ciel ouvert au 47e étage du Shibuya Scramble Square (229 m), offre la meilleure vue panoramique de Tokyo. Le plancher en verre est vertigineux. Au coucher du soleil, c'est un moment magique — réservation obligatoire."
      ],
      info: {
        address: "Shibuya-ku, Tokyo",
        hours: "Crossing 24h · Shibuya Sky 10h-22h30",
        price: "Crossing gratuit · Shibuya Sky ¥2 500 ad. · ¥1 600 enf.",
        transport: "JR Yamanote à Shibuya Station"
      },
      tip: "Pour la photo iconique du Crossing : 8e étage du Magnet by Shibuya 109 (rooftop, ¥1 000 entrée). Réservez Shibuya Sky pour le créneau 18h30-19h00 en été pour le coucher de soleil."
    },
    "kawaguchiko": {
      title: "Mont Fuji + Kawaguchiko",
      jp: "富士山・河口湖",
      escale: "Tokyo",
      meta: "Jour 3 — Day trip",
      wiki: "Lac_Kawaguchi",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mt._Fuji_from_Lake_Kawaguchi.jpg/1024px-Mt._Fuji_from_Lake_Kawaguchi.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chureito_Pagoda_and_Mount_Fuji_in_April_2018.jpg/1024px-Chureito_Pagoda_and_Mount_Fuji_in_April_2018.jpg"
      ],
      desc: [
        "Day trip depuis Tokyo pour voir le mont Fuji en grand. Kawaguchiko, à 1h45 de Shinjuku en Highway Bus, est l'un des cinq lacs Fuji et offre la meilleure vue panoramique sur la face nord de la montagne (3 776 m).",
        "Le matin est crucial : en août, le Fuji n'est visible que ~30% du temps à midi mais près de 80% avant 9h. <strong>Premier bus 5h30 depuis Busta Shinjuku obligatoire</strong> pour maximiser ses chances. Réservation J-30 sur <a href='https://highway-buses.jp/' target='_blank'>highway-buses.jp</a>.",
        "Programme idéal : 8h00 — pagode <strong>Chūreitō</strong> (Arakurayama Sengen Park, 10 min à pied depuis Shimoyoshida Station, 400 marches), photo iconique Fuji + pagode rouge à 5 étages. Puis tour du lac à vélo (~17 km, plat), téléphérique Mt. Tenjō (¥1 000), ou Oshino Hakkai (8 sources sacrées). Déjeuner Hōtō (nouilles miso locales) chez Kosaku."
      ],
      info: {
        address: "Fujikawaguchiko, préfecture de Yamanashi",
        hours: "Sites variés 9h-17h · téléphérique 9h-17h",
        price: "Bus Shinjuku ¥4 400 A/R · Téléphérique ¥1 000 · Vélos ~¥1 500/jour",
        transport: "Highway Bus 5h30 depuis Busta Shinjuku (4e étage)"
      },
      tip: "Premier bus de 5h30 IMPÉRATIF en été. Réservation J-30 sur highway-buses.jp. Chūreitō avant 10h pour la lumière idéale (l'après-midi, les nuages enveloppent le sommet). Apporter chapeau, eau, chaussures confortables pour les marches."
    },
    "kamakura": {
      title: "Kamakura",
      jp: "鎌倉",
      escale: "Tokyo",
      meta: "Jour 4 — Day trip",
      wiki: "Kamakura",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kamakura-Budda-Statue-02.jpg/1024px-Kamakura-Budda-Statue-02.jpg"
      ],
      desc: [
        "Capitale du Japon de 1185 à 1333, Kamakura est la ville des temples bouddhistes et des plages — à 1h de Tokyo. Le climat océanique en fait une bouffée d'air après la fournaise urbaine.",
        "Le Daibutsu de Kōtoku-in : statue de bronze de Bouddha Amitabha haute de 13,35 m, fondue en 1252. Initialement abritée dans un grand hall, le bâtiment a été emporté par un tsunami en 1495 — depuis, le Bouddha contemple la mer à ciel ouvert. On peut entrer dans la statue pour ¥50.",
        "À combiner : Hase-dera et sa statue de Kannon en bois doré (9,18 m, l'une des plus grandes du Japon), la rue commerçante Komachi-dōri (street food et boutiques de poterie), et la plage de Yuigahama pour un bain rapide si le temps le permet."
      ],
      info: {
        address: "Kamakura, préfecture de Kanagawa",
        hours: "Temples 8h-17h · Daibutsu 8h-17h30 (en été)",
        price: "Daibutsu ¥300 · Hase-dera ¥400 · Pass Enoshima-Kamakura ¥800/jour",
        transport: "JR Yokosuka Line depuis Tokyo Station (1h)"
      },
      tip: "Acheter le Kamakura-Enoshima Pass à Tokyo Station (incluant l'Enoden, tramway pittoresque qui relie tous les sites). Y aller un mardi ou mercredi, beaucoup plus calme que le week-end."
    },
    "teamlab": {
      title: "TeamLab Planets",
      jp: "チームラボプラネッツ",
      escale: "Tokyo",
      meta: "Jour 5 — Matin",
      wiki: "TeamLab",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/TeamLab_Borderless%2C_Tokyo.jpg/1024px-TeamLab_Borderless%2C_Tokyo.jpg"
      ],
      desc: [
        "Installation d'art immersif du collectif TeamLab, ouverte en 2018 à Toyosu. Une expérience sensorielle où les visiteurs marchent pieds nus dans l'eau, à travers des projections évoluant en temps réel, des miroirs infinis, et des jardins de fleurs flottants.",
        "Sept espaces distincts mêlant lumière, son, eau et plantes vivantes. Le clou : la « Floating Flower Garden » où 13 000 vraies orchidées descendent et remontent autour des visiteurs, créant des espaces différents à chaque seconde.",
        "À la différence d'autres musées numériques, ici on EST DANS l'œuvre. Pour les enfants, c'est une expérience inoubliable. Pour les adultes, une réflexion sur l'art numérique et le rapport au corps. Comptez 1h30-2h sur place."
      ],
      info: {
        address: "6-1-16 Toyosu, Kōtō-ku, Tokyo",
        hours: "9h-22h (dernière entrée 21h)",
        price: "¥3 800 ad. · ¥1 500 enf. · timed entry",
        transport: "Yurikamome jusqu'à Shin-Toyosu Station, 1 min à pied"
      },
      tip: "Critique : créneaux d'entrée timés, réservation obligatoire J-30 sur teamlab.art. Apporter un short ou un pantalon qu'on peut rouler (eau au-dessus de la cheville). Casiers gratuits sur place."
    },
    "akihabara": {
      title: "Akihabara",
      jp: "秋葉原",
      escale: "Tokyo",
      meta: "Geek paradise",
      wiki: "Akihabara",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Akihabara_201803.jpg/1024px-Akihabara_201803.jpg"
      ],
      desc: [
        "« La ville électrique ». À l'origine quartier de pièces détachées électroniques dans le Tokyo de l'après-guerre, Akihabara est devenu depuis les années 2000 le centre mondial de la culture otaku : manga, animé, jeux vidéo, idoles, figurines, jeux d'arcade.",
        "Les boutiques se déclinent par strates : Mandarake (la mecque du manga d'occasion, 8 étages), Yodobashi Camera (électronique géant), Super Potato (jeux vidéo rétro, du Famicom à la PlayStation 2), Don Quijote (le bazar tokyoïte), et des dizaines de game centers où l'on peut jouer aux derniers arcade games japonais.",
        "Les enfants adoreront les game centers (¥100 la partie de Mario Kart à plusieurs, ¥200 pour des Drum Mania), les capsule machines (gachapon) et les rues éclairées en LED toute la nuit."
      ],
      info: {
        address: "Sotokanda, Chiyoda-ku, Tokyo",
        hours: "Boutiques 10h-21h · game centers jusqu'à 23h-1h",
        price: "Gratuit · arcades ¥100-300 la partie",
        transport: "JR Yamanote à Akihabara Station, sortie Electric Town"
      },
      tip: "Visite idéale en fin d'après-midi pour profiter de l'illumination en soirée. Animal café (chats, chouettes, hérissons) pour une pause originale. Le maid café est facultatif et ostensiblement touristique."
    },
    "ginza": {
      title: "Ginza",
      jp: "銀座",
      escale: "Tokyo",
      meta: "Luxe et design",
      wiki: "Ginza",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ginza_at_night.jpg/1024px-Ginza_at_night.jpg"
      ],
      desc: [
        "Le quartier le plus chic de Tokyo, équivalent du Faubourg-Saint-Honoré à Paris. Les flagship stores des grandes marques internationales sont concentrés sur Chūō-dōri, mais ce qui fait l'âme de Ginza, ce sont aussi ses petites galeries d'art, ses pâtisseries-théâtres (sur 8 étages chez Henri Charpentier), et ses bars feutrés.",
        "Le week-end, la rue principale devient piétonne (« Hokōsha Tengoku ») entre 12h et 18h. Atmosphère bien plus détendue qu'on imagine.",
        "Pour la culture : le théâtre Kabuki-za, monument national depuis 1889, propose des spectacles tous les jours, et même des « single act » (un seul acte, ~1h, ¥1 500-2 500) accessibles aux non-initiés. Une introduction parfaite au kabuki pour des enfants curieux."
      ],
      info: {
        address: "Chūō-ku, Tokyo",
        hours: "Boutiques 11h-20h · Hokōsha Tengoku week-end 12h-18h",
        price: "Gratuit · Kabuki-za acte unique ¥1 500-2 500",
        transport: "Métro Ginza direct (Marunouchi/Hibiya/Ginza lines)"
      },
      tip: "Le toit de la boutique Mitsukoshi (10e étage) a un magnifique jardin avec vue sur le quartier. Café Paul Bassett pour une pause espresso. Itoya, papeterie sur 12 étages, est un délice pour les amateurs."
    },
    "tsukiji-toyosu": {
      title: "Tsukiji / Toyosu",
      jp: "築地・豊洲",
      escale: "Tokyo",
      meta: "Marchés aux poissons",
      wiki: "Marché_de_Toyosu",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Toyosu_Fish_Market_Auction.jpg/1024px-Toyosu_Fish_Market_Auction.jpg"
      ],
      desc: [
        "Le légendaire marché aux poissons de Tsukiji a déménagé en octobre 2018 vers Toyosu — un complexe moderne et plus hygiénique, mais qui a perdu un peu de son âme. La partie « marché professionnel » est désormais à Toyosu, le « marché extérieur » (Tsukiji Outer Market) demeure au centre de Tokyo et reste un délice pour les visiteurs.",
        "À Toyosu : la galerie d'observation surplombe les ventes aux enchères de thon (5h30-6h30 du matin) — gratuit, mais en hauteur, derrière une vitre, ambiance feutrée. Le restaurant Sushidai sert un petit-déjeuner sushi mythique à 7h (file d'attente assumée).",
        "À Tsukiji : 400 petites boutiques de produits de la mer, sushi de comptoir, brochettes de wagyu grillées, ustensiles de cuisine. Beaucoup plus accessible et chaleureux que Toyosu, ouvert dès 5h du matin pour les vendeurs et 8h pour les visiteurs."
      ],
      info: {
        address: "Toyosu : 6-6-2 Toyosu, Kōtō-ku · Tsukiji : 4-chōme Tsukiji, Chūō-ku",
        hours: "Toyosu 5h-15h (fermé dim.) · Tsukiji 6h-14h (fermé dim. et certains mer.)",
        price: "Gratuit · sushi ¥3 500-8 000/pers",
        transport: "Toyosu : Yurikamome · Tsukiji : Métro Hibiya à Tsukiji"
      },
      tip: "Pour la visite : Tsukiji vers 9h pour l'ambiance + sushi, ou Toyosu à 5h45 pour les enchères de thon (réservation gratuite obligatoire J-30 sur le site officiel)."
    },
    "ueno": {
      title: "Ueno",
      jp: "上野",
      escale: "Tokyo",
      meta: "Parc + musées",
      wiki: "Ueno",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ueno_Park_in_2014.jpg/1024px-Ueno_Park_in_2014.jpg"
      ],
      desc: [
        "Parc principal du nord-est de Tokyo (133 hectares), Ueno est une concentration unique d'institutions culturelles. Cinq musées de classe mondiale dans un rayon de 500 m : le Musée national de Tokyo (le plus grand musée d'art du Japon), le Musée national de la Nature et des Sciences, le Musée d'art national occidental (Le Corbusier, classé UNESCO), le Musée Mori et le Musée de Shitamachi.",
        "Le parc lui-même est un lieu de vie : étang Shinobazu couvert de lotus en été, sanctuaire Tōshō-gū dédié à Tokugawa Ieyasu, temple Bentendō sur une île, zoo (le plus ancien du Japon, populaire pour ses pandas), et l'arrière-cour bourdonnante des familles tokyoïtes le week-end.",
        "L'allée Ameyoko qui longe la voie ferrée mène à un marché en plein air aux accents asiatiques (vente de fruits, fruits de mer, vêtements, cosmétiques à bas prix). Très différent de l'image classique de Tokyo."
      ],
      info: {
        address: "Uenokōen, Taitō-ku, Tokyo",
        hours: "Parc 5h-23h · musées 9h30-17h (variable)",
        price: "Parc gratuit · musées ¥600-1 000",
        transport: "JR Yamanote à Ueno Station, sortie Park"
      },
      tip: "Le Musée national de Tokyo nécessite au moins 2-3h. Pour les enfants, le Musée des Sciences est passionnant (planétarium en bonus). Combiner Ueno + Asakusa dans la même journée."
    },
    "skytree": {
      title: "Tokyo Skytree",
      jp: "東京スカイツリー",
      escale: "Tokyo",
      meta: "634 m",
      wiki: "Tokyo_Skytree",
      wikiLang: "fr",
      photos: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Tokyo_Sky_Tree_2014_III.JPG/1024px-Tokyo_Sky_Tree_2014_III.JPG"
      ],
      desc: [
        "Inaugurée en 2012, la Tokyo Skytree est la plus haute tour autoportante du monde (634 m), et la deuxième plus haute structure après le Burj Khalifa. Le nombre 634 a été choisi car il se lit « mu-sa-shi » en japonais — l'ancien nom de la province de Tokyo.",
        "Deux observatoires : le Tembo Deck à 350 m (avec plancher en verre) et le Tembo Galleria à 450 m (parcours en spirale ascendant avec vue à 360°). Par temps clair, on voit le mont Fuji à 100 km au sud-ouest.",
        "Au pied de la tour, le complexe Solamachi : 300 boutiques, l'aquarium Sumida (très bon pour les enfants, pingouins et phoques), et un planétarium. C'est un quartier en soi."
      ],
      info: {
        address: "1-1-2 Oshiage, Sumida-ku, Tokyo",
        hours: "10h-21h (dernière entrée 20h)",
        price: "Tembo Deck ¥2 100 ad. · combo Tembo Deck+Galleria ¥3 100",
        transport: "Métro Hanzōmon à Oshiage (Skytree) Station"
      },
      tip: "Réserver en ligne 30 min en amont permet d'éviter la file. Lever du soleil (rare ouverture) ou coucher du soleil = magique. Pour les vues, préférer la Tokyo Tower (classique) pour les couleurs, et le Skytree pour la hauteur pure."
    },
    "karaoke": {
      title: "Karaoké à Shinjuku",
      jp: "新宿でカラオケ",
      escale: "Tokyo",
      meta: "Dernière soirée",
      wiki: "Karaoké",
      wikiLang: "fr",
      photos: [],
      desc: [
        "Le karaoké est né au Japon en 1971. Aujourd'hui le pays compte 9 000 « karaoke box » — salles privatives où l'on chante en famille ou entre amis, sans aucun jugement extérieur. Le concept est très différent du karaoké de bar occidental : ici, c'est intime, festif, et fait partie du quotidien des Japonais.",
        "Dans Shinjuku, plusieurs chaînes pour 2 familles à 8 personnes : Big Echo (8 étages près de la gare), Karaoke Kan (immortalisé par Lost in Translation), ou Joysound (avec hologrammes 3D pour les amateurs de spectacle). 2 heures, ~¥1 500/personne tout compris.",
        "Le catalogue contient plus de 200 000 chansons en japonais, anglais, français — vraiment toutes les langues. Possibilité de commander à manger et à boire dans la salle. Pour clore le voyage en beauté avec une vraie expérience japonaise vue de l'intérieur."
      ],
      info: {
        address: "Multiples adresses, Shinjuku, Tokyo",
        hours: "11h-5h en général (24h dans certaines chaînes)",
        price: "~¥1 500/pers pour 2h",
        transport: "JR Yamanote à Shinjuku, sortie est"
      },
      tip: "Réservation conseillée le week-end. Big Echo Shinjuku Higashiguchi pour 8 personnes : salle confortable avec banquette. Demander la « free drink option » (~¥800 supplémentaires) pour boissons illimitées."
    }
  };

  // Activity IDs in document order (matches order of <article class="attraction">)
  const IDS_ORDER = [
    "dotonbori", "osaka-castle", "umeda-sky", "usj", "hiroshima-miyajima",
    "kuromon", "shinsekai", "sumiyoshi", "osaka-food",
    "kiyomizu", "gion", "arashiyama-bamboo", "tenryuji", "fushimi-inari", "nara",
    "kinkakuji", "nishiki", "nanzenji", "pontocho",
    "owakudani", "lake-ashi", "yunessun", "open-air", "cottage-relax",
    "fuji-view", "pola-museum", "yumoto", "round-course",
    "sensoji", "harajuku", "shibuya", "kawaguchiko", "kamakura", "teamlab",
    "akihabara", "ginza", "tsukiji-toyosu", "ueno", "skytree", "karaoke"
  ];

  // -------- Modal rendering --------
  function render(act, tag) {
    const isPrevue = tag === 'Prévu';
    const tagClass = isPrevue ? '' : ' suggere';
    const tagLabel = isPrevue ? 'Prévu au programme' : 'Suggestion';

    return `
      <div class="act-hero">
        <span class="act-hero-tag${tagClass}">${tagLabel}</span>
        <img id="actHeroImg" alt="${act.title}" style="opacity:0;transition:opacity .4s;">
        <div class="act-hero-fallback" id="actHeroFallback">${act.jp || act.title}</div>
      </div>
      <div class="act-body">
        <h2 class="act-title">${act.title}</h2>
        <div class="act-jp">${act.jp || ''}</div>
        <div class="act-meta-row">
          <span class="act-meta-pill">${act.escale}</span>
          <span class="act-meta-pill">${act.meta}</span>
        </div>
        <div class="act-desc">
          ${act.desc.map(p => `<p>${p}</p>`).join('')}
        </div>
        <div class="act-info-grid">
          <div class="act-info-item"><div class="label">Adresse</div><div class="value">${act.info.address}</div></div>
          <div class="act-info-item"><div class="label">Horaires</div><div class="value">${act.info.hours}</div></div>
          <div class="act-info-item"><div class="label">Tarif</div><div class="value">${act.info.price}</div></div>
          <div class="act-info-item"><div class="label">Comment y aller</div><div class="value">${act.info.transport}</div></div>
        </div>
        <div class="act-tip"><strong>💡 Notre conseil</strong>${act.tip}</div>
        <h3 id="actGalleryTitle" style="display:none;font-family:'DM Serif Display',serif;font-size:1.15rem;margin:1.5rem 0 0.6rem;">Aperçus</h3>
        <div class="act-gallery" id="actGallery"></div>
        <div class="act-credit" id="actCredit">${act.wiki ? `Photos : Wikimedia Commons (CC). Plus d'infos sur <a href="https://${act.wikiLang || 'fr'}.wikipedia.org/wiki/${encodeURIComponent(act.wiki)}" target="_blank" rel="noopener">Wikipédia</a>.` : ''}</div>
      </div>
    `;
  }

  // Set hero img with fade-in
  function setHero(src) {
    const heroImg = document.getElementById('actHeroImg');
    const fallback = document.getElementById('actHeroFallback');
    if (!heroImg) return;
    heroImg.onload = () => {
      heroImg.style.opacity = '1';
      if (fallback) fallback.style.display = 'none';
    };
    heroImg.onerror = () => { heroImg.style.opacity = '0'; };
    heroImg.src = src;
  }

  // Fetch hero + gallery via Wikipedia REST API (reliable, no broken links)
  async function fetchMedia(act) {
    if (!act.wiki) return;
    const lang = act.wikiLang || 'fr';
    const wiki = encodeURIComponent(act.wiki);

    // 1) Hero from summary endpoint
    try {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${wiki}`);
      if (res.ok) {
        const data = await res.json();
        const heroSrc = data.originalimage?.source || data.thumbnail?.source;
        if (heroSrc) setHero(heroSrc);
      }
    } catch (e) { /* silent */ }

    // 2) Gallery from media-list endpoint
    try {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${wiki}`);
      if (!res.ok) return;
      const data = await res.json();
      const items = (data.items || [])
        .filter(it => it.type === 'image' && it.showInGallery !== false && it.srcset && it.srcset.length)
        .slice(0, 6);
      if (!items.length) return;

      const container = document.getElementById('actGallery');
      const title = document.getElementById('actGalleryTitle');
      if (!container) return;

      const urls = items.map(it => {
        // srcset is array sorted by scale ascending; pick the largest
        const last = it.srcset[it.srcset.length - 1].src;
        return last.startsWith('//') ? 'https:' + last : last;
      });

      // Show only the first 4 (we already have a hero)
      const shown = urls.slice(0, 4);
      container.innerHTML = shown.map((src, i) =>
        `<img src="${src}" alt="${act.title} (photo ${i+1})" loading="lazy" onclick="window.open('${src}','_blank')">`
      ).join('');
      if (title) title.style.display = 'block';
    } catch (e) { /* silent */ }
  }

  // -------- Init --------
  function initActivityFiches() {
    const articles = document.querySelectorAll('article.attraction');
    if (!articles.length) return;

    // Assign IDs based on order
    articles.forEach((art, idx) => {
      if (idx < IDS_ORDER.length) {
        const aid = IDS_ORDER[idx];
        if (ACTIVITIES[aid]) {
          art.dataset.activityId = aid;
          art.tabIndex = 0;
          art.setAttribute('role', 'button');
          art.setAttribute('aria-label', `Ouvrir la fiche : ${ACTIVITIES[aid].title}`);
        }
      }
    });

    // Build modal element
    const modal = document.createElement('div');
    modal.className = 'act-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="act-modal-overlay"></div>
      <div class="act-modal-content">
        <button class="act-modal-close" aria-label="Fermer">×</button>
        <div id="actModalBody"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const overlay = modal.querySelector('.act-modal-overlay');
    const closeBtn = modal.querySelector('.act-modal-close');
    const body = modal.querySelector('#actModalBody');

    const open = (aid, tag) => {
      const act = ACTIVITIES[aid];
      if (!act) return;
      body.innerHTML = render(act, tag);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      fetchMedia(act);
      // Scroll modal content to top
      modal.querySelector('.act-modal-content').scrollTop = 0;
    };

    const close = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // Click handlers on articles
    articles.forEach(art => {
      const aid = art.dataset.activityId;
      if (!aid) return;
      const tag = art.querySelector('.attraction-tag')?.textContent?.trim() || 'Prévu';
      const handler = () => open(aid, tag);
      art.addEventListener('click', handler);
      art.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActivityFiches);
  } else {
    initActivityFiches();
  }
})();
