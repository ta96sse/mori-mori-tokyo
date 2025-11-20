// Mori-Mori TOKYO - Modern App Script

const Data = {
  members: [
    { role: 'Captain', name: 'Takuro', desc: '真剣にごっこしてます。', background: 'Kayaking, Lacrosse', instagram: 'https://www.instagram.com/takuroad_jp/' },
    { role: 'Vice Captain', name: 'Hiroki', desc: '寝なくても平気。', background: 'Go, Bamboo Craft' },
    { role: 'Front Runner', name: 'Tatsuki', desc: 'チーム唯一のサブ3.5ランナー。', background: 'Water Polo, Lacrosse' },
    { role: 'Next-Gen Bridge', name: 'Tomoki', desc: '我が子もモリモリ育て〜。', background: 'Magic, Guitar' },
    { role: 'Rover', name: 'Taku', desc: '誘われたらなんでもやります。', background: 'Football, Grill Master' },
    { role: 'Spirit Creator', name: 'Mayuki', desc: 'チームマスコット「モリくん」の生みの親。', background: 'Volleyball, Calligraphy' }
  ],
  aboutPoints: [
    { title: 'レース参戦', text: 'みんなで目標を決めて、アドベンチャーレースやトレイルランニングのレースなどに積極的に参加しています。' },
    { title: '謝謝ラン', text: '月に一度、主に皇居でランニングイベントを開催しています。興味のある方はまずはここから参加してみてください！' },
    { title: 'その他イベント', text: 'レース後の打ち上げや飲み会、レースに向けた練習会など、様々な活動を企画しています。' }
  ],
  races: [
    { date: '2025/03/16', title: 'さいたまマラソン', url: 'https://saitama-marathon.jp/', category: 'Marathon', region: 'Saitama' },
    { date: '2025/03/30', title: 'ハセツネ30K', url: 'https://www.hasetsune.jp/30K/about.html', category: 'Trail', region: 'Tokyo' },
    { date: '2025/04/12', title: 'エクストリームシリーズ 那珂川', url: 'https://www.a-extremo.com/event/extreme/round01/', category: 'Adventure', region: 'Tochigi' },
    { date: '2025/05/10', title: 'エクストリームシリーズ 奥多摩', url: 'https://www.a-extremo.com/event/extreme/round02/', category: 'Adventure', region: 'Tokyo' },
    { date: '2025/06/08', title: '飛騨高山ウルトラマラソン', url: 'https://www.r-wellness.com/takayama/', category: 'Ultra', region: 'Gifu' },
    { date: '2025/07/05', title: '志賀高原100', url: 'https://www.nature-scene.net/shiga100/', category: 'Ultra Trail', region: 'Nagano' },
    { date: '2025/07/26-27', title: 'OMM LITE 白馬・小谷', url: 'https://theomm.jp/pages/the-10th-omm-lite-bike-hakuba-otari-2025', category: 'Navigation', region: 'Nagano' },
    { date: '2025/08/09', title: 'HYROX 横浜', url: 'https://hyroxjapan.com/ja/event/hyrox-yokohama/', category: 'Hybrid Fitness', region: 'Kanagawa' },
    { date: '2025/08/30', title: 'エクストリームシリーズ 奥大井', url: 'https://www.a-extremo.com/event/extreme/round04/', category: 'Adventure', region: 'Shizuoka' },
    { date: '2025/09/13', title: 'Spartan Race 新潟', url: 'https://jp.spartan.com/ja', category: 'Obstacle', region: 'Niigata' },
    { date: '2025/10/05', title: '東京6耐フェス', url: 'https://tokyo-rokutai-fes.jp/', category: 'Endurance', region: 'Tokyo' },
    { date: '2025/10/25-26', title: '菅平ロゲイニング', url: 'https://facebook.com/events/s/%E8%8F%85%E5%B9%B3%E3%83%AD%E3%82%B1%E3%82%A4%E3%83%8B%E3%83%B3%E3%82%AF2025/1415922696526613/', category: 'Rogaine', region: 'Nagano' },
    { date: '2025/11/08-09', title: 'OMM JAPAN 那須塩原', url: 'https://theomm.jp/pages/omm-japan-2025', category: 'Navigation', region: 'Tochigi' }
  ],
  upcoming: [
    { title: '大山阿夫利アドベンチャーレース', date: '2025/12/13', location: 'Kanagawa', members: 'Takuro, Taku, Maoka, Hiroki, Tomoki', category: 'Adventure', url: 'https://oyama-afuri-ar.main.jp/' },
    { title: '謝謝ラン', date: '2025/12/20', location: '皇居', members: 'Anyone', category: 'Running', url: '#' }
  ]
};

