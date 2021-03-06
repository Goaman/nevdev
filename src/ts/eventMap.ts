import { EventTypeNames, EventConstants } from './constantNames';

export interface EventTypeDefinition {
  /**
   * The name of the type.
   */
  name: string;
  /**
   * The event codes that the type has.
   */
  events: Record<number, string[]>;
}
/**
 * A map from the event type number to it's definition
 */
export type EventMap = Record<number, EventTypeDefinition>;

/**
 * The integer constants defined in `linux/input.h` and
 * `linux/input-event-codes.h`.
 *
 * Exposed constants:
 *
 * ```
 * SYN, REL, ABS, MSC, SW, LED, SND, REP, FF, FF_STATUS, KEY, ID, BUS, INPUT_PROP
 * ```
 *
 * The EventCodes provide a reverse and forward mappings of the names and values
 * of the above mentioned constants:
 *
 * ```
 * > eventCodes.KEY_A
 * 30
 *
 * > eventCodes.KEY[30]
 * ['KEY_A'] // One key can have multiples names.
 *
 * > eventCodes.REL[0]
 * ['REL_X']
 *
 * eventCodes.bytype[eventCodes.EV_REL][0]
 * ['REL_X']
 * ```
 */
export type EventCodes = {
  byTypes: Record<number, Record<number, string[]>>;
} & Record<EventTypeNames, Record<number, string>> &
  Record<EventConstants, number>;

