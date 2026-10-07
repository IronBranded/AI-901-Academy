/* learn.js - AI-901 guide, Learn track.
   Follows the structure of Microsoft's two AI-901 learning paths - "AI concepts
   for developers and technology professionals" and "Get started with AI
   applications and agents on Azure" - explained in this guide's own words.
   Every unit carries a visual and defines its key terms; the glossary is built
   from those definitions. */

function MSL(slug, t) { return { t: t, u: 'https://learn.microsoft.com/training/modules/' + slug + '/' }; }
var LEARN = [];

/* ======================================================================
   L1  What AI is
   ====================================================================== */
LEARN.push({
  id: 'L1', title: 'What AI Is', short: 'What AI is', mins: 20,
  summary: 'The vocabulary everything else in the exam builds on: how AI, machine learning and generative AI relate, how models are made and used, the workloads, and the principles for doing it responsibly.',
  ms: [MSL('get-started-ai-fundamentals', 'Introduction to AI concepts')],
  mods: ['01-01', '01-03'],
  units: [
    { t: 'AI, machine learning, deep learning, generative AI',
      body: '<p><strong>Artificial intelligence</strong> is the broad goal: software that does things we associate with human intelligence - understanding language, recognizing what is in a picture, reasoning, creating. The terms that follow are not alternatives to AI; each is a narrower way of achieving it, and they nest inside one another.</p>' +
        '<p><strong>Machine learning</strong> is the approach behind almost all modern AI: instead of a programmer writing the rules, an algorithm learns patterns from examples. <strong>Deep learning</strong> is machine learning that uses neural networks with many layers, which is what made language, speech and vision work well. <strong>Generative AI</strong> is deep learning used to <em>create</em> new content - text, images, audio, code - rather than only to label or predict.</p>',
      vis: vNest([
        { t: 'Artificial intelligence', s: 'software with human-like capabilities' },
        { t: 'Machine learning', s: 'learns patterns from data', k: 'acc' },
        { t: 'Deep learning', s: 'many-layered neural networks', k: 'd2' },
        { t: 'Generative AI', s: 'creates new content', k: 'd1', chips: ['language models', 'image models', 'speech models'] }
      ], 'Each ring is a subset of the one around it. Every generative AI system is also deep learning, machine learning and AI; the reverse is not true.'),
      terms: [['Artificial intelligence (AI)', 'Software that exhibits capabilities associated with human intelligence, such as understanding language, seeing, reasoning and creating.'],
        ['Machine learning (ML)', 'A way of building AI in which an algorithm learns patterns from example data instead of following hand-written rules.'],
        ['Deep learning', 'Machine learning that uses neural networks with many layers; the basis of modern language, speech and vision models.'],
        ['Neural network', 'A model made of layers of connected units whose numeric weights are adjusted during training.'],
        ['Generative AI', 'AI that creates new content - text, images, audio, video or code - in response to input.']] },

    { t: 'Training and inference',
      body: '<p>A <strong>model</strong> is what learning produces: a function with millions or billions of numeric <strong>parameters</strong> (weights) tuned so that it maps inputs to good outputs. <strong>Training</strong> is the expensive, one-off process of tuning those parameters on large amounts of data. <strong>Inference</strong> is every later use of the finished model on new input.</p>' +
        '<p>In AI-901 you almost never train. Providers pretrain large <strong>foundation models</strong>, and you use them by inference - deploying one in Foundry and sending it prompts. <strong>Fine-tuning</strong> sits between the two: continuing training on a smaller, specialised data set to adapt an existing model.</p>',
      vis: vFlow([
        { t: 'Training data', s: 'many examples' },
        { t: 'Training', s: 'algorithm adjusts weights', k: 'd1' },
        { t: 'Model', s: 'learned parameters', k: 'acc' },
        { t: 'Inference', s: 'new input in', k: 'd2' },
        { t: 'Output', s: 'prediction or content' }
      ], 'Training happens once and costs a great deal of compute; inference happens on every request and is what you pay for per token in Foundry.'),
      terms: [['Model', 'The output of training: a function with learned parameters that maps inputs to outputs.'],
        ['Parameters (weights)', 'The numbers inside a model that training adjusts; large language models have billions of them.'],
        ['Training', 'The process of adjusting a model\'s parameters using example data.'],
        ['Inference', 'Using a trained model to produce an output from new input.'],
        ['Foundation model', 'A large model pretrained on broad data that can be adapted to many tasks, typically through prompting or fine-tuning.'],
        ['Fine-tuning', 'Further training of an existing model on a smaller, task-specific data set.']] },

    { t: 'What kinds of output models produce',
      body: '<p>Before generative AI, most machine learning <em>predicted</em>: which category something belongs to, or what number to expect. Those ideas still describe a lot of what AI services do under the hood, and the words appear throughout the exam\'s options.</p>' +
        '<p><strong>Supervised</strong> learning trains on examples that already carry the right answer (labels); <strong>unsupervised</strong> learning finds structure in data with no labels. AI-901 does not test how to build these models - the machine-learning domain from AI-900 is gone - but you need to recognise the words.</p>',
      vis: vCards([
        { t: 'Classification', s: 'Which category? Spam or not; which of five product types.', tag: 'supervised' },
        { t: 'Regression', s: 'What number? Price, demand, temperature.', tag: 'supervised' },
        { t: 'Clustering', s: 'Which items belong together? Groups found without labels.', tag: 'unsupervised' },
        { t: 'Generation', s: 'Create something new: text, image, audio, code.', tag: 'generative', k: 'd1' }
      ], 'Three predictive patterns and the generative one. The labels on each card are how the model learned, not what it outputs.'),
      terms: [['Classification', 'Predicting which category an input belongs to.'],
        ['Regression', 'Predicting a numeric value.'],
        ['Clustering', 'Grouping similar items without predefined labels.'],
        ['Supervised learning', 'Training on examples that include the correct answer (labels).'],
        ['Unsupervised learning', 'Training on data without labels to discover structure in it.']] },

    { t: 'Confidence: models give probabilities, not certainties',
      body: '<p>Models do not know answers; they estimate. A vision model looking at a photo returns a score for every label it knows, and the application usually reports the highest. That <strong>confidence score</strong> is the model\'s own estimate of probability, not a guarantee.</p>' +
        '<p>This is why AI output is reviewed, why Azure services return confidence alongside results, and why good designs route low-confidence results to a person. It is also the root of generative AI\'s best-known failure: a fluent answer is not the same thing as a correct one.</p>',
      vis: vBars([
        { l: 'cat', v: 0.91 }, { l: 'fox', v: 0.06 }, { l: 'dog', v: 0.02 }, { l: 'rabbit', v: 0.01 }
      ], 'A classifier\'s scores for one photo. The app shows "cat"; the model was 91% sure. Set a threshold below which a person checks the result.'),
      terms: [['Confidence score', 'A model\'s estimate, between 0 and 1, of how likely its output is correct.'],
        ['Threshold', 'A cut-off confidence below which an application treats a result as uncertain, for example routing it to human review.']] },

    { t: 'AI workloads',
      body: '<p>A <strong>workload</strong> is a category of problem AI solves. The exam groups them the same way this guide does, and you should be able to name the workload from a one-sentence scenario by asking what goes in and what must come out.</p>',
      vis: vCards([
        { t: 'Generative AI', s: 'Prompt in, new content out', k: 'd1' },
        { t: 'Agentic AI', s: 'Goal in, actions taken through tools', k: 'd1' },
        { t: 'Text analysis (NLP)', s: 'Text in, meaning out: entities, sentiment, summary', k: 'd2' },
        { t: 'Speech', s: 'Audio to text, and text to audio', k: 'd2' },
        { t: 'Computer vision', s: 'Images in, labels, locations, text or descriptions out', k: 'd2' },
        { t: 'Information extraction', s: 'Documents, images, audio or video in, structured fields out', k: 'd2' }
      ], 'The six workloads named in the exam outline. Most scenarios describe exactly one.'),
      terms: [['Workload', 'A category of problem that AI is used to solve, such as speech or computer vision.'],
        ['Natural language processing (NLP)', 'The area of AI that analyses and generates human language.'],
        ['Computer vision', 'The area of AI that interprets images and video.'],
        ['Agentic AI', 'AI that pursues a goal over several steps by deciding which tools to use and acting through them.']] },

    { t: 'Responsible AI',
      body: '<p>Microsoft frames responsible AI as six principles. Four describe how the system must behave - <strong>fairness</strong>, <strong>reliability and safety</strong>, <strong>privacy and security</strong> and <strong>inclusiveness</strong>. The other two, <strong>transparency</strong> and <strong>accountability</strong>, are the foundation the four stand on: people must be able to understand the system, and specific people must answer for it.</p>' +
        '<p>Exam questions describe a situation and ask which principle it concerns. The distractor is nearly always the neighbouring principle, so learn the question each one answers.</p>',
      vis: vPillars([
        { t: 'Fairness', s: 'Do similar people get similar outcomes?' },
        { t: 'Reliability and safety', s: 'Does it behave as intended, even in unusual conditions?' },
        { t: 'Privacy and security', s: 'Is data protected, and does it resist attack?' },
        { t: 'Inclusiveness', s: 'Can everyone use it, including people with disabilities?' }
      ], [
        { t: 'Transparency', s: 'Do people understand what it is and what it cannot do?' },
        { t: 'Accountability', s: 'Who is answerable for it?' }
      ], 'Four principles on a two-part foundation. Module 01-01 maps each to Foundry controls and exam phrasing.'),
      terms: [['Responsible AI', 'Designing, building and operating AI so that it is fair, reliable and safe, private and secure, inclusive, transparent and accountable.'],
        ['Fairness', 'The principle that an AI system treats people equitably, giving similar outcomes to similar people.'],
        ['Reliability and safety', 'The principle that an AI system performs as intended and fails safely, including in unexpected conditions.'],
        ['Privacy and security', 'The principle that an AI system protects personal data and resists misuse and attack.'],
        ['Inclusiveness', 'The principle that an AI system empowers and is usable by everyone, including people with disabilities.'],
        ['Transparency', 'The principle that people understand how an AI system works, what it is for and what its limitations are.'],
        ['Accountability', 'The principle that people and organizations are answerable for how an AI system operates.']] }
  ]
});

