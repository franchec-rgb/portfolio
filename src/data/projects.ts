export interface Project {
  id: string
  slug: string
  title: string
  client: string
  year: string
  tags: string[]
  coverImage: string
  coverVideo?: string
  images: (string | string[])[]
  description: string
  longDescription: string
  nextProject: string
}

export const projects: Project[] = [
  {
    id: '01',
    slug: 'nike-x-yu-gi-oh',
    title: 'NIKE X YU-GI-OH!',
    client: '.SWOOSH',
    year: '2025',
    tags: ['3D Design', 'Game Design', 'Web3'],
    coverImage: '/images/01-yu-gi-oh-cover.jpg',
    images: [
      '/images/yugioh-project-shot-2.jpg',
      '/videos/01-muscle-exp-study-1-L.mp4',
      '/images/yugioh-project-shot-4.jpg',
      ['/videos/01-muscle-exp-study-6-L_1.mp4', '/images/yugioh-project-shot-6.jpg'],
    ],
    description: 'An immersive campaign experience bringing the Nike x Yu-Gi-Oh! collection to life.',
    longDescription: 'We designed an immersive campaign experience to bring the Nike x Yu-Gi-Oh! collection to life, highlighting each piece while celebrating the legacy behind it.\n\nThe journey began inside a playing card, where users explored the hero product—the Nike Air Max 95 QS YGO \'Joey.\' From there, the experience transported users through the card to discover the rest of the collection, styled on a Yu-Gi-Oh!-inspired character.\n\nTo extend the activation beyond digital, we also created a 3D billboard that amplified the campaign\'s impact in the physical world.',
    nextProject: '02',
  },
  {
    id: '02',
    slug: 'snkrs-reserve',
    title: 'SNKRS Reserve',
    client: 'SNKRS',
    year: '2025',
    tags: ['Product Design', '3D', 'Interactive'],
    coverImage: '/images/02-reserve-cover.jpg',
    coverVideo: '/videos/02-reserve-cover.mp4',
    images: [
      '/videos/02-reserve-shot-1.mp4',
      '/images/02-reserve-shot-2.jpg',
      '/images/02-reserve-shot-3.jpg',
      '/images/02-reserve-shot-4.jpg',
    ],
    description: 'After scaling pre-order to SNKRS as the Reserve program, we turned our focus to brand identity, building meaningful connections between brand design and the in-app experience.',
    longDescription: 'After scaling pre-order to SNKRS as the Reserve program, we turned our focus to brand identity, building meaningful connections between brand design and the in-app experience. The new branding brings a sense of exclusivity and premium feel to the feature, with a visual system flexible enough to support broader Nike brand activations.',
    nextProject: '03',
  },
  {
    id: '03',
    slug: 'nike-adventure',
    title: 'NIKE ADVENTURE',
    client: '.SWOOSH',
    year: '2025',
    tags: ['Design System', 'Product Design', 'Art Direction'],
    coverImage: '/images/03-adventure-cover.jpg',
    coverVideo: '/videos/03-adventure-cover.mp4',
    images: [
      '/videos/03-adventure-splash.mp4',
      '/videos/03-adventure-intro.mp4',
      '/videos/03-adventure-exp-study.mp4',
      '/images/project-03-2.jpg',
      ['/images/03-adventure-vertical-1.jpg', '/images/03-adventure-vertical-2.jpg'],
    ],
    description: 'A comprehensive digital identity system for Nike\'s emerging platforms.',
    longDescription: 'Following the successful campaign of the Nike Air Max 1 Low Poly, .SWOOSH launched the final chapter of Max\'s Lab by reopening its doors for one last quest: unlock \'Adventure.\' Inspired by early 2000s low-poly adventure games, we created a hidden room in the lab. To access \'Adventure,\' the community completed a mysterious quest, uncovering easter eggs along the way that teased future .SWOOSH releases.\n\nUpon completing the quest, users gained exclusive access to the Nike Air Max 1 Low Poly \'Adventure.\' This moment deepened community connection while bridging gameplay with product access in a meaningful way.',
    nextProject: '04',
  },
  {
    id: '04',
    slug: 'nike-x-ea-sports-fc',
    title: 'Nike x EA SPORTS FC',
    client: '.SWOOSH',
    year: '2024',
    tags: ['Experiential', 'Art Direction', '3D'],
    coverImage: '/images/04-eafc-cover.jpg',
    images: [
      '/images/04-eafc-shot-2.jpg',
      '/images/04-eafc-shot-3.jpg',
      '/videos/04-eafc-shot-4.mp4',
    ],
    description: 'In partnership with EA SPORTS FC, we built a destination on .SWOOSH connecting users to every Nike initiative inside the game.',
    longDescription: 'In partnership with EA SPORTS FC, we built a destination on .SWOOSH connecting users to every Nike initiative inside the game. Game updates, exclusive product access, and the latest Nike-designed kits, all in one place. Users could step inside those kits with an immersive in-game try-on experience.\n\nIt was a new expression of Nike at the intersection of sport, gaming, and style, meeting the next generation of fans where they already live.',
    nextProject: '05',
  },
  {
    id: '05',
    slug: 'nike-am1-low-poly',
    title: 'Nike AM1 Low Poly',
    client: '.SWOOSH',
    year: '2024',
    tags: ['Web3', '3D Design', 'Product Design'],
    coverImage: '/images/05-maxs-lab-cover.jpg',
    coverVideo: '/videos/05-maxs-lab-project-thumb.mp4',
    images: [
      '/images/05-maxs-lab-cover.jpg',
      '/images/05-max-project-shot-2.jpg',
      ['/images/05-adventure-leak-desk.jpg', '/images/05-maxslab-h.jpg'],
      '/images/05-maxslab-i.jpg',
      '/videos/05-max-lab-shot-7.mp4',
    ],
    description: 'A retro-gaming-inspired campaign for Nike AM1 Low Poly—Nike\'s first scaled pre-order experience, blending storytelling, commerce, and lore around Max.',
    longDescription: 'To launch the Nike AM1 Low Poly, we created Nike\'s first scaled pre-order experience—brought to life through a retro-gaming-inspired campaign designed to blur the line between reality and illusion. Every touchpoint engaged the audience in a world that merged digital storytelling with commerce in a fresh, interactive way.\n\nAt the center of the campaign was Max, a cheeky character that was first introduced in 1996 by Nike to explain its new Max Air cushioning. Nike rarely explores the origin stories behind its characters, which gave us a unique opportunity to build lore around Max and create brand equity for a new generation. The Lab was designed to be modular and repeatable, the campaign also set the stage for future colorway activations within the .SWOOSH platform.',
    nextProject: '06',
  },
  {
    id: '06',
    slug: 'nike-404-error',
    title: 'Nike 404 Error',
    client: '.SWOOSH',
    year: '2024',
    tags: ['Design Direction', 'Futures', 'Brand'],
    coverImage: '/images/06-404-cover.jpg',
    images: [
      '/videos/06-glitch-project-shot-1_1.mp4',
      '/images/06-glitch-project-shot-2.jpg',
      '/videos/06-404-project-sprites.mp4',
    ],
    description: 'Glitch Galaxy—an 8-bit-inspired game for .SWOOSH members to race to 404 points and unlock the Nike Air Force 1 "404 Error."',
    longDescription: 'To connect with our growing audience of sneaker-obsessed gamers, we created Glitch Galaxy, a game inspired by classic 8-bit video games. Players controlled a robot, collecting virtual shoes to earn points. The goal was to reach 404 points as quickly as possible, with the fastest players unlocking exclusive access to the Nike Air Force 1 \'404 Error.\'\n\nThe experience was designed to reward loyal .SWOOSH members while reducing bot interference. Customer response was overwhelmingly positive, with many calling it a fairer, more exciting way to access exclusive drops. The product sold out, proving both the demand and the impact of this gamified approach.',
    nextProject: '07',
  },
  {
    id: '07',
    slug: 'apple-watch-studio',
    title: 'APPLE WATCH STUDIO',
    client: 'Apple',
    year: '2022',
    tags: ['Metaverse', '3D', 'Experiential'],
    coverImage: '/images/07-watch-studio-cover.jpg',
    images: [
      '/videos/07-aws-exp-study-2-L_1.mp4',
      '/images/07-aws-project-shot-1.jpg',
      '/images/07-aws-project-shot-2.jpg',
    ],
    description: 'A customization journey that combines inspiration with utility so customers can build the Apple Watch that fits their needs.',
    longDescription: 'Apple wanted to give customers the flexibility to customize and style their Apple Watches exactly how they wanted. To support that vision, we created an experience that empowers users to build the watch that fits their needs—combining inspiration with utility throughout the journey.\n\nAs a result, 74% of all Apple Watch purchases post-launch were initiated through the Apple Watch Studio. This experience not only met the demand for personalization but also redefined how customers explore and purchase wearable technology.',
    nextProject: '01',
  },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id || p.slug === id)
}

export function getNextProject(nextId: string): Project | undefined {
  return projects.find((p) => p.id === nextId)
}
