/* Module 0 - Part 2: what AI can do (00-05 to 00-08).
   Grounded in Microsoft Learn: "Introduction to natural language processing
   concepts", "Introduction to AI speech concepts", "Introduction to computer
   vision concepts" and "Introduction to AI-powered information extraction
   concepts" (AI-901 learning path 1). */

/* ======================================================================
   00-05  Language
   ====================================================================== */
FOUND.push({
  id: '00-05', title: 'Language: AI That Works With Text', short: 'Language',
  scope: 'supports', supports: ['1.3.1', '1.3.2', '2.2.1'], area: 'language',
  prereq: ['00-04'], learn: ['L4'], mods: ['01-03', '02-03'],
  outcomes: [
    'Describe language detection, sentiment analysis, key phrase extraction, entity detection, PII detection and summarization',
    'Pick the right technique from the output a scenario needs',
    'Explain when a specialist text-analysis service beats a general-purpose language model'
  ],
  problem: `<p>An online store receives 3,000 product reviews a week in several languages. The product team wants to know which reviews are unhappy, what people keep mentioning ("battery", "delivery"), which products and places are named, and a short summary for each long review. Legal wants customers' phone numbers and email addresses removed before reviews are shared internally. Nobody has time to read them all.</p>`,
  plain: `<p><strong>Natural language processing (NLP)</strong> is the area of AI that works with human language. <strong>Text analysis</strong> is the part of NLP that reads text and returns structured information about it: which language it is in, whether it is positive or negative, what it is about, who and what it mentions, and what its main points are.</p>`,
  example: `<p>Review: <em>"Ordered the Contoso X2 headphones on 3 May. Delivery to Montreal took two weeks and the battery died in a day. Very disappointed."</em> Text analysis returns: language <strong>English</strong>; sentiment <strong>negative</strong>; key phrases <strong>delivery</strong>, <strong>battery</strong>; entities <strong>Contoso X2</strong> (product), <strong>3 May</strong> (date), <strong>Montreal</strong> (location), <strong>two weeks</strong> (duration).</p>`,
  words: [
    ['Natural language processing (NLP)', 'AI that analyzes and generates human language'],
    ['Language detection', 'Identifying which language a text is written in; often the first step'],
    ['Sentiment analysis', 'Classifying text as positive, neutral or negative'],
    ['Key phrase (keyword) extraction', 'Pulling out the main words and phrases a text is about'],
    ['Entity detection (NER)', 'Finding mentions of people, places, organizations, dates, products and similar'],
    ['PII detection', 'Finding personally identifiable information, such as names and phone numbers, so it can be redacted'],
    ['Summarization', 'Reducing text to its main points: extractive (selects sentences) or abstractive (writes new ones)']
  ],
  model: function () { return vIPO([
    { r: 'Input', t: 'Customer review', s: 'free text' },
    { r: 'Capability', t: 'Text analysis' },
    { r: 'Output', t: 'Sentiment, key phrases, entities', s: 'structured, with confidence', k: 'ok' },
    { r: 'Used by', t: 'Dashboard or support workflow' }
  ], 'The input is unstructured text; the output is structured data a program can count, filter and route.'); },
  concept: `<p>Microsoft Learn groups the common text-analysis techniques like this. <strong>Language detection</strong> finds the language. <strong>Text classification</strong> assigns a category, and <strong>sentiment analysis</strong> is a form of it. <strong>Key-term extraction</strong> and <strong>entity detection</strong> find what a text is about and what it mentions; a specialized form of entity detection finds <strong>personally identifiable information (PII)</strong> so it can be redacted. <strong>Summarization</strong> reduces the volume of text while keeping the main points.</p>`,
  how: `<p>Text is first split into <strong>tokens</strong> (words or parts of words) and normalized. Classic statistical techniques then go a long way: counting how often terms appear, scoring terms that are frequent in one document but rare across others (<strong>TF-IDF</strong>), classifying with word counts (<strong>bag-of-words</strong>), and selecting the most representative sentences for an <strong>extractive</strong> summary (TextRank). Modern services use <strong>semantic language models</strong> - transformers - that capture meaning in context, which is also what enables <strong>abstractive</strong> summaries written in new words.</p>`,
  ms: `<p><strong>Azure Language in Foundry Tools</strong> provides these techniques as ready-made features - language detection, sentiment analysis, key phrase extraction, named entity recognition, PII detection and summarization - with confidence scores and character offsets. You can also ask a <strong>general-purpose language model</strong> in Foundry to analyze text with a prompt. Microsoft's guidance: many text tasks are now handled by generative models, but specialist NLP tools are used when you need <em>predictable</em> results or custom rules.</p>`,
  compare: ['text-techniques', 'tool-vs-model'],
  distinctions: `<p><strong>Key phrases versus entities.</strong> Key phrases are what a text is <em>about</em> ("battery life"); entities are specific <em>things it names</em>, with a type (Montreal: location).</p>
<p><strong>Extractive versus abstractive summaries.</strong> Extractive selects existing sentences; abstractive generates new wording. The second needs a generative model.</p>
<p><strong>Text analysis versus information extraction.</strong> Text analysis describes free text. Information extraction pulls specific named fields - invoice number, total - out of documents. Lesson 00-08 covers it.</p>`,
  rai: `<p><em>Privacy:</em> detect and redact PII before text is stored or shared. <em>Reliability:</em> sentiment models misread sarcasm ("Great, it broke again") - treat scores as estimates. <em>Inclusiveness:</em> accuracy varies by language, so test the languages your users actually write in.</p>`,
  scenario: `<p>A city council collects 10,000 comments on a new bike lane. It wants the share that are supportive, the issues raised most often, and every comment that mentions a specific street - with residents' phone numbers removed before publication. That is sentiment analysis, key phrase extraction, entity detection (locations) and PII detection.</p>`,
  explore: { widget: 'textlab', title: 'Text analysis lab',
    intro: 'Paste or type any text and run the four classic techniques. Everything runs in your browser using the simple statistical methods Microsoft Learn describes - word lists and frequency counts - not Azure Language. Real services use trained models and are far more accurate; the point is to see what goes in and what comes out.' },
  observe: `<p>Try the sarcastic sample: the word-list sentiment scores it positive, because "great" and "love" outweigh "broke". A trained model does better, but sarcasm still trips real services. Then compare the key phrases with the summary: key phrases are single terms, the summary is whole sentences chosen from the text - an extractive summary.</p>`,
  check: [
    { q: 'A travel site wants to show, for each hotel, the three things reviewers mention most often, such as "breakfast" or "noise". Which technique fits?', o: ['Sentiment analysis', 'Key phrase extraction', 'Language detection', 'Speech recognition'], a: 1,
      why: 'The site wants the main topics people mention. Key phrase extraction returns those terms.',
      not: ['Sentiment tells you whether reviews are positive or negative, not what they mention.', '', 'Language detection only identifies the language each review is written in.', 'The reviews are already text; nothing needs transcribing.'],
      clue: '"things reviewers mention most often"', obj: '1.3.2', area: 'language' },
    { q: 'Before sharing support transcripts with a training vendor, a company must remove customers\' names, phone numbers and email addresses. Which capability should it use?', o: ['Abstractive summarization', 'Sentiment analysis', 'PII detection and redaction', 'Image classification'], a: 2,
      why: 'PII detection is a specialized form of entity detection that finds personal information so it can be redacted.',
      not: ['A summary shortens text but gives no guarantee that personal details are removed.', 'Sentiment says how a customer felt; it removes nothing.', '', 'The transcripts are text, not images.'],
      clue: '"remove names, phone numbers and email addresses"', obj: '1.1.3', area: 'language', misc: 'Summarizing text makes it anonymous.' },
    { q: 'A compliance team needs entity results that are identical every time the same document is processed, with a confidence score and the exact position of each entity. Which option fits better?', o: ['A general-purpose chat model with a prompt asking for entities', 'Azure Language entity recognition', 'An image-generation model', 'A speech synthesis voice'], a: 1,
      why: 'Azure Language returns entities in a fixed structure with categories, confidence scores and offsets. Microsoft recommends specialist NLP tools when results must be predictable.',
      not: ['A chat model can find entities, but its wording and format can vary between runs and it does not return offsets and confidence by design.', '', 'Image generation creates pictures; it does not analyze text.', 'Speech synthesis reads text aloud.'],
      clue: '"identical every time", "confidence score", "exact position"', obj: '2.2.1', area: 'language', misc: 'A general-purpose model is always the better choice for any text task.' }
  ],
  teach: { prompt: 'Explain the difference between key phrase extraction, entity detection and sentiment analysis using a single restaurant review as the example.',
    points: ['Key phrases: what the review is about', 'Entities: specific named things, each with a type', 'Sentiment: positive, neutral or negative', 'All three turn unstructured text into structured output'] },
  takeaways: [
    'Text analysis turns free text into structured output: language, sentiment, key phrases, entities, PII and summaries.',
    'Pick the technique from the output you need, not from the input (it is always text).',
    'Azure Language in Foundry Tools gives predictable, structured results; a general-purpose model is more flexible.',
    'Extractive summaries select sentences; abstractive summaries generate new ones.'
  ]
});