/* ======================================================================
   L2  Microsoft Foundry
   ====================================================================== */
LEARN.push({
  id: 'L2', title: 'Microsoft Foundry', short: 'Microsoft Foundry', mins: 18,
  summary: 'The platform every Domain 2 objective is set in: what Foundry provides, how resources and projects are organised, how models are deployed, and how access is controlled.',
  ms: [MSL('get-started-with-ai-in-azure', 'Get started with AI in Azure')],
  mods: ['ENV', '01-02', '02-01'],
  units: [
    { t: 'What Foundry is',
      body: '<p><strong>Microsoft Foundry</strong> is Azure\'s platform for building AI applications and agents. It brings together a catalog of models from Microsoft, OpenAI and other providers; an agent service; prebuilt AI capabilities called <strong>Foundry Tools</strong> (Speech, Language, Content Understanding and others); knowledge retrieval through <strong>Foundry IQ</strong>; and the safety, evaluation and monitoring features around them.</p>' +
        '<p>You work with it through the <strong>Foundry portal</strong> at ai.azure.com, through SDKs and REST APIs, or through the Azure CLI. Names you may still meet in older material - Azure AI Studio, Azure AI Foundry, Azure Cognitive Services, Azure AI services - all refer to earlier forms of the same platform.</p>',
      vis: vCards([
        { t: 'Models', s: 'Catalog, deployment, playground', k: 'acc' },
        { t: 'Agents', s: 'Foundry Agent Service: instructions, tools, versions', k: 'acc' },
        { t: 'Foundry Tools', s: 'Speech, Language, Content Understanding, Translator', k: 'd2' },
        { t: 'Knowledge', s: 'Foundry IQ: grounding agents in your data', k: 'd2' },
        { t: 'Safety', s: 'Guardrails, Prompt Shields, evaluations', k: 'd1' },
        { t: 'Operations', s: 'Monitoring, tracing, quotas, access control', k: 'd1' }
      ], 'One platform, six areas. The exam\'s Domain 2 lives almost entirely in the top four.'),
      terms: [['Microsoft Foundry', 'Azure\'s platform for building, deploying and managing AI applications and agents.'],
        ['Foundry portal', 'The web interface for Microsoft Foundry, at ai.azure.com.'],
        ['Foundry Tools', 'Prebuilt AI capabilities in Foundry, such as Azure Speech, Azure Language and Azure Content Understanding; formerly Azure AI services.'],
        ['Foundry Agent Service', 'The Foundry service for creating, versioning and running agents.']] },

    { t: 'Resources and projects',
      body: '<p>Everything lives in the usual Azure hierarchy. Inside a resource group you create a <strong>Foundry resource</strong>: the Azure resource that hosts model deployments and Foundry Tools, holds the keys, and is the boundary for networking and billing. Inside it you create one or more <strong>projects</strong>: workspaces where agents, files, indexes and evaluations for one solution live.</p>' +
        '<p>Several projects can share one resource - and so share its deployments and quota - while keeping their agents and data apart.</p>',
      vis: vNest([
        { t: 'Azure subscription', s: 'billing and quota' },
        { t: 'Resource group', s: 'lifecycle: delete it and everything goes' },
        { t: 'Foundry resource', s: 'deployments, Foundry Tools, keys, network', k: 'acc' },
        { t: 'Project', s: 'one solution\'s workspace', k: 'd1', chips: ['agents', 'files', 'indexes', 'evaluations', 'connections'] }
      ], 'From the outside in. Deleting the resource group removes the lot - and then leaves the Foundry resource soft-deleted until purged.'),
      terms: [['Foundry resource', 'The Azure resource (kind AIServices) that hosts model deployments and Foundry Tools and holds keys and network settings.'],
        ['Project', 'A workspace inside a Foundry resource that holds the agents, data and evaluations for one AI solution.'],
        ['Resource group', 'An Azure container whose resources share a lifecycle.'],
        ['Soft delete', 'A deleted Foundry resource is retained for a period and its name stays reserved until it is purged.']] },

    { t: 'Endpoints and authentication',
      body: '<p>An <strong>endpoint</strong> is the URL an application calls. A Foundry resource exposes several, and they differ in how they let you in. An <strong>API key</strong> is a shared secret for the whole resource. <strong>Microsoft Entra ID</strong> authentication uses an identity - yours, or an app\'s <strong>managed identity</strong> - and role assignments, so access is individual, auditable and revocable.</p>' +
        '<p>The <strong>project endpoint</strong>, used by the Foundry SDK, accepts Entra ID only. In Python, <code>DefaultAzureCredential</code> picks up whichever identity is available - your <code>az login</code> on a laptop, a managed identity in Azure - without code changes.</p>' + FIG('ENV', 0),
      vis: '',
      terms: [['Endpoint', 'The URL an application sends requests to.'],
        ['API key', 'A shared secret that grants access to a whole Foundry resource and bypasses Entra ID.'],
        ['Microsoft Entra ID', 'Microsoft\'s identity service; authenticates users and applications with individual identities.'],
        ['Managed identity', 'An Entra identity that Azure manages for a resource, so code running there needs no stored secret.'],
        ['DefaultAzureCredential', 'An Azure SDK credential that tries available identities in turn - environment, managed identity, developer sign-in.'],
        ['Project endpoint', 'The endpoint used by the Foundry SDK to reach a project; accepts Entra ID only.']] },

    { t: 'From catalog to deployment',
      body: '<p>The <strong>model catalog</strong> lists the models you can use, each with a <strong>model card</strong> describing capabilities, modalities, context window and benchmarks. To use a model you create a <strong>deployment</strong>: a named instance of it in your resource, with a deployment type and capacity. Your code addresses the deployment by name.</p>' +
        '<p>Capacity is measured in <strong>tokens per minute</strong> (TPM) and limited by <strong>quota</strong> per subscription, region and model. Exceed the rate and requests return HTTP 429 until the minute rolls over.</p>',
      vis: vFlow([
        { t: 'Model catalog', s: 'compare cards, benchmarks' },
        { t: 'Choose a model', s: 'by capability and cost' },
        { t: 'Deploy', s: 'name, type, capacity', k: 'acc' },
        { t: 'Playground', s: 'test prompts', k: 'd1' },
        { t: 'Code', s: 'call it by deployment name', k: 'd2' }
      ], 'The path every Foundry lab follows. Module 01-02 covers the deployment types; module 02-01 the playground and code.'),
      terms: [['Model catalog', 'The Foundry list of available models, with details and benchmarks for each.'],
        ['Model card', 'The catalog page describing a model\'s capabilities, limits and intended uses.'],
        ['Deployment', 'A named instance of a model in a Foundry resource, with its own type and capacity.'],
        ['Deployment name', 'The name your code passes to address a deployment; not necessarily the model\'s name.'],
        ['Tokens per minute (TPM)', 'The rate limit on a deployment, measured in tokens processed per minute.'],
        ['Quota', 'The maximum capacity you may deploy, per subscription, region and model.']] },

    { t: 'Ways to work',
      body: '<p>Foundry is the same platform whichever door you use. The portal is where you explore and test; code is where you build. The exam expects you to recognise all four and to read a short Python sample.</p>',
      vis: vCards([
        { t: 'Portal', s: 'ai.azure.com: catalog, playgrounds, agent builder', k: 'acc' },
        { t: 'SDK', s: 'Python and other languages: azure-ai-projects, tool SDKs', k: 'd2' },
        { t: 'REST API', s: 'HTTP calls any language can make', k: 'd2' },
        { t: 'Azure CLI', s: 'az commands for resources, projects, deployments', k: 'd1' }
      ], 'Portal to explore, SDK or REST to build, CLI to provision.'),
      terms: [['SDK', 'Software development kit: a library that wraps a service\'s API for a programming language.'],
        ['REST API', 'An HTTP-based interface to a service.'],
        ['Playground', 'A Foundry portal page for testing a model or agent interactively.'],
        ['Azure CLI', 'The az command-line tool for managing Azure resources.']] },

    { t: 'Who can do what',
      body: '<p>Azure separates the <strong>control plane</strong> - creating and configuring resources - from the <strong>data plane</strong> - using them. Owner or Contributor lets you create a Foundry resource and deploy models; it does not let your identity call those models. That needs a data-plane role such as <strong>Foundry User</strong> (formerly Azure AI User).</p>' +
        '<p>This split is why "I can see it in the portal but my code gets 403" is such a common failure, and a common exam distractor.</p>',
      vis: vVs({ t: 'Control plane', k: 'd1', items: ['Create resources and projects', 'Create deployments', 'Assign roles', 'Roles: Owner, Contributor'] },
        { t: 'Data plane', k: 'd2', items: ['Call models', 'Run agents', 'Use Foundry Tools', 'Role: Foundry User'] },
        'Two different permissions. Managing a resource does not grant using it.'),
      terms: [['Role-based access control (RBAC)', 'Granting permissions by assigning roles to identities at a scope.'],
        ['Control plane', 'Operations that create or configure Azure resources.'],
        ['Data plane', 'Operations that use a resource, such as calling a model.'],
        ['Foundry User', 'The built-in data-plane role for building with and calling Foundry projects; formerly Azure AI User.']] }
  ]
});

