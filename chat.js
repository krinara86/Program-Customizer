// ===========================
// AI Chat Assistant
// ===========================

// --- Action Schema (Guard Rail Layer 3) ---

const CHAT_ACTION_SCHEMA = {
  find_sadhaka: {
    required: { query: 'string' },
    optional: {},
    type: 'read',
    description: 'Search for sadhakas by partial name'
  },
  get_sadhaka: {
    required: { name: 'string' },
    optional: {},
    type: 'read',
    description: 'Load full details of a sadhaka'
  },
  list_asanas: {
    required: {},
    optional: { category: 'string' },
    type: 'read',
    description: 'List available asanas, optionally filtered by category'
  },
  find_asana: {
    required: { query: 'string' },
    optional: {},
    type: 'read',
    description: 'Search asanas by name'
  },
  add_asana_to_sadhaka: {
    required: { sadhakaName: 'string', asanaName: 'string', categorySection: 'string' },
    optional: { repetitions: 'string', specialNotes: 'string' },
    type: 'write',
    description: 'Add an asana to a sadhaka practice plan section'
  },
  remove_asana_from_sadhaka: {
    required: { sadhakaName: 'string', asanaName: 'string', categorySection: 'string' },
    optional: {},
    type: 'write',
    description: 'Remove an asana from a sadhaka practice plan section'
  },
  update_sadhaka_text: {
    required: { sadhakaName: 'string', field: 'string', value: 'string' },
    optional: {},
    type: 'write',
    description: 'Update a text field on a sadhaka'
  },
  create_sadhaka: {
    required: { name: 'string' },
    optional: {},
    type: 'write',
    description: 'Create a new sadhaka with default values'
  },
  delete_sadhaka: {
    required: { name: 'string' },
    optional: {},
    type: 'write',
    description: 'Delete a sadhaka'
  },
  help: {
    required: {},
    optional: {},
    type: 'read',
    description: 'Show what the assistant can do'
  },
  chat: {
    required: { message: 'string' },
    optional: {},
    type: 'read',
    description: 'General conversation response'
  }
};

// Valid asana div IDs (sections that hold asanas)
const VALID_CATEGORY_SECTIONS = [
  'jointsAndGlandsDiv', 'cardioDiv', 'nonCardioDiv', 'relaxationDiv',
  'meditativeDiv', 'breathingDiv', 'pranayamaDiv', 'meditationDiv'
];

// Valid text fields on a sadhaka document
const VALID_TEXT_FIELDS = [
  'prayerText', 'dietAndAdditionalNotes', 'routineText', 'advisoryText',
  'cardioTrainingText', 'mantraPracticeText', 'liabilityClauseText',
  'referenceBooksText', 'meditationText',
  'jointsAndGlandsNotes', 'cardioNotes', 'nonCardioNotes', 'relaxationNotes',
  'meditativeNotes', 'breathingNotes', 'pranayamaNotes', 'meditationNotes'
];

// Map category section IDs to their asana category names
const SECTION_TO_CATEGORY = {};
CATEGORIES.forEach(cat => {
  if (cat.type === 'asanas') {
    SECTION_TO_CATEGORY[cat.elementId] = cat.category;
  }
});

// --- API Key Management ---

function getHFApiKey() {
  return localStorage.getItem('hf_api_key');
}

function setHFApiKey(key) {
  localStorage.setItem('hf_api_key', key.trim());
}

function clearHFApiKey() {
  localStorage.removeItem('hf_api_key');
}

// --- HuggingFace API (Guard Rail Layer 1 - System Prompt) ---

