/* objectives.js - the single source of truth for what AI-901 measures.

   OBJ holds the 29 sub-objectives VERBATIM from the official study guide,
   "Skills measured as of April 15, 2026". Nothing else in the Academy restates
   objective text: modules call objectivesFor(id), and the validator
   (tools/validate.mjs) and the drift check (tools/check-objectives.mjs) compare
   this file against the live study guide.

   IDs such as "2.1.3" are the Academy's own references, built from the order of
   the outline (domain . group . item). Microsoft does not publish identifiers.

   Per objective:
     text   verbatim objective
     g      objective group id
     mod    exam module that teaches it, i = position inside that module
     area   concept area used for review ("which kind of AI do I keep confusing?")
     lens   AI-901 Exam Lens: what to be able to do, using the outline's verbs
     ms     Microsoft implementation in one line (checked against Microsoft Learn)
     found  Module 0 foundation lessons that prepare for it
     cmp    comparisons that sharpen it
     ex     practice: labs and in-browser explorations; na = why no exercise fits
     src    Microsoft Learn sources the teaching was checked against
*/

var EXAM = {
  code: 'AI-901',
  title: 'Microsoft Azure AI Fundamentals',
  passing: 700,
  outline: 'April 15, 2026',
  lastChecked: '2026-10-06',
  studyGuide: 'https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-901',
  domains: [
    { id: '00', name: 'Lab environment', weight: 'not an exam domain', mid: 0, tint: 'var(--domain-00)' },
    { id: '01', name: 'Identify AI concepts and capabilities', weight: '40-45%', mid: 42.5, tint: 'var(--domain-03)' },
    { id: '02', name: 'Implement AI solutions by using Microsoft Foundry', weight: '55-60%', mid: 57.5, tint: 'var(--domain-02)' }
  ]
};

var MSL_MOD = 'https://learn.microsoft.com/training/modules/';
var MSDOC = 'https://learn.microsoft.com/azure/';

/* Concept areas. Questions and concepts carry one, so review can say
   "you keep missing vision questions" and point at the right lesson. */
var AREAS = [
  { id: 'ml',       name: 'How AI and models work',         found: ['00-02', '00-03', '00-04'] },
  { id: 'rai',      name: 'Responsible AI',                 found: ['00-16'] },
  { id: 'genai',    name: 'Generative AI and prompts',      found: ['00-09', '00-10'] },
  { id: 'models',   name: 'Models and deployment',          found: ['00-10', '00-15'] },
  { id: 'agents',   name: 'AI agents',                      found: ['00-12'] },
  { id: 'language', name: 'Text analysis (NLP)',            found: ['00-05'] },
  { id: 'speech',   name: 'Speech',                         found: ['00-07'] },
  { id: 'vision',   name: 'Computer vision and images',     found: ['00-06'] },
  { id: 'extract',  name: 'Information extraction',         found: ['00-08'] },
  { id: 'foundry',  name: 'Foundry, APIs and code',         found: ['00-11', '00-13', '00-14', '00-15'] },
  { id: 'workloads',name: 'Choosing the right workload',    found: ['00-01', '00-17'] }
];

var GROUPS = [
  { id: '1.1', domain: '01', title: 'Describe principles of responsible AI', mods: ['01-01'] },
  { id: '1.2', domain: '01', title: 'Identify AI model components and configurations', mods: ['01-02'] },
  { id: '1.3', domain: '01', title: 'Identify AI workloads', mods: ['01-03'] },
  { id: '2.1', domain: '02', title: 'Implement generative AI apps and agents by using Foundry', mods: ['02-01', '02-02'] },
  { id: '2.2', domain: '02', title: 'Implement AI solutions for text and speech by using Foundry', mods: ['02-03'] },
  { id: '2.3', domain: '02', title: 'Implement AI solutions with computer vision and image-generation capabilities by using Foundry', mods: ['02-04'] },
  { id: '2.4', domain: '02', title: 'Implement AI solutions for information extraction by using Foundry', mods: ['02-05'] }
];

