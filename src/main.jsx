import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Gift,
  GraduationCap,
  Home,
  Lightbulb,
  MapPin,
  Mic2,
  PackageCheck,
  QrCode,
  Recycle,
  ScanLine,
  ShoppingBasket,
  Sparkles,
  Trophy,
  Users,
  Wallet,
  Wheat,
} from 'lucide-react';
import './styles.css';

const initialResident = {
  name: 'Aina Rahman',
  community: 'Desa Mentari',
  availablePoints: 3200,
  lifetimePoints: 12000,
  totalRecycled: 42.5,
  memberSince: 'January 2026',
};

const materialRates = {
  Plastic: 100,
  Paper: 60,
  Aluminium: 200,
  Glass: 80,
};

const rewards = {
  'Cash & Vouchers': [
    { name: 'RM5 cash voucher', cost: 500, icon: Wallet },
    { name: 'RM10 grocery voucher', cost: 1000, icon: Gift },
    { name: 'RM20 e-wallet voucher', cost: 2000, icon: Wallet },
  ],
  Groceries: [
    { name: '5 kg rice', cost: 800, icon: Wheat },
    { name: 'Cooking oil', cost: 600, icon: PackageCheck },
    { name: 'Basic grocery basket', cost: 1200, icon: ShoppingBasket },
    { name: 'Family essentials pack', cost: 2500, icon: Gift },
  ],
};

const baseOpportunities = [
  { id: 'skills', name: 'Basic Skills Workshop', required: 4000, icon: BookOpen },
  { id: 'vocational', name: 'Vocational Training Programme', required: 8000, icon: Award },
  { id: 'support', name: 'Education Scholarship Support', required: 10000, icon: GraduationCap },
  { id: 'advanced', name: 'Advanced Scholarship Programme', required: 15000, icon: Sparkles },
];

const communityEvents = [
  {
    id: 'showcase',
    title: 'Recycling Project Showcase',
    date: 'Saturday, 25 July 2026',
    time: '9:00 AM - 12:00 PM',
    location: 'Desa Mentari Open Field',
    description: 'Residents present creative recycling projects, school ideas, and useful items made from waste.',
    icon: Recycle,
    tag: 'Showcase',
  },
  {
    id: 'talent',
    title: 'Community Talent Show',
    date: 'Sunday, 2 August 2026',
    time: '7:30 PM - 10:00 PM',
    location: 'Block 5 Community Hall',
    description: 'Sing, dance, perform poetry, or cheer for neighbours in a friendly evening programme.',
    icon: Mic2,
    tag: 'Performance',
  },
  {
    id: 'competition',
    title: 'Problem Solving Competition',
    date: 'Saturday, 15 August 2026',
    time: '10:00 AM - 1:00 PM',
    location: 'Desa Mentari Learning Room',
    description: 'Teams suggest practical solutions for recycling, cleanliness, safety, and youth learning.',
    icon: Lightbulb,
    tag: 'Competition',
  },
  {
    id: 'clean-up',
    title: 'Neighbourhood Clean-Up Day',
    date: 'Sunday, 23 August 2026',
    time: '8:00 AM - 11:00 AM',
    location: 'Open Field Assembly Point',
    description: 'Join neighbours to collect recyclable items and keep shared spaces clean.',
    icon: Users,
    tag: 'Volunteer',
  },
];

function formatPoints(value) {
  return value.toLocaleString('en-MY');
}