/* ======================================================================
   L3  Generative AI and agents
   ====================================================================== */
LEARN.push({
  id: 'L3', title: 'Generative AI and Agents', short: 'Generative AI and agents', mins: 30,
  summary: 'How language models turn text into tokens and meaning, how they generate, how prompts steer them, and how an agent wraps a model with instructions and tools.',
  ms: [MSL('fundamentals-generative-ai', 'Introduction to generative AI and agents'), MSL('get-started-with-generative-ai-and-agents', 'Get started with generative AI and agents in Azure')],
  mods: ['01-02', '02-01', '02-02'],
  units: [
    { t: 'Language models',
      body: '<p>A <strong>language model</strong> is trained on very large amounts of text to predict what comes next. Scale changes what that simple objective produces: a <strong>large language model</strong> (LLM), with billions of parameters, picks up grammar, facts, style and a working ability to reason, and can follow instructions it was never explicitly trained on.</p>' +
        '<p>A <strong>small language model</strong> (SLM) trades breadth for speed and cost. For a narrow task, or on a device, it is often the better choice.</p>',
      vis: vVs({ t: 'Large language model', k: 'd1', items: ['Billions of parameters', 'Broad knowledge and reasoning', 'Higher cost and latency', 'Runs in the cloud'] },
        { t: 'Small language model', k: 'd2', items: ['Far fewer parameters', 'Narrower, faster, cheaper', 'Good for focused tasks', 'Can run on a device'] },
        'Pick by the task. A frontier model for classifying short messages wastes money and time.'),
      terms: [['Language model', 'A model trained on text to predict the next piece of text.'],
        ['Large language model (LLM)', 'A language model with billions of parameters, capable of broad understanding and generation.'],
        ['Small language model (SLM)', 'A compact language model, such as Phi, with lower cost and latency for narrower tasks.']] },

    { t: 'Tokens',
      body: '<p>Models do not read words; they read <strong>tokens</strong> - pieces of words, whole short words, punctuation - each mapped to a number in the model\'s vocabulary. In English a token averages about four characters. <strong>Tokenization</strong> is the step that splits text this way.</p>' +
        '<p>Everything practical is counted in tokens: the <strong>context window</strong> (how much input and output fit in one request), rate limits, and the price you pay.</p>',
      vis: vTokens([['Cont', 4086], ['oso', 17266], ['\'s', 596], [' agent', 8479], [' summar', 29385], ['ized', 1534], [' 3', 220], [' reports', 6821], ['.', 13]],
        'One sentence, nine tokens. The IDs are illustrative; each model family has its own vocabulary. Uncommon words split into several tokens.'),
      terms: [['Token', 'The unit a language model processes: a word, part of a word or a symbol, each mapped to an ID.'],
        ['Tokenization', 'Splitting text into tokens.'],
        ['Context window', 'The maximum number of tokens - input plus output - a model can handle in one request.']] },

    { t: 'Embeddings: meaning as position',
      body: '<p>Inside the model each token becomes an <strong>embedding</strong>: a <strong>vector</strong>, a list of hundreds or thousands of numbers. Training arranges these so that meaning becomes geometry - words used in similar ways end up close together, and directions in the space capture relationships.</p>' +
        '<p>Embeddings are also a product in their own right. An embedding model turns whole texts into vectors, and comparing vectors (usually by <strong>cosine similarity</strong>) finds text with similar meaning even when no words match. That is the engine of semantic search and of RAG.</p>',
      vis: vScatter([
        { x: 90, y: 80, l: 'dog', g: 0 }, { x: 130, y: 60, l: 'puppy', g: 0 }, { x: 110, y: 120, l: 'cat', g: 0 }, { x: 160, y: 105, l: 'kitten', g: 0 },
        { x: 380, y: 70, l: 'car', g: 1 }, { x: 430, y: 95, l: 'truck', g: 1 }, { x: 400, y: 130, l: 'bus', g: 1 },
        { x: 240, y: 230, l: 'apple', g: 2 }, { x: 290, y: 250, l: 'banana', g: 2 }, { x: 205, y: 262, l: 'pear', g: 2 }
      ], 'Embeddings squeezed into two dimensions. The query "young cat" lands among the animals; its nearest neighbours are what a semantic search would return.', { x: 150, y: 140, l: 'young cat', k: 3 }),
      terms: [['Embedding', 'A vector representation of a token or text in which similar meanings are close together.'],
        ['Vector', 'An ordered list of numbers; a point in a many-dimensional space.'],
        ['Cosine similarity', 'A measure of how closely two vectors point in the same direction; used to compare embeddings.'],
        ['Semantic search', 'Finding content by similarity of meaning rather than matching words.']] },

    { t: 'Transformers and attention',
      body: '<p>Modern language models are <strong>transformers</strong>. Their key mechanism is <strong>attention</strong>: when the model processes a token, it weighs every other token in the context to decide which ones matter for interpreting it. That is how the same word gets different meanings in different sentences.</p>' +
        '<p>In the sentence below, "bank" draws most of its meaning from "river". In "the bank approved the loan", attention would fall on "loan" instead, and the embedding the model builds for "bank" would differ.</p>',
      vis: vAttn(['The', 'bank', 'of', 'the', 'river', 'flooded'], 1, [0.04, 0, 0.05, 0.03, 0.71, 0.17],
        'Attention from "bank" to the other words (illustrative weights). Thicker arcs carry more influence on how "bank" is understood.'),
      terms: [['Transformer', 'The neural network architecture behind modern language models, built around attention.'],
        ['Attention', 'The mechanism by which a model weighs the relevance of every other token when processing one token.']] },

    { t: 'How text is generated',
      body: '<p>Generation is one step repeated: take all the tokens so far, compute a probability for every possible next token, choose one, append it, and go again - until a stop sequence or the output-token limit. Nothing is looked up, so the output can be fluent and wrong: a <strong>hallucination</strong>. <strong>Grounding</strong> - putting the facts in the prompt or letting the model retrieve them - is the remedy.</p>' +
        '<p><strong>Temperature</strong> controls how the next token is chosen. Low temperature almost always takes the most likely token; high temperature spreads the choice. Try it below.</p>' + FIG('01-02', 1),
      vis: FIG('01-02', 0),
      terms: [['Next-token prediction', 'The generation loop: compute probabilities for the next token, choose one, append, repeat.'],
        ['Temperature', 'A setting that controls randomness in token selection; lower is more deterministic.'],
        ['Top-p', 'A setting that limits selection to the most probable tokens whose probabilities add up to p.'],
        ['Hallucination', 'Generated content that is fluent and plausible but false or unsupported.'],
        ['Grounding', 'Supplying authoritative information to a model so that its answer is based on it.']] },

    { t: 'Prompts',
      body: '<p>A <strong>prompt</strong> is everything sent to the model in a request. It has parts with different owners. The <strong>system prompt</strong> is written by the developer and sets role, scope, format and rules. The <strong>user prompt</strong> is what the person asks. Between them you can add <strong>examples</strong> of good answers (few-shot prompting) and <strong>grounding data</strong> the model should rely on. In a chat, earlier turns are sent again every time.</p>' +
        '<p><strong>Prompt engineering</strong> is the practice of writing these parts so the output is useful: be specific, give a role, specify the format, show an example, supply the facts, and break complex tasks into steps.</p>',
      vis: vAnat([
        { l: 'System', t: 'You are a support assistant for Contoso routers. Answer only about Contoso products. Reply in under 80 words.', k: 'd1' },
        { l: 'Example', t: 'Q: How do I reset? A: Hold the reset button for 10 seconds, then wait for the green light.', k: 'acc' },
        { l: 'Grounding', t: 'From the manual: "Firmware 4.2 adds WPA3. Update via Settings > System."', k: 'd2' },
        { l: 'History', t: 'Earlier user and assistant turns, resent with each request.' },
        { l: 'User', t: 'Does my router support WPA3?', k: 'ok' }
      ], 'The anatomy of one request. The developer owns the top bands; the user owns the last. Zero-shot means no example band; few-shot means one or more.', 'One request, top to bottom'),
      terms: [['Prompt', 'The complete input sent to a model in a request.'],
        ['System prompt', 'Developer-written instructions that set a model\'s role, scope, format and rules; "instructions" in the Responses API.'],
        ['User prompt', 'The end user\'s request.'],
        ['Zero-shot prompting', 'Asking for a task with no examples in the prompt.'],
        ['Few-shot prompting', 'Including one or more example answers in the prompt to show the desired output.'],
        ['Prompt engineering', 'Designing prompts to get useful, reliable output.']] },

    { t: 'Agents',
      body: '<p>An <strong>agent</strong> packages a model with instructions and <strong>tools</strong> - capabilities it can decide to call, such as web search, searching your files, running code, or calling your APIs. Given a goal, it works in a loop: decide what to do, call a tool, look at the result, decide again, and answer when it has enough. That loop is what makes it <em>agentic</em>.</p>' +
        '<p>In Foundry an agent is saved with a name and an immutable version, and gets its own Entra identity. Clients reference it by name and version instead of sending a system prompt. Several agents can hand work to one another in a <strong>multi-agent</strong> solution; AI-901 stays with one.</p>',
      vis: vFlow([
        { t: 'Goal', s: 'from the user' },
        { t: 'Reason', s: 'what is needed next?', k: 'd1' },
        { t: 'Act', s: 'call a tool', k: 'acc' },
        { t: 'Observe', s: 'read the result', k: 'd2' },
        { t: 'Answer', s: 'when enough is known', k: 'ok' }
      ], 'The agent loop. Reason, act and observe repeat as many times as the task needs.', { loop: 'reason &rarr; act &rarr; observe repeats until the goal is met' }) + FIG('02-02', 0),
      terms: [['Agent', 'A model packaged with instructions and tools that can pursue a goal over several steps.'],
        ['Tool', 'A capability an agent can choose to call, such as web search, file search, code interpreter or an API.'],
        ['Function calling', 'A model returning a structured request to call a function that the application or service then runs.'],
        ['Model Context Protocol (MCP)', 'An open protocol for exposing tools and data to AI agents in a standard way.'],
        ['Multi-agent solution', 'Several agents that divide a task and pass work between them.'],
        ['Agent version', 'An immutable saved definition of an agent; saving changes creates a new version.']] },

    { t: 'Building it in Foundry',
      body: '<p>The Foundry path runs from the portal to code without changing platforms. You deploy a model, shape its behaviour in the playground, save the configuration as an agent, preview it as a web app, and take the generated client code to build your own application. The code uses the <strong>Responses API</strong> through an OpenAI client obtained from the project.</p>',
      vis: vFlow([
        { t: 'Deploy model', s: 'catalog' },
        { t: 'Playground', s: 'instructions, tools', k: 'd1' },
        { t: 'Save as agent', s: 'name + version', k: 'acc' },
        { t: 'Preview web app', s: 'no-code test' },
        { t: 'Continue in code', s: 'Responses API client', k: 'd2' }
      ], 'The flow of Microsoft\'s generative AI and agents lab, and of labs 02-01 and 02-02 here.'),
      terms: [['Responses API', 'The OpenAI-compatible API used to send prompts to models and agents in Foundry.'],
        ['Preview web app', 'A Foundry option that publishes a simple chat interface for an agent, for testing without code.']] }
  ]
});
/* ======================================================================
   L4  Text analysis and NLP
   ====================================================================== */