/* ======================================================================
   00-06  Vision
   ====================================================================== */
FOUND.push({
  id: '00-06', title: 'Vision: AI That Works With Images', short: 'Vision',
  scope: 'supports', supports: ['1.3.1', '1.3.4', '2.3.1', '2.3.2'], area: 'vision',
  prereq: ['00-04'], learn: ['L6'], mods: ['01-03', '02-04'],
  outcomes: [
    'Explain that an image is numbers to a computer, and what a filter does to it',
    'Tell image classification, object detection, semantic segmentation and image analysis apart by their output',
    'Distinguish analyzing an image from generating a new one'
  ],
  problem: `<p>A grocery chain wants a self-checkout that recognizes fruit and vegetables placed on a scale. Later it wants the camera to find every item when several are placed together, read the text on packaged goods, describe products for the website, and even create images for a new product line that has not been photographed yet.</p>`,
  plain: `<p><strong>Computer vision</strong> is the area of AI that analyzes visual input - photographs, video and live camera feeds. Different vision tasks answer different questions about the same picture: <em>what is this?</em>, <em>where is each thing?</em>, <em>exactly which pixels belong to it?</em>, <em>what is happening here?</em> A separate family of models goes the other way and <strong>generates</strong> new images from a text description.</p>`,
  example: `<p>Your phone suggests "Food" as an album for a photo of dinner (classification). A traffic camera draws boxes around each car (object detection). A video call blurs your background but not you (segmentation). A photo app writes "A person eating an apple on a park bench" as alt text (image analysis with a multimodal model).</p>`,
  words: [
    ['Pixel', 'One point of an image, stored as numbers (one for grey, three for red, green and blue)'],
    ['Image classification', 'Predicting one label for the main subject of an image'],
    ['Object detection', 'Finding each object and its location, given as a bounding box'],
    ['Bounding box', 'The rectangle (coordinates) around a detected object'],
    ['Semantic segmentation', 'Labelling individual pixels by the object they belong to'],
    ['Multimodal model', 'A model that works with more than one kind of input, such as text and images together'],
    ['Image generation', 'Creating a new image from a text prompt, commonly by diffusion']
  ],
  model: function () { return vIPO([
    { r: 'Input', t: 'Photo of the checkout scale' },
    { r: 'Capability', t: 'Computer vision' },
    { r: 'Output', t: 'Labels, boxes, masks or a description', s: 'depends on the task', k: 'ok' },
    { r: 'Used by', t: 'Checkout software' }
  ], 'Same input, different outputs: the task you choose decides what comes out.'); },
  concept: `<p>Microsoft Learn describes four kinds of vision output. <strong>Image classification</strong> predicts a label for the whole image. <strong>Object detection</strong> finds individual objects and their locations as rectangular bounding boxes. <strong>Semantic segmentation</strong> classifies individual pixels, giving a precise outline. <strong>Contextual image analysis</strong> uses <strong>multimodal</strong> models trained on images together with text, so they can describe what an image depicts and suggest tags. <strong>Image generation</strong> reverses the direction: a prompt goes in and an image comes out.</p>`,
  how: `<p>To a computer an image is a grid of numbers: one value per pixel for greyscale, three (red, green, blue) for colour. Vision models learn <strong>filters</strong> - small grids of weights slid across the image - that respond to edges, textures and shapes. Older models stack these filters in <em>convolutional neural networks</em>; newer models use <em>vision transformers</em>, and multimodal models connect what they see to language. Image generators commonly use <strong>diffusion</strong>: start from random noise and remove noise step by step until an image matching the prompt emerges.</p>`,
  ms: `<p>In Microsoft Foundry, a <strong>multimodal model</strong> deployment can take an image inside a prompt and answer questions about it. <strong>Image-generation models</strong> in the Foundry catalog create images from text. <strong>Azure Vision in Foundry Tools</strong> provides prebuilt image analysis. Reading text inside images (OCR) belongs to information extraction, covered in 00-08.</p>`,
  compare: ['vision-tasks', 'analyze-vs-generate-image'],
  distinctions: `<p><strong>Classification versus detection.</strong> One label for the picture, or every object and where it is? "Count the items on the shelf" needs detection; "is this a photo of a shelf" needs classification.</p>
<p><strong>Detection versus segmentation.</strong> Boxes are approximate rectangles; segmentation marks the exact pixels.</p>
<p><strong>Analyzing versus generating.</strong> Interpreting an existing image produces text or coordinates; generating produces a new image.</p>`,
  rai: `<p><em>Privacy:</em> images of people, especially faces, are personal data; delete them when they are no longer needed. <em>Fairness:</em> vision models trained on narrow data perform worse on people and settings they rarely saw. <em>Transparency:</em> generated images can be mistaken for photos; Microsoft's image models attach Content Credentials that identify AI-generated images.</p>`,
  scenario: `<p>A warehouse wants to count boxes on each pallet from a ceiling camera and flag any that are crushed. Counting requires finding each box separately, so object detection fits better than image classification, which would only label the whole picture.</p>`,
  explore: { widget: 'pixellab', title: 'Pixels, filters and four kinds of vision output',
    intro: 'Part 1: draw on the grid and watch the numbers change, then apply the edge filter from Microsoft Learn\'s vision module - a real convolution, computed in your browser. Part 2: switch between the four task types for the same scene and compare what each one outputs. Part 2\'s outputs are fixed illustrations, not a live model.' },
  observe: `<p>The edge filter turned flat areas to zero and lit up the boundaries of your shape: that is how the first layers of a vision model pick out structure. In part 2, notice that the scene never changed; only the question did. The output format - one label, several boxes, a pixel mask, or a sentence - is the clue that tells you which task a scenario needs.</p>`,
  check: [
    { q: 'A recycling plant\'s camera must find every plastic bottle on a conveyor belt and report where each one is so a robot arm can pick it up. Which vision task fits?', o: ['Image classification', 'Object detection', 'Image generation', 'Speech recognition'], a: 1,
      why: 'The system needs each object and its location. Object detection returns a label and bounding box per object.',
      not: ['Classification gives one label for the whole image and no locations.', '', 'Nothing new needs to be created; existing images are being analyzed.', 'The input is images, not audio.'],
      clue: '"every bottle" and "where each one is"', obj: '1.3.4', area: 'vision', misc: 'Classification can count objects.' },
    { q: 'A photo-sharing app wants to generate a one-sentence description of each uploaded photo for screen-reader users. What kind of model fits?', o: ['An image-generation model', 'A multimodal model that interprets images and produces text', 'A regression model', 'A text-to-speech voice alone'], a: 1,
      why: 'Describing an image in words is contextual image analysis, done by a multimodal model that links visual features to language.',
      not: ['Image generation creates new images; here the image already exists and text is needed.', '', 'Regression predicts a number, not a description.', 'A screen reader can read the description aloud, but something must first create the description from the image.'],
      clue: '"description of each uploaded photo"', obj: '1.3.4', area: 'vision' },
    { q: 'A marketing team needs product images for a range that has not been manufactured yet, created from written descriptions. What should they use?', o: ['Object detection', 'An image-generation model', 'Optical character recognition', 'Semantic segmentation'], a: 1,
      why: 'Creating new images from text descriptions is image generation.',
      not: ['Detection finds objects in existing images.', '', 'OCR reads text that already appears in an image.', 'Segmentation labels pixels in an existing image.'],
      clue: '"not been manufactured yet" and "created from written descriptions"', obj: '2.3.2', area: 'vision' }
  ],
  teach: { prompt: 'Using one photo of a street as the example, explain what classification, object detection and image description would each return.',
    points: ['Classification: one label for the whole photo', 'Detection: each object with a box', 'Description: a sentence about what is happening, from a multimodal model', 'Generation is different: it creates a new image from text'] },
  takeaways: [
    'To a computer, an image is a grid of numbers; filters find edges and shapes in it.',
    'Classification gives one label; detection gives objects and boxes; segmentation gives pixel masks; multimodal analysis gives descriptions.',
    'Image generation reverses the direction: text in, new image out, commonly by diffusion.',
    'In Foundry: multimodal models interpret images, image-generation models create them, Azure Vision offers prebuilt analysis.'
  ]
});