// --- Utilities ---

const getCategoryColor = (cat) => {
  const colors = {
    Adventure: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    Ultra: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    'Ultra Trail': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    Marathon: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    Trail: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    Navigation: 'text-ivyLight border-ivyLight/30 bg-ivyLight/10',
    Obstacle: 'text-red-400 border-red-500/30 bg-red-500/10',
    'Hybrid Fitness': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    Rogaine: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    Endurance: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
  };
  return colors[cat] || 'text-gray-400 border-gray-500/30 bg-gray-500/10';
};

// --- Render Functions ---



function renderAboutPoints() {
  const el = document.getElementById('about-points');
  if (!el) return;
  el.innerHTML = Data.aboutPoints.map((p, i) => `
    <div class="flex gap-4 items-start group reveal" data-delay="${i * 100}">
      <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-ivyLight/30 text-ivyLight font-display font-bold text-sm group-hover:bg-ivyLight group-hover:text-black transition-colors">0${i + 1}</span>
      <div>
        <h3 class="font-bold text-white text-lg mb-1 group-hover:text-ivyLight transition-colors">${p.title}</h3>
        <p class="text-sm text-gray-400 leading-relaxed">${p.text}</p>
      </div>
    </div>
  `).join('');
}

function renderUpcoming() {
  const el = document.getElementById('nextup-cards');
  if (!el) return;
  el.innerHTML = Data.upcoming.map((u, i) => `
    <a href="${u.url}" target="_blank" class="group relative bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-ivyLight/50 transition-colors overflow-hidden reveal block" data-delay="${i * 100}">
      <div class="absolute inset-0 bg-gradient-to-br from-ivyLight/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="relative z-10">
        <div class="flex justify-between items-start mb-6">
          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getCategoryColor(u.category)}">${u.category}</span>
          <span class="text-ivyLight font-mono text-sm">${u.date}</span>
        </div>
        
        <h3 class="font-display font-black text-2xl mb-4 leading-tight group-hover:text-ivyLight transition-colors">${u.title}</h3>
        
        <div class="space-y-3 pt-4 border-t border-white/5">
          <div class="flex justify-between items-center text-xs">
            <span class="text-gray-500 uppercase tracking-wider">Location</span>
            <span class="font-bold text-white">${u.location}</span>
          </div>
          ${u.members ? `
          <div class="flex flex-col gap-1 text-xs">
            <span class="text-gray-500 uppercase tracking-wider">Crew</span>
            <span class="font-bold text-white leading-relaxed">${u.members}</span>
          </div>
          ` : ''}
        </div>
      </div>
    </a>
  `).join('');
}