LEARN.push({
  id: 'L4', title: 'Text Analysis and Natural Language Processing', short: 'Text analysis (NLP)', mins: 22,
  summary: 'How software pulls meaning out of text, from counting words to semantic models, the named techniques the exam tests, and the two ways Foundry offers to do it.',
  ms: [MSL('introduction-language', 'Introduction to natural language processing concepts'), MSL('get-started-text-analysis-azure', 'Get started with text analysis in Azure')],
  mods: ['01-03', '02-03'],
  units: [
    { t: 'What text analysis does',
      body: '<p><strong>Natural language processing</strong> covers software that works with human language. Text analysis is the part that reads: it takes text in and returns structured facts about it - what language it is in, what it is about, who and what it mentions, how the writer feels, and what it says in brief.</p>',
      vis: vCards([
        { t: 'Language detection', s: 'Which language? With a confidence score.' },
        { t: 'Key phrase extraction', s: 'The main talking points.' },
        { t: 'Entity recognition', s: 'People, places, organizations, dates - typed.' },
        { t: 'Sentiment analysis', s: 'Positive, negative, neutral or mixed.' },
        { t: 'Summarization', s: 'The gist, extracted or newly written.' },
        { t: 'PII detection', s: 'Personal data found and redacted.', k: 'warn' }
      ], 'The techniques named in the exam outline, plus the two that surround them in practice.'),
      terms: [['Text analysis', 'Extracting structured information such as language, entities, key phrases and sentiment from text.'],
        ['Corpus', 'A collection of documents used for analysis or training.']] },

    { t: 'Preparing text: tokens, stop words, stems',
      body: '<p>Classic text analysis starts by cleaning and splitting text. It is normalised (for example lower-cased, punctuation removed), split into tokens, and stripped of <strong>stop words</strong> - very common words such as "the" and "of" that carry little meaning. Words are then reduced to a common form: <strong>stemming</strong> chops endings by rule ("running" to "run"), while <strong>lemmatization</strong> uses vocabulary to find the dictionary form ("better" to "good").</p>' +
        '<p>Tokens can be taken singly or in sequences called <strong>n-grams</strong> - "credit card" as a bi-gram carries meaning neither word has alone.</p>',
      vis: vFlow([
        { t: 'Raw text', s: '"The routers were failing!"' },
        { t: 'Normalize', s: 'the routers were failing' },
        { t: 'Tokenize', s: 'the | routers | were | failing' },
        { t: 'Remove stop words', s: 'routers | failing', k: 'd1' },
        { t: 'Stem / lemmatize', s: 'router | fail', k: 'd2' }
      ], 'Each stage throws away variation that does not change meaning, so that "failing", "failed" and "fails" count as one thing.'),
      terms: [['Stop words', 'Very common words removed before analysis because they carry little meaning.'],
        ['Stemming', 'Reducing words to a root by removing endings according to rules.'],
        ['Lemmatization', 'Reducing words to their dictionary form using vocabulary and grammar.'],
        ['N-gram', 'A sequence of n adjacent tokens; a bi-gram is two, a tri-gram three.']] },

    { t: 'Frequency: what a document is about',
      body: '<p>Counting words is the oldest way to find what a document is about - a <strong>bag of words</strong> that ignores order. Raw counts favour words that are common everywhere, so <strong>TF-IDF</strong> weighs each word\'s frequency in this document (term frequency) against how many documents in the corpus contain it (inverse document frequency). A word frequent here but rare elsewhere scores high: it is distinctive.</p>',
      vis: vBars([
        { l: 'firmware', v: 0.92, k: 'd2', note: '0.92' }, { l: 'WPA3', v: 0.81, k: 'd2', note: '0.81' }, { l: 'router', v: 0.44, note: '0.44' },
        { l: 'update', v: 0.31, note: '0.31' }, { l: 'the', v: 0.01, k: 'warn', note: '0.01' }
      ], 'Illustrative TF-IDF scores for one support article in a corpus of router articles. "router" appears in every article, so it scores lower than its raw count suggests; "the" is everywhere and scores near zero.'),
      terms: [['Bag of words', 'Representing a text by its word counts, ignoring order.'],
        ['Term frequency (TF)', 'How often a term appears in a document.'],
        ['TF-IDF', 'Term frequency weighted by inverse document frequency; high for terms common in one document but rare across the corpus.']] },

    { t: 'Semantic models: meaning beyond word counts',
      body: '<p>Statistical techniques count words; they do not understand them. "Not bad at all" contains "bad"; "inexpensive" and "cheap" share no letters. <strong>Semantic language models</strong> - the embedding-based models from the generative AI unit - represent meaning, so they handle negation, synonyms and context. Modern text analysis, including Azure Language and every LLM, is built on them.</p>',
      vis: vVs({ t: 'Statistical', k: 'd1', items: ['Counts words and n-grams', 'Fast, transparent, cheap', '"not bad" looks negative', 'Synonyms look unrelated'] },
        { t: 'Semantic', k: 'd2', items: ['Embeddings capture meaning', 'Understands context and negation', '"not bad" reads as positive', '"cheap" is close to "inexpensive"'] },
        'Both still matter: statistics for speed and explainability, semantics for meaning.'),
      terms: [['Semantic language model', 'A model that represents text by meaning, using embeddings, rather than by word counts.']] },

    { t: 'The techniques on one sentence',
      body: '<p>The exam distinguishes techniques that look alike. Run them all on the same sentence and the differences are obvious: key phrases are untyped topics, entities are typed, sentiment is one verdict, <strong>opinion mining</strong> ties each verdict to the thing it is about, and summarization rewrites. <strong>Extractive</strong> summaries select existing sentences; <strong>abstractive</strong> summaries write new ones. <strong>Entity linking</strong> goes one step past recognition by connecting an entity to a knowledge-base entry, so "Paris" the city is told apart from Paris the person.</p>',
      vis: FIG('01-03', 0),
      terms: [['Key phrase extraction', 'Identifying the main talking points in a text.'],
        ['Named entity recognition (NER)', 'Identifying mentions of people, places, organizations, dates and other typed entities.'],
        ['Entity linking', 'Connecting a recognized entity to a specific entry in a knowledge base to disambiguate it.'],
        ['Sentiment analysis', 'Classifying text as positive, negative, neutral or mixed, with confidence scores.'],
        ['Opinion mining', 'Sentiment analysis at the level of aspects: which thing was praised or criticised.'],
        ['Extractive summarization', 'Summarizing by selecting the most important existing sentences.'],
        ['Abstractive summarization', 'Summarizing by generating new sentences.'],
        ['PII detection', 'Finding and optionally redacting personally identifiable information such as names, phone numbers and addresses.']] },

    { t: 'Two ways in Foundry',
      body: '<p>Foundry offers both a general-purpose model and a purpose-built tool, and choosing between them is a tested skill. A model, prompted, can summarize, classify or extract entities in natural language and adapts to any instruction - but its output varies. <strong>Azure Language in Foundry Tools</strong> returns structured JSON with categories, confidence scores and character offsets, identically each time: what an automated pipeline or a compliance process needs.</p>',
      vis: vVs({ t: 'General-purpose model', k: 'd1', items: ['Prompt describes the task', 'Flexible, any instruction', 'Natural-language output', 'Can vary run to run'] },
        { t: 'Azure Language', k: 'd2', items: ['Call a specific operation', 'Fixed set of tasks', 'Structured JSON: category, offset, confidence', 'Repeatable'] },
        'Consistency, structure or compliance in the scenario points to Azure Language. Open-ended or conversational points to the model.'),
      terms: [['Azure Language', 'The Foundry Tool for text analysis: language detection, key phrases, entities, sentiment, PII, summarization and more.']] }
  ]
});

