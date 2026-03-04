const entities = items.map(i => i.json);

const byId = (id) => entities.find(e => e.entity_id === id);

const toBool = (v) => (v === 'on' ? true : v === 'off' ? false : null);
const toNum = (v) => {
  if (v === null || v === undefined || v === 'unknown' || v === 'unavailable' || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const cleanTextState = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === 'unknown' || s === 'unavailable') return null;
  return s;
};
const toIsoNoMs = (s) => {
  if (!s || s === 'unknown' || s === 'unavailable') return null;
  const normalized = String(s).replace(' ', 'T');
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, '');
};
const hhmmFromDate = (d) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const now = new Date();
const isFuture = (dt) => dt && new Date(dt) > now;

// -------- Extract entities --------
const zoneHome = byId('zone.home');
const priorityMode = byId('input_select.priority_mode');
const cropType = byId('input_text.crop_type');
const growthStage = byId('input_text.growth_stage');

const soil = byId('input_number.soit_moisture') || byId('input_number.soil_moisture');
const temp = byId('input_number.temperature');
const airHum = byId('input_number.air_humidity');
const lumi = byId('input_number.luminosity');

const actuatorsRaw = [
  {
    name: 'pump',
    state: byId('input_boolean.pump_physical_state'),
    manual_override: byId('input_boolean.pump_manual_override'),
    delay: byId('input_datetime.pump_excecute_at'),
    timer: byId('input_datetime.pump_excecute_until'),
  },
  {
    name: 'fan',
    state: byId('input_boolean.fan_physical_state'),
    manual_override: byId('input_boolean.fan_manual_override'),
    delay: byId('input_datetime.fan_excecute_at'),
    timer: byId('input_datetime.fan_excecute_until'),
  }
];

const actuators = {};

for (const act of actuatorsRaw) {
  const physicalState = cleanTextState(act.state?.state);
  const manualOverride = toBool(act.manual_override?.state);
  const delayAt = toIsoNoMs(act.delay?.state);
  const timerUntil = toIsoNoMs(act.timer?.state);

  const delayActive = isFuture(delayAt);

  // Determine skipped
  const skipped = physicalState === 'on' || delayActive || manualOverride;

  // Determine classification
  let classification = '';
  if (manualOverride) classification = 'MANUAL';
  else if (physicalState === 'on') classification = 'EXECUTING';
  else if (physicalState === 'off' && delayActive) classification = 'WAITING';
  else if (physicalState === 'off' && !delayActive) classification = 'FREE';

  // Determine timer.active
  let timerActive = false;
  if (physicalState === 'on') timerActive = true;
  else if (physicalState === 'off' && delayActive) timerActive = true;
  else timerActive = false;

  actuators[act.name] = {
    entity_id: act.state?.entity_id ?? null,
    physical_state: physicalState,
    classification,
    skipped,
    manual_override: manualOverride,
    timer: {
      active: timerActive,
      duration_minutes: null,
      execute_until: timerUntil
    },
    delay: {
      active: delayActive,
      execute_at: delayAt
    }
  };
}

// -------- Build output --------
const result = {
  meta: {
    run_id: `${Math.random().toString(16).slice(2, 8)}-${Math.random().toString(16).slice(2, 14)}`,
    triggered_at: now.toISOString().replace(/\.\d{3}Z$/, ''),
    mode: cleanTextState(priorityMode?.state)
  },
  location: {
    latitude: zoneHome?.attributes?.latitude ?? null,
    longitude: zoneHome?.attributes?.longitude ?? null,
    timezone: 'Africa/Algiers'
  },
  crop: {
    type: cleanTextState(cropType?.state),
    growth_stage: cleanTextState(growthStage?.state)
  },
  sensors: {
    soil_moisture: toNum(soil?.state),
    temperature: toNum(temp?.state),
    air_humidity: toNum(airHum?.state),
    luminosity: toNum(lumi?.state),
    time_of_day: hhmmFromDate(now)
  },
  actuators,
  weather: null,
  history: null,
  extra: {
    recommendations: [],
    warnings: []
  }
};

return [{ json: result }];