/* ======================================================================
   00-07  Speech
   ====================================================================== */
FOUND.push({
  id: '00-07', title: 'Speech: AI That Hears and Speaks', short: 'Speech',
  scope: 'supports', supports: ['1.3.3', '2.2.2', '2.2.3'], area: 'speech',
  prereq: ['00-05'], learn: ['L5'], mods: ['01-03', '02-03'],
  outcomes: [
    'Tell speech recognition (speech to text) and speech synthesis (text to speech) apart',
    'Describe in plain terms how each one works',
    'Recognize the extra speech features: translation, timestamps, confidence and voice control'
  ],
  problem: `<p>A pharmacy's phone line is overwhelmed. Callers should be able to ask "When does my prescription expire?" out loud, have the system understand them, and hear the answer spoken back. Managers also want written transcripts of calls for quality review.</p>`,
  plain: `<p>Speech AI works in two directions. <strong>Speech recognition</strong> turns spoken audio into text - a transcript. <strong>Speech synthesis</strong> turns text into spoken audio - a voice. Many solutions use both: recognize the question, work out the answer, then speak it.</p>`,
  example: `<p>Dictating a text message on your phone is speech recognition. Your navigation app saying "turn left in 200 metres" is speech synthesis. Live captions in a video meeting are recognition; an audiobook read by a computer voice is synthesis.</p>`,
  words: [
    ['Speech recognition (speech to text)', 'Converting spoken audio into text'],
    ['Speech synthesis (text to speech)', 'Converting text into spoken audio'],
    ['Phoneme', 'The smallest unit of sound that distinguishes words; "cat" has three'],
    ['Prosody', 'The rhythm, stress and pitch that make speech sound natural'],
    ['Neural voice', 'A synthetic voice generated by a deep learning model'],
    ['SSML', 'Speech Synthesis Markup Language: markup that controls voice, rate, pitch and pauses'],
    ['Speech translation', 'Recognizing speech in one language and producing text or speech in another']
  ],
  model: function () { return vVs(
    { t: 'Speech recognition', items: ['Input: audio', 'Capability: speech to text', 'Output: transcript, with timestamps and confidence', 'Used by: captions, search, an app that reads the text'] },
    { t: 'Speech synthesis', k: 'acc', items: ['Input: text', 'Capability: text to speech', 'Output: audio in a chosen voice', 'Used by: assistants, accessibility tools, phone systems'] },
    'Simplified teaching model: the two directions of speech AI.'); },
  concept: `<p>Microsoft Learn describes recognition as six stages: <strong>capture</strong> the audio, <strong>extract features</strong> that describe the sound, use an <strong>acoustic model</strong> to estimate which phonemes are being spoken, use a <strong>language model</strong> to prefer word sequences that make sense ("the weather is nice" over "the whether is nice"), <strong>decode</strong> the most likely text, and <strong>post-process</strong> it (capitalization, punctuation, "three p m" becomes "3 PM").</p>
<p>Synthesis runs four stages: <strong>normalize</strong> the text ("Dr." becomes "Doctor", "$25" becomes "twenty-five dollars"), work out the <strong>phonemes</strong>, generate <strong>prosody</strong> (pitch, timing, emphasis), and produce the <strong>audio waveform</strong> with a neural vocoder.</p>`,
  how: `<p>Both directions are probabilistic. Recognition returns its best guess, often with word-level <strong>timestamps</strong> and <strong>confidence</strong>, so an application can highlight uncertain words. Background noise, microphone quality and accents affect accuracy. Synthesis quality depends heavily on prosody: flat prosody is what makes speech sound robotic.</p>`,
  ms: `<p><strong>Azure Speech in Foundry Tools</strong> provides speech to text, text to speech with neural voices, speech translation and speaker recognition. You control synthesized speech with <strong>SSML</strong>. In Foundry you can also deploy an <strong>audio-capable multimodal model</strong> that accepts a spoken prompt directly, and build <strong>voice-based agents</strong> that hold real-time spoken conversations.</p>`,
  compare: ['stt-vs-tts'],
  distinctions: `<p><strong>Recognition versus synthesis</strong> is the direction of travel: audio to text, or text to audio. Exam scenarios usually reveal it with words like "transcribe" or "caption" (recognition) and "read aloud" or "voice" (synthesis).</p>
<p><strong>Transcribe-then-prompt versus a multimodal model.</strong> You can turn speech into text and send the text to a language model, or send the audio straight to an audio-capable model. Both answer a spoken question; the second has no separate transcription step.</p>`,
  rai: `<p><em>Inclusiveness:</em> captions help people with hearing loss; a voice helps people who cannot easily read a screen. <em>Privacy:</em> recordings of voices are personal data and need consent and retention rules. <em>Transparency:</em> realistic synthetic voices should be disclosed, so people know they are hearing a machine.</p>`,
  scenario: `<p>A conference wants live captions for every session and an audio version of each session's written summary for attendees who prefer to listen. Captions are speech recognition; the audio summary is speech synthesis.</p>`,
  explore: { widget: 'speechlab', title: 'Speech synthesis lab',
    intro: 'Type a sentence and hear it spoken. Change the voice, rate and pitch - the same kinds of control SSML gives you in Azure Speech. The audio comes from your device\'s built-in voices, not from Azure. The text normalization panel shows the first synthesis stage: turning symbols and numbers into words a voice can say.' },
  observe: `<p>Read the normalized text before you listen: "Dr." and "$25.50" had to become words first. Then change only the rate or the pitch and listen again. The words are identical; the prosody changed. If your browser offers several voices, notice how much the voice quality varies - that is why neural voices matter.</p>`,
  check: [
    { q: 'A clinic wants written records of doctor-patient conversations, with each word time-stamped. Which capability does it need?', o: ['Speech synthesis', 'Speech recognition', 'Image classification', 'Text generation'], a: 1,
      why: 'Turning spoken audio into text, with word timestamps, is speech recognition.',
      not: ['Synthesis goes the other way, text to audio.', '', 'There are no images involved.', 'The text must be what was actually said, not newly generated content.'],
      clue: '"written records of conversations"', obj: '1.3.3', area: 'speech' },
    { q: 'An airport app must read gate-change announcements aloud in a natural voice, with a pause before the gate number. What should the developer use?', o: ['Speech recognition with a custom language model', 'Speech synthesis controlled with SSML', 'Sentiment analysis', 'Object detection'], a: 1,
      why: 'Reading text aloud is speech synthesis; SSML controls details such as pauses, rate and pronunciation.',
      not: ['Recognition transcribes audio; here the text already exists and must be spoken.', '', 'Sentiment analysis classifies opinions in text; it produces no audio.', 'Object detection analyzes images.'],
      clue: '"read aloud" and "a pause before"', obj: '2.2.3', area: 'speech', misc: 'Pauses and pronunciation are controlled by changing the text itself.' },
    { q: 'A developer wants a deployed model to answer spoken questions without a separate transcription step. What does the solution need?', o: ['An embedding model', 'An audio-capable multimodal model deployment', 'A speech synthesis voice only', 'An object detection model'], a: 1,
      why: 'An audio-capable multimodal model accepts audio as part of the prompt, so no separate speech-to-text step is needed.',
      not: ['Embedding models turn text into vectors for similarity search; they do not accept audio prompts.', '', 'A synthesis voice produces audio; it does not understand incoming speech.', 'Object detection works on images.'],
      clue: '"without a separate transcription step"', obj: '2.2.2', area: 'speech' }
  ],
  teach: { prompt: 'Explain the difference between speech recognition and speech synthesis, and describe one app that needs both.',
    points: ['Recognition: audio in, text out', 'Synthesis: text in, audio out', 'Both are estimates shaped by models (acoustic and language models; prosody)', 'An app that listens and replies uses both'] },
  takeaways: [
    'Speech recognition is audio to text; speech synthesis is text to audio.',
    'Recognition returns a best guess with timestamps and confidence; noise and accents affect accuracy.',
    'Synthesis normalizes text, finds phonemes, adds prosody and generates audio; SSML controls the result.',
    'In Foundry: Azure Speech in Foundry Tools, audio-capable multimodal models, and voice-based agents.'
  ]
});