/* ======================================================================
   L5  Speech
   ====================================================================== */
LEARN.push({
  id: 'L5', title: 'Speech', short: 'Speech', mins: 20,
  summary: 'How audio becomes text and text becomes audio, what SSML controls, and the options Foundry gives you for speech-enabled apps and agents.',
  ms: [MSL('introduction-ai-speech', 'Introduction to AI speech concepts'), MSL('get-started-speech-azure', 'Get started with speech in Azure')],
  mods: ['01-03', '02-03'],
  units: [
    { t: 'Recognition and synthesis',
      body: '<p>Speech AI runs in two directions. <strong>Speech recognition</strong>, or speech-to-text, turns spoken audio into text: captions, transcripts, voice commands. <strong>Speech synthesis</strong>, or text-to-speech, turns text into spoken audio: screen readers, voice assistants, announcements. A voice agent does both, with a model in between.</p>',
      vis: vVs({ t: 'Speech recognition', k: 'd2', items: ['Audio in, text out', 'Speech-to-text (STT)', 'Captions, transcripts, commands'] },
        { t: 'Speech synthesis', k: 'd1', items: ['Text in, audio out', 'Text-to-speech (TTS)', 'Read-aloud, assistants, IVR'] },
        'Recognition listens; synthesis speaks. Exam scenarios swap them often.'),
      terms: [['Speech recognition', 'Converting spoken audio into text; also called speech-to-text.'],
        ['Speech synthesis', 'Converting text into spoken audio; also called text-to-speech.']] },

    { t: 'How recognition works',
      body: '<p>Audio arrives as a <strong>waveform</strong>: air pressure sampled thousands of times a second. The first step converts it into features a model can use, typically a <strong>spectrogram</strong> showing how much energy each frequency carries over time. An <strong>acoustic model</strong> maps those features to the sounds of the language (<strong>phonemes</strong>), and a <strong>language model</strong> turns sound sequences into the most likely words - which is how "recognize speech" wins over "wreck a nice beach".</p>' +
        '<p>Modern systems often fold these stages into one neural model, but the stages are still the clearest way to understand what is happening.</p>',
      vis: vWave('A spoken phrase as a waveform, and the same audio as a spectrogram. Recognition models work on the right-hand picture, not the left.') +
        vFlow([{ t: 'Audio', s: 'waveform' }, { t: 'Features', s: 'spectrogram' }, { t: 'Acoustic model', s: 'which sounds?', k: 'd1' }, { t: 'Language model', s: 'which words?', k: 'd2' }, { t: 'Text', s: 'transcript', k: 'ok' }], ''),
      terms: [['Waveform', 'The raw audio signal: amplitude over time.'],
        ['Spectrogram', 'A picture of audio showing the energy at each frequency over time.'],
        ['Phoneme', 'One of the distinct sounds of a language.'],
        ['Acoustic model', 'The part of a recognition system that maps audio features to phonemes.'],
        ['Language model (speech)', 'The part of a recognition system that turns sound sequences into the most probable words.']] },

    { t: 'How synthesis works',
      body: '<p>Synthesis runs the other way. Text is first <strong>normalized</strong>: "Dr." becomes "Doctor" and "$5" becomes "five dollars". It is converted to phonemes, then given <strong>prosody</strong> - the pitch, rhythm and stress that make speech sound natural and carry meaning ("You did?" versus "You did."). A <strong>neural voice</strong> then generates the audio.</p>',
      vis: vFlow([
        { t: 'Text', s: '"Dr. Lee owes $5."' },
        { t: 'Normalize', s: 'Doctor Lee owes five dollars' },
        { t: 'Phonemes', s: 'how each word sounds', k: 'd1' },
        { t: 'Prosody', s: 'pitch, rhythm, stress', k: 'd2' },
        { t: 'Neural voice', s: 'audio out', k: 'ok' }
      ], 'Most of the naturalness is decided in the prosody step.'),
      terms: [['Text normalization', 'Expanding abbreviations, numbers and symbols into the words to be spoken.'],
        ['Prosody', 'The pitch, rhythm, stress and pauses of speech.'],
        ['Neural voice', 'A synthetic voice generated by a neural network, sounding close to human speech.']] },

    { t: 'SSML: controlling how it sounds',
      body: '<p><strong>Speech Synthesis Markup Language</strong> is an XML format that tells the synthesizer exactly how to speak: which voice, how fast, where to pause, how to read a number or a date, how to pronounce an unusual word. Send plain text and the service decides; send SSML and you do.</p>',
      vis: vAnat([
        { l: '&lt;voice&gt;', t: 'Which neural voice speaks: name="en-US-AvaMultilingualNeural"', k: 'acc' },
        { l: '&lt;prosody&gt;', t: 'Rate, pitch and volume: rate="-10%" slows it down', k: 'd1' },
        { l: '&lt;break&gt;', t: 'A pause of a set length: time="500ms"', k: 'd2' },
        { l: '&lt;say-as&gt;', t: 'How to read a value: interpret-as="date" or "cardinal"', k: 'd2' },
        { l: '&lt;phoneme&gt;', t: 'Exact pronunciation for names and jargon' }
      ], 'The SSML elements that answer most exam questions about controlling synthesized speech.', 'SSML elements'),
      terms: [['SSML', 'Speech Synthesis Markup Language: XML that controls voice, rate, pitch, pauses and pronunciation in synthesized speech.']] },

    { t: 'Speech features and how they are delivered',
      body: '<p>Recognition comes in several shapes. <strong>Real-time</strong> transcription streams text as someone speaks; <strong>batch</strong> transcription processes stored recordings. <strong>Speaker diarization</strong> labels who spoke when. <strong>Speech translation</strong> recognizes in one language and outputs another. <strong>Voice Live</strong> combines recognition, a model or agent, and synthesis into one managed real-time conversation - it is what an agent\'s voice mode in Foundry uses.</p>' + FIG('02-03', 0),
      vis: vCards([
        { t: 'Real-time transcription', s: 'Live captions and commands', k: 'd2' },
        { t: 'Batch transcription', s: 'Large volumes of stored audio', k: 'd2' },
        { t: 'Speaker diarization', s: 'Who said what, when', k: 'd2' },
        { t: 'Speech translation', s: 'Speak in one language, get another', k: 'd1' },
        { t: 'Voice Live', s: 'Real-time spoken conversation with an agent', k: 'acc' }
      ], ''),
      terms: [['Real-time transcription', 'Converting speech to text as it is spoken.'],
        ['Batch transcription', 'Converting stored recordings to text asynchronously, often in bulk.'],
        ['Speaker diarization', 'Identifying which speaker said each part of a recording.'],
        ['Speech translation', 'Recognizing speech in one language and producing text or speech in another.'],
        ['Voice Live', 'An Azure Speech capability that runs a real-time spoken conversation with a model or agent; used by agent voice mode in Foundry.']] },

    { t: 'Azure Speech in Foundry Tools',
      body: '<p>In code, the Speech SDK follows one pattern for every feature: a <strong>SpeechConfig</strong> holds the key or credential, region and settings such as the language and voice; a recognizer or synthesizer uses it with an audio input or output; you call it and read the result.</p>',
      vis: vFlow([
        { t: 'SpeechConfig', s: 'credential, region, language, voice', k: 'acc' },
        { t: 'Recognizer or Synthesizer', s: 'with audio in or out' },
        { t: 'Call', s: 'recognize_once / speak_text', k: 'd2' },
        { t: 'Result', s: 'text, or audio played' }
      ], 'Module 02-03 has the working code, including a speak-listen-answer loop.'),
      terms: [['Speech SDK', 'The client library for Azure Speech: recognition, synthesis and translation.'],
        ['SpeechConfig', 'The Speech SDK object holding credentials and settings shared by recognizers and synthesizers.']] }
  ]
});

