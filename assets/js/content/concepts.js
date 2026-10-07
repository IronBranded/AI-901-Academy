/* concepts.js - the concept index behind search.
   One entry per capability or idea a learner might look up, with what goes in,
   what comes out, the objectives it maps to, and where it is taught.
   n: name, aka: acronyms and other names, area, in, out, def, objs, go (route),
   ms: Microsoft implementation (optional). */

var CONCEPTS = [
  /* how AI works */
  { n: 'Artificial intelligence', aka: ['AI'], area: 'ml', in: 'Any', out: 'Predictions or generated content', def: 'Software performing tasks associated with human abilities, using learned patterns.', objs: ['1.3.1'], go: '#/f/00-01' },
  { n: 'Machine learning', aka: ['ML'], area: 'ml', in: 'Labelled or unlabelled examples', out: 'A trained model', def: 'Building models by learning patterns from data instead of writing rules.', objs: [], go: '#/f/00-02' },
  { n: 'Model', aka: ['AI model'], area: 'ml', in: 'New input', out: 'Prediction or content', def: 'What training produces: a function with learned parameters.', objs: ['1.2.1'], go: '#/f/00-03' },
  { n: 'Training', aka: ['model training'], area: 'ml', in: 'Labelled examples', out: 'Model parameters', def: 'Adjusting a model\'s parameters to fit example data.', objs: [], go: '#/f/00-03' },
  { n: 'Inference', aka: ['scoring', 'prediction time'], area: 'ml', in: 'New input', out: 'Model output', def: 'Using a trained model on new input; what Foundry deployments do.', objs: ['1.2.1'], go: '#/f/00-03' },
  { n: 'Feature and label', aka: ['features', 'labels'], area: 'ml', in: 'Training data', out: 'Inputs and answers', def: 'Features are measured inputs; the label is the correct answer to learn.', objs: [], go: '#/f/00-03' },
  { n: 'Classification', aka: ['binary classification', 'multiclass classification'], area: 'ml', in: 'Features of an item', out: 'A category', def: 'Predicting which known category an item belongs to.', objs: [], go: '#/f/00-04' },
  { n: 'Regression', aka: [], area: 'ml', in: 'Features of an item', out: 'A number', def: 'Predicting a numeric value.', objs: [], go: '#/f/00-04' },
  { n: 'Clustering', aka: ['unsupervised learning'], area: 'ml', in: 'Unlabelled items', out: 'Groups', def: 'Grouping similar items without predefined labels.', objs: [], go: '#/f/00-04' },
  { n: 'Confidence score', aka: ['probability', 'threshold'], area: 'ml', in: 'A model result', out: 'A value between 0 and 1', def: 'The model\'s estimate of how likely its output is correct.', objs: ['1.1.2'], go: '#/f/00-03' },

  /* responsible AI */
  { n: 'Fairness', aka: ['bias'], area: 'rai', in: 'Decisions about people', out: 'Equitable outcomes', def: 'Similar people receive similar outcomes.', objs: ['1.1.1'], go: '#/f/00-16' },
  { n: 'Reliability and safety', aka: ['safety'], area: 'rai', in: 'An AI system in use', out: 'Intended behaviour, safe failure', def: 'Behaves as intended, including in unusual conditions.', objs: ['1.1.2'], go: '#/f/00-16' },
  { n: 'Privacy and security', aka: ['data protection'], area: 'rai', in: 'Personal and organizational data', out: 'Protected data', def: 'Protects data and resists misuse and attack.', objs: ['1.1.3'], go: '#/f/00-16' },
  { n: 'Inclusiveness', aka: ['accessibility'], area: 'rai', in: 'All potential users', out: 'Access for everyone', def: 'Everyone can use and benefit from the system.', objs: ['1.1.4'], go: '#/f/00-16' },
  { n: 'Transparency', aka: ['disclosure', 'explainability'], area: 'rai', in: 'Users and stakeholders', out: 'Understanding of the system', def: 'People know AI is involved, how it works and its limits.', objs: ['1.1.5'], go: '#/f/00-16' },
  { n: 'Accountability', aka: ['governance', 'human oversight'], area: 'rai', in: 'The organization', out: 'Named responsibility', def: 'People and organizations answer for the system.', objs: ['1.1.6'], go: '#/f/00-16' },
  { n: 'Guardrails (content filters)', aka: ['content safety', 'Azure AI Content Safety', 'Prompt Shields'], area: 'rai', in: 'Prompts and responses', out: 'Allowed, annotated or blocked content', def: 'Controls that detect harmful content and prompt attacks at a severity threshold.', objs: ['1.1.2'], go: '#/m/01-01', ms: 'Foundry guardrails, powered by Azure AI Content Safety' },

  /* generative AI and models */
  { n: 'Generative AI', aka: ['GenAI'], area: 'genai', in: 'A prompt', out: 'New text, images, code or audio', def: 'AI that creates new content.', objs: ['1.2.1', '1.3.1'], go: '#/f/00-09', ms: 'Foundry Models' },
  { n: 'Large language model', aka: ['LLM', 'SLM', 'small language model', 'language model'], area: 'genai', in: 'Tokens of a prompt', out: 'Generated tokens', def: 'A model that generates text by predicting the next token.', objs: ['1.2.1', '1.2.2'], go: '#/f/00-10', ms: 'Foundry model catalog' },
  { n: 'Token', aka: ['tokenization', 'TPM'], area: 'genai', in: 'Text', out: 'Numeric IDs', def: 'The unit a language model reads and writes; also the unit of limits and billing.', objs: ['1.2.1', '1.2.3'], go: '#/f/00-10' },
  { n: 'Embedding', aka: ['vector', 'embedding model', 'semantic search'], area: 'genai', in: 'Text (or images)', out: 'A vector of numbers', def: 'A numeric representation of meaning; similar meanings are close together.', objs: ['1.2.1', '1.2.2'], go: '#/f/00-10' },
  { n: 'Prompt', aka: ['system prompt', 'user prompt', 'instructions'], area: 'genai', in: 'Instructions and a request', out: 'Context for generation', def: 'The input a generative model responds to; system prompts set rules, user prompts ask.', objs: ['2.1.1'], go: '#/f/00-10' },
  { n: 'Temperature', aka: ['max output tokens', 'parameters'], area: 'models', in: 'A setting', out: 'More or less varied output', def: 'Controls randomness in choosing each token; lower is more consistent.', objs: ['1.2.3'], go: '#/f/00-09' },
  { n: 'Retrieval-augmented generation', aka: ['RAG', 'grounding', 'knowledge'], area: 'genai', in: 'A question plus retrieved passages', out: 'A grounded answer, often with citations', def: 'Retrieve relevant data and add it to the prompt before generating.', objs: ['2.1.1', '2.1.4'], go: '#/f/00-10', ms: 'File search, Foundry IQ knowledge bases' },
  { n: 'Reasoning model', aka: [], area: 'models', in: 'A complex problem', out: 'A more carefully worked answer', def: 'A model trained to work through multi-step problems, trading speed for accuracy.', objs: ['1.2.2'], go: '#/m/01-02' },
  { n: 'Multimodal model', aka: ['vision model', 'audio model'], area: 'models', in: 'Text with images or audio', out: 'Generated text (or audio)', def: 'A model that accepts more than one kind of input.', objs: ['1.2.2', '2.2.2', '2.3.1'], go: '#/f/00-06' },
  { n: 'Model deployment', aka: ['deployment', 'deployment name'], area: 'models', in: 'A catalog model', out: 'A callable endpoint', def: 'A model made available to call, with a name, type and limits.', objs: ['1.2.3', '2.1.2'], go: '#/f/00-11' },
  { n: 'Deployment type', aka: ['Global Standard', 'Data Zone Standard', 'Provisioned', 'PTU', 'Batch'], area: 'models', in: 'Data location and billing needs', out: 'Where processing happens, how you pay', def: 'Standard (per token), provisioned (reserved) or batch; global, data zone or geography.', objs: ['1.2.3'], go: '#/compare/deployment-types' },
  { n: 'Fine-tuning', aka: [], area: 'models', in: 'A model plus task-specific examples', out: 'An adapted model', def: 'Further training of an existing model on a smaller data set.', objs: ['1.2.2'], go: '#/f/00-03' },

  /* agents */
  { n: 'AI agent', aka: ['agentic AI', 'prompt agent'], area: 'agents', in: 'A goal or request', out: 'An answer or completed action', def: 'A generative model plus instructions plus tools.', objs: ['1.3.1', '2.1.4', '2.1.5'], go: '#/f/00-12', ms: 'Foundry Agent Service' },
  { n: 'Tool', aka: ['function calling', 'web search', 'file search', 'code interpreter', 'OpenAPI tool', 'MCP'], area: 'agents', in: 'A tool call from the model', out: 'Information or an action', def: 'Something an agent can call to get data or act.', objs: ['2.1.4'], go: '#/f/00-12' },
  { n: 'Multi-agent system', aka: ['workflow'], area: 'agents', in: 'A complex task', out: 'Coordinated results', def: 'Several specialized agents working together.', objs: ['1.3.1'], go: '#/f/00-12' },

  /* language */
  { n: 'Natural language processing', aka: ['NLP', 'text analysis', 'text analytics'], area: 'language', in: 'Text', out: 'Structured information about the text', def: 'AI that analyzes and generates human language.', objs: ['1.3.1', '1.3.2'], go: '#/f/00-05', ms: 'Azure Language in Foundry Tools' },
  { n: 'Language detection', aka: [], area: 'language', in: 'Text', out: 'Language name and code', def: 'Identifying which language a text is written in.', objs: ['1.3.2'], go: '#/f/00-05' },
  { n: 'Sentiment analysis', aka: ['opinion mining'], area: 'language', in: 'Text', out: 'Positive, neutral or negative, with confidence', def: 'Classifying the opinion expressed in text.', objs: ['1.3.2', '2.2.1'], go: '#/f/00-05' },
  { n: 'Key phrase extraction', aka: ['keyword extraction', 'key-term extraction'], area: 'language', in: 'Text', out: 'Main terms', def: 'Finding the words and phrases a text is about.', objs: ['1.3.2'], go: '#/f/00-05' },
  { n: 'Entity detection', aka: ['NER', 'named entity recognition', 'entity recognition'], area: 'language', in: 'Text', out: 'Named items with type and position', def: 'Finding people, places, organizations, dates and similar.', objs: ['1.3.2', '2.2.1'], go: '#/f/00-05' },
  { n: 'PII detection', aka: ['PII', 'personally identifiable information', 'redaction'], area: 'language', in: 'Text', out: 'Personal data found, optionally redacted', def: 'Entity detection specialized for personal information.', objs: ['1.3.2', '1.1.3'], go: '#/f/00-05' },
  { n: 'Summarization', aka: ['extractive summary', 'abstractive summary'], area: 'language', in: 'Long text', out: 'Shorter text with the main points', def: 'Condensing text by selecting sentences or writing new ones.', objs: ['1.3.2'], go: '#/f/00-05' },
  { n: 'Translation', aka: ['Azure Translator', 'speech translation'], area: 'language', in: 'Text or speech in one language', out: 'Text or speech in another', def: 'Converting content between languages.', objs: ['1.3.1'], go: '#/learn/L4' },

  /* speech */
  { n: 'Speech recognition', aka: ['speech to text', 'STT', 'transcription', 'ASR'], area: 'speech', in: 'Audio', out: 'Text with timestamps and confidence', def: 'Converting spoken audio into text.', objs: ['1.3.3', '2.2.3'], go: '#/f/00-07', ms: 'Azure Speech in Foundry Tools' },
  { n: 'Speech synthesis', aka: ['text to speech', 'TTS', 'neural voice'], area: 'speech', in: 'Text or SSML', out: 'Spoken audio', def: 'Converting text into spoken audio.', objs: ['1.3.3', '2.2.3'], go: '#/f/00-07', ms: 'Azure Speech in Foundry Tools' },
  { n: 'SSML', aka: ['Speech Synthesis Markup Language'], area: 'speech', in: 'Marked-up text', out: 'Controlled speech', def: 'Markup controlling voice, rate, pitch, pauses and pronunciation.', objs: ['2.2.3'], go: '#/f/00-07' },
  { n: 'Spoken prompt to a model', aka: ['voice mode', 'Voice Live', 'voice agent'], area: 'speech', in: 'Audio', out: 'A generated response', def: 'Sending speech directly to an audio-capable model or voice-based agent.', objs: ['2.2.2'], go: '#/m/02-03' },

  /* vision */
  { n: 'Computer vision', aka: ['vision', 'image analysis'], area: 'vision', in: 'Images or video', out: 'Labels, locations, masks or descriptions', def: 'AI that analyzes visual input.', objs: ['1.3.1', '1.3.4'], go: '#/f/00-06', ms: 'Multimodal models; Azure Vision in Foundry Tools' },
  { n: 'Image classification', aka: [], area: 'vision', in: 'An image', out: 'One label', def: 'Predicting the main subject of an image.', objs: ['1.3.4'], go: '#/compare/vision-tasks' },
  { n: 'Object detection', aka: ['bounding box'], area: 'vision', in: 'An image', out: 'Objects + locations (boxes)', def: 'Finding each object and where it is.', objs: ['1.3.4'], go: '#/compare/vision-tasks' },
  { n: 'Semantic segmentation', aka: ['segmentation', 'mask'], area: 'vision', in: 'An image', out: 'A label per pixel', def: 'Classifying individual pixels by the object they belong to.', objs: ['1.3.4'], go: '#/compare/vision-tasks' },
  { n: 'Visual input in prompts', aka: ['input_image', 'image prompt'], area: 'vision', in: 'An image and a question', out: 'A text answer', def: 'A multimodal model interpreting an image inside a prompt.', objs: ['2.3.1'], go: '#/m/02-04' },
  { n: 'Image generation', aka: ['diffusion', 'text to image', 'video generation'], area: 'vision', in: 'A text prompt', out: 'A new image or video', def: 'Creating visuals from descriptions, commonly by diffusion.', objs: ['1.3.4', '2.3.2'], go: '#/f/00-06', ms: 'Image-generation models in Foundry Models' },
  { n: 'Content Credentials', aka: ['C2PA', 'provenance'], area: 'vision', in: 'A generated image', out: 'Provenance metadata', def: 'Metadata identifying an image as AI-generated.', objs: ['2.3.2', '1.1.5'], go: '#/m/02-04' },

  /* extraction */
  { n: 'Information extraction', aka: ['document processing', 'field extraction'], area: 'extract', in: 'Documents, images, audio or video', out: 'Named fields with confidence', def: 'Turning unstructured content into structured data.', objs: ['1.3.1', '1.3.5'], go: '#/f/00-08', ms: 'Azure Content Understanding in Foundry Tools' },
  { n: 'Optical character recognition', aka: ['OCR', 'read'], area: 'extract', in: 'An image or scan', out: 'Text with positions', def: 'Finding and reading text in images.', objs: ['1.3.5', '2.4.2'], go: '#/compare/ocr-vs-fields' },
  { n: 'Schema and analyzer', aka: ['custom analyzer', 'prebuilt analyzer', 'layout'], area: 'extract', in: 'A field definition', out: 'Fields extracted to match it', def: 'The fields you want, and the analyzer that extracts them.', objs: ['2.4.1', '2.4.4'], go: '#/m/02-05' },
  { n: 'Audio and video extraction', aka: ['speaker', 'key frames', 'scenes'], area: 'extract', in: 'Recordings', out: 'Transcripts, speakers, scenes, fields', def: 'Extracting structured information from audio and video.', objs: ['2.4.3'], go: '#/m/02-05' },

  /* Foundry and code */
  { n: 'Microsoft Foundry', aka: ['Azure AI Foundry', 'Foundry portal'], area: 'foundry', in: 'Your AI project', out: 'Models, agents, tools and knowledge in one platform', def: 'Microsoft\'s platform for building AI apps and agents on Azure.', objs: ['2.1.2'], go: '#/f/00-15' },
  { n: 'Foundry Tools', aka: ['Azure AI services', 'Azure Language', 'Azure Speech', 'Azure Vision'], area: 'foundry', in: 'Content for a defined task', out: 'Structured results', def: 'Prebuilt AI services such as Language, Speech, Vision and Content Understanding.', objs: ['1.2.2', '2.2.1'], go: '#/compare/tool-vs-model' },
  { n: 'Foundry resource and project', aka: ['AIServices', 'workspace'], area: 'foundry', in: 'An Azure subscription', out: 'A platform resource and its workspaces', def: 'The resource provides capabilities; projects are workspaces inside it.', objs: ['2.1.2'], go: '#/f/00-15' },
  { n: 'Endpoint', aka: ['URL', 'project endpoint'], area: 'foundry', in: 'A request', out: 'A response', def: 'The web address client code sends requests to.', objs: ['2.1.3'], go: '#/f/00-11' },
  { n: 'API', aka: ['REST', 'REST API', 'HTTP'], area: 'foundry', in: 'A structured request', out: 'A structured response', def: 'A defined way for software to make requests to a service.', objs: ['2.1.3'], go: '#/f/00-13' },
  { n: 'SDK', aka: ['client library', 'Foundry SDK', 'azure-ai-projects', 'AIProjectClient'], area: 'foundry', in: 'Method calls', out: 'Typed results', def: 'A library that builds and sends API requests for you.', objs: ['2.1.3', '2.1.5'], go: '#/f/00-13' },
  { n: 'CLI', aka: ['Azure CLI', 'az'], area: 'foundry', in: 'Typed commands', out: 'Resource changes and listings', def: 'A command-line tool, mainly for managing Azure resources.', objs: [], go: '#/f/00-13' },
  { n: 'Responses API', aka: ['responses.create', 'output_text'], area: 'foundry', in: 'Deployment name and input', out: 'Generated output', def: 'The OpenAI-compatible API used to call Foundry models and agents.', objs: ['2.1.3', '2.1.5'], go: '#/m/02-01' },
  { n: 'Microsoft Entra ID authentication', aka: ['DefaultAzureCredential', 'managed identity', 'token', 'API key'], area: 'foundry', in: 'An identity', out: 'Authenticated requests', def: 'Signing requests with an identity instead of a shared key.', objs: ['2.1.3', '2.1.5'], go: '#/f/00-11' },
  { n: 'Python', aka: ['pip', 'virtual environment', 'f-string'], area: 'foundry', in: 'A short script', out: 'Calls to Azure services', def: 'The language of AI-901\'s lightweight client applications.', objs: ['2.1.3'], go: '#/f/00-14' },
  { n: 'Azure resource hierarchy', aka: ['tenant', 'subscription', 'resource group', 'region'], area: 'foundry', in: 'An organization', out: 'Nested containers for resources', def: 'Tenant, subscription, resource group, resource.', objs: [], go: '#/f/00-15' }
];