function buildSystemPrompt() {
  const names = sadhakaNames.length > 0
    ? sadhakaNames.join(', ')
    : '(no sadhakas loaded yet)';

  // Build compact asana list grouped by category
  const asanasByCategory = {};
  asanas.forEach(a => {
    const cat = a[3] || 'Uncategorized';
    if (!asanasByCategory[cat]) asanasByCategory[cat] = [];
    asanasByCategory[cat].push(a[2] || a[0]); // displayName or name
  });
  let asanaList = '';
  for (const [cat, names] of Object.entries(asanasByCategory)) {
    asanaList += `  ${cat}: ${names.join(', ')}\n`;
  }

  return `You are a yoga practice plan assistant. Parse the user's request into a JSON action.

RULES:
- Respond ONLY with a valid JSON object. No explanation, no markdown, no extra text.
- Use ONLY these actions: ${Object.keys(CHAT_ACTION_SCHEMA).join(', ')}
- If the request doesn't match any action, respond with: {"action": "chat", "message": "your response"}

VALID ACTIONS AND PARAMETERS:
- find_sadhaka: {"action":"find_sadhaka","query":"partial name"} - search students
- get_sadhaka: {"action":"get_sadhaka","name":"exact name"} - load student details
- list_asanas: {"action":"list_asanas"} or {"action":"list_asanas","category":"Breathing"} - list yoga poses
- find_asana: {"action":"find_asana","query":"partial name"} - search yoga poses
- add_asana_to_sadhaka: {"action":"add_asana_to_sadhaka","sadhakaName":"name","asanaName":"pose name","categorySection":"cardioDiv","repetitions":"3 times","specialNotes":"be gentle"}
- remove_asana_from_sadhaka: {"action":"remove_asana_from_sadhaka","sadhakaName":"name","asanaName":"pose name","categorySection":"cardioDiv"}
- update_sadhaka_text: {"action":"update_sadhaka_text","sadhakaName":"name","field":"fieldName","value":"new text"}
- create_sadhaka: {"action":"create_sadhaka","name":"new student name"}
- delete_sadhaka: {"action":"delete_sadhaka","name":"student name"}
- help: {"action":"help"}

CURRENT STUDENTS: ${names}

VALID CATEGORY SECTIONS (for asana operations):
jointsAndGlandsDiv (Joints and Glands), cardioDiv (Cardio Day Asanas / Physical Asana), nonCardioDiv (Non-Cardio Day Asanas / Physical Asana), relaxationDiv (Relaxation), meditativeDiv (Meditative Asana), breathingDiv (Breathing), pranayamaDiv (Pranayana), meditationDiv (Meditation)

VALID TEXT FIELDS (for update_sadhaka_text):
prayerText, dietAndAdditionalNotes, routineText, advisoryText, cardioTrainingText, mantraPracticeText, liabilityClauseText, referenceBooksText, meditationText, jointsAndGlandsNotes, cardioNotes, nonCardioNotes, relaxationNotes, meditativeNotes, breathingNotes, pranayamaNotes, meditationNotes

AVAILABLE ASANAS BY CATEGORY:
${asanaList}
EXAMPLES:
User: "find student Ravi"
{"action":"find_sadhaka","query":"Ravi"}

User: "add trikonasana to John's cardio section"
{"action":"add_asana_to_sadhaka","sadhakaName":"John","asanaName":"trikonasana","categorySection":"cardioDiv"}

User: "show me all breathing exercises"
{"action":"list_asanas","category":"Breathing"}

User: "what can you do?"
{"action":"help"}

User: "hello how are you"
{"action":"chat","message":"Hello! I'm your yoga practice plan assistant. I can help you find students, manage their asana practice plans, and more. Type 'help' to see what I can do!"}`;
}

