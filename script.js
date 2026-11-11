/**
 * Anurag Tiwari - Civil Engineer & Construction Management Portfolio
 * Premium Corporate & Infrastructure Engineering Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== 0. CINEMATIC 300-FRAME SCROLL & TEXT TRANSLATION CONTROLLER ====================
  const heroCanvas = document.getElementById('heroCanvas');
  const homeSection = document.getElementById('home');
  const heroFallback = document.getElementById('heroFallback');
  const heroTextWrapper = document.getElementById('heroTextWrapper');
  const heroTextBlock = document.getElementById('heroTextBlock');

  if (heroCanvas && homeSection) {
    const ctx = heroCanvas.getContext('2d', { alpha: false });
    const totalFrames = 300;
    const frames = new Array(totalFrames + 1);
    let targetFrame = 1;
    let currentFrame = 1;
    let lastRenderedFrame = -1;

    // Pre-calculated drawing dimensions for 0-latency 60fps rendering
    let dw = 0, dh = 0, dx = 0, dy = 0;
    let isShiftedToRight = false;

    function getFrameUrl(idx) {
      const padded = String(idx).padStart(3, '0');
      return 'assets/frames/ezgif-frame-' + padded + '.jpg';
    }

    function renderFrame(idx) {
      let img = frames[idx];
      // Fallback to nearest loaded frame in either direction
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = 1; i <= 35; i++) {
          if (frames[idx - i] && frames[idx - i].complete && frames[idx - i].naturalWidth > 0) {
            img = frames[idx - i];
            break;
          }
          if (frames[idx + i] && frames[idx + i].complete && frames[idx + i].naturalWidth > 0) {
            img = frames[idx + i];
            break;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      // Pure 1-line GPU draw (dimensions precomputed)
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Text stays stably in clean executive position without abrupt jumps
    function updateTextShiftState(frameIdx) {
      if (!heroTextBlock || !heroTextWrapper) return;
      heroTextBlock.style.transform = 'translate3d(0, 0, 0)';
    }

    function resizeHeroCanvas() {
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      heroCanvas.width = window.innerWidth * dpr;
      heroCanvas.height = window.innerHeight * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const cw = heroCanvas.width;
      const ch = heroCanvas.height;
      const imgRatio = 1920 / 1080;
      const canvasRatio = cw / ch;

      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * imgRatio;
        dx = (cw - dw) / 2;
        dy = 0;
      }

      renderFrame(Math.max(1, Math.min(totalFrames, Math.round(currentFrame))));
      
      // Update position on resize if already shifted
      if (isShiftedToRight && window.innerWidth >= 768) {
        const wrapperWidth = heroTextWrapper.clientWidth;
        const blockWidth = heroTextBlock.offsetWidth;
        const maxShift = Math.max(0, wrapperWidth - blockWidth);
        heroTextBlock.style.transform = 'translate3d(' + maxShift.toFixed(2) + 'px, 0, 0)';
      }
    }

    // Load Frame 1 immediately
    const firstImage = new Image();
    firstImage.src = getFrameUrl(1);
    firstImage.onload = () => {
      frames[1] = firstImage;
      resizeHeroCanvas();
      renderFrame(1);
      if (heroFallback) {
        heroFallback.style.opacity = '0';
        setTimeout(() => { heroFallback.style.display = 'none'; }, 700);
      }
    };

    // Preload ALL 300 frames immediately with background GPU decoding
    for (let i = 2; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        frames[i] = img;
        if (img.decode) img.decode().catch(() => {});
      };
    }

    // Scroll calculation - smooth scrubbing as hero section is viewed and scrolled past
    function handleScrollScrubbing() {
      const rect = homeSection.getBoundingClientRect();
      const scrollDist = -rect.top;
      const scrollRange = Math.max(window.innerHeight * 0.85, homeSection.offsetHeight * 0.85);

      if (scrollDist <= 0) {
        targetFrame = 1;
      } else if (scrollDist >= scrollRange) {
        targetFrame = totalFrames;
      } else {
        const progress = Math.min(1, Math.max(0, scrollDist / scrollRange));
        targetFrame = Math.max(1, Math.min(totalFrames, Math.round(progress * (totalFrames - 1)) + 1));
      }
    }

    window.addEventListener('scroll', handleScrollScrubbing, { passive: true });
    window.addEventListener('resize', resizeHeroCanvas);
    resizeHeroCanvas();

    // 60fps buttery physics interpolation loop
    function loop() {
      const frameDiff = targetFrame - currentFrame;
      if (Math.abs(frameDiff) > 0.01) {
        // Silky fluid lerp factor (butter-smooth motion)
        currentFrame += frameDiff * 0.075;
        const targetInt = Math.max(1, Math.min(totalFrames, Math.round(currentFrame)));
        if (targetInt !== lastRenderedFrame) {
          renderFrame(targetInt);
          lastRenderedFrame = targetInt;
        }
      }

      // Check text shift trigger
      updateTextShiftState(currentFrame);

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // ==================== 0.1 THEME CONTROLLER (DAY LIGHT / NIGHT DARK MODE) ====================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const themeToggleText = document.getElementById('themeToggleText');
  const mobileThemeIconSun = document.getElementById('mobileThemeIconSun');
  const mobileThemeIconMoon = document.getElementById('mobileThemeIconMoon');
  const mobileThemeToggleText = document.getElementById('mobileThemeToggleText');

  function applyPortfolioTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('anurag_portfolio_theme', 'light');

      if (themeIconSun) themeIconSun.classList.add('hidden');
      if (themeIconMoon) themeIconMoon.classList.remove('hidden');
      if (themeToggleText) themeToggleText.textContent = 'Dark Mode';

      if (mobileThemeIconSun) mobileThemeIconSun.classList.add('hidden');
      if (mobileThemeIconMoon) mobileThemeIconMoon.classList.remove('hidden');
      if (mobileThemeToggleText) mobileThemeToggleText.textContent = 'Switch to Dark Mode';
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('anurag_portfolio_theme', 'dark');

      if (themeIconSun) themeIconSun.classList.remove('hidden');
      if (themeIconMoon) themeIconMoon.classList.add('hidden');
      if (themeToggleText) themeToggleText.textContent = 'Day Mode';

      if (mobileThemeIconSun) mobileThemeIconSun.classList.remove('hidden');
      if (mobileThemeIconMoon) mobileThemeIconMoon.classList.add('hidden');
      if (mobileThemeToggleText) mobileThemeToggleText.textContent = 'Switch to Day Light Mode';
    }
  }

  // Read saved theme on startup
  const savedTheme = localStorage.getItem('anurag_portfolio_theme') || 'dark';
  applyPortfolioTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyLight = document.documentElement.classList.contains('light-mode');
      applyPortfolioTheme(isCurrentlyLight ? 'dark' : 'light');
    });
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      const isCurrentlyLight = document.documentElement.classList.contains('light-mode');
      applyPortfolioTheme(isCurrentlyLight ? 'dark' : 'light');
    });
  }

  // 1. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavMenu.classList.toggle('hidden');
      const isOpen = !mobileNavMenu.classList.contains('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        mobileMenuBtn.innerHTML = `
          <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        `;
      } else {
        mobileMenuBtn.innerHTML = `
          <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        `;
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = `
          <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        `;
      });
    });
  }

  // 2. Active Scroll Spy Navigation
  const navLinks = document.querySelectorAll('.desktop-nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('text-amber-400', 'font-semibold');
          link.classList.add('text-slate-300');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-amber-400', 'font-semibold');
            link.classList.remove('text-slate-300');
          }
        });
      }
    });

    // Navbar background blur darkening on scroll
    const header = document.getElementById('mainHeader');
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('bg-slate-950/90', 'shadow-2xl', 'border-b', 'border-amber-400/20');
        header.classList.remove('bg-slate-950/60');
      } else {
        header.classList.remove('bg-slate-950/90', 'shadow-2xl', 'border-amber-400/20');
        header.classList.add('bg-slate-950/60');
      }
    }
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // 3. Projects & Case Studies Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-lg');
        b.classList.add('bg-slate-900/80', 'text-slate-300', 'border', 'border-amber-400/20');
      });

      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-lg');
      btn.classList.remove('bg-slate-900/80', 'text-slate-300', 'border', 'border-amber-400/20');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });

  // 4. Modal Data & Logic for Projects and Expertise Deep Dive
  const modalData = {
    'agra-gwalior': {
      title: '89-Km Six-Lane Agra-Gwalior Greenfield Corridor',
      badge: 'Highway & Transportation Engineering',
      image: 'assets/images/exp-highway.jpg',
      client: 'National Highways Authority of India (NHAI)',
      focus: 'Expressway Design, Pavement Construction, Right of Way (RoW)',
      description: 'The 89-km Greenfield Expressway linking Agra and Gwalior represents high-speed connectivity designed to reduce transit times between Uttar Pradesh and Madhya Pradesh by over 50%. Built with flexible & high-grade rigid asphalt pavement, access-controlled interchanges, automated toll systems, and robust stormwater management.',
      highlights: [
        'Full 6-lane access-controlled greenfield geometric design standards',
        'Rigid pavement technology ensuring heavy axle-load durability for freight corridors',
        'Advanced environmental mitigation, fauna crossings, and automated traffic incident management',
        'Optimized cut-and-fill earthwork calculations and soil stabilization testing'
      ],
      visionNote: 'Reflects Anurag Tiwari’s specialized interest in high-capacity greenfield expressways and sustainable highway logistics.'
    },
    'railway-track': {
      title: 'Active Railway Viaduct & Mechanized Track Construction',
      badge: 'Active Construction Work • Viaduct & Heavy Rail',
      image: 'assets/images/railway-viaduct-active.jpg',
      client: 'Dedicated Freight Corridor Corporation of India (DFCCIL) & Indian Railways',
      focus: 'Launching Gantry Viaduct Erection, Ballastless Track, Plasser & Theurer Systems',
      description: 'Active construction work on elevated railway viaducts, combining high-capacity segmental box girder launching gantries, pier stem casting, mechanized track laying, automated ballast profiling, and continuous flash-butt rail welding for high-speed freight and passenger transit corridors.',
      highlights: [
        'Segmental precast box-girder launching and high-strength post-tensioning for viaduct spans',
        'Mechanized track-laying methodology with automated continuous action tamping',
        'Heavy axle load (25t to 32.5t) track structure specifications and prestressed concrete sleepers',
        'Overhead Electrification (OHE) mast foundation coordination and dynamic track deflection QA/QC'
      ],
      visionNote: 'Showcases Anurag Tiwari’s specialized focus on modern mechanized railway construction and viaduct erection.'
    },
    'slns-mgmt': {
      title: 'SLNS Developers - Construction & Project Management',
      badge: 'Project Planning & Coordination',
      image: 'assets/images/exp-management.jpg',
      client: 'Urban Development & Commercial Infrastructure',
      focus: 'Critical Path Method (CPM), Cost Control, Resource Allocation, Quality QA/QC',
      description: 'Strategic construction management models engineered for multi-tier urban infrastructure. Implements systematic baseline schedules, resource leveling, subcontract management, and weekly milestone tracking to prevent project overrun and ensure rigorous occupational safety.',
      highlights: [
        'Primavera P6 & MS Project-based critical path scheduling and float analysis',
        'Real-time material rate analysis, supply chain tracking, and site inventory control',
        'Zero-defect QA/QC inspection checklist covering structural concrete pouring and reinforcement steel placement',
        'Integrated site safety engineering adhering to IS 4014 & OSHA standards'
      ],
      visionNote: 'Demonstrates the practical application of M.Tech Construction Management principles to real-world job sites.'
    },
    'ashiana-realty': {
      title: 'Ashiana Real Estate Development (Gurugram Project)',
      badge: 'Real Estate & Multi-Storey Infrastructure',
      image: 'assets/images/exp-realty.jpg',
      client: 'Modern Residential & Commercial Communities',
      focus: '₹750 Crore Multi-Tier Housing Development, Precast & Monolithic Shuttering',
      description: 'Large-scale real estate development utilizing modern construction technologies such as Mivan aluminium formwork, deep pile foundation engineering, rainwater harvesting systems, and energy-efficient building envelopes.',
      highlights: [
        'Monolithic aluminium formwork cycle planning allowing rapid floor casting cycles',
        'Sub-surface soil investigation and deep bored cast-in-situ piling QA/QC',
        'Sustainable MEP coordination, centralized wastewater recycling, and green building design',
        'Total cost estimation, quantity takeoff, and vendor contract lifecycle management'
      ],
      visionNote: 'Exemplifies scalable residential engineering combined with modern construction economics.'
    },
    'alwar-behror': {
      title: 'Alwar-Behror 4-Lane Highway (₹516 Crore DPR)',
      badge: 'M/s M.S. Construction Focus Area',
      image: 'assets/images/highway-real.jpg',
      client: 'State PWD & Regional Infrastructure Development Authority',
      focus: 'Detailed Project Report (DPR), Highway Widening, Transit Time Reduction',
      description: 'A transformative 4-lane highway expansion reducing travel duration between Alwar and Behror to 45 minutes. Project incorporates extensive traffic volume studies, flexible pavement thickness design according to IRC:37 standards, culvert expansions, and highway lighting.',
      highlights: [
        'Preparation and appraisal of Detailed Project Reports (DPR) with financial and technical feasibility',
        'Bituminous concrete (BC) and Dense Bituminous Macadam (DBM) mix design optimization',
        'Junction engineering and geometric safety improvements at critical black spots',
        'Environmental clearance protocols and utility shifting coordination'
      ],
      visionNote: 'Directly aligns with M/s M.S. Construction’s capability to execute state and highway road contracts.'
    },
    'zuari-bridge': {
      title: 'Zuari Creek Bridge & Cable-Stayed Engineering Reference',
      badge: 'Major Civil Structures & Flyovers',
      image: 'assets/images/zuari-bridge-real.jpg',
      client: 'Ministry of Road Transport & Highways (MoRTH)',
      focus: 'Heavy Marine Foundations, Pre-stressed Concrete, Cable-Stay Dynamics',
      description: 'One of India’s benchmark engineering structures, spanning the Zuari Creek with long-span cable-stayed navigation spans, deep well foundations in marine clay, and elevated viaduct approaches engineered for high-wind seismic zones.',
      highlights: [
        'Pre-stressed box girder segmental launching methodology',
        'Marine concrete mix design utilizing fly-ash and micro-silica for anti-corrosion endurance',
        'Structural health monitoring sensors embedded along stays and piers',
        'Complex temporary works, staging design, and floating crane logistics'
      ],
      visionNote: 'Symbol of monumental bridge engineering and structural precision that inspires M/s M.S. Construction.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openProjectModal(key) {
    const data = modalData[key];
    if (!data || !projectModal) return;

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalBadge').textContent = data.badge;
    document.getElementById('modalImage').src = data.image;
    document.getElementById('modalImage').alt = data.title;
    document.getElementById('modalClient').textContent = data.client;
    document.getElementById('modalFocus').textContent = data.focus;
    document.getElementById('modalDesc').textContent = data.description;
    document.getElementById('modalVisionNote').textContent = data.visionNote;

    const highlightsList = document.getElementById('modalHighlights');
    highlightsList.innerHTML = '';
    data.highlights.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-900/70 border border-white/5 text-slate-200 text-xs sm:text-sm leading-relaxed hover:border-amber-400/30 transition-all shadow-sm';
      li.innerHTML = `
        <span class="w-6 h-6 rounded-lg bg-amber-400/15 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </span>
        <span class="font-normal text-slate-200">${item}</span>
      `;
      highlightsList.appendChild(li);
    });

    projectModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.getAttribute('data-modal-target');
      openProjectModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  // 5. Executive CV / Profile Modal System
  const cvModal = document.getElementById('cvModal');
  const cvModalCloseBtn = document.getElementById('cvModalCloseBtn');
  const cvModalBackdrop = document.getElementById('cvModalBackdrop');
  const openCvBtns = document.querySelectorAll('.open-cv-modal-btn');
  const printCvBtn = document.getElementById('printCvBtn');

  function openCvModal() {
    if (!cvModal) return;
    cvModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeCvModal() {
    if (!cvModal) return;
    cvModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCvModal();
    });
  });

  if (cvModalCloseBtn) cvModalCloseBtn.addEventListener('click', closeCvModal);
  if (cvModalBackdrop) cvModalBackdrop.addEventListener('click', closeCvModal);
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && !projectModal.classList.contains('hidden')) closeProjectModal();
      if (cvModal && !cvModal.classList.contains('hidden')) closeCvModal();
    }
  });

  // 6. Corporate Milestones & Track Record - CountingNumber Animation (0 to Target)
  function initStatsCounters() {
    const counterElements = document.querySelectorAll('.counter-number');
    const statsContainer = document.getElementById('company-stats');
    if (!counterElements.length || !statsContainer) return;

    let animated = false;

    function runCounterAnimation() {
      if (animated) return;
      animated = true;

      counterElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const useComma = el.getAttribute('data-comma') === 'true';
        const duration = 2000; // 2 seconds smooth cinematic count
        const startTime = performance.now();

        // Start from 0
        el.textContent = '0';

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Cubic ease-out curve (framer-motion / counting-number style)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);

          const formattedVal = useComma ? currentVal.toLocaleString('en-US') : String(currentVal);
          el.textContent = `${formattedVal}${progress >= 0.85 ? suffix : ''}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            const finalVal = useComma ? target.toLocaleString('en-US') : String(target);
            el.textContent = `${finalVal}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    // Check if already in viewport on load
    const rect = statsContainer.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0) {
      runCounterAnimation();
      return;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounterAnimation();
            obs.disconnect();
          }
        });
      }, { threshold: 0.05, rootMargin: '100px 0px 50px 0px' });

      observer.observe(statsContainer);
    }

    // Fallback scroll check
    function checkVisibilityFallback() {
      if (animated) return;
      const r = statsContainer.getBoundingClientRect();
      if (r.top <= window.innerHeight * 0.95 && r.bottom >= 0) {
        runCounterAnimation();
        window.removeEventListener('scroll', checkVisibilityFallback);
      }
    }
    window.addEventListener('scroll', checkVisibilityFallback, { passive: true });
  }

  initStatsCounters();

  // 7. Toast Notification System
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;

    if (type === 'success') {
      toastIcon.innerHTML = `
        <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
      `;
    } else {
      toastIcon.innerHTML = `
        <svg class="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      `;
    }

    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4000);
  }

  // 8. Copy to Clipboard Utility for Email & Phone
  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`, 'success');
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`${label} copied to clipboard!`, 'success');
    });
  };

  // ==================== EMAILJS CONFIGURATION ====================
  // 1. emailjs.com par free account banayein
  // 2. Gmail service connect karein -> SERVICE_ID copy karein
  // 3. Email Template banayein -> TEMPLATE_ID copy karein
  // 4. Account Settings se PUBLIC_KEY copy karein
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID',     // e.g. 'service_xxxxxxx'
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID',   // e.g. 'template_xxxxxxx'
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY'      // e.g. 'xxxxxxx_xxxxxx'
  };

  // Initialize EmailJS if public key is provided
  if (window.emailjs && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    } catch (err) {
      console.warn('EmailJS initialization warning:', err);
    }
  }

  // 9. Contact Form Handling with EmailJS Integration & Fallback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const category = document.getElementById('formCategory').value;
      const message = document.getElementById('formMessage').value.trim();

      const submitBtn = document.getElementById('formSubmitBtn');
      const btnText = document.getElementById('btnText');
      const btnIcon = document.getElementById('btnIcon');

      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.', 'info');
        return;
      }

      // Check if EmailJS is configured
      const isEmailJSReady = window.emailjs && 
                             EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                             EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
                             EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

      // Set Loading State on Button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
      }
      if (btnText) btnText.textContent = 'Sending Message...';
      if (btnIcon) {
        btnIcon.outerHTML = '<svg id="btnIcon" class="w-4 h-4 animate-spin text-slate-950" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
      }

      function resetButton() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
        if (btnText) btnText.textContent = 'Send Message to Anurag';
        const curIcon = document.getElementById('btnIcon');
        if (curIcon) {
          curIcon.outerHTML = '<svg id="btnIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>';
        }
      }

      // Always backup inquiries in localStorage
      const inquiries = JSON.parse(localStorage.getItem('anurag_inquiries') || '[]');
      inquiries.push({ name, email, subject, category, message, timestamp: new Date().toISOString() });
      localStorage.setItem('anurag_inquiries', JSON.stringify(inquiries));

      if (isEmailJSReady) {
        // Send email silently via EmailJS directly to inbox
        const templateParams = {
          from_name: name,
          from_email: email,
          reply_to: email,
          subject: subject || `Portfolio Inquiry: ${category}`,
          category: category,
          message: message,
          to_email: 'anuragdto@gmail.com'
        };

        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams, EMAILJS_CONFIG.PUBLIC_KEY)
          .then(() => {
            showToast('Message sent directly to Anurag! You will receive a response soon.', 'success');
            contactForm.reset();
            resetButton();
          })
          .catch((error) => {
            console.error('EmailJS Error:', error);
            showToast('Direct delivery failed. Opening email client fallback...', 'info');
            const mailtoLink = `mailto:anuragdto@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject || category} - ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
            resetButton();
          });
      } else {
        // Fallback when keys are not yet pasted: opens email client
        showToast('Opening email client to send message to anuragdto@gmail.com...', 'info');
        const mailtoLink = `mailto:anuragdto@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject || category} - ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}`)}`;
        setTimeout(() => {
          window.location.href = mailtoLink;
          resetButton();
          contactForm.reset();
        }, 800);
      }
    });
  }

  // 10. Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 11. Hero Background Switcher Utility
  window.changeHeroBg = function(src, btn) {
    const img = document.getElementById('heroBgImage');
    if (!img) return;
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = src;
      img.style.opacity = '1';
    }, 200);

    document.querySelectorAll('.hero-bg-btn').forEach(b => {
      b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
      b.classList.add('text-slate-300', 'font-semibold');
    });
    if (btn) {
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('text-slate-300', 'font-semibold');
    }
  };

  // ==================== 12. ORBITAL INFRASTRUCTURE SHOWCASE CAROUSEL ENGINE ====================
  (function initOrbitCarousel() {
    const root = document.getElementById('projectOrbitCarousel');
    if (!root) return;

    const platesContainer = document.getElementById('dshPlates');
    const arcPathEl = document.getElementById('dshArcPath');
    const track = document.getElementById('dshTrack');
    const prevBtn = document.getElementById('dshPrevBtn');
    const nextBtn = document.getElementById('dshNextBtn');
    const exploreBtn = document.getElementById('dshExploreBtn');

    const orbitItems = Array.from(root.querySelectorAll('[data-orbit-item]'));
    const orbitHeads = Array.from(root.querySelectorAll('[data-orbit-head]'));
    const orbitBodies = Array.from(root.querySelectorAll('[data-orbit-body]'));
    const orbitDots = Array.from(root.querySelectorAll('[data-orbit-index]'));
    const orbitThumbs = Array.from(root.querySelectorAll('[data-orbit-thumb]'));
    const n = orbitItems.length;
    if (n === 0) return;

    // Project data configuration matching our projects
    const projectsData = [
      { accent: '#F59E0B', modalId: 'ashiana-realty' },
      { accent: '#38BDF8', modalId: 'railway-track' },
      { accent: '#10B981', modalId: 'agra-gwalior' },
      { accent: '#A855F7', modalId: 'zuari-bridge' },
      { accent: '#EC4899', modalId: 'alwar-behror' }
    ];

    // Mathematical constants for expansive 1180 x 560 canvas
    const ORBIT_X = 270;
    const ORBIT_Y = -470;
    const ORBIT_R = 670;
    const SWING = 50; // degrees
    const ITEM = 118; // px per thumbnail
    const VISIBLE_THUMBS = 4;
    const ARC_REST = [[50, 102], [46, 126], [60, 128], [40, 104], [48, 118]];
    const ARC_SWEEP = [38, 146];
    const HIDE_1 = "inset(0% 0% 0% 100%)";
    const HIDE_2 = "inset(0% 100% 0% 0%)";
    const SHOW = "inset(0% 0% 0% 0%)";

    let currentIndex = 0;
    let isAnimating = false;
    let arcState = { a0: ARC_REST[0][0], a1: ARC_REST[0][1] };

    function calculateArcPath(a0, a1, cx, cy, r, w, steps = 48) {
      const outer = [];
      const inner = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
        const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45);
        const c = Math.cos(a);
        const s = Math.sin(a);
        outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1));
        inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1));
      }
      return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z";
    }

    function drawArc() {
      if (!arcPathEl) return;
      arcPathEl.setAttribute("d", calculateArcPath(arcState.a0, arcState.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118));
    }

    // Auto-scaling responsive canvas for wide full-page display
    function fitDesignCanvas() {
      const w = root.clientWidth;
      if (w <= 0) return;
      const scale = Math.min(w / 1180, 1.25);
      root.style.setProperty('--dsh-s', scale >= 0.35 ? scale.toFixed(3) : '1');
    }
    fitDesignCanvas();
    window.addEventListener('resize', fitDesignCanvas);

    // Initial setup
    function setupInitial() {
      drawArc();
      orbitItems.forEach((item, idx) => {
        if (idx === 0) {
          item.style.visibility = 'visible';
          item.style.opacity = '1';
          item.style.transform = 'rotate(0deg)';
        } else {
          item.style.visibility = 'hidden';
          item.style.opacity = '0';
        }
      });
      orbitHeads.forEach((head, idx) => {
        if (idx === 0) {
          head.style.visibility = 'visible';
          head.style.opacity = '1';
          const t1 = head.querySelector('.dsh-t1');
          const t2 = head.querySelector('.dsh-t2');
          if (t1) t1.style.clipPath = SHOW;
          if (t2) t2.style.clipPath = SHOW;
        } else {
          head.style.visibility = 'hidden';
          head.style.opacity = '0';
        }
      });
      orbitBodies.forEach((body, idx) => {
        if (idx === 0) {
          body.style.visibility = 'visible';
          body.style.opacity = '1';
          body.style.transform = 'none';
        } else {
          body.style.visibility = 'hidden';
          body.style.opacity = '0';
        }
      });
      updateControls(0);
    }

    function updateControls(targetIdx) {
      // Dots
      orbitDots.forEach((dot, idx) => {
        if (idx === targetIdx) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });

      // Thumbs
      orbitThumbs.forEach((btn, idx) => {
        if (idx === targetIdx) {
          btn.setAttribute('aria-current', 'true');
        } else {
          btn.removeAttribute('aria-current');
        }
      });

      // Strip track offset
      if (track) {
        const startThumb = Math.max(0, Math.min(targetIdx - 1, n - VISIBLE_THUMBS));
        track.style.transform = `translateX(${-startThumb * ITEM}px)`;
      }
    }

    function goTo(nextIndex, forcedDir) {
      if (nextIndex === currentIndex || isAnimating) return;
      isAnimating = true;

      const from = currentIndex;
      const to = ((nextIndex % n) + n) % n;
      let dir = forcedDir !== undefined ? forcedDir : (to > from ? 1 : -1);
      // Shorter wrap direction
      if (forcedDir === undefined) {
        const fwd = (((to - from) % n) + n) % n;
        dir = fwd <= n - fwd ? 1 : -1;
      }

      const restAngles = ARC_REST[to % ARC_REST.length];
      const accent = projectsData[to]?.accent || '#F59E0B';

      const oldPlate = orbitItems[from];
      const newPlate = orbitItems[to];
      const oldHead = orbitHeads[from];
      const newHead = orbitHeads[to];
      const oldBody = orbitBodies[from];
      const newBody = orbitBodies[to];

      updateControls(to);

      if (window.gsap) {
        const tl = gsap.timeline({
          onComplete: () => {
            currentIndex = to;
            isAnimating = false;
          }
        });

        // 1. Plate rotation along orbit curve
        tl.to(oldPlate, {
          rotation: SWING * dir,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.in"
        }, 0)
        .set(oldPlate, { rotation: 0 }, 0.6)
        .fromTo(newPlate, {
          autoAlpha: 0,
          rotation: -SWING * dir
        }, {
          autoAlpha: 1,
          rotation: 0,
          duration: 0.85,
          ease: "power3.out"
        }, 0.25);

        // 2. Title wipes
        const oldT1 = oldHead.querySelector('.dsh-t1');
        const oldT2 = oldHead.querySelector('.dsh-t2');
        const newT1 = newHead.querySelector('.dsh-t1');
        const newT2 = newHead.querySelector('.dsh-t2');
        const newEye = newHead.querySelector('.dsh-eye');

        tl.to(oldT1, { clipPath: HIDE_1, duration: 0.38, ease: "power2.in" }, 0)
          .to(oldT2, { clipPath: HIDE_2, duration: 0.38, ease: "power2.in" }, 0.05)
          .set(oldHead, { autoAlpha: 0 }, 0.45)
          .set(newHead, { autoAlpha: 1 }, 0.4)
          .fromTo(newEye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.45)
          .fromTo(newT1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.55, ease: "power3.out" }, 0.45)
          .fromTo(newT2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.55, ease: "power3.out" }, 0.5);

        // 3. Card details cross-fade
        tl.to(oldBody, { autoAlpha: 0, y: -8, duration: 0.28, ease: "power1.in" }, 0.05)
          .set(newBody, { autoAlpha: 1, y: 0 }, 0.35)
          .fromTo(newBody.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }, 0.35);

        // 4. Arc morph & color morph
        tl.to(arcState, {
          a0: ARC_SWEEP[0],
          a1: ARC_SWEEP[1],
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: drawArc
        }, 0)
        .to(arcState, {
          a0: restAngles[0],
          a1: restAngles[1],
          duration: 0.75,
          ease: "power3.out",
          onUpdate: drawArc
        }, 0.55);

        if (arcPathEl) {
          tl.to(arcPathEl, { fill: accent, duration: 0.9, ease: "power1.inOut" }, 0.1);
        }
      } else {
        // Fallback if GSAP is not yet loaded
        oldPlate.style.visibility = 'hidden';
        oldPlate.style.opacity = '0';
        newPlate.style.visibility = 'visible';
        newPlate.style.opacity = '1';

        oldHead.style.visibility = 'hidden';
        oldHead.style.opacity = '0';
        newHead.style.visibility = 'visible';
        newHead.style.opacity = '1';

        oldBody.style.visibility = 'hidden';
        oldBody.style.opacity = '0';
        newBody.style.visibility = 'visible';
        newBody.style.opacity = '1';

        arcState.a0 = restAngles[0];
        arcState.a1 = restAngles[1];
        drawArc();
        if (arcPathEl) arcPathEl.setAttribute('fill', accent);

        currentIndex = to;
        isAnimating = false;
      }
    }

    // Connect dots
    orbitDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goTo(idx));
    });

    // Connect thumbnails
    orbitThumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => goTo(idx));
    });

    // Arrows
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1, -1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1, 1));

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1, -1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1, 1);
    });

    // Touch Swipe on plates
    let touchStartX = 0;
    if (platesContainer) {
      platesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      platesContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) goTo(currentIndex - 1, -1);
          else goTo(currentIndex + 1, 1);
        }
      }, { passive: true });
    }

    // Modal connect button
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        const modalId = projectsData[currentIndex]?.modalId || 'agra-gwalior';
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    // Tabs inside details card
    root.querySelectorAll('.dsh-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.getAttribute('data-dsh-tab');
        root.querySelectorAll('.dsh-tab').forEach(b => {
          b.setAttribute('aria-selected', b === tabBtn ? 'true' : 'false');
        });
        root.querySelectorAll('.dsh-body').forEach(b => {
          const ov = b.querySelector('.dsh-tab-content-overview');
          const sp = b.querySelector('.dsh-tab-content-specs');
          if (ov && sp) {
            if (targetTab === 'overview') {
              ov.classList.remove('hidden');
              sp.classList.add('hidden');
            } else {
              ov.classList.add('hidden');
              sp.classList.remove('hidden');
            }
          }
        });
      });
    });

    // Likes counter toggle
    root.querySelectorAll('.dsh-like').forEach((likeBtn) => {
      likeBtn.addEventListener('click', () => {
        const isPressed = likeBtn.getAttribute('aria-pressed') === 'true';
        const countEl = likeBtn.querySelector('.dsh-like-count');
        let count = parseInt(countEl?.textContent || '0', 10);
        if (isPressed) {
          likeBtn.setAttribute('aria-pressed', 'false');
          if (countEl) countEl.textContent = String(count - 1);
        } else {
          likeBtn.setAttribute('aria-pressed', 'true');
          if (countEl) countEl.textContent = String(count + 1);
          if (window.gsap) {
            gsap.fromTo(likeBtn, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(2)" });
          }
        }
      });
    });

    setupInitial();
  })();

  // ==================== 14. SPLIT-PHOTO SLIDER (AREAS OF EXPERTISE) ====================
  (function initSplitPhotoSlider() {
    const root = document.querySelector('.sps-root');
    if (!root) return;

    const shots = Array.from(root.querySelectorAll('.sps-shot'));
    const blocks = Array.from(root.querySelectorAll('.sps-block'));
    const dots = Array.from(root.querySelectorAll('.sps-dot'));
    const btnPrev = root.querySelector('.sps-arrow-up');
    const btnNext = root.querySelector('.sps-arrow-down');
    const n = shots.length;
    if (n < 2) return;

    let current = 0;
    let isAnimating = false;
    let currentTl = null;

    function wrap(i, count) {
      return ((i % count) + count) % count;
    }

    function directionFor(from, to, count) {
      const d = wrap(to - from, count);
      return d === 0 || d <= count / 2 ? 1 : -1;
    }

    function goTo(target, dir) {
      const to = wrap(target, n);
      if (to === current || isAnimating) return;
      const from = current;
      const d = dir !== undefined ? dir : directionFor(from, to, n);

      if (currentTl) {
        currentTl.progress(1).kill();
      }

      isAnimating = true;
      current = to;

      // Update active dot
      dots.forEach((dot, idx) => {
        dot.setAttribute('aria-current', idx === to ? 'true' : 'false');
      });

      const oldShot = shots[from];
      const newShot = shots[to];
      const oldBlock = blocks[from];
      const newBlock = blocks[to];

      if (!oldShot || !newShot || !oldBlock || !newBlock) {
        isAnimating = false;
        return;
      }

      const oldImg = oldShot.querySelector('.sps-img');
      const newImg = newShot.querySelector('.sps-img');
      const oldLines = oldBlock.querySelectorAll('[data-sps-l]');
      const newLines = newBlock.querySelectorAll('[data-sps-l]');

      if (window.gsap) {
        gsap.set([oldShot, newShot, oldBlock, newBlock], { visibility: 'visible' });
        gsap.set(oldShot, { zIndex: 1 });
        gsap.set(newShot, { zIndex: 2 });

        const done = () => {
          shots.forEach((s, i) => {
            if (i === to) s.setAttribute('data-on', '');
            else s.removeAttribute('data-on');
          });
          blocks.forEach((b, i) => {
            if (i === to) b.setAttribute('data-on', '');
            else b.removeAttribute('data-on');
          });
          gsap.set([oldShot, newShot, oldBlock, newBlock], { clearProps: 'visibility,zIndex' });
          gsap.set([oldShot, oldImg, newShot, newImg], { clearProps: 'transform' });
          gsap.set([oldLines, newLines], { clearProps: 'transform,opacity' });
          isAnimating = false;
        };

        const t = gsap.timeline({ onComplete: done });

        // Copy lines stagger
        t.to(oldLines, { y: -38 * d, opacity: 0, duration: 0.4, ease: 'power2.in', stagger: 0.04 }, 0);
        t.fromTo(newLines, { y: 46 * d, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.06 }, 0.28);

        // Photos transition with counter-rotation and zoom drift
        t.fromTo(newShot, { yPercent: -100 * d }, { yPercent: 0, duration: 0.9, ease: 'power3.inOut' }, 0.15);
        t.fromTo(oldShot, { yPercent: 0 }, { yPercent: 42 * d, duration: 0.9, ease: 'power3.inOut' }, 0.15);
        t.fromTo(newImg, { rotation: -11 * d, scale: 1.3 }, { rotation: 0, scale: 1, duration: 1.25, ease: 'power2.out' }, 0.18);
        t.to(oldImg, { rotation: 7 * d, scale: 1.1, duration: 0.9, ease: 'power2.in' }, 0.15);

        currentTl = t;
      } else {
        // Fallback without GSAP
        shots.forEach((s, i) => {
          if (i === to) s.setAttribute('data-on', '');
          else s.removeAttribute('data-on');
        });
        blocks.forEach((b, i) => {
          if (i === to) b.setAttribute('data-on', '');
          else b.removeAttribute('data-on');
        });
        isAnimating = false;
      }
    }

    // Dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) goTo(idx);
      });
    });

    // Arrow navigation
    if (btnPrev) {
      btnPrev.addEventListener('click', () => goTo(current - 1, -1));
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => goTo(current + 1, 1));
    }

    // Keyboard navigation
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(current + 1, 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(current - 1, -1);
      }
    });

    // Touch swipe navigation
    let touchStartY = 0;
    let touchStartX = 0;
    root.addEventListener('touchstart', (e) => {
      if (!e.touches[0]) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    root.addEventListener('touchend', (e) => {
      if (!e.changedTouches[0]) return;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      const diffX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffY) > 40 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 0) goTo(current + 1, 1);
        else goTo(current - 1, -1);
      }
    }, { passive: true });
  })();
});
