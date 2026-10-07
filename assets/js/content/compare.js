/* compare.js - reusable comparisons for concepts learners confuse.

   Each comparison lists 2-4 concepts with the same fields so they line up:
   input, output, purpose, when (to use it), diff (the key difference),
   not (what it does not do), example. "takeaway" is the AI-901 Exam Lens line.

   scope 'exam'       - every concept compared sits inside a current objective (objs).
   scope 'foundation' - background needed to reason about objectives; not measured
                        directly by the April 15, 2026 outline.
   Checked against Microsoft Learn: Introduction to AI concepts, generative AI,
   NLP, speech, computer vision and information extraction modules; Foundry
   deployment types; Foundry resources and projects. */

var COMPARE = [
  { id: 'trad-vs-ai', title: 'Traditional software vs an AI model', scope: 'foundation', objs: ['1.3.1'], area: 'ml', lesson: '00-02',
    items: [
      { concept: 'Traditional software', input: 'Any data', output: 'Exactly what the rules dictate', purpose: 'Apply known, exact logic', when: 'The rules are known and must be auditable: tax, payroll, access checks', diff: 'Logic is written by a developer and readable line by line', not: 'Does not cope with variation nobody anticipated', example: 'An interest calculator' },
      { concept: 'AI model', input: 'Text, images, audio, data', output: 'A prediction or generated content, with uncertainty', purpose: 'Handle varied input using learned patterns', when: 'Inputs vary too much for rules: language, images, speech', diff: 'Logic is learned from examples and stored as numbers', not: 'Does not guarantee a correct answer', example: 'A spam filter' }
    ],
    takeaway: 'If a scenario needs exact, explainable logic, AI is the wrong tool. AI suits messy input and tolerates estimates.' },

  { id: 'class-reg-clust', title: 'Classification vs regression vs clustering', scope: 'foundation', objs: ['1.3.1'], area: 'ml', lesson: '00-04',
    items: [
      { concept: 'Classification', input: 'Features of an item', output: 'A category (label)', purpose: 'Decide which known group something belongs to', when: 'Answers like yes/no, or one of N categories', diff: 'Categories are defined in advance, learned from labelled examples', not: 'Does not produce a quantity', example: 'Is this email spam?' },
      { concept: 'Regression', input: 'Features of an item', output: 'A number', purpose: 'Estimate a quantity', when: 'Answers like how much, how many, how long', diff: 'Output is a continuous value', not: 'Does not choose a category', example: 'What will this house sell for?' },
      { concept: 'Clustering', input: 'Many unlabelled items', output: 'Groups of similar items', purpose: 'Discover structure', when: 'No categories exist yet', diff: 'Unsupervised: no labels needed', not: 'Does not name the groups or predict a known label', example: 'Find customer segments' }
    ],
    takeaway: 'AI-901 has no machine learning domain. Recognize these to understand services that are classifiers underneath, such as sentiment analysis.' },

  { id: 'predictive-vs-generative', title: 'Predictive AI vs generative AI', scope: 'exam', objs: ['1.2.1', '1.3.1'], area: 'genai', lesson: '00-09',
    items: [
      { concept: 'Predictive AI', input: 'Text, images, audio, data', output: 'A label, number, location or extracted value', purpose: 'Recognize or estimate something about the input', when: 'The answer comes from a known set or must be traced to the input', diff: 'Chooses or extracts; creates nothing new', not: 'Does not write new content', example: 'Sentiment of a review; objects in a photo' },
      { concept: 'Generative AI', input: 'A prompt (text, and often images or audio)', output: 'New text, images, code or audio', purpose: 'Create content', when: 'The answer is a draft, a reply, a summary in new words, an image', diff: 'Generates token by token from probabilities', not: 'Does not check its output for truth', example: 'Draft a reply to a complaint' }
    ],
    takeaway: 'Ask whether the output already exists in a known set or in the input (predictive or extraction), or must be created (generative).' },

  { id: 'app-vs-agent', title: 'Generative AI application vs AI agent', scope: 'exam', objs: ['1.3.1', '2.1.4', '2.1.5'], area: 'agents', lesson: '00-12',
    items: [
      { concept: 'Generative AI application', input: 'A prompt and context', output: 'Generated content', purpose: 'Answer, draft, summarize, explain', when: 'Everything needed is in the model or the prompt', diff: 'Prompt in, response out', not: 'Does not reach live systems or take actions', example: 'A chat page that explains company jargon' },
      { concept: 'AI agent', input: 'A goal or request', output: 'An answer based on tool results, or a completed action', purpose: 'Get tasks done using tools', when: 'Live data, documents or actions are needed', diff: 'Model + instructions + tools; the model decides when to call a tool', not: 'Does not run tools by itself; the agent runtime executes calls with the permissions it was given', example: 'Check an order status and rebook the delivery' }
    ],
    takeaway: 'Tools are the dividing line: if the scenario must look something up in a live system or act, it is an agent.' },

  { id: 'prompt-parts', title: 'System prompt vs user prompt vs conversation history', scope: 'exam', objs: ['2.1.1'], area: 'genai', lesson: '00-10',
    items: [
      { concept: 'System prompt (instructions)', input: 'Written by the app or agent developer', output: 'Shapes every response', purpose: 'Set role, tone, scope, format and rules', when: 'A rule should apply to every answer', diff: 'Set once by the application', not: 'Does not ask the specific question', example: '"You are Contoso\'s HR assistant. Answer only from the policy provided."' },
      { concept: 'User prompt', input: 'Typed or spoken by the user (or generated by the app)', output: 'The response to this request', purpose: 'Ask for something specific', when: 'Every turn', diff: 'Changes every request', not: 'Does not reliably enforce rules for future answers', example: '"How many leave days after three years?"' },
      { concept: 'Conversation history', input: 'Earlier prompts and responses, resent by the app', output: 'Continuity', purpose: 'Let follow-up questions make sense', when: 'Multi-turn chat', diff: 'Supplied by the application; the model keeps no memory', not: 'Does not add new facts', example: 'Resending earlier turns, or passing the previous response ID' }
    ],
    takeaway: 'Rules for every answer go in the system prompt; the request goes in the user prompt; continuity comes from the app resending history.' },

  { id: 'context-vs-grounding', title: 'Prompt context vs retrieved (grounded) information', scope: 'exam', objs: ['2.1.1', '2.1.4'], area: 'genai', lesson: '00-10',
    items: [
      { concept: 'Context written into the prompt', input: 'Text the developer or user includes', output: 'Responses shaped by that text', purpose: 'Give audience, format, examples', when: 'The needed information is short and known in advance', diff: 'Fixed text supplied with the request', not: 'Does not scale to a large or changing document collection', example: 'Including a style example in the prompt' },
      { concept: 'Retrieval-augmented generation (RAG)', input: 'The question plus passages retrieved from a data source', output: 'An answer grounded in those passages, often with citations', purpose: 'Answer from your own, current data', when: 'Answers depend on documents the model never saw', diff: 'Relevant content is searched for at request time', not: 'Does not change the model\'s parameters, and does not guarantee a correct answer', example: 'An agent with a Foundry IQ knowledge base over policy PDFs' }
    ],
    takeaway: 'When a model lacks your organization\'s facts, retrieve them and add them to the prompt (grounding) - not a higher temperature or a bigger model.' },

  { id: 'text-techniques', title: 'Text analysis techniques', scope: 'exam', objs: ['1.3.2', '2.2.1'], area: 'language', lesson: '00-05',
    items: [
      { concept: 'Key phrase (keyword) extraction', input: 'Text', output: 'Main terms and phrases', purpose: 'What is it about?', when: 'Topics, themes, tags', diff: 'Terms, not typed things', not: 'Does not say whether the text is positive', example: '"battery life", "delivery"' },
      { concept: 'Entity detection (NER)', input: 'Text', output: 'Named items with a type and position', purpose: 'Who, what, where, when?', when: 'People, places, organizations, dates, products; PII', diff: 'Each result has a category', not: 'Does not summarize the text', example: 'Montreal: Location; 3 May: DateTime' },
      { concept: 'Sentiment analysis', input: 'Text', output: 'Positive, neutral or negative, with confidence', purpose: 'How does the writer feel?', when: 'Reviews, feedback, social posts', diff: 'A classification of opinion', not: 'Does not say what the opinion is about', example: 'This review: negative (0.92)' },
      { concept: 'Summarization', input: 'Long text', output: 'A shorter version with the main points', purpose: 'Condense', when: 'Long articles, transcripts, reports', diff: 'Extractive selects sentences; abstractive writes new ones', not: 'Does not guarantee every detail is kept', example: 'Three-sentence summary of a meeting transcript' }
    ],
    takeaway: 'All four take text in. Choose by the output the scenario asks for.' },

  { id: 'stt-vs-tts', title: 'Speech recognition vs speech synthesis', scope: 'exam', objs: ['1.3.3', '2.2.2', '2.2.3'], area: 'speech', lesson: '00-07',
    items: [
      { concept: 'Speech recognition (speech to text)', input: 'Audio of speech', output: 'Text, with timestamps and confidence', purpose: 'Transcribe, caption, accept voice commands', when: '"transcribe", "caption", "dictate", "voice input"', diff: 'Audio to text', not: 'Does not produce audio', example: 'Captions for a live meeting' },
      { concept: 'Speech synthesis (text to speech)', input: 'Text (optionally SSML)', output: 'Spoken audio in a chosen voice', purpose: 'Speak to users', when: '"read aloud", "voice", "announce", "audio version"', diff: 'Text to audio', not: 'Does not understand speech', example: 'A kiosk reading answers aloud' },
      { concept: 'Audio-capable multimodal model', input: 'A spoken prompt (audio), possibly with text', output: 'A generated response', purpose: 'Respond to spoken prompts directly', when: 'No separate transcription step is wanted', diff: 'The model takes audio as part of the prompt', not: 'Is not the same as a transcription service', example: 'A voice-based agent in Foundry' }
    ],
    takeaway: 'Direction decides it: audio to text is recognition, text to audio is synthesis. SSML shapes synthesis.' },

  { id: 'vision-tasks', title: 'Computer vision tasks', scope: 'exam', objs: ['1.3.4', '2.3.1', '2.3.3'], area: 'vision', lesson: '00-06',
    items: [
      { concept: 'Image classification', input: 'An image', output: 'One label for the main subject', purpose: 'What is this a picture of?', when: 'One item per image', diff: 'One answer for the whole image', not: 'Does not locate or count objects', example: 'Banana' },
      { concept: 'Object detection', input: 'An image', output: 'Each object with a label and bounding box', purpose: 'What is where?', when: 'Count, locate, track several items', diff: 'Rectangles around each object', not: 'Does not give exact outlines', example: 'Three fruits at three box positions' },
      { concept: 'Semantic segmentation', input: 'An image', output: 'A label for each pixel', purpose: 'Exactly which pixels belong to what?', when: 'Precise shapes, backgrounds, areas', diff: 'Pixel masks instead of boxes', not: 'Does not describe the scene in words', example: 'Blurring the background behind a person' },
      { concept: 'Image analysis (multimodal)', input: 'An image, often with a question', output: 'A description, tags or an answer in text', purpose: 'What is happening here?', when: 'Captions, alt text, questions about an image', diff: 'Links visual features to language', not: 'Does not create new images', example: '"A person eating an apple"' }
    ],
    takeaway: 'Same image, different questions. The required output - label, boxes, masks or a description - picks the task.' },

  { id: 'analyze-vs-generate-image', title: 'Interpreting images vs generating images', scope: 'exam', objs: ['1.3.4', '2.3.1', '2.3.2'], area: 'vision', lesson: '00-06',
    items: [
      { concept: 'Interpret visual input', input: 'An existing image plus a prompt', output: 'Text about the image', purpose: 'Understand or answer questions about a picture', when: '"describe", "what is in", "read this chart"', diff: 'Image in, text out', not: 'Does not create pixels', example: 'A multimodal model describing a circuit board photo' },
      { concept: 'Generate visual output', input: 'A text prompt (sometimes an image to edit)', output: 'A new image (or video)', purpose: 'Create visuals', when: '"create", "design", "illustrate"', diff: 'Text in, image out, commonly by diffusion', not: 'Does not analyze an existing picture', example: 'An image-generation model creating a product mock-up' }
    ],
    takeaway: 'Which direction? Image to text is interpretation by a multimodal model; text to image is generation by an image model.' },

  { id: 'ocr-vs-fields', title: 'OCR vs field extraction vs image description', scope: 'exam', objs: ['1.3.5', '2.4.1', '2.4.2', '2.4.3'], area: 'extract', lesson: '00-08',
    items: [
      { concept: 'OCR (read)', input: 'An image or scanned page', output: 'All the text, with positions', purpose: 'Digitize printed or written text', when: '"read the text", "digitize", "serial numbers in photos"', diff: 'Text only, no meaning attached', not: 'Does not know which text is the total', example: 'Every line of a scanned contract' },
      { concept: 'Field extraction', input: 'A document, image, audio or video', output: 'Named fields from a schema, with confidence', purpose: 'Structured data for a business system', when: '"vendor, date and total", "policy number"', diff: 'Maps text to meaning and checks it', not: 'Does not write new content', example: 'Receipt: merchant, date, total' },
      { concept: 'Image description', input: 'An image', output: 'A sentence or tags about the scene', purpose: 'Understand what is pictured', when: '"describe", "alt text", "what is happening"', diff: 'Interprets the scene, not the printed text', not: 'Does not return business fields', example: '"A receipt on a café table"' }
    ],
    takeaway: 'OCR gives you text; field extraction gives you meaning. In Foundry, Azure Content Understanding does both, across documents, images, audio and video.' },

  { id: 'extract-vs-generate', title: 'Information extraction vs free-form generation', scope: 'exam', objs: ['1.3.5', '2.4.1', '1.3.1'], area: 'extract', lesson: '00-08',
    items: [
      { concept: 'Information extraction', input: 'Source content', output: 'Values that appear in the source, in named fields', purpose: 'Capture facts faithfully', when: 'Values must be traceable and validated: totals, IDs, dates', diff: 'Output is grounded in the source, with confidence', not: 'Does not invent values that are not there', example: 'Invoice total: 6.97, from line 14' },
      { concept: 'Free-form generation', input: 'A prompt', output: 'New text', purpose: 'Draft, explain, summarize in new words', when: 'A readable answer is wanted, and exact traceability is not', diff: 'Writes new content', not: 'Does not guarantee every value appears in, or matches, the source', example: 'A friendly letter explaining a claim decision' }
    ],
    takeaway: 'When the output feeds a system of record, extraction (with confidence and human review) beats generation.' },

  { id: 'tool-vs-model', title: 'Prebuilt Foundry Tool vs general-purpose model', scope: 'exam', objs: ['1.2.2', '2.2.1'], area: 'models', lesson: '00-05',
    items: [
      { concept: 'Foundry Tool (for example Azure Language)', input: 'Content for one well-defined task', output: 'A fixed, documented structure: labels, entities, offsets, confidence', purpose: 'Predictable results for a defined task', when: 'The task is well defined and results must be consistent', diff: 'Prebuilt models with fixed output', not: 'Does not handle open-ended requests', example: 'PII detection that returns category, offset and confidence every time' },
      { concept: 'General-purpose model (Foundry Models)', input: 'A prompt', output: 'Whatever the prompt asks for', purpose: 'Flexible, open-ended tasks', when: 'Varied tasks, natural language answers, combining several steps', diff: 'Behaviour set by prompts', not: 'Does not guarantee identical structure or wording each time', example: 'Summarize, classify and draft a reply in one request' }
    ],
    takeaway: 'Microsoft\'s guidance: when the use case is well defined, a Foundry Tool gives predictable performance; for open-ended tasks, use a model from the catalog.' },

  { id: 'api-sdk-cli', title: 'REST API vs SDK vs CLI', scope: 'exam', objs: ['2.1.3', '2.1.5', '2.4.4'], area: 'foundry', lesson: '00-13',
    items: [
      { concept: 'REST API', input: 'An HTTPS request: URL, headers, JSON body', output: 'An HTTPS response with JSON', purpose: 'Call a service from anything that speaks HTTP', when: 'No SDK for your language, or full control needed', diff: 'You write the request yourself', not: 'Does not hide authentication or parsing', example: 'curl POST to the Responses endpoint' },
      { concept: 'SDK (client library)', input: 'Method calls in your language', output: 'Typed objects', purpose: 'Build applications quickly', when: 'Python, C#, JavaScript or Java apps', diff: 'Builds and sends REST requests for you', not: 'Does not run the model locally', example: 'AIProjectClient, then responses.create()' },
      { concept: 'CLI (Azure CLI)', input: 'Typed commands', output: 'Results in the terminal', purpose: 'Create and manage resources, scripts', when: 'Provisioning, listing, deleting resources', diff: 'Mostly control plane', not: 'Is not how an app chats with a model', example: 'az cognitiveservices account deployment list' }
    ],
    takeaway: 'Apps use REST or an SDK to use models (data plane); people and scripts use the CLI to manage resources (control plane).' },

  { id: 'deployment-types', title: 'Model deployment types', scope: 'exam', objs: ['1.2.3'], area: 'models', lesson: '00-15',
    items: [
      { concept: 'Global Standard', input: 'Requests from your app', output: 'Pay-per-token inference', purpose: 'Default choice', when: 'No data-location restriction; newest models; bursty traffic', diff: 'May be processed in any Azure region', not: 'Does not keep processing in one geography', example: 'A prototype chatbot' },
      { concept: 'Data Zone Standard', input: 'Requests from your app', output: 'Pay-per-token inference', purpose: 'Keep processing within a data zone', when: 'EU-only or US-only processing, still pay per use', diff: 'Processed only within the Microsoft-specified data zone', not: 'Does not reserve capacity', example: 'An EU customer service assistant' },
      { concept: 'Provisioned (Global, Data Zone or Regional)', input: 'Requests from your app', output: 'Reserved throughput', purpose: 'Predictable, high-volume performance', when: 'Consistent high volume, low latency variance', diff: 'Reserved capacity rather than pay-per-token', not: 'Does not suit occasional or bursty use cheaply', example: 'A busy production contact centre' },
      { concept: 'Batch (Global or Data Zone)', input: 'Large files of requests', output: 'Results returned asynchronously', purpose: 'Lower-cost bulk processing', when: 'Large jobs that are not time-sensitive', diff: 'Asynchronous and discounted', not: 'Does not answer interactively', example: 'Classifying a year of archived emails overnight' }
    ],
    takeaway: 'Two questions decide it: where may data be processed (global, data zone, geography), and how do you want to pay (per token, reserved, batch)?' },

  { id: 'resource-vs-project', title: 'Foundry resource vs Foundry project', scope: 'exam', objs: ['2.1.2'], area: 'foundry', lesson: '00-15',
    items: [
      { concept: 'Foundry resource', input: 'Created in an Azure resource group', output: 'The Azure resource providing AI capabilities', purpose: 'Models, agent service, governance, security boundary, quotas', when: 'One per team or department, typically', diff: 'An Azure resource with region, access control and billing', not: 'Is not where a team organizes one solution\'s agents and files', example: 'ais-contoso-ai in West Europe' },
      { concept: 'Foundry project', input: 'Created inside a Foundry resource', output: 'A workspace', purpose: 'Build agents, evaluations, files, indexes, connections', when: 'One per AI use case', diff: 'Inherits settings from its parent resource', not: 'Is not a separate billing or networking boundary by default', example: 'proj-hr-assistant' }
    ],
    takeaway: 'Resource = the Azure platform and boundary; project = the workspace for one solution.' },

  { id: 'rai-neighbours', title: 'Responsible AI principles that get confused', scope: 'exam', objs: ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6'], area: 'rai', lesson: '00-16',
    items: [
      { concept: 'Fairness', input: 'Decisions about people', output: 'Equitable outcomes', purpose: 'Do similar people get similar outcomes?', when: 'Approvals, scores, rankings that affect people', diff: 'About outcomes of the system\'s decisions', not: 'Is not about who can use the interface', example: 'Loan approvals by neighbourhood' },
      { concept: 'Inclusiveness', input: 'All potential users', output: 'Access for everyone', purpose: 'Can everyone use it?', when: 'Disabilities, languages, devices', diff: 'About access to the system', not: 'Is not about whether decisions are equitable', example: 'Captions on a voice assistant' },
      { concept: 'Transparency', input: 'Users and stakeholders', output: 'Understanding', purpose: 'Do people know it is AI and what its limits are?', when: 'Disclosure, documentation, explanations', diff: 'About people understanding the system', not: 'Is not about who is answerable', example: '"You are chatting with an AI assistant"' },
      { concept: 'Accountability', input: 'The organization', output: 'Named responsibility and governance', purpose: 'Who answers for it?', when: 'Owners, approvals, oversight', diff: 'About people being answerable', not: 'Is not the same as explaining the system', example: 'A review board signs off each release' }
    ],
    takeaway: 'Learn the question each principle asks. Fairness vs inclusiveness: outcomes vs access. Transparency vs accountability: understanding vs answerability.' }
];

var CMP_BY = {}; COMPARE.forEach(function (c) { CMP_BY[c.id] = c; });
