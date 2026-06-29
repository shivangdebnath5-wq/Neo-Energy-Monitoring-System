"use strict";

const STORAGE_KEY = "industrial-ems-readings-v1";
const EQUIPMENT_STATE_KEY = "industrial-ems-equipment-state-v1";
const COST_PER_KWH = 9.25;
const CARBON_KG_PER_KWH = 0.82;
const FUEL_COST_PER_LITER = 92;
const WATER_COST_PER_M3 = 45;
const STEAM_COST_PER_TON = 1850;
const AIR_COST_PER_M3 = 0.35;

const equipmentCatalog = [
  {
    name: "Energy Meter",
    category: "Electrical",
    monitor: "kWh, kW, kVA, PF, Voltage, Current, Frequency, MD, THD",
    opportunity: "Reduce peak demand, improve power factor, identify high energy consumption",
    metrics: ["kWh", "kW", "kVA", "PF", "Voltage", "Current", "Frequency", "MD", "THD"],
  },
  {
    name: "Electric Motor",
    category: "Motor",
    monitor: "Current, Voltage, RPM, Load %, Temperature, Vibration, Efficiency",
    opportunity: "Prevent overloading, optimize loading, detect inefficient motors",
    metrics: ["Current", "Voltage", "RPM", "Load %", "Temperature", "Vibration", "Efficiency", "kW", "Runtime"],
  },
  {
    name: "Water Pump",
    category: "Utility",
    monitor: "Flow, Pressure, Power, Current, Runtime, Efficiency",
    opportunity: "Detect oversizing, leakage, dry running, optimize pump efficiency",
    metrics: ["Flow", "Pressure", "Power", "Current", "Runtime", "Efficiency", "Temperature"],
  },
  {
    name: "Air Compressor",
    category: "Compressed Air",
    monitor: "Air Pressure, Flow, Power, Air Leakage, Runtime, Load/Unload %, Dew Point",
    opportunity: "Detect compressed air leaks, reduce idle running, optimize pressure",
    metrics: ["Air Pressure", "Flow", "Power", "Air Leakage", "Runtime", "Load/Unload %", "Dew Point"],
  },
  {
    name: "Air Receiver",
    category: "Compressed Air",
    monitor: "Pressure, Temperature, Moisture, Safety Valve Status",
    opportunity: "Maintain stable pressure, reduce compressor cycling",
    metrics: ["Pressure", "Temperature", "Moisture", "Safety Valve Status"],
  },
  {
    name: "Boiler",
    category: "Thermal",
    monitor: "Steam Pressure, Steam Flow, Fuel Consumption, Feed Water Temp, Flue Gas Temp, O2, Efficiency",
    opportunity: "Improve combustion efficiency, reduce fuel consumption",
    metrics: ["Steam Pressure", "Steam Flow", "Fuel Consumption", "Feed Water Temp", "Flue Gas Temp", "O2", "Efficiency"],
  },
  {
    name: "Chiller",
    category: "HVAC",
    monitor: "COP, Power, Chilled Water Temp, Condenser Temp, Flow, Compressor Load",
    opportunity: "Improve cooling efficiency, optimize setpoints",
    metrics: ["COP", "Power", "Chilled Water Temp", "Condenser Temp", "Flow", "Compressor Load"],
  },
  {
    name: "Cooling Tower",
    category: "HVAC",
    monitor: "Fan Power, Water Temperature, Approach, Flow Rate",
    opportunity: "Reduce condenser load and chiller power",
    metrics: ["Fan Power", "Water Temperature", "Approach", "Flow Rate"],
  },
  {
    name: "Cooling Water Pump",
    category: "HVAC",
    monitor: "Flow, Pressure, Power, Temperature",
    opportunity: "Optimize circulation and reduce pumping energy",
    metrics: ["Flow", "Pressure", "Power", "Temperature", "Runtime"],
  },
  {
    name: "AHU (Air Handling Unit)",
    category: "HVAC",
    monitor: "Air Flow, Fan Speed, Power, Temperature, Humidity",
    opportunity: "Reduce HVAC energy using VFD control",
    metrics: ["Air Flow", "Fan Speed", "Power", "Temperature", "Humidity", "Runtime"],
  },
  {
    name: "HVAC System",
    category: "HVAC",
    monitor: "Temperature, Humidity, Energy Consumption",
    opportunity: "Optimize HVAC scheduling and setpoints",
    metrics: ["Temperature", "Humidity", "Energy Consumption", "Runtime"],
  },
  {
    name: "Solar Plant",
    category: "Renewable",
    monitor: "Generation, Irradiance, Module Temp, Inverter Efficiency, PR",
    opportunity: "Maximize solar generation and detect faults",
    metrics: ["Generation", "Irradiance", "Module Temp", "Inverter Efficiency", "PR", "Fault Status"],
  },
  {
    name: "Battery Bank / UPS",
    category: "Power Backup",
    monitor: "Voltage, Current, SOC, SOH, Backup Time",
    opportunity: "Prevent battery failure and optimize charging",
    metrics: ["Voltage", "Current", "SOC", "SOH", "Backup Time", "Temperature"],
  },
  {
    name: "DG Set",
    category: "Power Backup",
    monitor: "Fuel Consumption, kWh Generated, Load %, Engine Temp, Oil Pressure, Runtime",
    opportunity: "Reduce fuel cost and improve loading efficiency",
    metrics: ["Fuel Consumption", "kWh Generated", "Load %", "Engine Temp", "Oil Pressure", "Runtime"],
  },
  {
    name: "Fuel Tank",
    category: "Fuel",
    monitor: "Fuel Level, Daily Consumption",
    opportunity: "Prevent losses and monitor fuel usage",
    metrics: ["Fuel Level", "Daily Consumption"],
  },
  {
    name: "Lighting System",
    category: "Facility",
    monitor: "Energy Consumption, Occupancy, Lux Level, Runtime",
    opportunity: "Reduce unnecessary lighting through automation",
    metrics: ["Energy Consumption", "Occupancy", "Lux Level", "Runtime"],
  },
  {
    name: "Water Meter",
    category: "Water",
    monitor: "Water Consumption, Flow Rate",
    opportunity: "Detect leakage and reduce water wastage",
    metrics: ["Water Consumption", "Flow Rate"],
  },
  {
    name: "Steam Distribution",
    category: "Thermal",
    monitor: "Pressure, Temperature, Steam Flow, Trap Health",
    opportunity: "Reduce steam leakage and heat loss",
    metrics: ["Pressure", "Temperature", "Steam Flow", "Trap Health"],
  },
  {
    name: "Exhaust Fan",
    category: "Ventilation",
    monitor: "Power, RPM, Runtime",
    opportunity: "Optimize ventilation energy",
    metrics: ["Power", "RPM", "Runtime"],
  },
  {
    name: "VFD (Variable Frequency Drive)",
    category: "Drives",
    monitor: "Speed, Frequency, Power, Current, Fault Status",
    opportunity: "Optimize motor speed and save energy",
    metrics: ["Speed", "Frequency", "Power", "Current", "Fault Status"],
  },
  {
    name: "Production Machine",
    category: "Production",
    monitor: "Power per Machine, Cycle Time, OEE, Idle Time",
    opportunity: "Calculate energy per product and reduce idle losses",
    metrics: ["Power per Machine", "Cycle Time", "OEE", "Idle Time", "Runtime", "Production Quantity"],
  },
  {
    name: "Process Equipment",
    category: "Process",
    monitor: "Temperature, Pressure, Flow, Power",
    opportunity: "Optimize process efficiency",
    metrics: ["Temperature", "Pressure", "Flow", "Power", "Runtime"],
  },
];