function renderRaces() {
  const el = document.getElementById('race-calendar');
  if (!el) return;

  // Group races by year
  const racesByYear = Data.races.reduce((acc, race) => {
    const year = race.date.split('/')[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(race);
    return acc;
  }, {});

  // Sort years descending
  const years = Object.keys(racesByYear).sort((a, b) => b - a);

  el.innerHTML = years.map((year, index) => {
    const isExpanded = index === 0; // Expand only the latest year by default
    const races = racesByYear[year];

    return `
    <div class="border-b border-white/10 last:border-0 pb-8 last:pb-0">
      <button class="w-full flex justify-between items-end py-4 group text-left focus:outline-none" onclick="toggleYear('${year}')">
        <div class="flex items-baseline gap-4">
          <h3 class="font-display font-black text-4xl md:text-5xl text-white group-hover:text-ivyLight transition-colors">${year}</h3>
          <span class="font-mono text-sm text-gray-500">${races.length} Races</span>
        </div>
        <div class="p-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
          <svg id="icon-${year}" class="w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      
      <div id="content-${year}" class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}">
        ${races.map((r, i) => `
          <a href="${r.url}" target="_blank" class="block group/card relative bg-surface border border-white/5 p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500">${r.category}</span>
              <span class="text-[10px] text-gray-600">${r.region}</span>
            </div>
            <h3 class="font-bold text-lg mb-2 group-hover/card:text-ivyLight transition-colors line-clamp-1">${r.title}</h3>
            <div class="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span>${r.date}</span>
              <span class="w-full h-[1px] bg-white/10 group-hover/card:bg-ivyLight/30 transition-colors"></span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
  }).join('');

  // Add toggle function to window scope
  window.toggleYear = (year) => {
    const content = document.getElementById(`content-${year}`);
    const icon = document.getElementById(`icon-${year}`);

    if (content.classList.contains('max-h-0')) {
      // Open
      content.classList.remove('max-h-0', 'opacity-0', 'mt-0');
      content.classList.add('max-h-[2000px]', 'opacity-100', 'mt-6');
      icon.classList.add('rotate-180');
    } else {
      // Close
      content.classList.remove('max-h-[2000px]', 'opacity-100', 'mt-6');
      content.classList.add('max-h-0', 'opacity-0', 'mt-0');
      icon.classList.remove('rotate-180');
    }
  };
}

function renderMembers() {
  const el = document.getElementById('team-cards');
  if (!el) return;

  el.innerHTML = Data.members.map((m, i) => `
    <div class="tilt-card group relative h-full reveal" data-tilt data-delay="${i * 100}">
      <div class="absolute inset-0 bg-gradient-to-br from-ivy to-ivyLight rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      <div class="relative h-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col overflow-hidden">
        
        <!-- Background Pattern -->
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
        </div>

        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-[0.2em] text-ivyLight mb-2 block">${m.role}</span>
          <div class="flex items-center gap-3">
            <h3 class="font-display font-black text-3xl uppercase italic tracking-tighter">${m.name}</h3>
            ${m.instagram ? `
              <a href="${m.instagram}" target="_blank" class="text-gray-600 hover:text-ivyLight transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            ` : ''}
          </div>
        </div>
        
        <p class="text-sm text-gray-400 leading-relaxed mb-8 flex-grow border-l-2 border-white/10 pl-4">
          ${m.desc}
        </p>

        <div class="pt-6 border-t border-white/5">
          <div class="flex justify-between items-center text-xs">
            <span class="text-gray-500 uppercase tracking-wider">Background</span>
            <span class="font-bold text-white">${m.background}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Interactions ---

function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

function initParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll < window.innerHeight) {
      heroBg.style.transform = `scale(1.1) translateY(${scroll * 0.3}px)`;
    }
  });
}

function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('glass', 'py-3');
      nav.classList.remove('py-6');
    } else {
      nav.classList.remove('glass', 'py-3');
      nav.classList.add('py-6');
    }
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Target section headers and descriptions
  document.querySelectorAll('section h2, section > div > p').forEach(el => {
    el.classList.add('reveal');
  });

  // Initialize all reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  // Inject CSS for animation
  const style = document.createElement('style');
  style.innerHTML = `
    .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
  `;
  document.head.appendChild(style);
}

// --- Boot ---
function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    // Optional: Toggle icon shape if you want to animate the hamburger
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  renderAboutPoints();
  renderUpcoming();
  renderRaces();
  renderMembers();

  initTilt();
  initParallax();
  initNavbar();
  initScrollReveal();
  initMobileMenu();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