/* ======================================================================
   L6  Computer vision
   ====================================================================== */
LEARN.push({
  id: 'L6', title: 'Computer Vision', short: 'Computer vision', mins: 24,
  summary: 'How software sees: images as numbers, filters and features, the models that learn from them, the tasks the exam names, and how images and video are generated.',
  ms: [MSL('introduction-computer-vision', 'Introduction to computer vision concepts'), MSL('get-started-vision-azure', 'Get started with computer vision in Azure')],
  mods: ['01-03', '02-04'],
  units: [
    { t: 'Images are numbers',
      body: '<p>To a computer an image is a grid of <strong>pixels</strong>, each a number. A grayscale pixel is one value from 0 (black) to 255 (white). A colour image stacks three such grids - red, green and blue <strong>channels</strong> - so every pixel is three numbers. Everything computer vision does starts from these arrays.</p>',
      vis: vFig('<div class="vconv">' + vGrid([[0, 0, 0, 0, 0, 0], [0, 0, 255, 255, 0, 0], [0, 255, 255, 255, 255, 0], [0, 255, 255, 255, 255, 0], [0, 0, 255, 255, 0, 0], [0, 0, 0, 0, 0, 0]], 'gray', 'A 6 &times; 6 grayscale image') + '</div>',
        'A tiny white shape on black, as the model receives it. A phone photo is the same idea with millions of pixels and three channels.'),
      terms: [['Pixel', 'The smallest element of a digital image, stored as one number (grayscale) or three (colour).'],
        ['Channel', 'One layer of an image\'s values; colour images have red, green and blue channels.']] },

    { t: 'Filters and features',
      body: '<p>A <strong>filter</strong> (or kernel) is a small grid of weights slid across the image. At each position the pixel values under it are multiplied by the weights and summed - a <strong>convolution</strong> - producing a new grid called a <strong>feature map</strong>. The filter below responds strongly where brightness changes: it finds edges.</p>' +
        '<p>Hand-written filters like this were how image processing began. Deep learning\'s step forward was to <em>learn</em> the filter weights from data.</p>',
      vis: vConv([[0, 0, 0, 0, 0], [0, 255, 255, 255, 0], [0, 255, 255, 255, 0], [0, 255, 255, 255, 0], [0, 0, 0, 0, 0]],
        [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]],
        [[1275, 765, 1275], [765, 0, 765], [1275, 765, 1275]],
        'An edge-detection filter applied to the centre of a white square. Flat areas cancel to 0; corners and edges light up. Values are the raw sums.'),
      terms: [['Filter (kernel)', 'A small grid of weights applied across an image to detect a pattern.'],
        ['Convolution', 'Sliding a filter over an image and summing weighted pixel values at each position.'],
        ['Feature map', 'The grid of filter responses produced by a convolution.']] },

    { t: 'Models that learn to see',
      body: '<p>A <strong>convolutional neural network</strong> (CNN) stacks many learned filters in layers. Early layers find edges and colours, middle layers combine them into textures and parts, later layers into whole objects - and a final layer turns that into a prediction.</p>' +
        '<p>Newer <strong>vision transformers</strong> cut the image into <strong>patches</strong> and treat each patch like a token, using the same attention mechanism as language models. Because image patches and words then live in comparable embedding spaces, one model can take both: a <strong>multimodal model</strong>, which is what AI-901 mostly uses for vision.</p>',
      vis: vFlow([
        { t: 'Image', s: 'pixels' },
        { t: 'Early layers', s: 'edges, colours' },
        { t: 'Middle layers', s: 'textures, parts', k: 'd1' },
        { t: 'Late layers', s: 'whole objects', k: 'd2' },
        { t: 'Prediction', s: '"bicycle", 0.94', k: 'ok' }
      ], 'What a CNN learns at increasing depth.') +
        vFlow([
          { t: 'Image', s: 'split into patches' },
          { t: 'Patch tokens', s: 'embedded like words', k: 'd1' },
          { t: 'Transformer', s: 'attention across patches and text', k: 'acc' },
          { t: 'Answer', s: 'text about the image', k: 'ok' }
        ], 'How a multimodal model reads an image alongside a question.'),
      terms: [['Convolutional neural network (CNN)', 'A deep learning model that uses layers of learned filters to recognise visual patterns.'],
        ['Vision transformer', 'A transformer that processes an image as a sequence of patches.'],
        ['Multimodal model', 'A model that accepts more than one kind of input, such as text and images, in the same request.']] },

    { t: 'Vision tasks',
      body: '<p>The exam names the task by what the answer looks like. <strong>Image classification</strong> labels the whole image. <strong>Object detection</strong> finds each object and draws a <strong>bounding box</strong> around it. <strong>Semantic segmentation</strong> labels every pixel. <strong>OCR</strong> reads text. <strong>Image captioning</strong> describes the scene in a sentence. Face <em>detection</em> is broadly available; face <em>identification</em> is Limited Access.</p>',
      vis: FIG('01-03', 1),
      terms: [['Image classification', 'Assigning one or more labels to a whole image.'],
        ['Object detection', 'Locating objects in an image with labelled bounding boxes.'],
        ['Bounding box', 'A rectangle defining an object\'s position in an image.'],
        ['Semantic segmentation', 'Classifying every pixel of an image, producing masks with exact shapes.'],
        ['Optical character recognition (OCR)', 'Detecting and reading text in images.'],
        ['Image captioning', 'Generating a natural-language description of an image.']] },

    { t: 'Generating images and video',
      body: '<p>Generation runs vision backwards: text in, pixels out. Many image models are <strong>diffusion models</strong>. Trained to remove noise from images, they generate by starting from pure noise and denoising step by step, steered at each step by the prompt\'s embedding, until a picture emerges. The same models can <strong>edit</strong>: regenerate only a masked region (inpainting). <strong>Video-generation</strong> models extend this across frames to produce short clips from a prompt.</p>' +
        '<p>Images generated by Azure OpenAI image models carry <strong>Content Credentials</strong>, a C2PA provenance record identifying them as AI-generated.</p>',
      vis: vDiffusion('Diffusion in five frames. Real models take tens of steps, in a compressed representation rather than raw pixels.'),
      terms: [['Diffusion model', 'A generative model that creates images by iteratively removing noise, guided by a prompt.'],
        ['Image generation', 'Creating a new image from a text prompt, optionally with a source image.'],
        ['Inpainting', 'Regenerating a selected region of an existing image.'],
        ['Video generation', 'Creating short video clips from a text prompt.'],
        ['Content Credentials (C2PA)', 'Provenance metadata attached to media recording how it was created, including whether AI generated it.']] },

    { t: 'Vision in Foundry',
      body: '<p>In Foundry, interpreting an image means sending it to a deployed multimodal model as an <code>input_image</code> part of the prompt, next to the question. Creating one means calling an image-generation deployment. Reading the direction of travel - image in or image out - resolves most exam questions on this objective.</p>',
      vis: FIG('02-04', 0),
      terms: [['input_image', 'The Responses API content part that carries an image, as a URL or base64 data URL, into a prompt.']] }
  ]
});

