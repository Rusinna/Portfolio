import { useEffect, useRef } from 'react';

const ORANGE = '#BF300F';
const TEAL = '#9CC1D9';
const BLUE = '#4a90d9';

export default function GameMonitor() {
  const screenRef = useRef(null);
  const canvasRef = useRef(null);
  const scElRef = useRef(null);
  const lvElRef = useRef(null);

  useEffect(() => {
    const screen = screenRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = screen.clientWidth;
      H = canvas.height = screen.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(screen);

    let raf, score, lives, player, bullets, alienBullets, aliens, particles, frame;
    let alienDir, alienMoveTimer, running;



    function spawnParticle(x, y, color) {
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 2.5 + 0.5;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color });
      }
    }

    function spawnAliens() {
      aliens = [];
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 8; c++)
          aliens.push({
            x: 20 + c * 32, y: 24 + r * 24,
            w: 16, h: 10, alive: true, type: r,
            pulse: Math.random() * Math.PI * 2,
          });
      alienDir = 1; alienMoveTimer = 0;
    }

    function initGame() {
      score = 0; lives = 3; frame = 0;
      if (scElRef.current) scElRef.current.textContent = '0';
      if (lvElRef.current) lvElRef.current.textContent = '♦♦♦';
      player = { x: W / 2, y: H - 26, w: 24, h: 16, vx: 0 };
      bullets = [];
      alienBullets = [];
      particles = [];
      spawnAliens();
      running = true;
    }

    function drawPlayer(p) {
      ctx.fillStyle = ORANGE;
      ctx.fillRect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
      ctx.fillRect(p.x - 2, p.y - p.h / 2 - 8, 4, 9);
      ctx.fillStyle = TEAL;
      ctx.fillRect(p.x - p.w / 2 - 5, p.y + 2, 6, 5);
      ctx.fillRect(p.x + p.w / 2 - 1, p.y + 2, 6, 5);
      // engine glow
      ctx.fillStyle = `rgba(216,72,32,0.4)`;
      ctx.fillRect(p.x - 6, p.y + p.h / 2, 12, 4);
    }

    function drawAlien(a) {
      if (!a.alive) return;
      a.pulse += 0.07;
      const glow = 0.65 + 0.35 * Math.sin(a.pulse);
      const colors = [ORANGE, TEAL, BLUE];
      ctx.fillStyle = colors[a.type];
      ctx.globalAlpha = glow;
      if (a.type === 0) {
        ctx.fillRect(a.x - 7, a.y - 3, 14, 7);
        ctx.fillRect(a.x - 5, a.y - 7, 3, 5);
        ctx.fillRect(a.x + 2, a.y - 7, 3, 5);
        ctx.fillRect(a.x - 9, a.y + 1, 4, 3);
        ctx.fillRect(a.x + 5, a.y + 1, 4, 3);
      } else if (a.type === 1) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y - 7);
        ctx.lineTo(a.x + 8, a.y + 5);
        ctx.lineTo(a.x - 8, a.y + 5);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(a.x - 3, a.y - 2, 6, 5);
      } else {
        ctx.beginPath();
        ctx.arc(a.x, a.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(a.x - 10, a.y - 1, 6, 2);
        ctx.fillRect(a.x + 4, a.y - 1, 6, 2);
      }
      ctx.globalAlpha = 1;
    }

    function update() {
      frame++;

      player.vx *= 0.7;

      player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x + player.vx));

      alienMoveTimer++;
      const moveEvery = Math.max(6, 26 - Math.floor(score / 40));
      if (alienMoveTimer >= moveEvery) {
        alienMoveTimer = 0;
        const alive = aliens.filter(a => a.alive);
        if (!alive.length) return;
        const minX = Math.min(...alive.map(a => a.x)) - 9;
        const maxX = Math.max(...alive.map(a => a.x)) + 9;
        if (maxX >= W - 4 || minX <= 4) { alienDir *= -1; aliens.forEach(a => a.y += 8); }
        aliens.forEach(a => { if (a.alive) a.x += alienDir * 9; });
      }

      if (frame % 70 === 0) {
        const alive = aliens.filter(a => a.alive);
        if (alive.length > 0) {
          const shooter = alive[Math.floor(Math.random() * alive.length)];
          alienBullets.push({ x: shooter.x, y: shooter.y + 7, vy: 3 });
        }
      }

      if (frame % 40 === 0) bullets.push({ x: player.x, y: player.y - 12 });

      bullets = bullets.filter(b => b.y > 0);
      bullets.forEach(b => b.y -= 6);
      alienBullets = alienBullets.filter(b => b.y < H);
      alienBullets.forEach(b => b.y += b.vy);

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.045; p.vx *= 0.94; p.vy *= 0.94; });

      bullets.forEach((b, bi) => {
        aliens.forEach(a => {
          if (!a.alive) return;
          if (Math.abs(b.x - a.x) < 11 && Math.abs(b.y - a.y) < 9) {
            a.alive = false;
            bullets.splice(bi, 1);
            score += 10;
            if (scElRef.current) scElRef.current.textContent = score;
            spawnParticle(a.x, a.y, a.type === 0 ? ORANGE : a.type === 1 ? TEAL : BLUE);
          }
        });
      });

      alienBullets.forEach((b, bi) => {
        if (Math.abs(b.x - player.x) < 15 && Math.abs(b.y - player.y) < 12) {
          alienBullets.splice(bi, 1);
          lives--;
          spawnParticle(player.x, player.y, ORANGE);
          if (lvElRef.current) lvElRef.current.textContent = '♦'.repeat(Math.max(0, lives));
          if (lives <= 0) { restartGame(); return; }
        }
      });

      const alive = aliens.filter(a => a.alive);
      if (alive.some(a => a.y + 9 >= player.y - 12)) { restartGame(); return; }
      if (alive.length === 0) { score += 100; spawnAliens(); }
    }

    function restartGame() {
      cancelAnimationFrame(raf);
      running = false;
      ctx.fillStyle = '#131026';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = ORANGE;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', W / 2, H / 2 - 10);
      ctx.fillStyle = '#9CC1D9';
      ctx.font = '10px monospace';
      ctx.fillText('score: ' + score, W / 2, H / 2 + 8);
      ctx.textAlign = 'left';
      setTimeout(() => { initGame(); raf = requestAnimationFrame(loop); }, 1500);
    }

    function render() {
      ctx.fillStyle = '#131026';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(74,85,128,0.07)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < W; i += 28) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
      }
      for (let j = 0; j < H; j += 24) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke();
      }

      aliens.forEach(drawAlien);

      bullets.forEach(b => {
        ctx.fillStyle = TEAL;
        ctx.shadowColor = TEAL;
        ctx.shadowBlur = 4;
        ctx.fillRect(b.x - 1, b.y - 6, 2, 10);
        ctx.shadowBlur = 0;
      });
      alienBullets.forEach(b => {
        ctx.fillStyle = ORANGE;
        ctx.shadowColor = ORANGE;
        ctx.shadowBlur = 4;
        ctx.fillRect(b.x - 1, b.y - 5, 2, 8);
        ctx.shadowBlur = 0;
      });

      particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.globalAlpha = 1;
      });

      drawPlayer(player);

      ctx.fillStyle = ORANGE;
      ctx.fillRect(0, H - 2, W, 2);
    }

    function loop() {
      if (!running) return;
      update();
      render();
      raf = requestAnimationFrame(loop);
    }



    let moveDir = 0;
    const onTouchStart = (e) => {
      const tx = e.touches[0].clientX;
      const rect = screen.getBoundingClientRect();
      const rx = tx - rect.left;
      if (rx < rect.width * 0.35) moveDir = -1;
      else if (rx > rect.width * 0.65) moveDir = 1;
      else { bullets.push({ x: player.x, y: player.y - 12 }); moveDir = 0; }
    };
    const onTouchEnd = () => { moveDir = 0; };
    const touchInterval = setInterval(() => { if (running && moveDir !== 0) player.x += moveDir * 4; }, 16);

    const onMouseMove = (e) => {
      if (!running) return;
      const rect = screen.getBoundingClientRect();
      player.x = (e.clientX - rect.left) * (W / rect.width);
    };
    const onClick = () => { if (running) bullets.push({ x: player.x, y: player.y - 12 }); };


    screen.addEventListener('touchstart', onTouchStart, { passive: true });
    screen.addEventListener('touchend', onTouchEnd, { passive: true });
    screen.addEventListener('mousemove', onMouseMove);
    screen.addEventListener('click', onClick);

    initGame();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(touchInterval);
      ro.disconnect();

      screen.removeEventListener('touchstart', onTouchStart);
      screen.removeEventListener('touchend', onTouchEnd);
      screen.removeEventListener('mousemove', onMouseMove);
      screen.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="monitor-wrap">
      <div className="monitor-frame">
        <div ref={screenRef} className="monitor-screen">
          <div className="hud-left">SCR: <span ref={scElRef}>0</span></div>
          <div className="hud-right"><span ref={lvElRef}>♦♦♦</span></div>
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
        <div className="monitor-glow" />
      </div>
      <div className="monitor-stand" />
      <div className="monitor-base" />
    </div>
  );
}