async function callHuggingFace(userMessage) {
  const apiKey = getHFApiKey();
  if (!apiKey) {
    throw new Error('No HuggingFace API key configured.');
  }

  const systemPrompt = buildSystemPrompt();

  const response = await fetch(
    'https://router.huggingface.co/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.1
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401) {
      throw new Error('Invalid HuggingFace API key. Please update your key.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited by HuggingFace. Please wait a moment and try again.');
    }
    throw new Error(`HuggingFace API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from HuggingFace.');
  }

  return content;
}

// --- JSON Parsing (Guard Rail Layer 2) ---

function parseActionJSON(rawText) {
  // Try direct parse first
  try {
    return JSON.parse(rawText.trim());
  } catch (e) {
    // Fall through to regex extraction
  }

  // Try to extract JSON from markdown code blocks or surrounding text
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Fall through
    }
  }

  return null;
}

// --- Fuzzy Matching (Guard Rail Layer 4) ---

function fuzzyMatchSadhaka(query) {
  if (!query) return null;
  const lower = query.toLowerCase().trim();

  // Exact match first
  const exact = sadhakaNames.find(n => n.toLowerCase() === lower);
  if (exact) return exact;

  // Starts-with match
  const startsWith = sadhakaNames.find(n => n.toLowerCase().startsWith(lower));
  if (startsWith) return startsWith;

  // Contains match
  const contains = sadhakaNames.find(n => n.toLowerCase().includes(lower));
  if (contains) return contains;

  return null;
}

function fuzzyMatchAsana(query) {
  if (!query) return null;
  const lower = query.toLowerCase().trim();

  // Match against name (index 0) and displayName (index 2)
  const exact = asanas.find(a =>
    a[0].toLowerCase() === lower || (a[2] && a[2].toLowerCase() === lower)
  );
  if (exact) return exact;

  const startsWith = asanas.find(a =>
    a[0].toLowerCase().startsWith(lower) || (a[2] && a[2].toLowerCase().startsWith(lower))
  );
  if (startsWith) return startsWith;

  const contains = asanas.find(a =>
    a[0].toLowerCase().includes(lower) || (a[2] && a[2].toLowerCase().includes(lower))
  );
  if (contains) return contains;

  return null;
}

function findAllMatchingSadhakas(query) {
  if (!query) return [];
  const lower = query.toLowerCase().trim();
  return sadhakaNames.filter(n => n.toLowerCase().includes(lower));
}

function findAllMatchingAsanas(query, category) {
  if (!query) {
    if (category) {
      return asanas.filter(a => a[3] && a[3].toLowerCase() === category.toLowerCase());
    }
    return asanas;
  }
  const lower = query.toLowerCase().trim();
  let results = asanas.filter(a =>
    a[0].toLowerCase().includes(lower) || (a[2] && a[2].toLowerCase().includes(lower))
  );
  if (category) {
    results = results.filter(a => a[3] && a[3].toLowerCase() === category.toLowerCase());
  }
  return results;
}

// --- Validation (Guard Rail Layers 3, 4, 5, 6) ---

function validateAction(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Response was not a valid JSON object.' };
  }

  if (!parsed.action) {
    return { valid: false, error: 'No action field in response.' };
  }

  const schema = CHAT_ACTION_SCHEMA[parsed.action];
  if (!schema) {
    return { valid: false, error: `Unknown action: "${parsed.action}". I can only perform known operations.` };
  }

  // Check required fields
  for (const [field, type] of Object.entries(schema.required)) {
    if (parsed[field] === undefined || parsed[field] === null) {
      return { valid: false, error: `Missing required field "${field}" for action "${parsed.action}".` };
    }
    if (typeof parsed[field] !== type) {
      return { valid: false, error: `Field "${field}" must be a ${type}.` };
    }
  }

  // Check no unknown fields (only action + required + optional allowed)
  const allowedFields = new Set(['action', ...Object.keys(schema.required), ...Object.keys(schema.optional)]);
  for (const key of Object.keys(parsed)) {
    if (!allowedFields.has(key)) {
      return { valid: false, error: `Unknown field "${key}" for action "${parsed.action}".` };
    }
  }

  // --- Action-specific validation ---

  // Validate sadhaka name references (Layer 4)
  if (parsed.sadhakaName) {
    const match = fuzzyMatchSadhaka(parsed.sadhakaName);
    if (!match) {
      return { valid: false, error: `Sadhaka "${parsed.sadhakaName}" not found. Available: ${sadhakaNames.slice(0, 10).join(', ')}${sadhakaNames.length > 10 ? '...' : ''}` };
    }
    parsed.sadhakaName = match; // Resolve to exact name
  }

  if (parsed.action === 'get_sadhaka' || parsed.action === 'delete_sadhaka') {
    const match = fuzzyMatchSadhaka(parsed.name);
    if (!match) {
      return { valid: false, error: `Sadhaka "${parsed.name}" not found.` };
    }
    parsed.name = match;
  }

  if (parsed.action === 'create_sadhaka') {
    if (!parsed.name || parsed.name.trim() === '') {
      return { valid: false, error: 'Sadhaka name cannot be empty.' };
    }
    if (sadhakaNames.includes(parsed.name)) {
      return { valid: false, error: `Sadhaka "${parsed.name}" already exists.` };
    }
  }

  // Validate asana name references (Layer 4)
  if (parsed.asanaName) {
    const match = fuzzyMatchAsana(parsed.asanaName);
    if (!match) {
      return { valid: false, error: `Asana "${parsed.asanaName}" not found. Try searching with "find asana <name>".` };
    }
    parsed._resolvedAsana = match; // Store full tuple [name, desc, displayName, category]
    parsed.asanaName = match[0];   // Use internal name
  }

  // Validate categorySection (Layer 5)
  if (parsed.categorySection) {
    if (!VALID_CATEGORY_SECTIONS.includes(parsed.categorySection)) {
      return { valid: false, error: `Invalid section "${parsed.categorySection}". Valid: ${VALID_CATEGORY_SECTIONS.join(', ')}` };
    }

    // Check asana belongs to the target category
    if (parsed._resolvedAsana) {
      const expectedCategory = SECTION_TO_CATEGORY[parsed.categorySection];
      const asanaCategory = parsed._resolvedAsana[3];
      if (expectedCategory && asanaCategory && asanaCategory !== expectedCategory) {
        return {
          valid: false,
          error: `Asana "${parsed._resolvedAsana[2] || parsed.asanaName}" is in category "${asanaCategory}" but section "${parsed.categorySection}" is for "${expectedCategory}".`
        };
      }
    }
  }

  // Validate text field whitelist (Layer 6)
  if (parsed.action === 'update_sadhaka_text') {
    if (!VALID_TEXT_FIELDS.includes(parsed.field)) {
      return { valid: false, error: `Invalid text field "${parsed.field}". Valid fields: ${VALID_TEXT_FIELDS.join(', ')}` };
    }
  }

  return { valid: true, action: parsed };
}

// --- Action Execution ---

async function executeAction(action) {
  switch (action.action) {
    case 'find_sadhaka': {
      const matches = findAllMatchingSadhakas(action.query);
      if (matches.length === 0) {
        return `No sadhakas found matching "${action.query}".`;
      }
      return `Found ${matches.length} sadhaka(s):\n${matches.map(n => `  - ${n}`).join('\n')}`;
    }

    case 'get_sadhaka': {
      try {
        const doc = await db.collection('sadhakas').doc(action.name).get();
        if (!doc.exists) {
          return `Sadhaka "${action.name}" not found in database.`;
        }
        const data = doc.data();
        let summary = `Sadhaka: ${data.name}\n\n`;

        // Show asana sections
        CATEGORIES.forEach(cat => {
          if (cat.type === 'asanas' && data[cat.elementId] && data[cat.elementId].length > 0) {
            summary += `${cat.title} (${data[cat.elementId].length} asanas):\n`;
            data[cat.elementId].forEach(a => {
              summary += `  - ${a.asanaName}`;
              if (a.repetitions) summary += ` (${a.repetitions})`;
              if (a.specialNotes) summary += ` [${a.specialNotes}]`;
              summary += '\n';
            });
            summary += '\n';
          }
        });

        // Also load into the main UI
        loadSadhaka(action.name);

        return summary || `Sadhaka "${action.name}" exists but has no asanas assigned.`;
      } catch (e) {
        return `Error loading sadhaka: ${e.message}`;
      }
    }

    case 'list_asanas': {
      let results;
      if (action.category) {
        results = findAllMatchingAsanas(null, action.category);
        if (results.length === 0) {
          return `No asanas found in category "${action.category}". Valid categories: ${Object.values(SECTION_TO_CATEGORY).filter((v, i, a) => a.indexOf(v) === i).join(', ')}`;
        }
        return `Asanas in "${action.category}" (${results.length}):\n${results.map(a => `  - ${a[2] || a[0]}`).join('\n')}`;
      }
      results = asanas;
      // Group by category for readability
      const grouped = {};
      results.forEach(a => {
        const cat = a[3] || 'Uncategorized';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(a[2] || a[0]);
      });
      let output = `All asanas (${results.length} total):\n`;
      for (const [cat, names] of Object.entries(grouped)) {
        output += `\n${cat} (${names.length}):\n${names.map(n => `  - ${n}`).join('\n')}\n`;
      }
      return output;
    }

    case 'find_asana': {
      const matches = findAllMatchingAsanas(action.query);
      if (matches.length === 0) {
        return `No asanas found matching "${action.query}".`;
      }
      return `Found ${matches.length} asana(s):\n${matches.map(a => `  - ${a[2] || a[0]} (${a[3] || 'uncategorized'})`).join('\n')}`;
    }

    case 'add_asana_to_sadhaka': {
      try {
        const doc = await db.collection('sadhakas').doc(action.sadhakaName).get();
        if (!doc.exists) {
          return `Sadhaka "${action.sadhakaName}" not found.`;
        }
        const data = doc.data();
        const sectionArray = data[action.categorySection] || [];

        // Check if already present
        if (sectionArray.some(a => a.asanaName === action.asanaName)) {
          return `Asana "${action.asanaName}" is already in ${action.sadhakaName}'s ${action.categorySection}.`;
        }

        sectionArray.push({
          asanaName: action.asanaName,
          repetitions: action.repetitions || '',
          specialNotes: action.specialNotes || ''
        });

        data[action.categorySection] = sectionArray;
        await saveSadhakaToDB(data);

        // Refresh UI if this sadhaka is currently loaded
        const currentLoaded = document.getElementById('sadhakaName')?.value;
        if (currentLoaded === action.sadhakaName) {
          loadSadhaka(action.sadhakaName);
        }

        const displayName = action._resolvedAsana ? (action._resolvedAsana[2] || action.asanaName) : action.asanaName;
        return `Added "${displayName}" to ${action.sadhakaName}'s ${action.categorySection}.`;
      } catch (e) {
        return `Error adding asana: ${e.message}`;
      }
    }

    case 'remove_asana_from_sadhaka': {
      try {
        const doc = await db.collection('sadhakas').doc(action.sadhakaName).get();
        if (!doc.exists) {
          return `Sadhaka "${action.sadhakaName}" not found.`;
        }
        const data = doc.data();
        const sectionArray = data[action.categorySection] || [];
        const idx = sectionArray.findIndex(a => a.asanaName === action.asanaName);
        if (idx === -1) {
          return `Asana "${action.asanaName}" not found in ${action.sadhakaName}'s ${action.categorySection}.`;
        }

        sectionArray.splice(idx, 1);
        data[action.categorySection] = sectionArray;
        await saveSadhakaToDB(data);

        const currentLoaded = document.getElementById('sadhakaName')?.value;
        if (currentLoaded === action.sadhakaName) {
          loadSadhaka(action.sadhakaName);
        }

        return `Removed "${action.asanaName}" from ${action.sadhakaName}'s ${action.categorySection}.`;
      } catch (e) {
        return `Error removing asana: ${e.message}`;
      }
    }

    case 'update_sadhaka_text': {
      try {
        const doc = await db.collection('sadhakas').doc(action.sadhakaName).get();
        if (!doc.exists) {
          return `Sadhaka "${action.sadhakaName}" not found.`;
        }
        const data = doc.data();
        data[action.field] = action.value;
        await saveSadhakaToDB(data);

        const currentLoaded = document.getElementById('sadhakaName')?.value;
        if (currentLoaded === action.sadhakaName) {
          loadSadhaka(action.sadhakaName);
        }

        return `Updated "${action.field}" for ${action.sadhakaName}.`;
      } catch (e) {
        return `Error updating text: ${e.message}`;
      }
    }

    case 'create_sadhaka': {
      try {
        const newSadhaka = createNewSadhaka(action.name);
        await saveSadhakaToDB(newSadhaka);
        sadhakaNames.push(action.name);
        populateSadhakaNameList();
        return `Created new sadhaka "${action.name}" with default values.`;
      } catch (e) {
        return `Error creating sadhaka: ${e.message}`;
      }
    }

    case 'delete_sadhaka': {
      try {
        await db.collection('sadhakas').doc(action.name).delete();
        sadhakaNames = sadhakaNames.filter(n => n !== action.name);
        populateSadhakaNameList();

        const currentLoaded = document.getElementById('sadhakaName')?.value;
        if (currentLoaded === action.name) {
          document.getElementById('sadhakaName').value = '';
          clearSadhakaDiv();
        }

        return `Deleted sadhaka "${action.name}".`;
      } catch (e) {
        return `Error deleting sadhaka: ${e.message}`;
      }
    }

    case 'help': {
      return `I can help you manage yoga practice plans. Here's what I can do:

Search & View:
  - "Find student Ravi" - search for sadhakas by name
  - "Show me Ravi's practice plan" - load full details
  - "List all breathing exercises" - list asanas by category
  - "Find asana trikonasana" - search for a specific asana

Modify Practice Plans:
  - "Add trikonasana to Ravi's cardio section" - add an asana
  - "Remove trikonasana from Ravi's cardio section" - remove an asana
  - "Update Ravi's prayer text to ..." - change a text field

Manage Students:
  - "Create new student John" - add a new sadhaka
  - "Delete student Test" - remove a sadhaka

All modifications require your confirmation before executing.`;
    }

    case 'chat': {
      return action.message || "I'm not sure how to help with that. Type 'help' to see what I can do.";
    }

    default:
      return 'Unknown action. Type "help" to see what I can do.';
  }
}