var SRC = {
  aiConcepts:   MSL_MOD + 'get-started-ai-fundamentals/',
  rai:          MSL_MOD + 'get-started-ai-fundamentals/7-responsible-ai',
  genai:        MSL_MOD + 'fundamentals-generative-ai/',
  llm:          MSL_MOD + 'fundamentals-generative-ai/3-language-models',
  prompts:      MSL_MOD + 'fundamentals-generative-ai/6-writing-prompts',
  agentsConcept:MSL_MOD + 'fundamentals-generative-ai/7-agents',
  nlp:          MSL_MOD + 'introduction-language/',
  speech:       MSL_MOD + 'introduction-ai-speech/',
  vision:       MSL_MOD + 'introduction-computer-vision/',
  extraction:   MSL_MOD + 'introduction-information-extraction/',
  rag:          MSL_MOD + 'rag-fundamentals/',
  aiInAzure:    MSL_MOD + 'get-started-with-ai-in-azure/',
  genaiAzure:   MSL_MOD + 'get-started-with-generative-ai-and-agents/',
  textAzure:    MSL_MOD + 'get-started-text-analysis-azure/',
  speechAzure:  MSL_MOD + 'get-started-speech-azure/',
  visionAzure:  MSL_MOD + 'get-started-vision-azure/',
  extractAzure: MSL_MOD + 'get-started-information-extraction/',
  foundryIQ:    MSL_MOD + 'get-started-foundry-iq/',
  guardrails:   MSDOC + 'foundry/guardrails/guardrails-overview',
  deployTypes:  MSDOC + 'foundry/foundry-models/concepts/deployment-types',
  foundryTools: MSDOC + 'ai-services/what-are-ai-services',
  cu:           MSDOC + 'ai-services/content-understanding/overview',
  sdk:          MSDOC + 'foundry/how-to/develop/sdk-overview',
  agentsDoc:    MSDOC + 'foundry/agents/overview'
};

