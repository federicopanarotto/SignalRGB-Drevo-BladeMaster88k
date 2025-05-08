export function Name() { return "Drevo Blade Master 88k" }
export function VendorId() { return 0x1a2c }
export function ProductId() { return 0xb58f }
export function Publisher() { return "federicopanarotto" }
export function Documentation() { return "troubleshooting/brand" }
export function Size() { return [19, 8]; }
export function DeviceType() { return "keyboard" }
export function ImageUrl() { return "https://i.ibb.co/hqc6ByL/bmte-01.png" }

export function ControllableParameters() {
  return [
    { "property": "shutdownColor", "group": "lighting", "label": "Shutdown Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
    { "property": "LightingMode", "group": "lighting", "label": "Lighting Mode", "type": "combobox", "values": ["Canvas", "Forced"], "default": "Canvas" },
    { "property": "forcedColor", "group": "lighting", "label": "Forced Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
    { "property": "barColor", "group": "lighting", "label": "Bar Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
    { "property": "delay", "label": "Delay", "step": "50", "min": "0", "max": "1000", "type": "number", "default": "100" },
  ];
}

export function Validate(endpoint) {
  return endpoint.interface === 0
    && endpoint.usage === 0x0001
    && endpoint.usage_page === 0xff00
    && endpoint.collection === 0x0004
}

let vLedNames = [
  "ESC", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PRTSC", "SCRLK", "PAUSE",
  "\\", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", '\'', "ì", "backspace", "INS", "HOME", "PG UP",
  "TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "è", "+", "return", "DEL", "END", "PG DN",
  "CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ò", "à", "ù",
  "SHIFT", "<", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "-", "SHIFT", "UP",
  "CTRL", "WIN", "ALT", "SPACE", "ALT GR", "MENU", "FN", "CTRL", "LEFT", "DOWN", "RIGHT",

  "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10", "L11", "L12", "L13", "L14", "L15",
  "L16", "L17", "L18", "L19", "L20", "L21",
  "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "L31", "L32", "L33", "L34", "L35",
  "L36", "L37", "L38", "L39", "L40"
];

let vLedPositions = [
  [1, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1], [15, 1], [16, 1], [17, 1],
  [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2], [15, 2], [16, 2], [17, 2],
  [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3], [14, 3], [15, 3], [16, 3], [17, 3],
  [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4],
  [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5], [16, 5],
  [1, 6], [2, 6], [3, 6], [7, 6], [11, 6], [12, 6], [13, 6], [14, 6], [15, 6], [16, 6], [17, 6],

  // [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [10, 0], [11, 0], [12, 0], [13, 0], [15, 0], [16, 0], [17, 0],
  // [18, 1],
  // [18, 2],
  // [18, 3],
  // [18, 4],
  // [18, 5],
  // [18, 6],
  // [17, 7], [16, 7], [15, 7], [14, 7], [13, 7], [10, 7], [8, 7], [7, 7], [6, 7], [5, 7], [4, 7], [3, 7], [2, 7], [1, 7],
  // [0, 5],
  // [0, 4],
  // [0, 3],
  // [0, 2],
  // [0, 1]
];

export function LedNames() { return vLedNames }
export function LedPositions() { return vLedPositions }

export function Initialize() {
  device.log(`Start plugin: ${Name()}, created by ${Publisher()}`);
  device.write([0x05, 0xfa, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 8)
}

export function Render() {
  sendColors();
  device.pause(delay);
}

export function Shutdown() { sendColors(shutdownColor) }

const specialPackets = [
  [0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
  [0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x72],
]

let lastUpdate = 0;

function sendColors(overrideColor) {
  let colors = [];

  for (let idx = 0; idx < vLedPositions.length; idx++) {
    let [iPxX, iPxY] = vLedPositions[idx];

    let color;
    if (overrideColor) {
      color = hexToRgb(overrideColor);
    } else if (LightingMode === "Forced") {
      color = hexToRgb(forcedColor);
    } else {
      color = device.color(iPxX, iPxY);
    }

    colors.push(color);
  }

  let firstPacket = new Array(8).fill(0x00);
  firstPacket[0] = 0x05;
  firstPacket[1] = 0xf3;
  firstPacket[4] = 0x80;
  firstPacket[5] = colors[0][0];
  firstPacket[6] = colors[0][1];
  firstPacket[7] = colors[0][2];
  device.write(firstPacket, 8);

  for (let i = 1; i < colors.length; i += 2) {
    let packet = new Array(8).fill(0x00);
    packet[0] = 0x05;
    packet[1] = 0x00;

    packet[2] = colors[i][0];
    packet[3] = colors[i][1];
    packet[4] = colors[i][2];

    if (i + 1 < colors.length) {
      packet[5] = colors[i + 1][0];
      packet[6] = colors[i + 1][1];
      packet[7] = colors[i + 1][2];
    }

    device.write(packet, 8);
  }

  // device.write(specialPackets[0], 8)
  // device.write(specialPackets[0], 8)
  // device.write(specialPackets[1], 8)
}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let colors = [];
  colors[0] = parseInt(result[1], 16);
  colors[1] = parseInt(result[2], 16);
  colors[2] = parseInt(result[3], 16);
  return colors;
}