// --- Human-readable Description for Confirmations ---

function describeAction(action) {
  switch (action.action) {
    case 'add_asana_to_sadhaka': {
      const displayName = action._resolvedAsana ? (action._resolvedAsana[2] || action.asanaName) : action.asanaName;
      const sectionTitle = CATEGORIES.find(c => c.elementId === action.categorySection)?.title || action.categorySection;
      let desc = `Add "${displayName}" to ${action.sadhakaName}'s ${sectionTitle} section`;
      if (action.repetitions) desc += ` with repetitions: ${action.repetitions}`;
      if (action.specialNotes) desc += ` (note: ${action.specialNotes})`;
      return desc;
    }
    case 'remove_asana_from_sadhaka': {
      const sectionTitle = CATEGORIES.find(c => c.elementId === action.categorySection)?.title || action.categorySection;
      return `Remove "${action.asanaName}" from ${action.sadhakaName}'s ${sectionTitle} section`;
    }
    case 'update_sadhaka_text':
      return `Update "${action.field}" for ${action.sadhakaName}`;
    case 'create_sadhaka':
      return `Create new sadhaka "${action.name}" with default values`;
    case 'delete_sadhaka':
      return `DELETE sadhaka "${action.name}" permanently`;
    default:
      return JSON.stringify(action);
  }
}