const numericMetricNames = new Set([
  "kWh", "kW", "kVA", "PF", "Voltage", "Current", "Frequency", "MD", "THD", "RPM", "Load %",
  "Temperature", "Vibration", "Efficiency", "Flow", "Pressure", "Power", "Runtime", "Air Pressure",
  "Air Leakage", "Load/Unload %", "Dew Point", "Moisture", "Steam Pressure", "Steam Flow",
  "Fuel Consumption", "Feed Water Temp", "Flue Gas Temp", "O2", "COP", "Chilled Water Temp",
  "Condenser Temp", "Compressor Load", "Fan Power", "Water Temperature", "Approach", "Flow Rate",
  "Air Flow", "Fan Speed", "Humidity", "Energy Consumption", "Generation", "Irradiance",
  "Module Temp", "Inverter Efficiency", "PR", "SOC", "SOH", "Backup Time", "kWh Generated",
  "Engine Temp", "Oil Pressure", "Fuel Level", "Daily Consumption", "Water Consumption",
  "Lux Level", "Speed", "Power per Machine", "Cycle Time", "OEE", "Idle Time", "Production Quantity",
]);

const units = {
  kWh: "kWh",
  kW: "kW",
  kVA: "kVA",
  PF: "",
  Voltage: "V",
  Current: "A",
  Frequency: "Hz",
  MD: "kW",
  THD: "%",
  RPM: "rpm",
  "Load %": "%",
  Temperature: "C",
  Vibration: "mm/s",
  Efficiency: "%",
  Flow: "m3/h",
  Pressure: "bar",
  Power: "kW",
  Runtime: "h",
  "Air Pressure": "bar",
  "Air Leakage": "%",
  "Load/Unload %": "%",
  "Dew Point": "C",
  Moisture: "%",
  "Steam Pressure": "bar",
  "Steam Flow": "TPH",
  "Fuel Consumption": "L",
  "Feed Water Temp": "C",
  "Flue Gas Temp": "C",
  O2: "%",
  COP: "",
  "Chilled Water Temp": "C",
  "Condenser Temp": "C",
  "Compressor Load": "%",
  "Fan Power": "kW",
  "Water Temperature": "C",
  Approach: "C",
  "Flow Rate": "m3/h",
  "Air Flow": "m3/h",
  "Fan Speed": "%",
  Humidity: "%",
  "Energy Consumption": "kWh",
  Generation: "kWh",
  Irradiance: "W/m2",
  "Module Temp": "C",
  "Inverter Efficiency": "%",
  PR: "%",
  SOC: "%",
  SOH: "%",
  "Backup Time": "min",
  "kWh Generated": "kWh",
  "Engine Temp": "C",
  "Oil Pressure": "bar",
  "Fuel Level": "%",
  "Daily Consumption": "L",
  "Water Consumption": "m3",
  "Lux Level": "lux",
  Speed: "%",
  "Power per Machine": "kW",
  "Cycle Time": "s",
  OEE: "%",
  "Idle Time": "h",
  "Production Quantity": "units",
};

let readings = loadReadings();
let editId = null;
let selectedDetailGroup = null;
let equipmentStates = loadEquipmentStates();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function loadReadings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveReadings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
}