function App() {
  const [screen, setScreen] = useState('Home');
  const [resident, setResident] = useState(initialResident);
  const [activity, setActivity] = useState([
    { text: 'Plastic recycling verified', points: '+250 points', tone: 'positive' },
    { text: 'Grocery voucher redeemed', points: '-800 points', tone: 'spend' },
    { text: 'Scholarship support unlocked', points: 'Unlocked', tone: 'neutral' },
  ]);
  const [toast, setToast] = useState('');
  const [confirmReward, setConfirmReward] = useState(null);
  const [claimed, setClaimed] = useState({});
  const [joinedEvents, setJoinedEvents] = useState({});

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(''), 2600);
  }

  function recordActivity(item) {
    setActivity((items) => [item, ...items].slice(0, 5));
  }

  function addRecycling({ material, weight, points }) {
    setResident((current) => ({
      ...current,
      availablePoints: current.availablePoints + points,
      lifetimePoints: current.lifetimePoints + points,
      totalRecycled: Number((current.totalRecycled + weight).toFixed(1)),
    }));
    recordActivity({
      text: `${material} recycling verified`,
      points: `+${formatPoints(points)} points`,
      tone: 'positive',
    });
    showToast(`Submission recorded. ${formatPoints(points)} points added.`);
  }

  function redeemReward(reward) {
    setResident((current) => ({
      ...current,
      availablePoints: current.availablePoints - reward.cost,
    }));
    recordActivity({
      text: `${reward.name} redeemed`,
      points: `-${formatPoints(reward.cost)} points`,
      tone: 'spend',
    });
    setConfirmReward(null);
    showToast(`${reward.name} redeemed. Balance updated.`);
  }

  function claimOpportunity(opportunity) {
    setClaimed((current) => ({ ...current, [opportunity.id]: true }));
    recordActivity({
      text: `${opportunity.name} claimed`,
      points: 'Claimed',
      tone: 'neutral',
    });
    showToast(`${opportunity.name} claimed. Lifetime Points unchanged.`);
  }

  function joinEvent(event) {
    setJoinedEvents((current) => ({ ...current, [event.id]: true }));
    recordActivity({
      text: `${event.title} joined`,
      points: 'Registered',
      tone: 'neutral',
    });
    showToast(`You joined ${event.title}.`);
  }

  return (
    <div className="app-shell">
      <main className="phone-frame" aria-live="polite">
        {screen === 'Home' && <HomeScreen resident={resident} activity={activity} setScreen={setScreen} />}
        {screen === 'Scan' && <ScanScreen onSubmit={addRecycling} />}
        {screen === 'Redeem' && (
          <RedeemScreen resident={resident} onAskRedeem={setConfirmReward} />
        )}
        {screen === 'Events' && (
          <EventsScreen joinedEvents={joinedEvents} onJoin={joinEvent} />
        )}
        {screen === 'Opportunities' && (
          <OpportunitiesScreen
            resident={resident}
            claimed={claimed}
            onClaim={claimOpportunity}
          />
        )}
      </main>

      <BottomNav current={screen} onChange={setScreen} />
      {toast && <div className="toast">{toast}</div>}
      {confirmReward && (
        <ConfirmModal
          reward={confirmReward}
          onCancel={() => setConfirmReward(null)}
          onConfirm={() => redeemReward(confirmReward)}
        />
      )}
    </div>
  );
}

function BrandHeader({ title, subtitle }) {
  return (
    <header className="brand-header">
      <div>
        <p className="small-label">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <img className="brand-logo" src="/trash-to-tuition-logo.png" alt="Trash to Tuition" />
    </header>
  );
}