var OBJ = [
  /* ---------------- 1.1 Describe principles of responsible AI ---------------- */
  { id: '1.1.1', g: '1.1', mod: '01-01', i: 0, area: 'rai',
    text: 'Describe considerations for fairness in an AI solution',
    lens: ['Describe how biased or unrepresentative training data can lead to different outcomes for similar people',
           'Recognize a fairness concern in a scenario that affects decisions about people',
           'Distinguish fairness (equitable outcomes) from inclusiveness (who can use the system)'],
    ms: 'Reasoned about at design time and tested with evaluations; Foundry\'s safety evaluators can scan outputs for bias and unfairness.',
    found: ['00-16'], cmp: ['rai-neighbours'], ex: { explore: ['00-16'] }, src: [SRC.rai] },
  { id: '1.1.2', g: '1.1', mod: '01-01', i: 1, area: 'rai',
    text: 'Describe considerations for reliability and safety in an AI solution',
    lens: ['Describe why probabilistic output needs testing, thresholds and safe failure',
           'Recognize guardrails (content filters) as a reliability and safety control in Foundry',
           'Describe using confidence to decide when a system should not act on its own'],
    ms: 'Foundry guardrails (powered by Azure AI Content Safety) scan user input and model output for harm categories at a configurable severity threshold.',
    found: ['00-16', '00-03'], cmp: ['rai-neighbours'], ex: { labs: ['01-01'], explore: ['00-16'] }, src: [SRC.rai, SRC.guardrails] },
  { id: '1.1.3', g: '1.1', mod: '01-01', i: 2, area: 'rai',
    text: 'Describe considerations for privacy and security in an AI solution',
    lens: ['Describe protecting personal data used to train or prompt a model',
           'Recognize redaction of personal information and access control as privacy and security measures',
           'Describe why a model must not reveal private data it was given'],
    ms: 'Microsoft Entra ID and role-based access control on the Foundry resource; personal data detection (PII) in Azure Language; data deleted when no longer needed.',
    found: ['00-16', '00-05'], cmp: ['rai-neighbours'], ex: { explore: ['00-16'] }, src: [SRC.rai] },
  { id: '1.1.4', g: '1.1', mod: '01-01', i: 3, area: 'rai',
    text: 'Describe considerations for inclusiveness in an AI solution',
    lens: ['Describe designing so that people with disabilities or different needs are not excluded',
           'Recognize captions for speech, screen-reader support and multiple input modes as inclusiveness',
           'Distinguish inclusiveness from fairness'],
    ms: 'Speech in Foundry Tools can caption spoken output and voice text output; multimodal models accept text, images and audio.',
    found: ['00-16', '00-07'], cmp: ['rai-neighbours'], ex: { explore: ['00-16'] }, src: [SRC.rai] },
  { id: '1.1.5', g: '1.1', mod: '01-01', i: 4, area: 'rai',
    text: 'Describe considerations for transparency in an AI solution',
    lens: ['Describe telling users that they are interacting with AI and what its limitations are',
           'Recognize documenting intended uses, limits and training data characteristics as transparency',
           'Distinguish transparency (people understand the system) from accountability (people answer for it)'],
    ms: 'Model cards and transparency notes in the Foundry catalog; citations in grounded agent responses; Content Credentials on generated images.',
    found: ['00-16'], cmp: ['rai-neighbours'], ex: { explore: ['00-16'] }, src: [SRC.rai] },
  { id: '1.1.6', g: '1.1', mod: '01-01', i: 5, area: 'rai',
    text: 'Describe considerations for accountability in an AI solution',
    lens: ['Describe why people and organizations, not the model, are answerable for an AI system',
           'Recognize governance, named owners and human oversight as accountability',
           'Distinguish accountability from transparency'],
    ms: 'Governance applied through Azure RBAC, Azure Policy and the Foundry control plane, with tracing and evaluation records of what agents did.',
    found: ['00-16'], cmp: ['rai-neighbours'], ex: { explore: ['00-16'] }, src: [SRC.rai] },

  /* ---------------- 1.2 Identify AI model components and configurations ---------------- */
  { id: '1.2.1', g: '1.2', mod: '01-02', i: 0, area: 'genai',
    text: 'Describe how generative AI models work',
    lens: ['Describe a language model as predicting the next token from the tokens so far, one token at a time',
           'Describe tokens and embeddings at a conceptual level',
           'Recognize that fluent output is not guaranteed to be correct',
           'Describe how image models create images from prompts (diffusion)'],
    ms: 'Foundry Models catalog: language, reasoning, multimodal, embedding and image-generation models, called through the Responses API.',
    found: ['00-03', '00-09', '00-10'], cmp: ['predictive-vs-generative'], ex: { labs: ['01-02'], explore: ['00-09', '00-10'] }, src: [SRC.llm, SRC.genai] },
  { id: '1.2.2', g: '1.2', mod: '01-02', i: 1, area: 'models',
    text: 'Identify an appropriate AI model, based on capabilities',
    lens: ['Identify chat, reasoning, multimodal, embedding and image-generation models from what a scenario needs',
           'Identify when a large or a small language model fits',
           'Identify when a prebuilt Foundry Tool fits better than a general-purpose model'],
    ms: 'Foundry model catalog with capabilities, benchmarks, leaderboards and model cards; Foundry Tools for well-defined tasks.',
    found: ['00-09', '00-10'], cmp: ['tool-vs-model'], ex: { labs: ['01-02'] }, src: [SRC.genaiAzure] },
  { id: '1.2.3', g: '1.2', mod: '01-02', i: 2, area: 'models',
    text: 'Identify appropriate model deployment options and configuration parameters',
    lens: ['Identify a deployment type from data-processing location and billing needs (Global, Data Zone, Standard; pay-per-token, provisioned, batch)',
           'Identify the effect of temperature, max output tokens and system instructions',
           'Recognize a tokens-per-minute limit and throttling'],
    ms: 'Deployment type, model version and TPM limit chosen at deployment; parameters set in the playground or in code.',
    found: ['00-10', '00-15'], cmp: ['deployment-types'], ex: { labs: ['01-02'] }, src: [SRC.deployTypes, SRC.genaiAzure] },

  /* ---------------- 1.3 Identify AI workloads ---------------- */
  { id: '1.3.1', g: '1.3', mod: '01-03', i: 0, area: 'workloads',
    text: 'Identify scenarios for common AI workloads, including generative and agentic AI, text analysis, speech, computer vision, and information extraction',
    lens: ['Identify the workload from what goes in and what must come out',
           'Distinguish generative AI (create content) from agentic AI (act through tools)',
           'Distinguish extraction (structured fields) from text analysis and from generation'],
    ms: 'Foundry Models and agents for generative and agentic AI; Azure Language, Azure Speech, Azure Vision and Azure Content Understanding in Foundry Tools for the others.',
    found: ['00-01', '00-05', '00-06', '00-07', '00-08', '00-09', '00-12', '00-17'], cmp: ['app-vs-agent', 'extract-vs-generate', 'predictive-vs-generative'],
    ex: { labs: ['01-03'], explore: ['00-17'] }, src: [SRC.aiConcepts] },
  { id: '1.3.2', g: '1.3', mod: '01-03', i: 1, area: 'language',
    text: 'Describe common text analysis techniques, including keyword extraction, entity detection, sentiment analysis, and summarization',
    lens: ['Describe keyword (key phrase) extraction, entity detection, sentiment analysis and summarization',
           'Recognize language detection and personal information (PII) detection',
           'Distinguish extractive summarization (selects sentences) from abstractive (writes new text)'],
    ms: 'Azure Language in Foundry Tools, or a general-purpose language model when predictability is less important.',
    found: ['00-05'], cmp: ['text-techniques'], ex: { labs: ['01-03'], explore: ['00-05'] }, src: [SRC.nlp] },
  { id: '1.3.3', g: '1.3', mod: '01-03', i: 2, area: 'speech',
    text: 'Identify features and capabilities of speech recognition and speech synthesis',
    lens: ['Identify speech recognition (speech-to-text) and speech synthesis (text-to-speech) from a scenario',
           'Recognize that recognition returns text with timestamps and confidence',
           'Recognize that synthesis can be shaped by voice, rate, pitch and pauses'],
    ms: 'Azure Speech in Foundry Tools: speech to text, text to speech, speech translation; audio-capable models in Foundry Models.',
    found: ['00-07'], cmp: ['stt-vs-tts'], ex: { labs: ['01-03'], explore: ['00-07'] }, src: [SRC.speech] },
  { id: '1.3.4', g: '1.3', mod: '01-03', i: 3, area: 'vision',
    text: 'Identify features and capabilities of computer vision and image-generation models',
    lens: ['Identify image classification, object detection, semantic segmentation and image analysis from the required output',
           'Identify when a multimodal model can interpret an image in a prompt',
           'Identify image generation (and video generation) from a text description'],
    ms: 'Multimodal and image-generation models in Foundry Models; Azure Vision in Foundry Tools.',
    found: ['00-06'], cmp: ['vision-tasks', 'analyze-vs-generate-image'], ex: { labs: ['01-03'], explore: ['00-06'] }, src: [SRC.vision] },
  { id: '1.3.5', g: '1.3', mod: '01-03', i: 4, area: 'extract',
    text: 'Identify techniques to extract information from text, images, audio, and videos',
    lens: ['Describe OCR as finding text in images, and field extraction as mapping that text to named fields',
           'Identify extraction from audio (transcripts, speakers) and video (scenes, key frames)',
           'Recognize confidence scores and human review for uncertain values'],
    ms: 'Azure Content Understanding in Foundry Tools turns documents, images, audio and video into schema-defined fields with confidence and grounding.',
    found: ['00-08'], cmp: ['ocr-vs-fields', 'extract-vs-generate'], ex: { labs: ['01-03'], explore: ['00-08'] }, src: [SRC.extraction, SRC.cu] },

  /* ---------------- 2.1 Implement generative AI apps and agents ---------------- */
  { id: '2.1.1', g: '2.1', mod: '02-01', i: 0, area: 'genai',
    text: 'Create effective system and user prompts for generative AI models',
    lens: ['Create a system prompt that sets role, tone, scope and output format',
           'Create a user prompt that is clear, specific, gives context and asks for structure',
           'Recognize when conversation history or retrieved data must be added to the prompt'],
    ms: 'System instructions and user input in the Foundry playground, or instructions and input in a Responses API call.',
    found: ['00-10'], cmp: ['prompt-parts', 'context-vs-grounding'], ex: { labs: ['02-01'], explore: ['00-10'] }, src: [SRC.prompts] },
  { id: '2.1.2', g: '2.1', mod: '02-01', i: 1, area: 'foundry',
    text: 'Deploy a model and interact with it in the Foundry portal',
    lens: ['Deploy a model from the Foundry model catalog into a project',
           'Use the playground to test prompts and parameters before writing code',
           'Recognize the deployment name as what client code refers to'],
    ms: 'Foundry portal: model catalog, deploy, playground (system instructions, temperature, max output tokens), view code.',
    found: ['00-11', '00-15'], cmp: ['resource-vs-project'], ex: { labs: ['02-01'] }, src: [SRC.aiInAzure, SRC.genaiAzure] },
  { id: '2.1.3', g: '2.1', mod: '02-01', i: 2, area: 'foundry',
    text: 'Create a lightweight chat client application by using the Foundry SDK',
    lens: ['Implement a Python client that connects to a project endpoint with Microsoft Entra ID',
           'Implement a call to a deployed model with the Responses API and read output_text',
           'Recognize how to keep conversation context between turns'],
    ms: 'azure-ai-projects (AIProjectClient) with azure-identity (DefaultAzureCredential), then get_openai_client() and responses.create().',
    found: ['00-11', '00-13', '00-14'], cmp: ['api-sdk-cli'], ex: { labs: ['02-01'] }, src: [SRC.genaiAzure, SRC.sdk] },
  { id: '2.1.4', g: '2.1', mod: '02-02', i: 0, area: 'agents',
    text: 'Create and test a single-agent solution in the Foundry portal',
    lens: ['Describe an agent as a model plus instructions plus tools',
           'Select a tool from the need: web search, file search or knowledge, code interpreter, custom functions',
           'Test the agent in the playground and save it'],
    ms: 'Foundry Agent Service prompt agents, created in the Foundry portal with a model, instructions, tools and knowledge.',
    found: ['00-12'], cmp: ['app-vs-agent', 'context-vs-grounding'], ex: { labs: ['02-02'], explore: ['00-12'] }, src: [SRC.genaiAzure, SRC.agentsDoc] },
  { id: '2.1.5', g: '2.1', mod: '02-02', i: 1, area: 'agents',
    text: 'Create a lightweight client application for an agent',
    lens: ['Implement a Python client that references an existing agent by name in a Responses API call',
           'Recognize that the project endpoint requires Microsoft Entra ID authentication',
           'Recognize that the agent, not the client, holds the instructions and tools'],
    ms: 'AIProjectClient.agents.get(), then responses.create() with an agent reference; Microsoft Entra ID via DefaultAzureCredential.',
    found: ['00-12', '00-13', '00-14'], cmp: ['app-vs-agent'], ex: { labs: ['02-02'] }, src: [SRC.genaiAzure] },

  /* ---------------- 2.2 Text and speech ---------------- */
  { id: '2.2.1', g: '2.2', mod: '02-03', i: 0, area: 'language',
    text: 'Build a lightweight application that includes text analysis',
    lens: ['Implement text analysis with Azure Language or with a general-purpose model',
           'Select Azure Language when results must be predictable and structured (entities, confidence, offsets)',
           'Recognize the input and output of each technique'],
    ms: 'Azure Language in Foundry Tools via its client library or REST API; or a prompt to a deployed language model.',
    found: ['00-05', '00-13', '00-14'], cmp: ['tool-vs-model', 'text-techniques'], ex: { labs: ['02-03'] }, src: [SRC.textAzure] },
  { id: '2.2.2', g: '2.2', mod: '02-03', i: 1, area: 'speech',
    text: 'Respond to spoken prompts by using a deployed multimodal model',
    lens: ['Identify an audio-capable multimodal model as able to accept a spoken prompt directly',
           'Recognize voice-based interaction with an agent in the Foundry portal',
           'Distinguish sending audio to a model from transcribing it first'],
    ms: 'Audio-capable models in Foundry Models; voice-based agents connected through Voice Live.',
    found: ['00-07', '00-10'], cmp: ['stt-vs-tts'], ex: { labs: ['02-03'] }, src: [SRC.speechAzure] },
  { id: '2.2.3', g: '2.2', mod: '02-03', i: 2, area: 'speech',
    text: 'Build a lightweight application by using Azure Speech in Foundry Tools',
    lens: ['Implement speech recognition and speech synthesis with the Speech SDK',
           'Recognize the configuration a speech client needs (endpoint or region, and credentials)',
           'Recognize SSML as the way to control voice, rate, pitch and pauses'],
    ms: 'Azure Speech in Foundry Tools: SpeechRecognizer and SpeechSynthesizer in the Speech SDK.',
    found: ['00-07', '00-13', '00-14'], cmp: ['stt-vs-tts'], ex: { labs: ['02-03'] }, src: [SRC.speechAzure] },

  /* ---------------- 2.3 Vision and image generation ---------------- */
  { id: '2.3.1', g: '2.3', mod: '02-04', i: 0, area: 'vision',
    text: 'Interpret visual input in prompts by using a deployed multimodal model',
    lens: ['Implement a prompt that combines text and an image for a multimodal model',
           'Recognize how an image is passed (a URL or base64 data)',
           'Recognize that the answer is generated text and can be wrong'],
    ms: 'A multimodal model deployment called through the Responses API with text and image content parts.',
    found: ['00-06', '00-10'], cmp: ['analyze-vs-generate-image', 'vision-tasks'], ex: { labs: ['02-04'] }, src: [SRC.visionAzure] },
  { id: '2.3.2', g: '2.3', mod: '02-04', i: 1, area: 'vision',
    text: 'Create new visual outputs by using generative models',
    lens: ['Identify an image-generation (or video-generation) model from the requirement',
           'Describe how a text prompt shapes the generated image',
           'Recognize Content Credentials as a transparency measure on generated images'],
    ms: 'Image-generation models in Foundry Models, used from the portal playground or code.',
    found: ['00-06', '00-09'], cmp: ['analyze-vs-generate-image'], ex: { labs: ['02-04'] }, src: [SRC.visionAzure] },
  { id: '2.3.3', g: '2.3', mod: '02-04', i: 2, area: 'vision',
    text: 'Build a lightweight application that includes vision capabilities',
    lens: ['Implement a small Python app that sends an image to a model and prints the result',
           'Select the vision capability that matches the required output',
           'Recognize input and output formats for images in code'],
    ms: 'Foundry SDK with a multimodal or image-generation deployment; Azure Vision in Foundry Tools for prebuilt analysis.',
    found: ['00-06', '00-13', '00-14'], cmp: ['vision-tasks'], ex: { labs: ['02-04'] }, src: [SRC.visionAzure] },

  /* ---------------- 2.4 Information extraction ---------------- */
  { id: '2.4.1', g: '2.4', mod: '02-05', i: 0, area: 'extract',
    text: 'Extract information from documents and forms by using Azure Content Understanding in Foundry Tools',
    lens: ['Select a prebuilt analyzer (for example read, layout or receipt) or a custom field schema',
           'Recognize output fields, confidence scores and grounding',
           'Distinguish OCR alone from field extraction'],
    ms: 'Azure Content Understanding analyzers for documents, with schema-defined fields.',
    found: ['00-08'], cmp: ['ocr-vs-fields', 'extract-vs-generate'], ex: { labs: ['02-05'] }, src: [SRC.cu, SRC.extractAzure] },
  { id: '2.4.2', g: '2.4', mod: '02-05', i: 1, area: 'extract',
    text: 'Extract information from images by using Content Understanding',
    lens: ['Extract text and fields from photographs and scanned images',
           'Recognize OCR as the first step for text inside images',
           'Distinguish extracting fields from an image from describing the image'],
    ms: 'Azure Content Understanding image analysis.',
    found: ['00-06', '00-08'], cmp: ['ocr-vs-fields'], ex: { labs: ['02-05'] }, src: [SRC.cu] },
  { id: '2.4.3', g: '2.4', mod: '02-05', i: 2, area: 'extract',
    text: 'Extract information from audio and video by using Content Understanding',
    lens: ['Extract transcripts, speakers, summaries and fields from audio',
           'Extract scenes, key frames, transcripts and descriptions from video',
           'Distinguish Content Understanding audio analysis from plain speech-to-text'],
    ms: 'Azure Content Understanding audio and video analyzers.',
    found: ['00-07', '00-08'], cmp: ['ocr-vs-fields'], ex: { labs: ['02-05'] }, src: [SRC.cu] },
  { id: '2.4.4', g: '2.4', mod: '02-05', i: 3, area: 'extract',
    text: 'Build a lightweight application with information extraction capabilities by using Content Understanding',
    lens: ['Implement a Python client that submits content to an analyzer and waits for the result',
           'Recognize that analysis is a long-running operation (start, then poll for the result)',
           'Read extracted field values and their confidence from the result'],
    ms: 'Content Understanding client library or REST API: begin analysis, poll, read fields.',
    found: ['00-08', '00-13', '00-14'], cmp: ['api-sdk-cli'], ex: { labs: ['02-05'] }, src: [SRC.cu, SRC.extractAzure] }
];

/* ---------------- lookups ---------------- */
var OBJ_BY = {}; OBJ.forEach(function (o) { OBJ_BY[o.id] = o; });
function objById(id) { return OBJ_BY[id] || null; }
function objKey(mod, i) { for (var k = 0; k < OBJ.length; k++) if (OBJ[k].mod === mod && OBJ[k].i === i) return OBJ[k].id; return null; }
function objectivesFor(mod) { return OBJ.filter(function (o) { return o.mod === mod; }).sort(function (a, b) { return a.i - b.i; }).map(function (o) { return o.text; }); }
function groupById(id) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i]; return null; }
function areaById(id) { for (var i = 0; i < AREAS.length; i++) if (AREAS[i].id === id) return AREAS[i]; return null; }