/* ======================================================================
   L7  Information extraction
   ====================================================================== */
LEARN.push({
  id: 'L7', title: 'Information Extraction', short: 'Information extraction', mins: 20,
  summary: 'Turning documents, images, audio and video into structured data: OCR, layout, field extraction with schemas, and how Azure Content Understanding does all of it.',
  ms: [MSL('introduction-information-extraction', 'Introduction to AI-powered information extraction concepts'), MSL('get-started-information-extraction', 'Get started with AI-powered information extraction in Azure')],
  mods: ['01-03', '02-05'],
  units: [
    { t: 'From unstructured to structured',
      body: '<p>Most business data arrives <strong>unstructured</strong>: scanned forms, photographed receipts, recorded calls. Applications need it <strong>structured</strong>: named <strong>fields</strong> with typed values they can store, sum and search. Information extraction is the bridge, and its output is usually JSON.</p>',
      vis: vReceipt(['TAILWIND TRADERS', '12 High St, Reading', '', '2026-09-14  14:22', '', 'USB-C cable      12.99', 'Router RT-400    89.00', '', 'SUBTOTAL        101.99', 'TAX              20.40', 'TOTAL           122.39'],
        '{\n  "MerchantName": "Tailwind Traders",\n  "TransactionDate": "2026-09-14",\n  "Items": [\n    { "Description": "USB-C cable", "Price": 12.99 },\n    { "Description": "Router RT-400", "Price": 89.00 }\n  ],\n  "Total": 122.39\n}',
        'The same receipt as a person sees it and as an application needs it.'),
      terms: [['Unstructured data', 'Content without a predefined data model, such as images of documents, audio and free text.'],
        ['Structured data', 'Data organised into defined fields and types.'],
        ['Field', 'A named value extracted from content, such as invoice total or vendor name.']] },

    { t: 'OCR: reading the text',
      body: '<p>Extraction starts by reading. <strong>OCR</strong> finds regions of an image that contain text, recognises the characters, and returns lines and words with their positions (a <strong>bounding polygon</strong>) and a confidence score. It captures <em>what</em> the text says - not what any of it means.</p>',
      vis: vFlow([
        { t: 'Image', s: 'scan or photo' },
        { t: 'Detect text regions', s: 'where is text?', k: 'd1' },
        { t: 'Recognise characters', s: 'what does it say?', k: 'd2' },
        { t: 'Lines and words', s: 'with positions and confidence', k: 'ok' }
      ], 'OCR alone cannot tell you which number on the receipt is the total.'),
      terms: [['Bounding polygon', 'The coordinates outlining where a word, line or region appears on a page.']] },

    { t: 'Layout: recovering structure',
      body: '<p><strong>Layout analysis</strong> adds structure to the text: which lines form a paragraph, which are a heading, how cells form a table, where <strong>selection marks</strong> (check boxes) are and whether they are ticked. For documents where structure carries meaning - forms, statements, contracts - this step is what makes the text usable.</p>',
      vis: vLayout('Layout analysis recognises the regions of a page, not only the characters on it.'),
      terms: [['Layout analysis', 'Recovering a document\'s structure: paragraphs, headings, tables and selection marks.'],
        ['Selection mark', 'A check box or radio button on a form, with its selected or unselected state.']] },

    { t: 'Fields, schemas and confidence',
      body: '<p><strong>Field extraction</strong> maps content to meaning using a <strong>schema</strong>: the list of fields you want, each with a type and a description. In Content Understanding, each field is filled by one of three methods - <strong>extract</strong> a value that appears in the content, <strong>generate</strong> one that must be inferred, or <strong>classify</strong> into categories you define. Every value comes back with a <strong>confidence</strong> score and <strong>grounding</strong> that points to where it came from, so low-confidence values can go to a person.</p>',
      vis: vFig(T('compare', ['Field', 'Type', 'Method', 'Example value'], [
        ['VendorName', 'string', '<span class="vm" data-m="extract">extract</span>', 'Tailwind Traders'],
        ['InvoiceTotal', 'number', '<span class="vm" data-m="extract">extract</span>', '122.39'],
        ['Summary', 'string', '<span class="vm" data-m="generate">generate</span>', 'Two network accessories, paid by card'],
        ['Category', 'string', '<span class="vm" data-m="classify">classify</span>', 'hardware (of: hardware, service, other)']
      ]), 'A small schema. Extract copies what is there; generate infers; classify chooses from your list.'),
      terms: [['Schema', 'The definition of the fields to extract, with their names, types and descriptions.'],
        ['Field extraction', 'Mapping values in content to the named fields of a schema.'],
        ['Extract, generate, classify', 'The three ways Content Understanding fills a field: copy a value present in the content, infer one, or choose from given categories.'],
        ['Grounding (extraction)', 'The reference from an extracted value back to its location in the source content.']] },

    { t: 'Beyond documents: images, audio and video',
      body: '<p>The same ladder - read, structure, fields - applies to every modality. For audio, reading is transcription and structure is speakers and segments. For video, it is transcript plus <strong>key frames</strong> and scene <strong>segments</strong>, with fields extracted per segment.</p>',
      vis: FIG('02-05', 0),
      terms: [['Key frame', 'A representative still image selected from a video segment.'],
        ['Segment', 'A continuous portion of audio or video, such as a scene or a speaker turn.'],
        ['Transcription', 'Converting the speech in audio or video into text.']] },

    { t: 'Azure Content Understanding',
      body: '<p><strong>Azure Content Understanding in Foundry Tools</strong> does all of this through <strong>analyzers</strong>. A <strong>prebuilt analyzer</strong> covers a common case - Read, Layout, receipts, invoices, and analyzers for images, audio and video. A <strong>custom analyzer</strong> carries your own schema. Analysis is a <strong>long-running operation</strong>: the SDK returns a poller, and the JSON result arrives when it completes. Field extraction runs on generative models deployed in your Foundry resource.</p>',
      vis: vFlow([
        { t: 'Content', s: 'URL or bytes' },
        { t: 'Analyzer', s: 'prebuilt or custom', k: 'acc' },
        { t: 'begin_analyze', s: 'returns a poller', k: 'd1' },
        { t: '.result()', s: 'wait for completion', k: 'd1' },
        { t: 'JSON', s: 'markdown + fields + confidence', k: 'ok' }
      ], 'The shape of every Content Understanding call. Module 02-05 has the working code.'),
      terms: [['Azure Content Understanding', 'The Foundry Tool that extracts structured information from documents, images, audio and video.'],
        ['Analyzer', 'A Content Understanding configuration that defines what to extract and how.'],
        ['Prebuilt analyzer', 'A ready-made analyzer for a common content type, such as receipts or invoices.'],
        ['Custom analyzer', 'An analyzer built with your own field schema.'],
        ['Long-running operation', 'An asynchronous API call that returns immediately with a poller and completes later.']] }
  ]
});