export const eventMap: EventMap = {
  /**
   * Keys and buttons
   *
   * Most of the keys/buttons are modeled after USB HUT 1.12
   * (see http://www.usb.org/developers/hidpage).
   * Abbreviations in the comments:
   * AC - Application Control
   * AL - Application Launch Button
   * SC - System Control
   */
  0x01: {
    name: 'EV_KEY',
    events: {
      0: ['KEY_RESERVED'],
      1: ['KEY_ESC'],
      2: ['KEY_1'],
      3: ['KEY_2'],
      4: ['KEY_3'],
      5: ['KEY_4'],
      6: ['KEY_5'],
      7: ['KEY_6'],
      8: ['KEY_7'],
      9: ['KEY_8'],
      10: ['KEY_9'],
      11: ['KEY_0'],
      12: ['KEY_MINUS'],
      13: ['KEY_EQUAL'],
      14: ['KEY_BACKSPACE'],
      15: ['KEY_TAB'],
      16: ['KEY_Q'],
      17: ['KEY_W'],
      18: ['KEY_E'],
      19: ['KEY_R'],
      20: ['KEY_T'],
      21: ['KEY_Y'],
      22: ['KEY_U'],
      23: ['KEY_I'],
      24: ['KEY_O'],
      25: ['KEY_P'],
      26: ['KEY_LEFTBRACE'],
      27: ['KEY_RIGHTBRACE'],
      28: ['KEY_ENTER'],
      29: ['KEY_LEFTCTRL'],
      30: ['KEY_A'],
      31: ['KEY_S'],
      32: ['KEY_D'],
      33: ['KEY_F'],
      34: ['KEY_G'],
      35: ['KEY_H'],
      36: ['KEY_J'],
      37: ['KEY_K'],
      38: ['KEY_L'],
      39: ['KEY_SEMICOLON'],
      40: ['KEY_APOSTROPHE'],
      41: ['KEY_GRAVE'],
      42: ['KEY_LEFTSHIFT'],
      43: ['KEY_BACKSLASH'],
      44: ['KEY_Z'],
      45: ['KEY_X'],
      46: ['KEY_C'],
      47: ['KEY_V'],
      48: ['KEY_B'],
      49: ['KEY_N'],
      50: ['KEY_M'],
      51: ['KEY_COMMA'],
      52: ['KEY_DOT'],
      53: ['KEY_SLASH'],
      54: ['KEY_RIGHTSHIFT'],
      55: ['KEY_KPASTERISK'],
      56: ['KEY_LEFTALT'],
      57: ['KEY_SPACE'],
      58: ['KEY_CAPSLOCK'],
      59: ['KEY_F1'],
      60: ['KEY_F2'],
      61: ['KEY_F3'],
      62: ['KEY_F4'],
      63: ['KEY_F5'],
      64: ['KEY_F6'],
      65: ['KEY_F7'],
      66: ['KEY_F8'],
      67: ['KEY_F9'],
      68: ['KEY_F10'],
      69: ['KEY_NUMLOCK'],
      70: ['KEY_SCROLLLOCK'],
      71: ['KEY_KP7'],
      72: ['KEY_KP8'],
      73: ['KEY_KP9'],
      74: ['KEY_KPMINUS'],
      75: ['KEY_KP4'],
      76: ['KEY_KP5'],
      77: ['KEY_KP6'],
      78: ['KEY_KPPLUS'],
      79: ['KEY_KP1'],
      80: ['KEY_KP2'],
      81: ['KEY_KP3'],
      82: ['KEY_KP0'],
      83: ['KEY_KPDOT'],

      85: ['KEY_ZENKAKUHANKAKU'],
      86: ['KEY_102ND'],
      87: ['KEY_F11'],
      88: ['KEY_F12'],
      89: ['KEY_RO'],
      90: ['KEY_KATAKANA'],
      91: ['KEY_HIRAGANA'],
      92: ['KEY_HENKAN'],
      93: ['KEY_KATAKANAHIRAGANA'],
      94: ['KEY_MUHENKAN'],
      95: ['KEY_KPJPCOMMA'],
      96: ['KEY_KPENTER'],
      97: ['KEY_RIGHTCTRL'],
      98: ['KEY_KPSLASH'],
      99: ['KEY_SYSRQ'],
      100: ['KEY_RIGHTALT'],
      101: ['KEY_LINEFEED'],
      102: ['KEY_HOME'],
      103: ['KEY_UP'],
      104: ['KEY_PAGEUP'],
      105: ['KEY_LEFT'],
      106: ['KEY_RIGHT'],
      107: ['KEY_END'],
      108: ['KEY_DOWN'],
      109: ['KEY_PAGEDOWN'],
      110: ['KEY_INSERT'],
      111: ['KEY_DELETE'],
      112: ['KEY_MACRO'],
      113: [
        //
        'KEY_MUTE',
        'KEY_MIN_INTERESTING' /* We avoid low common keys in module aliases so they don't get huge. */,
      ],
      114: ['KEY_VOLUMEDOWN'],
      115: ['KEY_VOLUMEUP'],
      116: ['KEY_POWER'] /* SC System Power Down */,
      117: ['KEY_KPEQUAL'],
      118: ['KEY_KPPLUSMINUS'],
      119: ['KEY_PAUSE'],
      120: ['KEY_SCALE'] /* AL Compiz Scale (Expose) */,

      121: ['KEY_KPCOMMA'],
      122: ['KEY_HANGEUL', 'KEY_HANGUEL'],
      123: ['KEY_HANJA'],
      124: ['KEY_YEN'],
      125: ['KEY_LEFTMETA'],
      126: ['KEY_RIGHTMETA'],
      127: ['KEY_COMPOSE'],

      128: ['KEY_STOP'] /* AC Stop */,
      129: ['KEY_AGAIN'],
      130: ['KEY_PROPS'] /* AC Properties */,
      131: ['KEY_UNDO'] /* AC Undo */,
      132: ['KEY_FRONT'],
      133: ['KEY_COPY'] /* AC Copy */,
      134: ['KEY_OPEN'] /* AC Open */,
      135: ['KEY_PASTE'] /* AC Paste */,
      136: ['KEY_FIND'] /* AC Search */,
      137: ['KEY_CUT'] /* AC Cut */,
      138: ['KEY_HELP'] /* AL Integrated Help Center */,
      139: ['KEY_MENU'] /* Menu (show menu) */,
      140: ['KEY_CALC'] /* AL Calculator */,
      141: ['KEY_SETUP'],
      142: ['KEY_SLEEP'] /* SC System Sleep */,
      143: ['KEY_WAKEUP'] /* System Wake Up */,
      144: ['KEY_FILE'] /* AL Local Machine Browser */,
      145: ['KEY_SENDFILE'],
      146: ['KEY_DELETEFILE'],
      147: ['KEY_XFER'],
      148: ['KEY_PROG1'],
      149: ['KEY_PROG2'],
      150: ['KEY_WWW'] /* AL Internet Browser */,
      151: ['KEY_MSDOS'],
      152: [
        //
        'KEY_COFFEE' /* AL Terminal Lock/Screensaver */,
        'KEY_SCREENLOCK',
      ],
      153: [
        //
        'KEY_ROTATE_DISPLAY' /* Display orientation for e.g. tablets */,
        'KEY_DIRECTION',
      ],
      154: ['KEY_CYCLEWINDOWS'],
      155: ['KEY_MAIL'],
      156: ['KEY_BOOKMARKS'] /* AC Bookmarks */,
      157: ['KEY_COMPUTER'],
      158: ['KEY_BACK'] /* AC Back */,
      159: ['KEY_FORWARD'] /* AC Forward */,
      160: ['KEY_CLOSECD'],
      161: ['KEY_EJECTCD'],
      162: ['KEY_EJECTCLOSECD'],
      163: ['KEY_NEXTSONG'],
      164: ['KEY_PLAYPAUSE'],
      165: ['KEY_PREVIOUSSONG'],
      166: ['KEY_STOPCD'],
      167: ['KEY_RECORD'],
      168: ['KEY_REWIND'],
      169: ['KEY_PHONE'] /* Media Select Telephone */,
      170: ['KEY_ISO'],
      171: ['KEY_CONFIG'] /* AL Consumer Control Configuration */,
      172: ['KEY_HOMEPAGE'] /* AC Home */,
      173: ['KEY_REFRESH'] /* AC Refresh */,
      174: ['KEY_EXIT'] /* AC Exit */,
      175: ['KEY_MOVE'],
      176: ['KEY_EDIT'],
      177: ['KEY_SCROLLUP'],
      178: ['KEY_SCROLLDOWN'],
      179: ['KEY_KPLEFTPAREN'],
      180: ['KEY_KPRIGHTPAREN'],
      181: ['KEY_NEW'] /* AC New */,
      182: ['KEY_REDO'] /* AC Redo/Repeat */,

      183: ['KEY_F13'],
      184: ['KEY_F14'],
      185: ['KEY_F15'],
      186: ['KEY_F16'],
      187: ['KEY_F17'],
      188: ['KEY_F18'],
      189: ['KEY_F19'],
      190: ['KEY_F20'],
      191: ['KEY_F21'],
      192: ['KEY_F22'],
      193: ['KEY_F23'],
      194: ['KEY_F24'],

      200: ['KEY_PLAYCD'],
      201: ['KEY_PAUSECD'],
      202: ['KEY_PROG3'],
      203: ['KEY_PROG4'],
      204: ['KEY_DASHBOARD'] /* AL Dashboard */,
      205: ['KEY_SUSPEND'],
      206: ['KEY_CLOSE'] /* AC Close */,
      207: ['KEY_PLAY'],
      208: ['KEY_FASTFORWARD'],
      209: ['KEY_BASSBOOST'],
      210: ['KEY_PRINT'] /* AC Print */,
      211: ['KEY_HP'],
      212: ['KEY_CAMERA'],
      213: ['KEY_SOUND'],
      214: ['KEY_QUESTION'],
      215: ['KEY_EMAIL'],
      216: ['KEY_CHAT'],
      217: ['KEY_SEARCH'],
      218: ['KEY_CONNECT'],
      219: ['KEY_FINANCE'] /* AL Checkbook/Finance */,
      220: ['KEY_SPORT'],
      221: ['KEY_SHOP'],
      222: ['KEY_ALTERASE'],
      223: ['KEY_CANCEL'] /* AC Cancel */,
      224: ['KEY_BRIGHTNESSDOWN'],
      225: ['KEY_BRIGHTNESSUP'],
      226: ['KEY_MEDIA'],

      227: [
        'KEY_SWITCHVIDEOMODE',
      ] /* Cycle between available video
                  outputs (Monitor/LCD/TV-out/etc) */,
      228: ['KEY_KBDILLUMTOGGLE'],
      229: ['KEY_KBDILLUMDOWN'],
      230: ['KEY_KBDILLUMUP'],

      231: ['KEY_SEND'] /* AC Send */,
      232: ['KEY_REPLY'] /* AC Reply */,
      233: ['KEY_FORWARDMAIL'] /* AC Forward Msg */,
      234: ['KEY_SAVE'] /* AC Save */,
      235: ['KEY_DOCUMENTS'],

      236: ['KEY_BATTERY'],

      237: ['KEY_BLUETOOTH'],
      238: ['KEY_WLAN'],
      239: ['KEY_UWB'],

      240: ['KEY_UNKNOWN'],

      241: ['KEY_VIDEO_NEXT'] /* drive next video source */,
      242: ['KEY_VIDEO_PREV'] /* drive previous video source */,
      243: ['KEY_BRIGHTNESS_CYCLE'] /* brightness up, after max is min */,
      244: [
        'KEY_BRIGHTNESS_AUTO' /* Set Auto Brightness: manual
        brightness control is off,
        rely on ambient */,
        'KEY_BRIGHTNESS_ZERO',
      ],
      245: ['KEY_DISPLAY_OFF'] /* display device to off state */,

      246: [
        //
        'KEY_WWAN' /* Wireless WAN (LTE, UMTS, GSM, etc.) */,
        'KEY_WIMAX',
      ],
      247: ['KEY_RFKILL'] /* Key that controls all radios */,

      248: ['KEY_MICMUTE'] /* Mute / unmute the microphone */,

      /* Code 255 is reserved for special needs of AT keyboard driver */

      0x100: ['BTN_0', 'BTN_MISC'],
      0x101: ['BTN_1'],
      0x102: ['BTN_2'],
      0x103: ['BTN_3'],
      0x104: ['BTN_4'],
      0x105: ['BTN_5'],
      0x106: ['BTN_6'],
      0x107: ['BTN_7'],
      0x108: ['BTN_8'],
      0x109: ['BTN_9'],

      0x110: ['BTN_LEFT', 'BTN_MOUSE'],
      0x111: ['BTN_RIGHT'],
      0x112: ['BTN_MIDDLE'],
      0x113: ['BTN_SIDE'],
      0x114: ['BTN_EXTRA'],
      0x115: ['BTN_FORWARD'],
      0x116: ['BTN_BACK'],
      0x117: ['BTN_TASK'],

      0x120: ['BTN_JOYSTICK', 'BTN_TRIGGER'],
      0x121: ['BTN_THUMB'],
      0x122: ['BTN_THUMB2'],
      0x123: ['BTN_TOP'],
      0x124: ['BTN_TOP2'],
      0x125: ['BTN_PINKIE'],
      0x126: ['BTN_BASE'],
      0x127: ['BTN_BASE2'],
      0x128: ['BTN_BASE3'],
      0x129: ['BTN_BASE4'],
      0x12a: ['BTN_BASE5'],
      0x12b: ['BTN_BASE6'],
      0x12f: ['BTN_DEAD'],

      0x130: ['BTN_A', 'BTN_SOUTH', 'BTN_GAMEPAD'],
      0x131: ['BTN_B', 'BTN_EAST'],
      0x132: ['BTN_C'],
      0x133: ['BTN_X', 'BTN_NORTH'],
      0x134: ['BTN_Y', 'BTN_WEST'],
      0x135: ['BTN_Z'],
      0x136: ['BTN_TL'],
      0x137: ['BTN_TR'],
      0x138: ['BTN_TL2'],
      0x139: ['BTN_TR2'],
      0x13a: ['BTN_SELECT'],
      0x13b: ['BTN_START'],
      0x13c: ['BTN_MODE'],
      0x13d: ['BTN_THUMBL'],
      0x13e: ['BTN_THUMBR'],

      0x140: ['BTN_TOOL_PEN', 'BTN_DIGI'],
      0x141: ['BTN_TOOL_RUBBER'],
      0x142: ['BTN_TOOL_BRUSH'],
      0x143: ['BTN_TOOL_PENCIL'],
      0x144: ['BTN_TOOL_AIRBRUSH'],
      0x145: ['BTN_TOOL_FINGER'],
      0x146: ['BTN_TOOL_MOUSE'],
      0x147: ['BTN_TOOL_LENS'],
      0x148: ['BTN_TOOL_QUINTTAP'] /* Five fingers on trackpad */,
      0x149: ['BTN_STYLUS3'],
      0x14a: ['BTN_TOUCH'],
      0x14b: ['BTN_STYLUS'],
      0x14c: ['BTN_STYLUS2'],
      0x14d: ['BTN_TOOL_DOUBLETAP'],
      0x14e: ['BTN_TOOL_TRIPLETAP'],
      0x14f: ['BTN_TOOL_QUADTAP'] /* Four fingers on trackpad */,

      0x150: ['BTN_GEAR_DOWN', 'BTN_WHEEL'],
      0x151: ['BTN_GEAR_UP'],

      0x160: ['KEY_OK'],
      0x161: ['KEY_SELECT'],
      0x162: ['KEY_GOTO'],
      0x163: ['KEY_CLEAR'],
      0x164: ['KEY_POWER2'],
      0x165: ['KEY_OPTION'],
      0x166: ['KEY_INFO'] /* AL OEM Features/Tips/Tutorial */,
      0x167: ['KEY_TIME'],
      0x168: ['KEY_VENDOR'],
      0x169: ['KEY_ARCHIVE'],
      0x16a: ['KEY_PROGRAM'] /* Media Select Program Guide */,
      0x16b: ['KEY_CHANNEL'],
      0x16c: ['KEY_FAVORITES'],
      0x16d: ['KEY_EPG'],
      0x16e: ['KEY_PVR'] /* Media Select Home */,
      0x16f: ['KEY_MHP'],
      0x170: ['KEY_LANGUAGE'],
      0x171: ['KEY_TITLE'],
      0x172: ['KEY_SUBTITLE'],
      0x173: ['KEY_ANGLE'],
      0x174: [
        //
        'KEY_FULL_SCREEN' /* AC View Toggle */,
        'KEY_ZOOM',
      ],
      0x175: ['KEY_MODE'],
      0x176: ['KEY_KEYBOARD'],
      0x177: [
        //
        'KEY_ASPECT_RATIO' /* HUTRR37: Aspect */,
        'KEY_SCREEN',
      ],
      0x178: ['KEY_PC'] /* Media Select Computer */,
      0x179: ['KEY_TV'] /* Media Select TV */,
      0x17a: ['KEY_TV2'] /* Media Select Cable */,
      0x17b: ['KEY_VCR'] /* Media Select VCR */,
      0x17c: ['KEY_VCR2'] /* VCR Plus */,
      0x17d: ['KEY_SAT'] /* Media Select Satellite */,
      0x17e: ['KEY_SAT2'],
      0x17f: ['KEY_CD'] /* Media Select CD */,
      0x180: ['KEY_TAPE'] /* Media Select Tape */,
      0x181: ['KEY_RADIO'],
      0x182: ['KEY_TUNER'] /* Media Select Tuner */,
      0x183: ['KEY_PLAYER'],
      0x184: ['KEY_TEXT'],
      0x185: ['KEY_DVD'] /* Media Select DVD */,
      0x186: ['KEY_AUX'],
      0x187: ['KEY_MP3'],
      0x188: ['KEY_AUDIO'] /* AL Audio Browser */,
      0x189: ['KEY_VIDEO'] /* AL Movie Browser */,
      0x18a: ['KEY_DIRECTORY'],
      0x18b: ['KEY_LIST'],
      0x18c: ['KEY_MEMO'] /* Media Select Messages */,
      0x18d: ['KEY_CALENDAR'],
      0x18e: ['KEY_RED'],
      0x18f: ['KEY_GREEN'],
      0x190: ['KEY_YELLOW'],
      0x191: ['KEY_BLUE'],
      0x192: ['KEY_CHANNELUP'] /* Channel Increment */,
      0x193: ['KEY_CHANNELDOWN'] /* Channel Decrement */,
      0x194: ['KEY_FIRST'],
      0x195: ['KEY_LAST'] /* Recall Last */,
      0x196: ['KEY_AB'],
      0x197: ['KEY_NEXT'],
      0x198: ['KEY_RESTART'],
      0x199: ['KEY_SLOW'],
      0x19a: ['KEY_SHUFFLE'],
      0x19b: ['KEY_BREAK'],
      0x19c: ['KEY_PREVIOUS'],
      0x19d: ['KEY_DIGITS'],
      0x19e: ['KEY_TEEN'],
      0x19f: ['KEY_TWEN'],
      0x1a0: ['KEY_VIDEOPHONE'] /* Media Select Video Phone */,
      0x1a1: ['KEY_GAMES'] /* Media Select Games */,
      0x1a2: ['KEY_ZOOMIN'] /* AC Zoom In */,
      0x1a3: ['KEY_ZOOMOUT'] /* AC Zoom Out */,
      0x1a4: ['KEY_ZOOMRESET'] /* AC Zoom */,
      0x1a5: ['KEY_WORDPROCESSOR'] /* AL Word Processor */,
      0x1a6: ['KEY_EDITOR'] /* AL Text Editor */,
      0x1a7: ['KEY_SPREADSHEET'] /* AL Spreadsheet */,
      0x1a8: ['KEY_GRAPHICSEDITOR'] /* AL Graphics Editor */,
      0x1a9: ['KEY_PRESENTATION'] /* AL Presentation App */,
      0x1aa: ['KEY_DATABASE'] /* AL Database App */,
      0x1ab: ['KEY_NEWS'] /* AL Newsreader */,
      0x1ac: ['KEY_VOICEMAIL'] /* AL Voicemail */,
      0x1ad: ['KEY_ADDRESSBOOK'] /* AL Contacts/Address Book */,
      0x1ae: ['KEY_MESSENGER'] /* AL Instant Messaging */,
      0x1af: [
        //
        'KEY_DISPLAYTOGGLE' /* Turn display (LCD) on and off */,
        'KEY_BRIGHTNESS_TOGGLE',
      ],
      0x1b0: ['KEY_SPELLCHECK'] /* AL Spell Check */,
      0x1b1: ['KEY_LOGOFF'] /* AL Logoff */,

      0x1b2: ['KEY_DOLLAR'],
      0x1b3: ['KEY_EURO'],

      0x1b4: ['KEY_FRAMEBACK'] /* Consumer - transport controls */,
      0x1b5: ['KEY_FRAMEFORWARD'],
      0x1b6: ['KEY_CONTEXT_MENU'] /* GenDesc - system context menu */,
      0x1b7: ['KEY_MEDIA_REPEAT'] /* Consumer - transport control */,
      0x1b8: ['KEY_10CHANNELSUP'] /* 10 channels up (10+) */,
      0x1b9: ['KEY_10CHANNELSDOWN'] /* 10 channels down (10-) */,
      0x1ba: ['KEY_IMAGES'] /* AL Image Browser */,
      0x1bc: ['KEY_NOTIFICATION_CENTER'] /* Show/hide the notification center */,
      0x1bd: ['KEY_PICKUP_PHONE'] /* Answer incoming call */,
      0x1be: ['KEY_HANGUP_PHONE'] /* Decline incoming call */,

      0x1c0: ['KEY_DEL_EOL'],
      0x1c1: ['KEY_DEL_EOS'],
      0x1c2: ['KEY_INS_LINE'],
      0x1c3: ['KEY_DEL_LINE'],

      0x1d0: ['KEY_FN'],
      0x1d1: ['KEY_FN_ESC'],
      0x1d2: ['KEY_FN_F1'],
      0x1d3: ['KEY_FN_F2'],
      0x1d4: ['KEY_FN_F3'],
      0x1d5: ['KEY_FN_F4'],
      0x1d6: ['KEY_FN_F5'],
      0x1d7: ['KEY_FN_F6'],
      0x1d8: ['KEY_FN_F7'],
      0x1d9: ['KEY_FN_F8'],
      0x1da: ['KEY_FN_F9'],
      0x1db: ['KEY_FN_F10'],
      0x1dc: ['KEY_FN_F11'],
      0x1dd: ['KEY_FN_F12'],
      0x1de: ['KEY_FN_1'],
      0x1df: ['KEY_FN_2'],
      0x1e0: ['KEY_FN_D'],
      0x1e1: ['KEY_FN_E'],
      0x1e2: ['KEY_FN_F'],
      0x1e3: ['KEY_FN_S'],
      0x1e4: ['KEY_FN_B'],
      0x1e5: ['KEY_FN_RIGHT_SHIFT'],

      0x1f1: ['KEY_BRL_DOT1'],
      0x1f2: ['KEY_BRL_DOT2'],
      0x1f3: ['KEY_BRL_DOT3'],
      0x1f4: ['KEY_BRL_DOT4'],
      0x1f5: ['KEY_BRL_DOT5'],
      0x1f6: ['KEY_BRL_DOT6'],
      0x1f7: ['KEY_BRL_DOT7'],
      0x1f8: ['KEY_BRL_DOT8'],
      0x1f9: ['KEY_BRL_DOT9'],
      0x1fa: ['KEY_BRL_DOT10'],

      0x200: ['KEY_NUMERIC_0'] /* used by phones, remote controls, */,
      0x201: ['KEY_NUMERIC_1'] /* and other keypads */,
      0x202: ['KEY_NUMERIC_2'],
      0x203: ['KEY_NUMERIC_3'],
      0x204: ['KEY_NUMERIC_4'],
      0x205: ['KEY_NUMERIC_5'],
      0x206: ['KEY_NUMERIC_6'],
      0x207: ['KEY_NUMERIC_7'],
      0x208: ['KEY_NUMERIC_8'],
      0x209: ['KEY_NUMERIC_9'],
      0x20a: ['KEY_NUMERIC_STAR'],
      0x20b: ['KEY_NUMERIC_POUND'],
      0x20c: ['KEY_NUMERIC_A'] /* Phone key A - HUT Telephony 0xb9 */,
      0x20d: ['KEY_NUMERIC_B'],
      0x20e: ['KEY_NUMERIC_C'],
      0x20f: ['KEY_NUMERIC_D'],

      0x210: ['KEY_CAMERA_FOCUS'],
      0x211: ['KEY_WPS_BUTTON'] /* WiFi Protected Setup key */,

      0x212: ['KEY_TOUCHPAD_TOGGLE'] /* Request switch touchpad on or off */,
      0x213: ['KEY_TOUCHPAD_ON'],
      0x214: ['KEY_TOUCHPAD_OFF'],

      0x215: ['KEY_CAMERA_ZOOMIN'],
      0x216: ['KEY_CAMERA_ZOOMOUT'],
      0x217: ['KEY_CAMERA_UP'],
      0x218: ['KEY_CAMERA_DOWN'],
      0x219: ['KEY_CAMERA_LEFT'],
      0x21a: ['KEY_CAMERA_RIGHT'],

      0x21b: ['KEY_ATTENDANT_ON'],
      0x21c: ['KEY_ATTENDANT_OFF'],
      0x21d: ['KEY_ATTENDANT_TOGGLE'] /* Attendant call on or off */,
      0x21e: ['KEY_LIGHTS_TOGGLE'] /* Reading light on or off */,

      0x220: ['BTN_DPAD_UP'],
      0x221: ['BTN_DPAD_DOWN'],
      0x222: ['BTN_DPAD_LEFT'],
      0x223: ['BTN_DPAD_RIGHT'],

      0x230: ['KEY_ALS_TOGGLE'] /* Ambient light sensor */,
      0x231: ['KEY_ROTATE_LOCK_TOGGLE'] /* Display rotation lock */,

      0x240: ['KEY_BUTTONCONFIG'] /* AL Button Configuration */,
      0x241: ['KEY_TASKMANAGER'] /* AL Task/Project Manager */,
      0x242: ['KEY_JOURNAL'] /* AL Log/Journal/Timecard */,
      0x243: ['KEY_CONTROLPANEL'] /* AL Control Panel */,
      0x244: ['KEY_APPSELECT'] /* AL Select Task/Application */,
      0x245: ['KEY_SCREENSAVER'] /* AL Screen Saver */,
      0x246: ['KEY_VOICECOMMAND'] /* Listening Voice Command */,
      0x247: ['KEY_ASSISTANT'] /* AL Context-aware desktop assistant */,
      0x248: ['KEY_KBD_LAYOUT_NEXT'] /* AC Next Keyboard Layout Select */,

      0x250: ['KEY_BRIGHTNESS_MIN'] /* Set Brightness to Minimum */,
      0x251: ['KEY_BRIGHTNESS_MAX'] /* Set Brightness to Maximum */,

      0x260: ['KEY_KBDINPUTASSIST_PREV'],
      0x261: ['KEY_KBDINPUTASSIST_NEXT'],
      0x262: ['KEY_KBDINPUTASSIST_PREVGROUP'],
      0x263: ['KEY_KBDINPUTASSIST_NEXTGROUP'],
      0x264: ['KEY_KBDINPUTASSIST_ACCEPT'],
      0x265: ['KEY_KBDINPUTASSIST_CANCEL'],

      /* Diagonal movement keys */
      0x266: ['KEY_RIGHT_UP'],
      0x267: ['KEY_RIGHT_DOWN'],
      0x268: ['KEY_LEFT_UP'],
      0x269: ['KEY_LEFT_DOWN'],

      0x26a: ['KEY_ROOT_MENU'] /* Show Device's Root Menu */,
      /* Show Top Menu of the Media (e.g. DVD) */
      0x26b: ['KEY_MEDIA_TOP_MENU'],
      0x26c: ['KEY_NUMERIC_11'],
      0x26d: ['KEY_NUMERIC_12'],
      /**
       * Toggle Audio Description: refers to an audio service that helps blind and
       * visually impaired consumers understand the action in a program. Note: in
       * some countries this is referred to as "Video Description".
       */
      0x26e: ['KEY_AUDIO_DESC'],
      0x26f: ['KEY_3D_MODE'],
      0x270: ['KEY_NEXT_FAVORITE'],
      0x271: ['KEY_STOP_RECORD'],
      0x272: ['KEY_PAUSE_RECORD'],
      0x273: ['KEY_VOD'] /* Video on Demand */,
      0x274: ['KEY_UNMUTE'],
      0x275: ['KEY_FASTREVERSE'],
      0x276: ['KEY_SLOWREVERSE'],
      /**
       * Control a data application associated with the currently viewed channel,
       * e.g. teletext or data broadcast application (MHEG, MHP, HbbTV, etc.)
       */
      0x277: ['KEY_DATA'],
      0x278: ['KEY_ONSCREEN_KEYBOARD'],
      /* Electronic privacy screen control */
      0x279: ['KEY_PRIVACY_SCREEN_TOGGLE'],

      /* Select an area of screen to be copied */
      0x27a: ['KEY_SELECTIVE_SCREENSHOT'],

      /**
       * Some keyboards have keys which do not have a defined meaning, these keys
       * are intended to be programmed / bound to macros by the user. For most
       * keyboards with these macro-keys the key-sequence to inject, or action to
       * take, is all handled by software on the host side. So from the kernel's
       * point of view these are just normal keys.
       *
       * The KEY_MACRO# codes below are intended for such keys, which may be labeled
       * e.g. G1-G18, or S1 - S30. The KEY_MACRO# codes MUST NOT be used for keys
       * where the marking on the key does indicate a defined meaning / purpose.
       *
       * The KEY_MACRO# codes MUST also NOT be used as fallback for when no existing
       * KEY_FOO define matches the marking / purpose. In this case a new KEY_FOO
       * define MUST be added.
       */
      0x290: ['KEY_MACRO1'],
      0x291: ['KEY_MACRO2'],
      0x292: ['KEY_MACRO3'],
      0x293: ['KEY_MACRO4'],
      0x294: ['KEY_MACRO5'],
      0x295: ['KEY_MACRO6'],
      0x296: ['KEY_MACRO7'],
      0x297: ['KEY_MACRO8'],
      0x298: ['KEY_MACRO9'],
      0x299: ['KEY_MACRO10'],
      0x29a: ['KEY_MACRO11'],
      0x29b: ['KEY_MACRO12'],
      0x29c: ['KEY_MACRO13'],
      0x29d: ['KEY_MACRO14'],
      0x29e: ['KEY_MACRO15'],
      0x29f: ['KEY_MACRO16'],
      0x2a0: ['KEY_MACRO17'],
      0x2a1: ['KEY_MACRO18'],
      0x2a2: ['KEY_MACRO19'],
      0x2a3: ['KEY_MACRO20'],
      0x2a4: ['KEY_MACRO21'],
      0x2a5: ['KEY_MACRO22'],
      0x2a6: ['KEY_MACRO23'],
      0x2a7: ['KEY_MACRO24'],
      0x2a8: ['KEY_MACRO25'],
      0x2a9: ['KEY_MACRO26'],
      0x2aa: ['KEY_MACRO27'],
      0x2ab: ['KEY_MACRO28'],
      0x2ac: ['KEY_MACRO29'],
      0x2ad: ['KEY_MACRO30'],

      /**
       * Some keyboards with the macro-keys described above have some extra keys
       * for controlling the host-side software responsible for the macro handling:
       * -A macro recording start/stop key. Note that not all keyboards which emit
       *  KEY_MACRO_RECORD_START will also emit KEY_MACRO_RECORD_STOP if
       *  KEY_MACRO_RECORD_STOP is not advertised, then KEY_MACRO_RECORD_START
       *  should be interpreted as a recording start/stop toggle;
       * -Keys for switching between different macro (pre)sets, either a key for
       *  cycling through the configured presets or keys to directly select a preset.
       */
      0x2b0: ['KEY_MACRO_RECORD_START'],
      0x2b1: ['KEY_MACRO_RECORD_STOP'],
      0x2b2: ['KEY_MACRO_PRESET_CYCLE'],
      0x2b3: ['KEY_MACRO_PRESET1'],
      0x2b4: ['KEY_MACRO_PRESET2'],
      0x2b5: ['KEY_MACRO_PRESET3'],

      /**
       * Some keyboards have a buildin LCD panel where the contents are controlled
       * by the host. Often these have a number of keys directly below the LCD
       * intended for controlling a menu shown on the LCD. These keys often don't
       * have any labeling so we just name them KEY_KBD_LCD_MENU#
       */
      0x2b8: ['KEY_KBD_LCD_MENU1'],
      0x2b9: ['KEY_KBD_LCD_MENU2'],
      0x2ba: ['KEY_KBD_LCD_MENU3'],
      0x2bb: ['KEY_KBD_LCD_MENU4'],
      0x2bc: ['KEY_KBD_LCD_MENU5'],

      0x2c0: ['BTN_TRIGGER_HAPPY1', 'BTN_TRIGGER_HAPPY'],
      0x2c1: ['BTN_TRIGGER_HAPPY2'],
      0x2c2: ['BTN_TRIGGER_HAPPY3'],
      0x2c3: ['BTN_TRIGGER_HAPPY4'],
      0x2c4: ['BTN_TRIGGER_HAPPY5'],
      0x2c5: ['BTN_TRIGGER_HAPPY6'],
      0x2c6: ['BTN_TRIGGER_HAPPY7'],
      0x2c7: ['BTN_TRIGGER_HAPPY8'],
      0x2c8: ['BTN_TRIGGER_HAPPY9'],
      0x2c9: ['BTN_TRIGGER_HAPPY10'],
      0x2ca: ['BTN_TRIGGER_HAPPY11'],
      0x2cb: ['BTN_TRIGGER_HAPPY12'],
      0x2cc: ['BTN_TRIGGER_HAPPY13'],
      0x2cd: ['BTN_TRIGGER_HAPPY14'],
      0x2ce: ['BTN_TRIGGER_HAPPY15'],
      0x2cf: ['BTN_TRIGGER_HAPPY16'],
      0x2d0: ['BTN_TRIGGER_HAPPY17'],
      0x2d1: ['BTN_TRIGGER_HAPPY18'],
      0x2d2: ['BTN_TRIGGER_HAPPY19'],
      0x2d3: ['BTN_TRIGGER_HAPPY20'],
      0x2d4: ['BTN_TRIGGER_HAPPY21'],
      0x2d5: ['BTN_TRIGGER_HAPPY22'],
      0x2d6: ['BTN_TRIGGER_HAPPY23'],
      0x2d7: ['BTN_TRIGGER_HAPPY24'],
      0x2d8: ['BTN_TRIGGER_HAPPY25'],
      0x2d9: ['BTN_TRIGGER_HAPPY26'],
      0x2da: ['BTN_TRIGGER_HAPPY27'],
      0x2db: ['BTN_TRIGGER_HAPPY28'],
      0x2dc: ['BTN_TRIGGER_HAPPY29'],
      0x2dd: ['BTN_TRIGGER_HAPPY30'],
      0x2de: ['BTN_TRIGGER_HAPPY31'],
      0x2df: ['BTN_TRIGGER_HAPPY32'],
      0x2e0: ['BTN_TRIGGER_HAPPY33'],
      0x2e1: ['BTN_TRIGGER_HAPPY34'],
      0x2e2: ['BTN_TRIGGER_HAPPY35'],
      0x2e3: ['BTN_TRIGGER_HAPPY36'],
      0x2e4: ['BTN_TRIGGER_HAPPY37'],
      0x2e5: ['BTN_TRIGGER_HAPPY38'],
      0x2e6: ['BTN_TRIGGER_HAPPY39'],
      0x2e7: ['BTN_TRIGGER_HAPPY40'],

      /* We avoid low common keys in module aliases so they don't get huge. */
      0x2ff: ['KEY_MAX'],
      0x300: ['KEY_CNT'],
    },
  },
  0x00: {
    name: 'EV_SYN',
    events: {
      0: ['SYN_REPORT'],
      1: ['SYN_CONFIG'],
      2: ['SYN_MT_REPORT'],
      3: ['SYN_DROPPED'],
      0xf: ['SYN_MAX'],
      0x10: ['SYN_CNT'],
    },
  },
  0x02: {
    name: 'EV_REL',
    events: {
      /**
       * Relative axes
       */

      0x00: ['REL_X'],
      0x01: ['REL_Y'],
      0x02: ['REL_Z'],
      0x03: ['REL_RX'],
      0x04: ['REL_RY'],
      0x05: ['REL_RZ'],
      0x06: ['REL_HWHEEL'],
      0x07: ['REL_DIAL'],
      0x08: ['REL_WHEEL'],
      0x09: ['REL_MISC'],
      /**
       * 0x0a is reserved and should not be used in input drivers.
       * It was used by HID as REL_MISC+1 and userspace needs to detect if
       * the next REL_* event is correct or is just REL_MISC + n.
       * We define here REL_RESERVED so userspace can rely on it and detect
       * the situation described above.
       */
      0x0a: ['REL_RESERVED'],
      0x0b: ['REL_WHEEL_HI_RES'],
      0x0c: ['REL_HWHEEL_HI_RES'],
      0x0f: ['REL_MAX'],
      0x1f: ['REL_CNT'],
    },
  },
  0x03: {
    name: 'EV_ABS',
    events: {
      /**
       * Absolute axes
       */

      0x00: ['ABS_X'],
      0x01: ['ABS_Y'],
      0x02: ['ABS_Z'],
      0x03: ['ABS_RX'],
      0x04: ['ABS_RY'],
      0x05: ['ABS_RZ'],
      0x06: ['ABS_THROTTLE'],
      0x07: ['ABS_RUDDER'],
      0x08: ['ABS_WHEEL'],
      0x09: ['ABS_GAS'],
      0x0a: ['ABS_BRAKE'],
      0x10: ['ABS_HAT0X'],
      0x11: ['ABS_HAT0Y'],
      0x12: ['ABS_HAT1X'],
      0x13: ['ABS_HAT1Y'],
      0x14: ['ABS_HAT2X'],
      0x15: ['ABS_HAT2Y'],
      0x16: ['ABS_HAT3X'],
      0x17: ['ABS_HAT3Y'],
      0x18: ['ABS_PRESSURE'],
      0x19: ['ABS_DISTANCE'],
      0x1a: ['ABS_TILT_X'],
      0x1b: ['ABS_TILT_Y'],
      0x1c: ['ABS_TOOL_WIDTH'],

      0x20: ['ABS_VOLUME'],

      0x28: ['ABS_MISC'],

      /**
       * 0x2e is reserved and should not be used in input drivers.
       * It was used by HID as ABS_MISC+6 and userspace needs to detect if
       * the next ABS_* event is correct or is just ABS_MISC + n.
       * We define here ABS_RESERVED so userspace can rely on it and detect
       * the situation described above.
       */
      0x2e: ['ABS_RESERVED'],

      0x2f: ['ABS_MT_SLOT'] /* MT slot being modified */,
      0x30: ['ABS_MT_TOUCH_MAJOR'] /* Major axis of touching ellipse */,
      0x31: ['ABS_MT_TOUCH_MINOR'] /* Minor axis (omit if circular) */,
      0x32: ['ABS_MT_WIDTH_MAJOR'] /* Major axis of approaching ellipse */,
      0x33: ['ABS_MT_WIDTH_MINOR'] /* Minor axis (omit if circular) */,
      0x34: ['ABS_MT_ORIENTATION'] /* Ellipse orientation */,
      0x35: ['ABS_MT_POSITION_X'] /* Center X touch position */,
      0x36: ['ABS_MT_POSITION_Y'] /* Center Y touch position */,
      0x37: ['ABS_MT_TOOL_TYPE'] /* Type of touching device */,
      0x38: ['ABS_MT_BLOB_ID'] /* Group a set of packets as a blob */,
      0x39: ['ABS_MT_TRACKING_ID'] /* Unique ID of initiated contact */,
      0x3a: ['ABS_MT_PRESSURE'] /* Pressure on contact area */,
      0x3b: ['ABS_MT_DISTANCE'] /* Contact hover distance */,
      0x3c: ['ABS_MT_TOOL_X'] /* Center X tool position */,
      0x3d: ['ABS_MT_TOOL_Y'] /* Center Y tool position */,

      0x3f: ['ABS_MAX'],
      0x40: ['ABS_CNT'],
    },
  },
  0x04: {
    name: 'EV_MSC',
    events: {
      /**
       * Misc events
       */

      0x00: ['MSC_SERIAL'],
      0x01: ['MSC_PULSELED'],
      0x02: ['MSC_GESTURE'],
      0x03: ['MSC_RAW'],
      0x04: ['MSC_SCAN'],
      0x05: ['MSC_TIMESTAMP'],
      0x07: ['MSC_MAX'],
      0x08: ['MSC_CNT'],
    },
  },
  0x05: {
    name: 'EV_SW',
    events: {
      /**
       * Switch events
       */

      0x00: ['SW_LID'] /* set = lid shut */,
      0x01: ['SW_TABLET_MODE'] /* set = tablet mode */,
      0x02: ['SW_HEADPHONE_INSERT'] /* set = inserted */,
      0x03: [
        //
        'SW_RFKILL_ALL' /* rfkill master switch, type "any". set = radio enabled */,
        'SW_RADIO' /* deprecated */,
      ],
      0x04: ['SW_MICROPHONE_INSERT'] /* set = inserted */,
      0x05: ['SW_DOCK'] /* set = plugged into dock */,
      0x06: ['SW_LINEOUT_INSERT'] /* set = inserted */,
      0x07: ['SW_JACK_PHYSICAL_INSERT'] /* set = mechanical switch set */,
      0x08: ['SW_VIDEOOUT_INSERT'] /* set = inserted */,
      0x09: ['SW_CAMERA_LENS_COVER'] /* set = lens covered */,
      0x0a: ['SW_KEYPAD_SLIDE'] /* set = keypad slide out */,
      0x0b: ['SW_FRONT_PROXIMITY'] /* set = front proximity sensor active */,
      0x0c: ['SW_ROTATE_LOCK'] /* set = rotate locked/disabled */,
      0x0d: ['SW_LINEIN_INSERT'] /* set = inserted */,
      0x0e: ['SW_MUTE_DEVICE'] /* set = device disabled */,
      0x0f: ['SW_PEN_INSERTED'] /* set = pen inserted */,
      0x10: [
        //
        'SW_MACHINE_COVER' /* set = cover closed */,
        'SW_MAX',
      ],
      0x11: ['SW_CNT'],
    },
  },
  0x11: {
    name: 'EV_LED',
    events: {
      /**
       * LEDs
       */

      0x00: ['LED_NUML'],
      0x01: ['LED_CAPSL'],
      0x02: ['LED_SCROLLL'],
      0x03: ['LED_COMPOSE'],
      0x04: ['LED_KANA'],
      0x05: ['LED_SLEEP'],
      0x06: ['LED_SUSPEND'],
      0x07: ['LED_MUTE'],
      0x08: ['LED_MISC'],
      0x09: ['LED_MAIL'],
      0x0a: ['LED_CHARGING'],
      0x0f: ['LED_MAX'],
      0x10: ['LED_CNT'],
    },
  },
  0x12: {
    name: 'EV_SND',
    events: {
      /**
       * Sounds
       */
      0x00: ['SND_CLICK'],
      0x01: ['SND_BELL'],
      0x02: ['SND_TONE'],
      0x07: ['SND_MAX'],
      0x08: ['SND_CNT'],
    },
  },
  0x14: {
    name: 'EV_REP',
    events: {
      /**
       * Autorepeat values
       */
      0x00: ['REP_DELAY'],
      0x01: ['REP_PERIOD', 'REP_MAX'],
      0x02: ['REP_CNT'],
    },
  },
  0x15: {
    name: 'EV_FF',
    events: {
      /**
       * Force feedback effect types
       */
      0x50: ['FF_RUMBLE', 'FF_EFFECT_MIN'],
      0x51: ['FF_PERIODIC'],
      0x52: ['FF_CONSTANT'],
      0x53: ['FF_SPRING'],
      0x54: ['FF_FRICTION'],
      0x55: ['FF_DAMPER'],
      0x56: ['FF_INERTIA'],
      0x57: ['FF_RAMP', 'FF_EFFECT_MAX'],

      /**
       * Force feedback periodic effect types
       */

      0x58: ['FF_SQUARE', 'FF_WAVEFORM_MIN'],
      0x59: ['FF_TRIANGLE'],
      0x5a: ['FF_SINE'],
      0x5b: ['FF_SAW_UP'],
      0x5c: ['FF_SAW_DOWN'],
      0x5d: ['FF_CUSTOM', 'FF_WAVEFORM_MAX'],

      /**
       * Set ff device properties
       */
      /**
       * ff->playback(effect_id = FF_GAIN) is the first effect_id to
       * cause a collision with another ff method, in this case ff->set_gain().
       * Therefore the greatest safe value for effect_id is FF_GAIN - 1,
       * and thus the total number of effects should never exceed FF_GAIN.
       */
      0x60: ['FF_GAIN', 'FF_MAX_EFFECTS'],
      0x61: ['FF_AUTOCENTER'],

      0x7f: ['FF_MAX'],
      0x80: ['FF_CNT'],
    },
  },

  0x16: {
    name: 'EV_PWR',
    events: {},
  },
  0x17: {
    name: 'EV_FF_STATUS',
    events: {
      /**
       * Values describing the status of a force-feedback effect
       */
      0x00: ['FF_STATUS_STOPPED'],
      0x01: ['FF_STATUS_PLAYING', 'FF_STATUS_MAX'],
    },
  },
  0x1f: {
    name: 'EV_MAX',
    events: {},
  },
  0x20: {
    name: 'EV_CNT',
    events: {},
  },
};