/* ======================================================================
   00-08  Documents and information extraction
   ====================================================================== */
FOUND.push({
  id: '00-08', title: 'Documents and Information Extraction', short: 'Information extraction',
  scope: 'supports', supports: ['1.3.5', '2.4.1', '2.4.2', '2.4.3', '2.4.4'], area: 'extract',
  prereq: ['00-06'], learn: ['L7'], mods: ['01-03', '02-05'],
  outcomes: [
    'Explain the difference between unstructured content and structured fields',
    'Describe OCR and field extraction as two separate steps',
    'Recognize confidence scores, validation and human review as part of extraction'
  ],
  problem: `<p>An accounts-payable team receives about 2,000 supplier invoices a month as PDFs, scans and phone photos. For each one, a clerk types the vendor name, invoice number, date and total into the finance system. It is slow, boring and error-prone.</p>`,
  plain: `<p><strong>Information extraction</strong> turns <em>unstructured</em> content - a scanned page, a photo, a recording - into <em>structured</em> data: named fields with values that a program can store and check. "Vendor: Fourth Coffee. Date: 2024-08-15. Total: 6.97."</p>
<p>It usually happens in two steps. First, <strong>optical character recognition (OCR)</strong> finds the text in the image and where it sits. Second, <strong>field extraction</strong> works out which piece of text is the vendor, which is the date, and which is the total.</p>`,
  example: `<p>An expense app where you photograph a receipt and the merchant, date and amount fill themselves in is information extraction. So is a bank app that reads a cheque, and a meeting tool that lists the action items from a recording.</p>`,
  words: [
    ['Unstructured data', 'Content without named fields: scans, photos, free text, audio, video'],
    ['Structured data', 'Named fields with values, such as a database row or JSON'],
    ['OCR', 'Optical character recognition: finding and reading text in images'],
    ['Field extraction', 'Mapping recognized text to named fields such as "total"'],
    ['Schema', 'The list of fields you want, with their names and types'],
    ['Confidence score', 'How sure the system is about each extracted value'],
    ['Human in the loop', 'A person reviews values the system is unsure about']
  ],
  model: function () { return vIPO([
    { r: 'Input', t: 'Scanned receipt', s: 'an image' },
    { r: 'Step 1', t: 'OCR', s: 'text + positions' },
    { r: 'Step 2', t: 'Field extraction', s: 'map text to the schema', k: 'acc' },
    { r: 'Output', t: 'Fields + confidence', s: 'vendor, date, total', k: 'ok' },
    { r: 'Used by', t: 'Expense system', s: 'or a clerk, if unsure' }
  ], 'Information extraction combines computer vision (OCR) with a model that understands what each value means.'); },
  concept: `<p>OCR tells you <em>what text exists</em> and where. Field extraction tells you <em>what that text means</em>. Microsoft Learn describes three ways to find fields: <strong>templates</strong> (rules such as "the value after the word Total"), <strong>machine learning</strong> models trained on example documents, and <strong>generative AI</strong> that is given the text plus a schema and matches values to fields. Extracted values are then normalized (one date format, one currency format) and validated - for example, checking that line items add up to the total.</p>`,
  how: `<p>Position matters as much as wording: "12345" near "Invoice No." is an invoice number; near "Phone" it is not. Every extracted value comes with a <strong>confidence score</strong>, and good systems send low-confidence values to a person rather than straight into the finance system. Newer services extend the same idea beyond documents: transcripts and speakers from <strong>audio</strong>, scenes and key frames from <strong>video</strong>.</p>`,
  ms: `<p><strong>Azure Content Understanding in Foundry Tools</strong> uses generative AI to turn documents, images, audio and video into a user-defined output: fields from a schema you describe, each with confidence and grounding (where in the source it came from). It offers prebuilt analyzers for common content and custom analyzers for your own fields. Azure Document Intelligence is a related Foundry Tool for document data; AI-901's implementation objectives name Content Understanding.</p>`,
  compare: ['ocr-vs-fields', 'extract-vs-generate'],
  distinctions: `<p><strong>OCR versus extraction.</strong> OCR alone returns all the text. Extraction returns the specific fields you asked for.</p>
<p><strong>Extraction versus generation.</strong> Extraction must return what the document actually says, traceable to its location. Free-form generation writes new text that may not appear in the source - fine for a summary, wrong for an invoice total.</p>
<p><strong>Extraction versus text analysis.</strong> Entity detection finds a date somewhere in free text; extraction knows that this date is the <em>invoice date</em> field.</p>`,
  rai: `<p><em>Privacy and security:</em> invoices, IDs and medical forms contain sensitive data - control access and retention. <em>Reliability:</em> set a confidence threshold and route uncertain values to people. <em>Accountability:</em> someone must own the decision when an extracted value is wrong and a payment goes out.</p>`,
  scenario: `<p>An insurer receives claim forms, photos of damage and recorded phone statements. It needs the policy number and claim amount from the form, any registration plate visible in the photos, and the caller's account of events from the recording. That is extraction from documents, images and audio - the same workload across three kinds of content.</p>`,
  explore: { widget: 'extractlab', title: 'Extraction lab: from receipt text to fields',
    intro: 'The left panel is OCR output from a receipt. The lab applies a simple template approach - look for a label, take the value next to it - then normalizes and validates the result. Edit the receipt and watch the fields, confidence and validation change. This is the oldest of the three approaches Microsoft Learn describes; services such as Content Understanding use trained and generative models instead.' },
  observe: `<p>Change "TOTAL" to "Amount due" and the template loses the field: templates break on layouts they were not written for, which is why learned and generative approaches exist. Change the total so it no longer equals subtotal plus tax: the cross-field check catches it and routes the receipt to a person. That is human in the loop.</p>`,
  check: [
    { q: 'A logistics firm needs the shipment number, weight and destination from thousands of scanned delivery notes, loaded into its database. Which workload fits?', o: ['Speech recognition', 'Information extraction', 'Image generation', 'Sentiment analysis'], a: 1,
      why: 'Specific named fields must be pulled from scanned documents into structured data. That is information extraction.',
      not: ['There is no audio involved.', '', 'Nothing new should be created; existing values must be read.', 'Sentiment classifies opinion; delivery notes have no opinion to classify.'],
      clue: '"specific fields from scanned documents into a database"', obj: '1.3.5', area: 'extract' },
    { q: 'A team runs OCR on scanned contracts and gets all the text. What do they still need in order to fill in "signing date" and "contract value" fields?', o: ['Nothing; OCR output is already structured fields', 'Field extraction that maps the recognized text to named fields', 'Speech synthesis', 'A higher image resolution only'], a: 1,
      why: 'OCR returns text and positions. A field-extraction step decides which text is the signing date and which is the contract value.',
      not: ['OCR output is text plus layout, not named business fields.', '', 'Speech synthesis reads text aloud; it does not identify fields.', 'Better scans can improve OCR accuracy, but they do not tell the system which text is which field.'],
      clue: '"gets all the text" but needs named fields', obj: '1.3.5', area: 'extract', misc: 'OCR and information extraction are the same thing.' },
    { q: 'An extraction system reports a confidence of 0.41 for the total on one invoice. What should a responsibly designed process do?', o: ['Pay the invoice anyway, because the model is usually right', 'Route the invoice to a person to check the total', 'Delete the invoice', 'Lower every confidence threshold to zero'], a: 1,
      why: 'A low confidence means the value may be wrong. Human review of uncertain values protects reliability and accountability.',
      not: ['Acting automatically on a low-confidence value is exactly the risk confidence scores exist to prevent.', '', 'The invoice is still valid; only one value is uncertain.', 'A zero threshold would accept every value however uncertain, removing the safeguard.'],
      clue: '"confidence of 0.41"', obj: '1.1.2', area: 'rai' }
  ],
  teach: { prompt: 'Explain why OCR alone is not enough to automate invoice processing, and what the second step adds.',
    points: ['OCR finds text and where it is', 'Field extraction decides what each value means (vendor, total)', 'Values are normalized and validated', 'Low-confidence values go to a person'] },
  takeaways: [
    'Information extraction turns unstructured content into structured fields.',
    'OCR finds text and its position; field extraction maps it to a schema.',
    'Confidence scores and validation decide when a person needs to check a value.',
    'Azure Content Understanding extracts fields from documents, images, audio and video.'
  ]
});