function loadEquipmentStates() {
  try {
    return JSON.parse(localStorage.getItem(EQUIPMENT_STATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveEquipmentStates() {
  localStorage.setItem(EQUIPMENT_STATE_KEY, JSON.stringify(equipmentStates));
}

function currentDateTimeLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function fmt(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return number.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function latestByEquipment(name) {
  return readings
    .filter((entry) => entry.equipment === name)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
}

function latestReadings() {
  return equipmentCatalog
    .map((equipment) => latestByEquipment(equipment.name))
    .filter(Boolean);
}

function getMetricValue(entry, names) {
  if (!entry) return 0;
  for (const name of names) {
    const value = Number(entry.metrics[name]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function metricTotal(entries, names) {
  return entries.reduce((total, entry) => total + getMetricValue(entry, names), 0);
}

function powerFrom(entry) {
  return getMetricValue(entry, ["kW", "Power", "Power per Machine", "Fan Power"]);
}

function energyFrom(entry) {
  const direct = getMetricValue(entry, ["kWh", "Energy Consumption", "Generation", "kWh Generated"]);
  if (direct) return direct;
  const power = powerFrom(entry);
  const runtime = getMetricValue(entry, ["Runtime"]);
  return power && runtime ? power * runtime : 0;
}

function totalEnergy(entries = readings) {
  return entries.reduce((total, entry) => total + energyFrom(entry), 0);
}

function totalPower(entries = readings) {
  return entries.reduce((total, entry) => total + powerFrom(entry), 0);
}

function averageMetric(entries, names) {
  const values = entries.map((entry) => getMetricValue(entry, names)).filter((value) => Number.isFinite(value) && value > 0);
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function groupBy(entries, grouper) {
  return entries.reduce((groups, entry) => {
    const key = grouper(entry) || "Unassigned";
    groups[key] = groups[key] || [];
    groups[key].push(entry);
    return groups;
  }, {});
}

function byDateKey(entry) {
  return new Date(entry.timestamp).toISOString().slice(0, 10);
}

function costFromEnergy(kWh) {
  return kWh * COST_PER_KWH;
}

function carbonFromEnergy(kWh) {
  return kWh * CARBON_KG_PER_KWH;
}

function renderMetric(container, label, value, unit = "") {
  const displayUnit = unit ? ` ${unit}` : "";
  container.insertAdjacentHTML("beforeend", `<div class="metric"><strong>${label}</strong><span>${value}${displayUnit}</span></div>`);
}

function updateSummary() {
  const container = $("#summaryMetrics");
  container.innerHTML = "";
  const energy = totalEnergy();
  const power = totalPower();
  const cost = costFromEnergy(energy);
  const carbon = carbonFromEnergy(energy);
  const alarms = buildAlarms();
  $("#siteStatus").textContent = alarms.length ? `${alarms.length} active alerts need attention` : readings.length ? "Plant energy profile normal" : "Awaiting entries";
  renderMetric(container, "Total Plant Energy", fmt(energy), "kWh");
  renderMetric(container, "Instant Power", fmt(power), "kW");
  renderMetric(container, "Energy Cost", `Rs ${fmt(cost)}`);
  renderMetric(container, "Carbon Emission", fmt(carbon), "kg CO2");
  updatePlantStatus(alarms);
}

const statusGroups = {
  meter: ["Energy Meter"],
  motors: ["Electric Motor", "VFD (Variable Frequency Drive)", "Production Machine", "Process Equipment"],
  boiler: ["Boiler", "Steam Distribution"],
  chiller: ["Chiller", "Cooling Tower", "Cooling Water Pump", "AHU (Air Handling Unit)", "HVAC System"],
  solar: ["Solar Plant", "Battery Bank / UPS"],
  dg: ["DG Set", "Fuel Tank"],
};

const groupLabels = {
  meter: "Meter",
  motors: "Motors",
  boiler: "Boiler",
  chiller: "Chiller / HVAC",
  solar: "Solar / Battery",
  dg: "DG / Fuel",
};

function updatePlantStatus(alarms = buildAlarms()) {
  Object.entries(statusGroups).forEach(([group, equipmentNames]) => {
    const node = document.querySelector(`[data-status-node="${group}"]`);
    if (!node) return;
    const groupOn = isGroupOn(group);
    const hasReading = readings.some((entry) => equipmentNames.includes(entry.equipment));
    const groupAlarms = alarms.filter((alarm) => equipmentNames.includes(alarm.entry.equipment));
    const hasDanger = groupAlarms.some((alarm) => alarm.level === "danger");
    const hasWarn = groupAlarms.some((alarm) => alarm.level === "warn");
    const status = !groupOn ? "off" : !hasReading ? "no-data" : hasDanger ? "danger" : hasWarn ? "warn" : "normal";
    const label = status === "off" ? "Turned off" : status === "no-data" ? "No data entered" : status === "danger" ? "Critical alarm" : status === "warn" ? "Warning alarm" : "Normal";
    node.classList.remove("status-no-data", "status-normal", "status-warn", "status-danger", "status-off");
    node.classList.add(`status-${status}`);
    node.title = `${node.textContent.trim()}: ${label}${groupAlarms.length ? ` (${groupAlarms.length})` : ""}`;
    node.setAttribute("aria-label", node.title);
  });
}

function isGroupOn(group) {
  return equipmentStates[group] !== "off";
}

function renderDashboards() {
  const electrical = $("#electricalDashboard");
  const production = $("#productionDashboard");
  const sustainability = $("#sustainabilityDashboard");
  electrical.innerHTML = "";
  production.innerHTML = "";
  sustainability.innerHTML = "";

  const latestEnergyMeter = latestByEquipment("Energy Meter");
  const latestProduction = latestByEquipment("Production Machine");
  const energy = totalEnergy();
  const productionQty = metricTotal(readings, ["Production Quantity"]);
  const solar = metricTotal(readings.filter((entry) => entry.equipment === "Solar Plant"), ["Generation"]);
  const water = metricTotal(readings.filter((entry) => entry.equipment === "Water Meter"), ["Water Consumption"]);
  const steam = metricTotal(readings.filter((entry) => entry.equipment === "Steam Distribution" || entry.equipment === "Boiler"), ["Steam Flow"]);
  const fuel = metricTotal(readings.filter((entry) => entry.equipment === "DG Set" || entry.equipment === "Fuel Tank" || entry.equipment === "Boiler"), ["Fuel Consumption", "Daily Consumption"]);
  const runtime = metricTotal(readings, ["Runtime"]);
  const idle = metricTotal(readings, ["Idle Time"]);
  const downtime = readings.filter((entry) => getMetricValue(entry, ["Fault Status"]) || /fault|down|trip/i.test(entry.notes || "")).length;

  [
    ["Total Plant Energy", fmt(energy), "kWh"],
    ["Instant Power", fmt(totalPower()), "kW"],
    ["Maximum Demand", fmt(getMetricValue(latestEnergyMeter, ["MD"])), "kW"],
    ["Power Factor", fmt(getMetricValue(latestEnergyMeter, ["PF"]), 3), ""],
    ["Voltage", fmt(getMetricValue(latestEnergyMeter, ["Voltage"])), "V"],
    ["Current", fmt(getMetricValue(latestEnergyMeter, ["Current"])), "A"],
    ["Frequency", fmt(getMetricValue(latestEnergyMeter, ["Frequency"])), "Hz"],
    ["THD", fmt(getMetricValue(latestEnergyMeter, ["THD"])), "%"],
    ["Cost per Hour", `Rs ${fmt(totalPower() * COST_PER_KWH)}`, ""],
    ["Energy Cost Today", `Rs ${fmt(costFromEnergy(todayEntries().reduce((sum, entry) => sum + energyFrom(entry), 0)))}`, ""],
    ["Carbon Emission", fmt(carbonFromEnergy(energy)), "kg CO2"],
  ].forEach(([label, value, unit]) => renderMetric(electrical, label, value, unit));

  [
    ["Production Quantity", fmt(productionQty), "units"],
    ["Energy per Unit", productionQty ? fmt(energy / productionQty, 3) : "0", "kWh/unit"],
    ["Machine Efficiency", fmt(averageMetric(readings, ["Efficiency"])), "%"],
    ["OEE", fmt(getMetricValue(latestProduction, ["OEE"])), "%"],
    ["Idle Time", fmt(idle), "h"],
    ["Runtime", fmt(runtime), "h"],
    ["Downtime Events", fmt(downtime, 0), ""],
  ].forEach(([label, value, unit]) => renderMetric(production, label, value, unit));

  [
    ["CO2 Emission", fmt(carbonFromEnergy(energy)), "kg"],
    ["Water Consumption", fmt(water), "m3"],
    ["Steam Consumption", fmt(steam), "TPH"],
    ["Fuel Consumption", fmt(fuel), "L"],
    ["Solar Generation", fmt(solar), "kWh"],
    ["Renewable Energy", energy ? fmt((solar / energy) * 100) : "0", "%"],
    ["Carbon Saving", fmt(carbonFromEnergy(solar)), "kg CO2"],
  ].forEach(([label, value, unit]) => renderMetric(sustainability, label, value, unit));

  const latest = readings.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  $("#lastUpdated").textContent = latest ? `Last updated ${new Date(latest.timestamp).toLocaleString()}` : "No readings saved yet.";
}

function todayEntries() {
  const today = new Date().toISOString().slice(0, 10);
  return readings.filter((entry) => byDateKey(entry) === today);
}

function buildAlarms() {
  const alarms = [];
  latestReadings().forEach((entry) => {
    const m = entry.metrics;
    const add = (level, title, detail) => alarms.push({ level, title, detail, entry });
    if (Number(m.PF) > 0 && Number(m.PF) < 0.95) add("warn", "Low Power Factor", `${entry.equipment} PF is ${m.PF}.`);
    if (Number(m.MD) > 500) add("danger", "High Demand Alert", `${entry.equipment} demand is ${m.MD} kW.`);
    if (Number(m.THD) > 8) add("warn", "High THD", `${entry.equipment} THD is ${m.THD}%.`);
    if (Number(m.Voltage) > 460 || Number(m.Voltage) < 360 && Number(m.Voltage) > 0) add("warn", "Voltage Imbalance", `${entry.equipment} voltage is ${m.Voltage} V.`);
    if (["Electric Motor", "VFD (Variable Frequency Drive)", "Production Machine"].includes(entry.equipment) && Number(m["Load %"]) > 90) add("danger", "Motor Overload", `${entry.equipment} load is ${m["Load %"]}%.`);
    if (entry.equipment === "Electric Motor" && Number(m.Temperature) > 80) add("danger", "Motor High Temperature", `Motor temperature is ${m.Temperature} C.`);
    if (entry.equipment === "Battery Bank / UPS" && Number(m.Temperature) > 45) add("danger", "Battery High Temperature", `Battery temperature is ${m.Temperature} C.`);
    if (entry.equipment === "DG Set" && Number(m["Engine Temp"]) > 95) add("danger", "DG Engine High Temperature", `DG engine temperature is ${m["Engine Temp"]} C.`);
    if (entry.equipment === "Boiler" && Number(m["Flue Gas Temp"]) > 220) add("danger", "Boiler Stack Temperature High", `Flue gas temperature is ${m["Flue Gas Temp"]} C.`);
    if (Number(m["Air Leakage"]) > 10) add("warn", "Compressor Leakage", `${entry.equipment} leakage is ${m["Air Leakage"]}%.`);
    if (entry.equipment === "Boiler" && Number(m.Efficiency) > 0 && Number(m.Efficiency) < 80) add("warn", "Boiler Efficiency Drop", `Boiler efficiency is ${m.Efficiency}%.`);
    if (entry.equipment === "Chiller" && Number(m.COP) > 0 && Number(m.COP) < 3.5) add("warn", "Chiller COP Low", `Chiller COP is ${m.COP}.`);
    if (/pump/i.test(entry.equipment) && Number(m.Flow) === 0 && Number(m.Power) > 0) add("danger", "Pump Dry Running", `${entry.equipment} has power with zero flow.`);
    if (entry.equipment === "Solar Plant" && /fault|trip|fail/i.test(String(m["Fault Status"] || ""))) add("danger", "Solar Inverter Fault", String(m["Fault Status"]));
    if (entry.equipment === "DG Set" && Number(m["Load %"]) > 0 && Number(m["Load %"]) < 40) add("warn", "DG Light Load", `DG load is ${m["Load %"]}%.`);
    if (entry.equipment === "Fuel Tank" && Number(m["Fuel Level"]) > 0 && Number(m["Fuel Level"]) < 20) add("danger", "DG Fuel Low", `Fuel level is ${m["Fuel Level"]}%.`);
    if (entry.equipment === "Steam Distribution" && Number(m.Pressure) > 0 && Number(m.Pressure) < 4) add("warn", "Steam Pressure Drop", `Steam pressure is ${m.Pressure} bar.`);
    if (entry.equipment === "Steam Distribution" && /fail|leak|bad|suspect/i.test(String(m["Trap Health"] || ""))) add("warn", "Steam Trap Health", `Trap health is ${m["Trap Health"]}.`);
    if (/communication/i.test(entry.notes || "")) add("warn", "Communication Failure", entry.notes);
  });
  return alarms.sort((a, b) => (a.level === "danger" ? -1 : 1) - (b.level === "danger" ? -1 : 1));
}

function buildRecommendations() {
  const recs = [];
  readings.forEach((entry) => {
    const m = entry.metrics;
    const add = (title, detail) => recs.push({ title, detail, entry });
    if (Number(m["Load %"]) > 90) add("Check motor sizing or reduce load", `${entry.equipment} loading exceeds 90%.`);
    if (Number(m.PF) > 0 && Number(m.PF) < 0.95) add("Switch capacitor bank", `Power factor is below 0.95 on ${entry.equipment}.`);
    if (Number(m["Load/Unload %"]) > 30) add("Repair air leaks or optimize pressure", `Compressor unload time is ${m["Load/Unload %"]}%.`);
    if (entry.equipment === "Chiller" && Number(m.COP) > 0 && Number(m.COP) < 3.5) add("Clean condenser or adjust chilled water temperature", `COP is below target on ${entry.equipment}.`);
    if (Number(m["Flue Gas Temp"]) > 220) add("Inspect insulation or economizer", `Boiler stack temperature is high at ${m["Flue Gas Temp"]} C.`);
    if (entry.equipment === "Steam Distribution" && Number(m.Pressure) > 0 && Number(m.Pressure) < 4) add("Check steam traps and pipeline leakage", "Steam pressure drop detected.");
    if (/pump/i.test(entry.equipment) && Number(m.Efficiency) > 0 && Number(m.Efficiency) < 60) add("Reduce speed using VFD", `${entry.equipment} appears away from best efficiency point.`);
    if (entry.equipment === "Solar Plant" && Number(m.PR) > 0 && Number(m.PR) < 70) add("Clean panels or inspect inverter", `Solar performance ratio is ${m.PR}%.`);
    if (entry.equipment === "DG Set" && Number(m["Load %"]) > 0 && Number(m["Load %"]) < 40) add("Avoid light-load DG operation", `DG load is below 40%.`);
    if (entry.equipment === "Lighting System" && /yes|occupied/i.test(String(m.Occupancy || "")) === false && Number(m.Runtime) > 0) add("Turn off lighting in unoccupied areas", "Lighting runtime exists with no occupancy.");
  });
  return recs;
}

function renderAlarmsAndRecommendations() {
  const alarmList = $("#alarmList");
  const recList = $("#recommendationList");
  const alarms = buildAlarms();
  const recs = buildRecommendations();
  alarmList.innerHTML = alarms.length
    ? alarms.slice(0, 12).map((alarm) => `<div class="notice ${alarm.level}"><strong>${alarm.title}</strong><span>${alarm.detail} ${alarm.entry.equipment} at ${new Date(alarm.entry.timestamp).toLocaleString()}</span></div>`).join("")
    : `<div class="notice good"><strong>No active alarms</strong><span>Saved readings are within configured thresholds.</span></div>`;
  recList.innerHTML = recs.length
    ? recs.slice(0, 12).map((rec) => `<div class="notice"><strong>${rec.title}</strong><span>${rec.detail} Logged at ${new Date(rec.entry.timestamp).toLocaleString()}</span></div>`).join("")
    : `<div class="notice good"><strong>No recommendations yet</strong><span>Add readings to generate equipment-specific actions.</span></div>`;
}

function renderEquipmentSelect() {
  const select = $("#equipmentSelect");
  select.innerHTML = equipmentCatalog.map((item) => `<option value="${item.name}">${item.name}</option>`).join("");
}

function renderMetricInputs() {
  const selected = equipmentCatalog.find((item) => item.name === $("#equipmentSelect").value);
  const container = $("#metricInputs");
  container.innerHTML = selected.metrics.map((name) => {
    const unit = units[name] ? ` (${units[name]})` : "";
    const type = numericMetricNames.has(name) ? "number" : "text";
    const step = type === "number" ? `step="any"` : "";
    return `<label>${name}${unit}<input name="${name}" type="${type}" ${step} placeholder="${name}${unit}" /></label>`;
  }).join("");
}

function renderEntries() {
  const tbody = $("#entryRows");
  const rows = readings.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 80);
  tbody.innerHTML = rows.length
    ? rows.map((entry) => {
      const keyValues = Object.entries(entry.metrics)
        .filter(([, value]) => value !== "")
        .slice(0, 5)
        .map(([key, value]) => `${key}: ${value}${units[key] ? ` ${units[key]}` : ""}`)
        .join(", ");
      return `<tr>
        <td>${new Date(entry.timestamp).toLocaleString()}</td>
        <td>${entry.equipment}</td>
        <td>${entry.department || "Unassigned"}</td>
        <td>${entry.shift || "General"}</td>
        <td>${keyValues || "No metrics"}</td>
        <td><button class="delete-btn" type="button" data-delete="${entry.id}">Delete</button></td>
      </tr>`;
    }).join("")
    : `<tr><td colspan="6">No manual readings saved yet.</td></tr>`;
}

function renderEquipmentCards() {
  const term = $("#equipmentSearch").value.toLowerCase();
  const cards = equipmentCatalog.filter((item) => {
    const blob = `${item.name} ${item.category} ${item.monitor} ${item.opportunity}`.toLowerCase();
    return blob.includes(term);
  });
  $("#equipmentCards").innerHTML = cards.map((item) => `
    <article class="equipment-card" data-equipment-name="${item.name}">
      <div>
        <p class="eyebrow">${item.category}</p>
        <h3>${item.name}</h3>
      </div>
      <div>
        <strong>What to Monitor</strong>
        <div class="tag-list">${item.metrics.map((metric) => `<span class="tag">${metric}</span>`).join("")}</div>
      </div>
      <div>
        <strong>Energy Saving Opportunity</strong>
        <p>${item.opportunity}</p>
      </div>
      <button class="secondary detail-card-btn" type="button" data-equipment-detail="${item.name}">View Details</button>
    </article>
  `).join("");
}

function openDetail(groupOrEquipment) {
  selectedDetailGroup = statusGroups[groupOrEquipment] ? groupOrEquipment : groupForEquipment(groupOrEquipment);
  if (!selectedDetailGroup) return;
  $("#detailPanel").classList.add("active");
  renderDetailPanel();
  $("#detailPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function groupForEquipment(equipmentName) {
  return Object.entries(statusGroups).find(([, names]) => names.includes(equipmentName))?.[0] || null;
}

function renderDetailPanel() {
  if (!selectedDetailGroup) return;
  const names = statusGroups[selectedDetailGroup];
  const entries = readings.filter((entry) => names.includes(entry.equipment)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestEntries = names.map((name) => latestByEquipment(name)).filter(Boolean);
  const alarms = buildAlarms().filter((alarm) => names.includes(alarm.entry.equipment));
  const recs = buildRecommendations().filter((rec) => names.includes(rec.entry.equipment));
  $("#detailTitle").textContent = `${groupLabels[selectedDetailGroup] || titleCase(selectedDetailGroup)} Detail`;
  $("#equipmentPowerToggle").checked = isGroupOn(selectedDetailGroup);
  $("#equipmentPowerLabel").textContent = isGroupOn(selectedDetailGroup) ? "On" : "Off";

  const readingsBox = $("#detailReadings");
  readingsBox.innerHTML = "";
  if (!latestEntries.length) {
    readingsBox.innerHTML = `<div class="notice"><strong>No readings</strong><span>Enter manual readings to view equipment values.</span></div>`;
  } else {
    latestEntries.forEach((entry) => {
      Object.entries(entry.metrics).slice(0, 8).forEach(([key, value]) => {
        renderMetric(readingsBox, `${entry.equipment}: ${key}`, `${value}${units[key] ? ` ${units[key]}` : ""}`);
      });
    });
  }

  $("#detailIssues").innerHTML = !isGroupOn(selectedDetailGroup)
    ? `<div class="notice warn"><strong>Equipment turned off</strong><span>This group is marked off by the operator. Alarms are still visible from readings, but the plant indicator is grey.</span></div>`
    : alarms.length
      ? alarms.map((alarm) => `<div class="notice ${alarm.level}"><strong>${alarm.title}</strong><span>${alarm.detail} ${new Date(alarm.entry.timestamp).toLocaleString()}</span></div>`).join("")
      : `<div class="notice good"><strong>No active issues</strong><span>Latest readings are within configured limits.</span></div>`;

  $("#detailGuidance").innerHTML = `
    <div class="notice"><strong>Equipment included</strong><span>${names.join(", ")}</span></div>
    ${recs.length ? recs.map((rec) => `<div class="notice"><strong>${rec.title}</strong><span>${rec.detail}</span></div>`).join("") : `<div class="notice good"><strong>No action suggested</strong><span>No recommendation is currently triggered.</span></div>`}
  `;
  drawEquipmentTrend(entries);
}

function titleCase(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

function drawEquipmentTrend(entries) {
  const canvas = $("#equipmentTrendChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d8e0e2";
  for (let i = 0; i < 5; i += 1) {
    const y = 35 + i * 55;
    ctx.beginPath();
    ctx.moveTo(55, y);
    ctx.lineTo(canvas.width - 25, y);
    ctx.stroke();
  }
  const points = entries.slice().reverse().map((entry) => ({
    label: new Date(entry.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: energyFrom(entry) || powerFrom(entry) || getMetricValue(entry, ["Fuel Level", "COP", "Efficiency", "Pressure", "Flow", "Load %"]),
  })).filter((point) => Number.isFinite(point.value));
  if (!points.length) {
    ctx.fillStyle = "#60707b";
    ctx.font = "16px Arial";
    ctx.fillText("No trend data available.", 55, 150);
    return;
  }
  const max = Math.max(...points.map((point) => point.value), 1);
  const xStep = (canvas.width - 100) / Math.max(points.length - 1, 1);
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 4;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = 55 + index * xStep;
    const y = 260 - (point.value / max) * 220;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  points.forEach((point, index) => {
    const x = 55 + index * xStep;
    const y = 260 - (point.value / max) * 220;
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#172026";
    ctx.font = "12px Arial";
    ctx.fillText(fmt(point.value), x - 12, Math.max(18, y - 10));
    ctx.fillText(point.label, x - 20, 286);
  });
}

function drawTrendChart() {
  const canvas = $("#trendChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const metric = $("#chartMetric").value;
  const groups = groupBy(readings, byDateKey);
  const points = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([date, entries]) => {
    const kWh = totalEnergy(entries);
    const value = metric === "kWh" ? kWh : metric === "kW" ? totalPower(entries) : metric === "cost" ? costFromEnergy(kWh) : carbonFromEnergy(kWh);
    return { label: date.slice(5), value };
  });

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d8e0e2";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i += 1) {
    const y = 40 + i * 60;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 30, y);
    ctx.stroke();
  }

  if (!points.length) {
    ctx.fillStyle = "#60707b";
    ctx.font = "18px Arial";
    ctx.fillText("Add readings to view trends.", 60, 180);
    return;
  }

  const max = Math.max(...points.map((point) => point.value), 1);
  const xStep = (canvas.width - 110) / Math.max(points.length - 1, 1);
  const chartHeight = 250;
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 4;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = 60 + index * xStep;
    const y = 300 - (point.value / max) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const x = 60 + index * xStep;
    const y = 300 - (point.value / max) * chartHeight;
    ctx.fillStyle = "#0f766e";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#172026";
    ctx.font = "12px Arial";
    ctx.fillText(point.label, x - 16, 330);
    ctx.fillText(fmt(point.value), x - 16, Math.max(22, y - 12));
  });
}

function renderBreakdowns() {
  const container = $("#breakdownList");
  const sections = [
    ["Weekly Trend", groupBy(readings, (entry) => `Week ${weekNumber(new Date(entry.timestamp))}`)],
    ["Monthly Trend", groupBy(readings, (entry) => new Date(entry.timestamp).toLocaleString(undefined, { month: "short", year: "numeric" }))],
    ["Shift-wise Consumption", groupBy(readings, (entry) => entry.shift)],
    ["Department-wise Consumption", groupBy(readings, (entry) => entry.department)],
    ["Machine-wise Consumption", groupBy(readings, (entry) => entry.equipment)],
    ["Cost Analysis", groupBy(readings, (entry) => entry.category)],
    ["Peak Demand Trend", groupBy(readings, byDateKey)],
  ];
  container.innerHTML = sections.map(([title, groups]) => {
    const lines = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).slice(0, 6).map(([label, entries]) => {
      const energy = totalEnergy(entries);
      const value = title === "Peak Demand Trend" ? `${fmt(Math.max(...entries.map((entry) => getMetricValue(entry, ["MD", "Power", "kW"])), 0))} kW` : `${fmt(energy)} kWh, Rs ${fmt(costFromEnergy(energy))}`;
      return `<div>${label}: <strong>${value}</strong></div>`;
    }).join("") || "<div>No data</div>";
    return `<div class="notice"><strong>${title}</strong>${lines}</div>`;
  }).join("");
}

function weekNumber(date) {
  const first = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - first) / 86400000) + first.getDay() + 1) / 7);
}

function renderReport() {
  const type = $("#reportType").value;
  const energy = totalEnergy();
  const fuel = metricTotal(readings, ["Fuel Consumption", "Daily Consumption"]);
  const steam = metricTotal(readings, ["Steam Flow"]);
  const water = metricTotal(readings, ["Water Consumption"]);
  const air = metricTotal(readings, ["Flow", "Air Flow"]);
  const reportGroups = type === "machine" ? groupBy(readings, (entry) => entry.equipment)
    : type === "department" ? groupBy(readings, (entry) => entry.department)
      : type === "shift" ? groupBy(readings, (entry) => entry.shift)
        : type === "monthly" ? groupBy(readings, (entry) => new Date(entry.timestamp).toLocaleString(undefined, { month: "short", year: "numeric" }))
          : type === "weekly" ? groupBy(readings, (entry) => `Week ${weekNumber(new Date(entry.timestamp))}`)
            : groupBy(readings, byDateKey);

  const kpis = [
    ["Total Energy", `${fmt(energy)} kWh`],
    ["Daily Cost", `Rs ${fmt(costFromEnergy(totalEnergy(todayEntries())))}`],
    ["Monthly Cost", `Rs ${fmt(costFromEnergy(energy))}`],
    ["Annual Cost Projection", `Rs ${fmt(costFromEnergy(energy) * 12)}`],
    ["Fuel Cost", `Rs ${fmt(fuel * FUEL_COST_PER_LITER)}`],
    ["Steam Cost", `Rs ${fmt(steam * STEAM_COST_PER_TON)}`],
    ["Water Cost", `Rs ${fmt(water * WATER_COST_PER_M3)}`],
    ["Compressed Air Cost", `Rs ${fmt(air * AIR_COST_PER_M3)}`],
    ["Carbon Emission", `${fmt(carbonFromEnergy(energy))} kg CO2`],
  ];

  $("#reportOutput").innerHTML = `
    <h3>${$("#reportType").selectedOptions[0].text}</h3>
    <div class="report-kpis">${kpis.map(([label, value]) => `<div class="metric"><strong>${label}</strong><span>${value}</span></div>`).join("")}</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Group</th><th>Entries</th><th>Energy</th><th>Cost</th><th>Carbon</th></tr></thead>
        <tbody>
          ${Object.entries(reportGroups).sort(([a], [b]) => a.localeCompare(b)).map(([label, entries]) => {
            const groupEnergy = totalEnergy(entries);
            return `<tr><td>${label}</td><td>${entries.length}</td><td>${fmt(groupEnergy)} kWh</td><td>Rs ${fmt(costFromEnergy(groupEnergy))}</td><td>${fmt(carbonFromEnergy(groupEnergy))} kg CO2</td></tr>`;
          }).join("") || `<tr><td colspan="5">No data available.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function saveEntry(event) {
  event.preventDefault();
  const equipment = equipmentCatalog.find((item) => item.name === $("#equipmentSelect").value);
  const metrics = {};
  $$("#metricInputs input").forEach((input) => {
    if (input.value === "") return;
    metrics[input.name] = input.type === "number" ? Number(input.value) : input.value.trim();
  });
  const entry = {
    id: editId || crypto.randomUUID(),
    timestamp: $("#timestamp").value,
    equipment: equipment.name,
    category: equipment.category,
    department: $("#department").value.trim() || "Utilities",
    shift: $("#shift").value,
    metrics,
    notes: $("#notes").value.trim(),
  };
  if (!entry.timestamp) {
    alert("Please enter a timestamp.");
    return;
  }
  if (!Object.keys(metrics).length) {
    alert("Please enter at least one monitored value.");
    return;
  }
  readings = editId ? readings.map((item) => item.id === editId ? entry : item) : [...readings, entry];
  editId = null;
  saveReadings();
  clearForm();
  renderAll();
}

function clearForm() {
  $("#timestamp").value = currentDateTimeLocal();
  $("#department").value = "Utilities";
  $("#shift").value = "General";
  $("#notes").value = "";
  renderMetricInputs();
}

function deleteEntry(id) {
  readings = readings.filter((entry) => entry.id !== id);
  saveReadings();
  renderAll();
}

function exportJson() {
  downloadFile("industrial-ems-readings.json", JSON.stringify({ exportedAt: new Date().toISOString(), readings }, null, 2), "application/json");
}

function exportCsv() {
  const metricNames = Array.from(new Set(equipmentCatalog.flatMap((item) => item.metrics)));
  const headers = ["timestamp", "equipment", "category", "department", "shift", "notes", ...metricNames];
  const lines = [headers.join(",")];
  readings.forEach((entry) => {
    const row = headers.map((header) => csvCell(header in entry ? entry[header] : entry.metrics[header] ?? ""));
    lines.push(row.join(","));
  });
  downloadFile("industrial-ems-readings.csv", lines.join("\n"), "text/csv");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function seedSampleData() {
  if (readings.length && !confirm("Replace current readings with sample data?")) return;
  const now = new Date();
  const sample = [
    ["Energy Meter", -5, { kWh: 1840, kW: 312, kVA: 340, PF: 0.92, Voltage: 414, Current: 486, Frequency: 50.1, MD: 528, THD: 9.4 }],
    ["Electric Motor", -4, { Current: 142, Voltage: 414, RPM: 1470, "Load %": 93, Temperature: 78, Vibration: 5.1, Efficiency: 86, kW: 75, Runtime: 8 }],
    ["Water Pump", -4, { Flow: 0, Pressure: 2.1, Power: 18, Current: 32, Runtime: 2, Efficiency: 52 }],
    ["Air Compressor", -3, { "Air Pressure": 7.2, Flow: 620, Power: 94, "Air Leakage": 14, Runtime: 8, "Load/Unload %": 36, "Dew Point": 5 }],
    ["Boiler", -3, { "Steam Pressure": 8.5, "Steam Flow": 4.2, "Fuel Consumption": 420, "Feed Water Temp": 76, "Flue Gas Temp": 236, O2: 5.8, Efficiency: 76 }],
    ["Chiller", -2, { COP: 3.1, Power: 128, "Chilled Water Temp": 8.5, "Condenser Temp": 36, Flow: 180, "Compressor Load": 82 }],
    ["Cooling Tower", -2, { "Fan Power": 18, "Water Temperature": 31, Approach: 5.2, "Flow Rate": 190 }],
    ["AHU (Air Handling Unit)", -2, { "Air Flow": 8200, "Fan Speed": 76, Power: 22, Temperature: 24, Humidity: 58, Runtime: 9 }],
    ["Solar Plant", -1, { Generation: 540, Irradiance: 760, "Module Temp": 48, "Inverter Efficiency": 96, PR: 68, "Fault Status": "Normal" }],
    ["DG Set", -1, { "Fuel Consumption": 85, "kWh Generated": 210, "Load %": 34, "Engine Temp": 88, "Oil Pressure": 4.2, Runtime: 3 }],
    ["Fuel Tank", -1, { "Fuel Level": 18, "Daily Consumption": 85 }],
    ["Lighting System", 0, { "Energy Consumption": 92, Occupancy: "No", "Lux Level": 520, Runtime: 6 }],
    ["Water Meter", 0, { "Water Consumption": 140, "Flow Rate": 18 }],
    ["Steam Distribution", 0, { Pressure: 3.6, Temperature: 166, "Steam Flow": 3.9, "Trap Health": "Suspect" }],
    ["Production Machine", 0, { "Power per Machine": 42, "Cycle Time": 36, OEE: 71, "Idle Time": 1.4, Runtime: 7.5, "Production Quantity": 1250 }],
  ].map(([name, hourOffset, metrics], index) => {
    const equipment = equipmentCatalog.find((item) => item.name === name);
    const time = new Date(now.getTime() + hourOffset * 3600000);
    return {
      id: crypto.randomUUID(),
      timestamp: time.toISOString().slice(0, 16),
      equipment: name,
      category: equipment.category,
      department: index % 3 === 0 ? "Utilities" : index % 3 === 1 ? "Production" : "HVAC",
      shift: index % 2 === 0 ? "A" : "B",
      metrics,
      notes: "",
    };
  });
  readings = sample;
  saveReadings();
  renderAll();
}

function renderAll() {
  updateSummary();
  renderDashboards();
  renderAlarmsAndRecommendations();
  renderEntries();
  renderEquipmentCards();
  drawTrendChart();
  renderBreakdowns();
  renderReport();
  if (selectedDetailGroup) renderDetailPanel();
}

function wireEvents() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((item) => item.classList.remove("active"));
      $$(".view").forEach((view) => view.classList.remove("active"));
      tab.classList.add("active");
      $(`#${tab.dataset.view}`).classList.add("active");
      drawTrendChart();
    });
  });
  $("#equipmentSelect").addEventListener("change", renderMetricInputs);
  $("#entryForm").addEventListener("submit", saveEntry);
  $("#clearFormBtn").addEventListener("click", clearForm);
  $("#equipmentSearch").addEventListener("input", renderEquipmentCards);
  $("#chartMetric").addEventListener("change", drawTrendChart);
  $("#reportType").addEventListener("change", renderReport);
  $("#exportJsonBtn").addEventListener("click", exportJson);
  $("#exportCsvBtn").addEventListener("click", exportCsv);
  $("#printBtn").addEventListener("click", () => window.print());
  $("#seedBtn").addEventListener("click", seedSampleData);
  $("#entryRows").addEventListener("click", (event) => {
    const id = event.target.dataset.delete;
    if (id && confirm("Delete this reading?")) deleteEntry(id);
  });
  $$(".node[data-detail-group]").forEach((node) => {
    node.addEventListener("click", () => openDetail(node.dataset.detailGroup));
  });
  $("#equipmentCards").addEventListener("click", (event) => {
    const equipmentName = event.target.dataset.equipmentDetail;
    if (equipmentName) openDetail(equipmentName);
  });
  $("#closeDetailBtn").addEventListener("click", () => {
    selectedDetailGroup = null;
    $("#detailPanel").classList.remove("active");
  });
  $("#equipmentPowerToggle").addEventListener("change", (event) => {
    if (!selectedDetailGroup) return;
    equipmentStates[selectedDetailGroup] = event.target.checked ? "on" : "off";
    saveEquipmentStates();
    renderAll();
  });
}

renderEquipmentSelect();
wireEvents();
clearForm();
renderAll();