function HomeScreen({ resident, activity, setScreen }) {
  return (
    <section className="screen">
      <BrandHeader title="Hello, Aina" subtitle={resident.community} />
      <div className="stats-grid">
        <StatCard icon={Sparkles} label="Available Points" value={formatPoints(resident.availablePoints)} accent="gold" />
        <StatCard icon={Wallet} label="Lifetime Points" value={formatPoints(resident.lifetimePoints)} />
        <StatCard icon={Recycle} label="Total Recycled" value={`${resident.totalRecycled.toFixed(1)} kg`} />
      </div>
      <div className="info-strip">
        <span>i</span>
        <p>Available Points can be spent. Lifetime Points never expire.</p>
      </div>
      <h2>Quick Actions</h2>
      <div className="quick-grid">
        <QuickButton icon={ScanLine} label="Scan Recycling" onClick={() => setScreen('Scan')} />
        <QuickButton icon={Gift} label="Redeem Rewards" onClick={() => setScreen('Redeem')} variant="gold" />
        <QuickButton icon={CalendarDays} label="Join Events" onClick={() => setScreen('Events')} />
        <QuickButton icon={GraduationCap} label="View Opportunities" onClick={() => setScreen('Opportunities')} />
      </div>
      <div className="section-heading">
        <h2>Recent Activity</h2>
      </div>
      <div className="activity-list">
        {activity.map((item, index) => (
          <div className="activity-row" key={`${item.text}-${index}`}>
            <span className={`dot ${item.tone}`} />
            <span>{item.text}</span>
            <strong className={item.tone}>{item.points}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <article className="stat-card">
      <div className={`icon-bubble ${accent || ''}`}><Icon size={24} /></div>
      <p>{label}</p>
      <strong className={accent || ''}>{value}</strong>
    </article>
  );
}

function QuickButton({ icon: Icon, label, onClick, variant }) {
  return (
    <button className={`quick-button ${variant || ''}`} onClick={onClick}>
      <Icon size={31} />
      <span>{label}</span>
      <ChevronRight size={22} />
    </button>
  );
}

function ScanScreen({ onSubmit }) {
  const [scanned, setScanned] = useState(false);
  const [material, setMaterial] = useState('Plastic');
  const [weight, setWeight] = useState('2.5');
  const numericWeight = Math.max(0, Number(weight) || 0);
  const rate = materialRates[material];
  const estimatedPoints = Math.round(numericWeight * rate);

  function submit(event) {
    event.preventDefault();
    if (!numericWeight) return;
    onSubmit({ material, weight: numericWeight, points: estimatedPoints });
    setScanned(false);
    setWeight('');
  }

  return (
    <section className="screen">
      <BrandHeader title="Scan and Weigh" subtitle="Recycling submission" />
      <div className="scanner-panel">
        <QrCode size={54} />
        <h2>Camera or QR scanner</h2>
        <p>Scan the bag label or enter the details manually.</p>
        <button className="primary-button" onClick={() => setScanned(true)}>
          Scan Bag Label
        </button>
        <button className="text-button" onClick={() => setScanned(true)}>
          Enter manually instead
        </button>
      </div>
      {scanned && (
        <form className="form-card" onSubmit={submit}>
          <label>
            Material type
            <select value={material} onChange={(event) => setMaterial(event.target.value)}>
              {Object.keys(materialRates).map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label>
            Weight in kilograms
            <input
              inputMode="decimal"
              min="0"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Example: 2.5"
              type="number"
            />
          </label>
          <div className="conversion-box">
            <span>{material}: {rate} points per kg</span>
            <strong>Estimated Points: {formatPoints(estimatedPoints)} points</strong>
          </div>
          <button className="primary-button" disabled={!numericWeight}>
            Submit Recycling
          </button>
        </form>
      )}
    </section>
  );
}

function RedeemScreen({ resident, onAskRedeem }) {
  const [tab, setTab] = useState('Cash & Vouchers');

  return (
    <section className="screen">
      <BrandHeader title="Redeem Rewards" subtitle={`Available Balance: ${formatPoints(resident.availablePoints)} points`} />
      <div className="tabs">
        {Object.keys(rewards).map((name) => (
          <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>
            {name}
          </button>
        ))}
      </div>
      <div className="catalogue">
        {rewards[tab].map((reward) => {
          const Icon = reward.icon;
          const disabled = resident.availablePoints < reward.cost;
          return (
            <article className="reward-card" key={reward.name}>
              <div className="reward-icon"><Icon size={28} /></div>
              <div>
                <h2>{reward.name}</h2>
                <p>{formatPoints(reward.cost)} points</p>
              </div>
              <button
                className="small-button"
                disabled={disabled}
                onClick={() => onAskRedeem(reward)}
              >
                {disabled ? 'Not enough' : 'Redeem'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EventsScreen({ joinedEvents, onJoin }) {
  return (
    <section className="screen">
      <BrandHeader title="Community Events" subtitle="Upcoming activities" />
      <div className="info-strip">
        <span>i</span>
        <p>Join local events, meet neighbours, and take part in community learning activities.</p>
      </div>
      <div className="event-hero">
        <div>
          <p className="small-label">Next event</p>
          <h2>Recycling Project Showcase</h2>
          <p>Bring an idea, a model, or a useful item made from recyclable materials.</p>
        </div>
        <Trophy size={42} />
      </div>
      <div className="event-list">
        {communityEvents.map((event) => {
          const Icon = event.icon;
          const joined = joinedEvents[event.id];
          return (
            <article className="event-card" key={event.id}>
              <div className="event-top">
                <div className="reward-icon"><Icon size={27} /></div>
                <div>
                  <span className="event-tag">{event.tag}</span>
                  <h2>{event.title}</h2>
                </div>
              </div>
              <p className="event-description">{event.description}</p>
              <div className="event-meta">
                <span><CalendarDays size={18} /> {event.date}</span>
                <span><MapPin size={18} /> {event.location}</span>
                <span><Users size={18} /> {event.time}</span>
              </div>
              <button
                className={`primary-button event-button ${joined ? 'joined' : ''}`}
                disabled={joined}
                onClick={() => onJoin(event)}
              >
                {joined ? <><Check size={18} /> Joined</> : 'Join Event'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OpportunitiesScreen({ resident, claimed, onClaim }) {
  return (
    <section className="screen">
      <BrandHeader title="Learning and Future Opportunities" subtitle={`Your Lifetime Points: ${formatPoints(resident.lifetimePoints)}`} />
      <div className="info-strip">
        <span>i</span>
        <p>Lifetime Points never expire and are not deducted when you claim an opportunity.</p>
      </div>
      <div className="opportunity-list">
        {baseOpportunities.map((opportunity) => {
          const unlocked = resident.lifetimePoints >= opportunity.required;
          const isClaimed = claimed[opportunity.id];
          const remaining = Math.max(0, opportunity.required - resident.lifetimePoints);
          const progress = Math.min(100, Math.round((resident.lifetimePoints / opportunity.required) * 100));
          const Icon = opportunity.icon;
          return (
            <article className="opportunity-card" key={opportunity.id}>
              <div className="opportunity-top">
                <div className="reward-icon"><Icon size={27} /></div>
                <div>
                  <h2>{opportunity.name}</h2>
                  <p>Required Lifetime Points: {formatPoints(opportunity.required)}</p>
                </div>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-copy">
                <span>{formatPoints(Math.min(resident.lifetimePoints, opportunity.required))} / {formatPoints(opportunity.required)} points</span>
                <strong>{progress}% completed</strong>
              </div>
              <div className="card-actions">
                <StatusLabel unlocked={unlocked} claimed={isClaimed} remaining={remaining} />
                {unlocked && !isClaimed && (
                  <button className="small-button" onClick={() => onClaim(opportunity)}>
                    Claim
                  </button>
                )}
                {isClaimed && <button className="small-button claimed" disabled><Check size={16} /> Claimed</button>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StatusLabel({ unlocked, claimed, remaining }) {
  if (claimed) return <span className="status claimed">Claimed</span>;
  if (unlocked) return <span className="status unlocked">Unlocked</span>;
  return <span className="status locked">{formatPoints(remaining)} more points needed</span>;
}

function BottomNav({ current, onChange }) {
  const items = [
    { name: 'Home', label: 'Home', icon: Home },
    { name: 'Scan', label: 'Scan', icon: ScanLine },
    { name: 'Redeem', label: 'Redeem', icon: Gift },
    { name: 'Events', label: 'Events', icon: CalendarDays },
    { name: 'Opportunities', label: 'Future', icon: GraduationCap },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ name, label, icon: Icon }) => (
        <button key={name} className={current === name ? 'active' : ''} onClick={() => onChange(name)}>
          <Icon size={23} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function ConfirmModal({ reward, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Redeem this reward?</h2>
        <p>{reward.name} will use {formatPoints(reward.cost)} Available Points. Lifetime Points will not change.</p>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onCancel}>Cancel</button>
          <button className="primary-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