/* ======================================================================
   L8  RAG and Foundry IQ
   ====================================================================== */
LEARN.push({
  id: 'L8', title: 'Retrieval-Augmented Generation and Foundry IQ', short: 'RAG and Foundry IQ', mins: 18,
  summary: 'How to make a model answer from your data instead of its training: preparing and indexing content, retrieving the right pieces, and grounding answers with citations. Both Learn paths cover it; the exam touches it through agents with knowledge.',
  ms: [MSL('rag-fundamentals', 'Introduction to retrieval-augmented generation concepts'), MSL('get-started-foundry-iq', 'Get started with Microsoft Foundry IQ')],
  mods: ['02-02'],
  units: [
    { t: 'Why ground a model',
      body: '<p>A model knows only what was in its training data, up to a cutoff date, and none of your organization\'s private information. Asked about your return policy, it will produce something plausible. <strong>Retrieval-augmented generation</strong> (RAG) fixes this by finding relevant passages in your content at question time and putting them in the prompt, with instructions to answer from them and cite them.</p>',
      vis: vVs({ t: 'Ungrounded', k: 'warn', items: ['Answers from training data', 'Knowledge stops at a cutoff', 'Knows nothing private', 'Plausible answers, no sources'] },
        { t: 'Grounded with RAG', k: 'ok', items: ['Retrieves your content first', 'Current as your data', 'Uses private knowledge you permit', 'Cites where each claim came from'] },
        'The same model, with and without retrieval.'),
      terms: [['Retrieval-augmented generation (RAG)', 'Retrieving relevant content at question time and adding it to the prompt so the model answers from it.']] },

    { t: 'Preparing the data',
      body: '<p>Documents are too long to put in a prompt whole, so they are split into <strong>chunks</strong> of a few hundred tokens, usually overlapping a little so no idea is cut in half. Each chunk is turned into an embedding and stored, with its text and source, in an <strong>index</strong> - a <strong>vector index</strong> when searching by embedding. This happens ahead of time and again whenever the content changes.</p>',
      vis: vFlow([
        { t: 'Sources', s: 'files, sites, stores' },
        { t: 'Chunk', s: 'split into passages', k: 'd1' },
        { t: 'Embed', s: 'a vector per chunk', k: 'd1' },
        { t: 'Index', s: 'vectors + text + source', k: 'acc' }
      ], 'Ingestion runs before anyone asks a question.'),
      terms: [['Chunking', 'Splitting documents into smaller passages for indexing and retrieval.'],
        ['Index', 'A searchable store of content; in RAG, the chunks with their embeddings and metadata.'],
        ['Vector index', 'An index that supports finding items by embedding similarity.']] },

    { t: 'Retrieval',
      body: '<p>At question time the question is embedded the same way and the index returns the chunks nearest in meaning - <strong>vector search</strong>. Pure keyword search still wins for exact terms such as product codes, so production systems combine both in <strong>hybrid search</strong>, then apply a <strong>semantic ranker</strong> that re-scores the candidates for relevance. The top few chunks go forward.</p>',
      vis: vScatter([
        { x: 90, y: 70, l: 'returns: 30 days', g: 0 }, { x: 200, y: 160, l: 'refund to card', g: 0 }, { x: 95, y: 170, l: 'receipt required', g: 0 },
        { x: 380, y: 80, l: 'router setup', g: 1 }, { x: 430, y: 130, l: 'firmware 4.2', g: 1 },
        { x: 300, y: 240, l: 'store hours', g: 2 }, { x: 380, y: 250, l: 'parking', g: 2 }
      ], 'Chunks in embedding space. The question lands among the returns-policy chunks, and the three nearest are retrieved.', { x: 140, y: 115, l: 'Can I get my money back?', k: 3 }) +
        vFlow([{ t: 'Question', s: 'embedded' }, { t: 'Hybrid search', s: 'vector + keyword', k: 'd1' }, { t: 'Semantic ranker', s: 're-score candidates', k: 'd2' }, { t: 'Top chunks', s: 'to the prompt', k: 'ok' }], ''),
      terms: [['Vector search', 'Finding the indexed items whose embeddings are most similar to the query\'s embedding.'],
        ['Keyword search', 'Finding items that contain the query\'s words.'],
        ['Hybrid search', 'Combining vector and keyword search in one query.'],
        ['Semantic ranker', 'A model that re-scores search results by relevance to the query.']] },

    { t: 'Augment and generate',
      body: '<p>The retrieved chunks are added to the prompt, each labelled with its source, together with instructions to answer only from them and to cite. The model then does what it is good at - writing a clear answer - from material you control. If nothing relevant is retrieved, good instructions tell it to say so rather than guess.</p>',
      vis: vAnat([
        { l: 'System', t: 'Answer only from the sources below. Cite them as [1], [2]. If they do not answer the question, say so.', k: 'd1' },
        { l: 'Source [1]', t: 'returns-policy.pdf: "Items may be returned within 30 days with a receipt..."', k: 'd2' },
        { l: 'Source [2]', t: 'refunds.md: "Refunds go to the original payment method within 5 days..."', k: 'd2' },
        { l: 'User', t: 'Can I get my money back?', k: 'ok' },
        { l: 'Answer', t: 'Yes, within 30 days with a receipt [1]; the refund goes to your card within 5 days [2].', k: 'acc' }
      ], 'An augmented prompt and its grounded, cited answer.', 'The augmented prompt'),
      terms: [['Augmented prompt', 'A prompt that includes retrieved content alongside the question and instructions.'],
        ['Citation', 'A reference in a generated answer to the source passage that supports it.']] },

    { t: 'Foundry IQ: knowledge for agents',
      body: '<p><strong>Foundry IQ</strong> is Foundry\'s managed way to give agents this capability. You connect <strong>knowledge sources</strong> - such as uploaded files, storage, SharePoint or the web - to a <strong>knowledge base</strong>, which is built on Azure AI Search and handles chunking, indexing and retrieval. Attach the knowledge base to an agent and it retrieves and cites automatically. The file search tool in lab 02-02 is the same idea at small scale.</p>',
      vis: vFlow([
        { t: 'Knowledge sources', s: 'files, storage, SharePoint, web' },
        { t: 'Knowledge base', s: 'on Azure AI Search', k: 'acc' },
        { t: 'Agent', s: 'knowledge attached as a tool', k: 'd1' },
        { t: 'Grounded answer', s: 'with citations', k: 'ok' }
      ], 'RAG as a managed service. Watch the Azure AI Search tier: Basic and above bill hourly.'),
      terms: [['Foundry IQ', 'The Foundry capability that connects agents to enterprise knowledge for grounded, cited answers.'],
        ['Knowledge base', 'In Foundry IQ, the managed retrieval layer built over one or more knowledge sources.'],
        ['Knowledge source', 'A connected location of content, such as files, storage or SharePoint, that a knowledge base draws from.'],
        ['Azure AI Search', 'Azure\'s search service providing keyword, vector and hybrid search; the engine under Foundry IQ.']] }
  ]
});