// --- Chat UI Controller ---

let chatPendingConfirmation = null;

function toggleChat() {
  const chatWindow = document.getElementById('chatWindow');
  const chatButton = document.getElementById('chatButton');

  if (chatWindow.style.display === 'flex') {
    chatWindow.style.display = 'none';
    chatButton.style.display = 'flex';
  } else {
    chatWindow.style.display = 'flex';
    chatButton.style.display = 'none';

    // Show API key banner if needed
    const keyBanner = document.getElementById('chatKeyBanner');
    if (!getHFApiKey()) {
      keyBanner.style.display = 'block';
    } else {
      keyBanner.style.display = 'none';
    }

    // Focus input
    document.getElementById('chatInput').focus();
  }
}

function addChatMessage(text, sender) {
  const messagesDiv = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg chat-msg-${sender}`;

  // Support multi-line text
  const pre = document.createElement('pre');
  pre.className = 'chat-msg-text';
  pre.textContent = text;
  msgDiv.appendChild(pre);

  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addConfirmationCard(description, onConfirm, onCancel) {
  const messagesDiv = document.getElementById('chatMessages');

  const cardDiv = document.createElement('div');
  cardDiv.className = 'chat-confirmation-card';

  const descP = document.createElement('p');
  descP.className = 'chat-confirm-desc';
  descP.textContent = description;
  cardDiv.appendChild(descP);

  const questionP = document.createElement('p');
  questionP.className = 'chat-confirm-question';
  questionP.textContent = 'Proceed with this action?';
  cardDiv.appendChild(questionP);

  const btnContainer = document.createElement('div');
  btnContainer.className = 'chat-confirm-buttons';

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'chat-btn-confirm';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.onclick = () => {
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    onConfirm();
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'chat-btn-cancel';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => {
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    onCancel();
  };

  btnContainer.appendChild(confirmBtn);
  btnContainer.appendChild(cancelBtn);
  cardDiv.appendChild(btnContainer);

  messagesDiv.appendChild(cardDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTypingIndicator() {
  const messagesDiv = document.getElementById('chatMessages');
  const indicator = document.createElement('div');
  indicator.className = 'chat-msg chat-msg-assistant';
  indicator.id = 'chatTypingIndicator';
  indicator.innerHTML = '<span class="chat-typing">Thinking...</span>';
  messagesDiv.appendChild(indicator);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.getElementById('chatTypingIndicator');
  if (indicator) indicator.remove();
}

async function handleChatSend() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  if (!getHFApiKey()) {
    addChatMessage('Please set your HuggingFace API key first (see the banner above).', 'assistant');
    return;
  }

  input.value = '';
  addChatMessage(text, 'user');
  showTypingIndicator();

  try {
    const rawResponse = await callHuggingFace(text);
    hideTypingIndicator();

    // Guard Rail Layer 2: Parse JSON
    const parsed = parseActionJSON(rawResponse);
    if (!parsed) {
      addChatMessage("I couldn't understand the response. Please try rephrasing your request.", 'assistant');
      console.error('Failed to parse LLM response:', rawResponse);
      return;
    }

    // Guard Rail Layer 3-6: Validate
    const validation = validateAction(parsed);
    if (!validation.valid) {
      addChatMessage(`I couldn't process that: ${validation.error}`, 'assistant');
      return;
    }

    const action = validation.action;
    const schema = CHAT_ACTION_SCHEMA[action.action];

    // Read actions execute immediately (Layer 7 not needed)
    if (schema.type === 'read') {
      const result = await executeAction(action);
      addChatMessage(result, 'assistant');
      return;
    }

    // Write actions require confirmation (Guard Rail Layer 7)
    const description = describeAction(action);
    addChatMessage(`I understand you want to:`, 'assistant');
    addConfirmationCard(
      description,
      async () => {
        showTypingIndicator();
        try {
          const result = await executeAction(action);
          hideTypingIndicator();
          addChatMessage(result, 'assistant');
        } catch (e) {
          hideTypingIndicator();
          addChatMessage(`Error: ${e.message}`, 'assistant');
        }
      },
      () => {
        addChatMessage('Action cancelled.', 'assistant');
      }
    );
  } catch (e) {
    hideTypingIndicator();
    addChatMessage(`Error: ${e.message}`, 'assistant');
  }
}

function saveChatApiKey() {
  const input = document.getElementById('chatApiKeyInput');
  const key = input.value.trim();
  if (!key) {
    alert('Please enter a valid API key.');
    return;
  }
  setHFApiKey(key);
  document.getElementById('chatKeyBanner').style.display = 'none';
  addChatMessage('API key saved! You can now start chatting. Type "help" to see what I can do.', 'assistant');
  input.value = '';
}

function changeChatApiKey() {
  clearHFApiKey();
  document.getElementById('chatKeyBanner').style.display = 'block';
  addChatMessage('API key cleared. Please enter a new key.', 'assistant');
}

// Handle Enter key in chat input
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSend();
      }
    });
  }
});