const IdConstants: Record<number, string[]> = {
  0: ['ID_BUS'],
  1: ['ID_VENDOR'],
  2: ['ID_PRODUCT'],
  3: ['ID_VERSION'],
};
const BusConstants: Record<number, string[]> = {
  0x01: ['BUS_PCI'],
  0x02: ['BUS_ISAPNP'],
  0x03: ['BUS_USB'],
  0x04: ['BUS_HIL'],
  0x05: ['BUS_BLUETOOTH'],
  0x06: ['BUS_VIRTUAL'],

  0x10: ['BUS_ISA'],
  0x11: ['BUS_I8042'],
  0x12: ['BUS_XTKBD'],
  0x13: ['BUS_RS232'],
  0x14: ['BUS_GAMEPORT'],
  0x15: ['BUS_PARPORT'],
  0x16: ['BUS_AMIGA'],
  0x17: ['BUS_ADB'],
  0x18: ['BUS_I2C'],
  0x19: ['BUS_HOST'],
  0x1a: ['BUS_GSC'],
  0x1b: ['BUS_ATARI'],
  0x1c: ['BUS_SPI'],
  0x1d: ['BUS_RMI'],
  0x1e: ['BUS_CEC'],
  0x1f: ['BUS_INTEL_ISHTP'],
};
const InputPropConstants: Record<number, string[]> = {
  0x00: ['INPUT_PROP_POINTER'] /* needs a pointer */,
  0x01: ['INPUT_PROP_DIRECT'] /* direct input devices */,
  0x02: ['INPUT_PROP_BUTTONPAD'] /* has button(s) under pad */,
  0x03: ['INPUT_PROP_SEMI_MT'] /* touch rectangle only */,
  0x04: ['INPUT_PROP_TOPBUTTONPAD'] /* softbuttons at top of pad */,
  0x05: ['INPUT_PROP_POINTING_STICK'] /* is a pointing stick */,
  0x06: ['INPUT_PROP_ACCELEROMETER'] /* has accelerometer */,

  0x1f: ['INPUT_PROP_MAX'],
  0x20: ['INPUT_PROP_CNT'],
};

// Make an untyped eventCodes to fill it more easily.
const untypedEventCodes: any = {
  byTypes: {},
};

for (const [eventTypeCode, eventTypeInfo] of Object.entries(eventMap)) {
  const eventTypeCodeNumber = parseInt(eventTypeCode);
  untypedEventCodes.byTypes[eventTypeCodeNumber] = eventTypeInfo.events;
  untypedEventCodes[eventTypeInfo.name] = eventTypeCodeNumber;
  const simplifiedTypeName = eventTypeInfo.name.slice(4);
  untypedEventCodes[simplifiedTypeName] = {};

  for (const [eventCode, eventNames] of Object.entries(eventTypeInfo.events)) {
    const eventCodeNumber = parseInt(eventCode);
    untypedEventCodes[simplifiedTypeName][eventCodeNumber] = eventNames;

    for (const eventName of eventNames) {
      untypedEventCodes[eventName] = eventCodeNumber;
    }
  }
}

untypedEventCodes.ID = IdConstants;
untypedEventCodes.BUS = BusConstants;
untypedEventCodes.INPUT_PROP = InputPropConstants;

export const eventCodes = untypedEventCodes as EventCodes;
