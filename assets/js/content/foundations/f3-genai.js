/* Module 0 - Part 3: generative AI and agents (00-09 to 00-12).
   Grounded in Microsoft Learn "Introduction to generative AI and agents"
   (LLMs, prompts, agents units), "Get started with AI in Azure" (clients,
   servers, endpoints) and "Get started with generative AI and agents in Azure". */

/* ======================================================================
   00-09  Generative AI
   ====================================================================== */
FOUND.push({
  id: '00-09', title: 'Generative AI: Creating Instead of Labelling', short: 'Generative AI',
  scope: 'supports', supports: ['1.2.1', '1.3.1'], area: 'genai',
  prereq: ['00-04'], learn: ['L3'], mods: ['01-02', '01-03'],
  outcomes: [
    'Describe how generative AI differs from predictive AI',
    'Explain, without maths, how a language model produces text one token at a time',
    'Explain why generated output varies and can be wrong'
  ],
  problem: `<p>A customer-service team writes hundreds of replies a day that are similar but never identical. Marketing needs first drafts of product descriptions. A history website wants visitors to ask questions in their own words and get an answer in their own words. None of these needs a label or a number. They need <em>new text</em>.</p>`,
  plain: `<p><strong>Predictive AI</strong> chooses from known answers: a category, a number, a location. <strong>Generative AI</strong> creates new content - text, images, code, audio - in response to an instruction called a <strong>prompt</strong>.</p>
<p>A language model generates text much like a very powerful version of the predictive-text feature on a phone: given the words so far, it estimates which word piece is most likely to come next, adds it, and repeats until the response is complete.</p>`,
  example: `<p>Asking a chat assistant to "write a polite reply declining the meeting and suggesting Thursday" is generative AI. So is asking an image model for "a watercolour of a lighthouse at dusk", or asking a coding assistant to "write a function that checks an email address".</p>`,
  words: [
    ['Generative AI', 'AI that creates new content in response to a prompt'],
    ['Prompt', 'The input you give a generative model: a question, an instruction, examples'],
    ['Completion (response)', 'What the model generates in reply to the prompt'],
    ['Language model', 'A model that generates text by predicting likely next tokens'],
    ['LLM / SLM', 'Large and small language models: larger ones generalize well but cost more; smaller ones suit focused or on-device tasks'],
    ['Token', 'A word, part of a word or punctuation mark: the unit a language model reads and writes'],
    ['Temperature', 'A setting that controls how much randomness goes into choosing each token']
  ],
  model: function () { return vIPO([
    { r: 'Input', t: 'Prompt', s: '"Write a reply declining the meeting"' },
    { r: 'Capability', t: 'Language model', s: 'predicts the next token, repeatedly' },
    { r: 'Output', t: 'Generated response', s: 'new text that did not exist before', k: 'ok' },
    { r: 'Used by', t: 'A person who reviews and sends it' }
  ], 'The simplest generative model. Lesson 00-10 adds instructions, history and retrieved context.'); },
  concept: `<p>Microsoft Learn describes generative AI as a branch of AI that enables applications to generate new content. Its core is the <strong>language model</strong>, trained on very large volumes of text to capture how words relate to one another. <strong>Large language models (LLMs)</strong> are powerful and generalize well; <strong>small language models (SLMs)</strong> are cheaper and suit focused tasks or devices. <strong>Multimodal</strong> models also accept or produce images and audio. Image generators use a related approach (diffusion) to create pictures from prompts.</p>`,
  how: `<p>Generation is a loop. The prompt is split into tokens. The model calculates a probability for every token in its vocabulary as the next one, one is chosen, it is appended, and the whole sequence goes back in to predict the next token - until the model predicts the end. <strong>Temperature</strong> controls the choice: at low temperature the model almost always takes the most likely token, so output is consistent; at higher temperature less likely tokens get chosen more often, so output is more varied.</p>
<p>Nothing in this loop checks facts. The model produces text that <em>fits the patterns</em> of its training data and prompt. Usually that is also correct; sometimes it is fluent and wrong - often called a <em>hallucination</em>.</p>`,
  ms: `<p>Microsoft Foundry's <strong>model catalog</strong> holds thousands of generative models from Microsoft, OpenAI and other providers: chat models, reasoning models, multimodal models, image-generation models and more. You <strong>deploy</strong> a model, try it in the Foundry <strong>playground</strong>, then call it from code through the <strong>Responses API</strong>. Foundry's <strong>guardrails</strong> scan prompts and responses for harmful content.</p>`,
  compare: ['predictive-vs-generative'],
  distinctions: `<p><strong>Generative versus predictive.</strong> If the answer must be one of a known set (a category, a number, a location), it is predictive. If the answer is new content, it is generative.</p>
<p><strong>Generative AI versus a search engine.</strong> A search engine returns existing documents. A language model writes new text; it does not look anything up unless the application gives it data or a search tool.</p>`,
  rai: `<p><em>Reliability:</em> generated answers can be wrong, so high-stakes output needs review or grounding in trusted data. <em>Safety:</em> models can be prompted to produce harmful content; guardrails filter inputs and outputs. <em>Transparency:</em> people should know when content was generated by AI.</p>`,
  scenario: `<p>A law firm wants first drafts of routine letters from a few bullet points, which a lawyer will always review. Generative AI fits, and the lawyer's review is the safeguard against fluent but wrong output.</p>`,
  explore: { widget: 'bigram', title: 'A tiny generative model',
    intro: 'This lab trains a real - but tiny - language model in your browser. It counts which word follows which in a small training text, then generates by repeatedly picking a likely next word. Choose a training text, a starting word and a temperature, and generate several times. Real LLMs work with sub-word tokens, look at the whole context through attention, and have billions of parameters; this one looks only at the previous word.' },
  observe: `<p>At temperature 0 the same start always produces the same text. Raise it and every run differs. Switch training texts and the "style" of output changes completely: the model can only produce patterns it learned. Some outputs are grammatical but meaningless - fluent is not the same as true. Real models are vastly better, but these behaviours are the same in kind.</p>`,
  check: [
    { q: 'Which requirement calls for generative AI rather than predictive AI?', o: ['Label each support ticket as urgent or not urgent', 'Estimate next month\'s ticket volume', 'Draft a personalised reply to each ticket for an agent to review', 'Group tickets into themes nobody has defined yet'], a: 2,
      why: 'Drafting a reply creates new text, which is generative AI.',
      not: ['Choosing between two labels is classification, a predictive task.', 'Estimating a quantity is regression.', '', 'Discovering groups is clustering. None of these three create new content.'],
      clue: '"draft a reply"', obj: '1.3.1', area: 'genai', misc: 'Any AI that handles text is generative AI.' },
    { q: 'At each step of generating a response, what does a large language model do?', o: ['Retrieves the closest stored answer from its training data', 'Predicts the most likely next token from the tokens so far', 'Runs a rule a developer wrote for that question', 'Searches the web and copies the top result'], a: 1,
      why: 'LLMs generate by repeatedly predicting the next token from the sequence so far.',
      not: ['A model does not store answers to look up; it stores learned parameters and generates from them.', '', 'No developer-written rule decides the response.', 'A model only searches the web if the application gives it a search tool; that is not how generation itself works.'],
      clue: '"at each step"', obj: '1.2.1', area: 'genai', misc: 'A language model looks answers up in its training data.' },
    { q: 'A product team needs the same input to produce nearly the same wording every time from a non-reasoning chat model. Which setting should they lower?', o: ['Max output tokens', 'Temperature', 'Tokens-per-minute rate limit', 'The number of deployments'], a: 1,
      why: 'Lower temperature makes the model choose the most likely tokens more consistently, so output varies less.',
      not: ['Max output tokens limits length, not variety.', '', 'The rate limit controls throughput, not wording.', 'Adding deployments changes capacity, not how each response is generated.'],
      clue: '"nearly the same wording every time"', obj: '1.2.3', area: 'models' }
  ],
  teach: { prompt: 'Explain why an AI-generated answer should not automatically be assumed to be correct.',
    points: ['The model predicts likely tokens; it does not check facts', 'It reflects the patterns in its training data and prompt', 'Output can be fluent and still wrong', 'Grounding in trusted data and human review reduce the risk'] },
  takeaways: [
    'Predictive AI chooses from known answers; generative AI creates new content from a prompt.',
    'A language model generates one token at a time by predicting the next most likely token.',
    'Temperature trades consistency for variety.',
    'Generated output is not checked for truth: review it or ground it in trusted data.'
  ]
});

/* ======================================================================
   00-10  Large language models: prompt, context, output
   ====================================================================== */
FOUND.push({
  id: '00-10', title: 'Large Language Models: Prompt, Context and Output', short: 'LLMs and prompts',
  scope: 'supports', supports: ['1.2.1', '2.1.1', '1.2.3'], area: 'genai',
  prereq: ['00-09'], learn: ['L3', 'L8'], mods: ['01-02', '02-01'],
  outcomes: [
    'Describe what a model actually receives: instructions, history, the user\'s message and any retrieved data',
    'Write a system prompt and a user prompt that follow Microsoft\'s prompt guidance',
    'Explain tokens, the context window and grounding (RAG) in plain terms'
  ],
  problem: `<p>A company deploys a language model and asks it "How many days of paid leave do I get?". The answer is polite, generic and useless: it advises checking the employee handbook. The model was never told it works for this company, never shown the handbook, and remembers nothing from earlier in the chat unless the application sends it again.</p>`,
  plain: `<p>A language model sees only what is in front of it for this one request. That bundle is the <strong>context</strong>, and the application builds it from up to four parts: <strong>instructions</strong> (the system prompt: role, tone, rules), the <strong>conversation history</strong>, the <strong>user's message</strong>, and any <strong>retrieved information</strong> such as relevant pages from the handbook. Better context produces better answers.</p>`,
  example: `<p>System prompt: <em>"You are the HR assistant for Contoso. Answer only from the policy text provided. If the answer is not there, say so."</em> Retrieved text: the leave policy section. User prompt: <em>"How many days of paid leave do I get after three years?"</em> Now the model can answer specifically - and is told what to do when it cannot.</p>`,
  words: [
    ['System prompt (instructions)', 'Sets the model\'s role, tone, constraints and output format; usually set by the application'],
    ['User prompt', 'The specific question or instruction from the user'],
    ['Conversation history', 'Earlier turns the application resends so the model can follow the conversation'],
    ['Context window', 'The maximum number of tokens a model can take in at once'],
    ['Embedding', 'A list of numbers that represents meaning, so similar text has similar numbers'],
    ['Grounding', 'Giving the model trusted information to base its answer on'],
    ['RAG', 'Retrieval-augmented generation: retrieve relevant data, add it to the prompt, then generate']
  ],
  model: function () { return vFlow([
    { t: 'Instructions', s: 'system prompt' },
    { t: '+ History', s: 'earlier turns' },
    { t: '+ User input', s: 'this question' },
    { t: '+ Retrieved context', s: 'grounding data' },
    { t: 'Model', s: 'predicts tokens', k: 'acc' },
    { t: 'Output', s: 'a completion', k: 'ok' }
  ], 'Simplified teaching model. The application assembles the context on every request; the model itself keeps no memory between requests.'); },
  concept: `<p>Microsoft Learn names two main kinds of prompt. <strong>System prompts</strong> set behaviour, tone and constraints. <strong>User prompts</strong> ask for a specific response. To keep a conversation consistent, applications include the <strong>conversation history</strong> in later prompts. To add facts the model was never trained on, applications use <strong>retrieval-augmented generation (RAG)</strong>: they search a trusted source, add what they find to the prompt, and the model's answer is <strong>grounded</strong> in that information.</p>
<p>Microsoft's tips for better prompts: be <strong>clear and specific</strong>, add <strong>context</strong> (topic, audience, format), give <strong>examples</strong> of what you want, and ask for <strong>structure</strong> such as bullet points or a table.</p>`,
  how: `<p>Before a model reads anything, text is split into <strong>tokens</strong> and each token becomes a number. The model turns tokens into <strong>embeddings</strong> - lists of numbers in which tokens used in similar ways end up close together - and its <strong>attention</strong> layers weigh how much each earlier token should influence the next one. Everything counts against the <strong>context window</strong>: long histories and big retrieved documents leave less room for the answer, and every token in and out is billed.</p>
<p>Embeddings also power retrieval: convert documents and the question into embeddings, and the closest document vectors are the most relevant passages to add to the prompt.</p>`,
  ms: `<p>In the <strong>Foundry playground</strong> you set <strong>system instructions</strong>, <strong>temperature</strong> and <strong>max output tokens</strong>, then test user prompts. In code, the same settings go into a <strong>Responses API</strong> call, and you keep context either by resending earlier turns or by passing the previous response's ID. For grounding, Foundry agents can use <strong>knowledge</strong> - file search, or <strong>Foundry IQ</strong> knowledge bases that return citation-backed content.</p>`,
  compare: ['prompt-parts', 'context-vs-grounding'],
  distinctions: `<p><strong>System prompt versus user prompt.</strong> Rules that should apply to every answer ("only answer questions about our products", "respond in under 100 words") belong in the system prompt. The specific request belongs in the user prompt.</p>
<p><strong>Grounding versus fine-tuning.</strong> If the model lacks information, retrieve it and add it to the prompt. Fine-tuning changes how a model behaves; it is not the usual way to give it today's facts.</p>`,
  rai: `<p><em>Reliability:</em> grounding reduces made-up answers but does not eliminate them; instruct the model what to do when the data does not contain the answer. <em>Security:</em> users can try to override instructions ("ignore your rules") - Foundry's guardrails include prompt-attack detection. <em>Privacy:</em> anything placed in a prompt is sent to the model; do not include data the user is not allowed to see.</p>`,
  scenario: `<p>A bank's chat assistant must answer only questions about the bank's own accounts, in a friendly tone, citing the relevant policy. The scope and tone go in the system prompt, the relevant policy passages are retrieved and added to each prompt (RAG), and the customer's question is the user prompt.</p>`,
  explore: { widget: 'prompt', title: 'What the model actually receives',
    intro: 'Build a request from its parts and see the assembled context, a rough token count and a check against Microsoft\'s prompt tips. No model is called: the point is to see how much of the answer quality is decided before the model runs.' },
  observe: `<p>Turn off the retrieved policy and read the assembled context: nothing in it tells the model how much leave Contoso gives, so no model could answer correctly. Turn it back on and the answer is right there. Watch the token estimate grow with history and retrieved text - that is what fills a context window and drives cost.</p>`,
  check: [
    { q: 'A developer wants every response from a model to be in formal English and to decline questions unrelated to the company\'s products. Where should these rules go?', o: ['In each user prompt', 'In the system prompt (instructions)', 'In the deployment\'s rate limit', 'In the model\'s training data'], a: 1,
      why: 'Rules that apply to every answer - tone, scope, format - belong in the system prompt, which the application sets for every request.',
      not: ['Users would have to repeat the rules and could leave them out.', '', 'The rate limit controls throughput, not behaviour.', 'You cannot edit a deployed model\'s training data, and doing so is not how you set per-application behaviour.'],
      clue: '"every response"', obj: '2.1.1', area: 'genai' },
    { q: 'An HR assistant gives generic answers about leave because the model has never seen the company\'s policy. What should be added?', o: ['A higher temperature', 'Retrieval of the relevant policy text, added to the prompt (grounding)', 'More conversation history', 'A smaller model'], a: 1,
      why: 'The model lacks the facts. Retrieving the policy and adding it to the prompt grounds the answer in the company\'s own data.',
      not: ['Temperature changes variety, not knowledge.', '', 'History repeats what has already been said; it does not contain the policy.', 'A smaller model knows less, not more, about the company.'],
      clue: '"never seen the company\'s policy"', obj: '2.1.1', area: 'genai', misc: 'A better model will know your organization\'s private information.' },
    { q: 'A chat client answers the first question well, but on a follow-up such as "And what about part-time staff?" it has no idea what "that" refers to. Why?', o: ['The model forgot because its memory is full', 'The application did not send the earlier conversation with the new request', 'The temperature is too low', 'Follow-up questions require an agent'], a: 1,
      why: 'A model keeps nothing between requests. The application must resend history (or reference the previous response) for the model to follow the conversation.',
      not: ['There is no memory to fill: each request is processed on its own.', '', 'Temperature affects word choice, not whether context is present.', 'A plain chat client handles follow-ups fine once it includes the history.'],
      clue: '"first question well, follow-up fails"', obj: '2.1.3', area: 'genai' }
  ],
  teach: { prompt: 'Explain what a prompt does, and what the difference is between a system prompt and a user prompt.',
    points: ['A prompt is the input the model generates from', 'The system prompt sets role, rules and format for every answer', 'The user prompt is the specific request', 'History and retrieved data are also part of what the model receives'] },
  takeaways: [
    'A model sees only the context sent with each request: instructions, history, the user\'s message and retrieved data.',
    'System prompts set rules for every answer; user prompts ask for a specific one.',
    'Grounding (RAG) adds trusted data to the prompt so answers are based on it.',
    'Tokens are the unit of input, output, context limits and cost.'
  ]
});

/* ======================================================================
   00-11  AI applications
   ====================================================================== */
FOUND.push({
  id: '00-11', title: 'AI Applications: How Software Uses a Model', short: 'AI applications',
  scope: 'supports', supports: ['2.1.2', '2.1.3'], area: 'foundry',
  prereq: ['00-10'], learn: ['L2'], mods: ['02-01'],
  outcomes: [
    'Describe an AI application as a client that sends requests to a model deployment',
    'Name the parts of a request: endpoint, authentication, body; and of a response',
    'Explain why the deployment, not the model family, is what code refers to'
  ],
  problem: `<p>A model working nicely in a test page is not yet a product. Employees want it inside their intranet, customers want it in the mobile app, and the support team wants it inside their ticketing tool. Each of these is a different piece of software, and each needs a way to send the model a request and use what comes back.</p>`,
  plain: `<p>An <strong>AI application</strong> is ordinary software - a web page, a mobile app, a command-line script - that sends input to an AI service and does something useful with the result. The app is the <strong>client</strong>. The model it calls runs on a <strong>server</strong>; in Microsoft Foundry, that server is your <strong>model deployment</strong>.</p>`,
  example: `<p>A one-file Python script that asks for a question, sends it to a deployed model and prints the reply is a complete, if tiny, AI application. Microsoft Learn calls this a <strong>lightweight client</strong>: it collects input, calls a remote service, and displays results, while the heavy work happens on the server.</p>`,
  words: [
    ['Client application', 'The program a user interacts with; it sends requests and displays results'],
    ['Server (back end)', 'Where the request is processed; in Foundry, the model deployment'],
    ['Deployment', 'A model made available to call, under a name you choose'],
    ['Endpoint', 'The web address (URL) a client sends requests to'],
    ['Request / response', 'What the client sends (headers and a JSON body) and what comes back'],
    ['Key', 'A secret string that authenticates a request; must never be stored in code'],
    ['Microsoft Entra ID token', 'Proof of a signed-in identity, used instead of a key']
  ],
  model: function () { return vFlow([
    { t: 'User', s: 'types or speaks' },
    { t: 'Client app', s: 'builds the request', k: 'd2' },
    { t: 'Endpoint', s: 'URL + credentials' },
    { t: 'Model deployment', s: 'runs inference', k: 'acc' },
    { t: 'Response', s: 'JSON with the output', k: 'ok' },
    { t: 'Client app', s: 'shows the result', k: 'd2' }
  ], 'Simplified client-server model. Safety filters, instructions and logging run on the server side too.'); },
  concept: `<p>Microsoft Learn splits the work clearly. The <strong>client</strong> presents an interface, collects input, formats it as a prompt or API request, sends it to the model endpoint and displays the output. The <strong>server</strong> receives the prompt, runs inference, applies system instructions, safety and context, and returns the output - text, an image, audio or structured JSON.</p>`,
  how: `<p>Requests travel over HTTPS. Each has <strong>headers</strong> (including authentication and the data format) and a <strong>body</strong> in JSON - for a generative model, the deployment name and the input. The response comes back as JSON too; for the Responses API, the generated text sits inside an <code>output</code> list, and SDKs expose it directly as <code>output_text</code>.</p>
<p>Endpoints are protected: a request must carry either an API <strong>key</strong> or a <strong>Microsoft Entra ID</strong> token. Keys are secrets, so they belong in a secure store such as Azure Key Vault, never in code or a repository. Some Foundry endpoints, including the project endpoint used by the Foundry SDK, accept only Entra ID.</p>`,
  ms: `<p>In Foundry you <strong>deploy</strong> a model from the catalog into your project, test it in the <strong>playground</strong>, then use <strong>View code</strong> to get a starting point for your own client. Two endpoints matter: the <strong>project endpoint</strong> for working with the project and its agents, and <strong>model endpoints</strong> for sending prompts to deployments. In code, the <code>model</code> value you send is your <strong>deployment name</strong>.</p>`,
  compare: ['resource-vs-project'],
  distinctions: `<p><strong>Model versus deployment.</strong> "gpt-4.1" is a model in the catalog. "support-chat" might be your deployment of it, with its own settings and limits. Your code calls the deployment.</p>
<p><strong>Key versus Entra ID.</strong> A key is a shared secret: anyone holding it can call the endpoint. Entra ID ties each call to an identity that can be given only the access it needs.</p>`,
  rai: `<p><em>Security:</em> a leaked key lets anyone run up usage on your resource; prefer Entra ID and managed identities, and keep keys in Key Vault. <em>Accountability:</em> identity-based access records who called what. <em>Transparency:</em> the client is where you tell users they are talking to AI.</p>`,
  scenario: `<p>A team builds a small internal tool: a web page where staff paste a paragraph and get a plain-language rewrite. The page is the client; it sends the paragraph to a model deployment in their Foundry project, authenticating with the web app's managed identity rather than a key, and shows the rewrite it gets back.</p>`,
  explore: { widget: 'request', title: 'Inside a request and a response',
    intro: 'Change the question, the deployment name or the authentication method and watch the HTTP request change. The response is an illustrative example in the shape Microsoft Learn documents for the Responses API; no request is actually sent.' },
  observe: `<p>Find three things: the <strong>endpoint</strong> URL, the <strong>Authorization</strong> header, and the <code>"model"</code> field holding your deployment name. In the response, follow <code>output</code> &rarr; <code>content</code> &rarr; <code>text</code> to the generated answer. An SDK simply builds the first part for you and hands you the last part as <code>output_text</code>.</p>`,
  check: [
    { q: 'In a Foundry chat client, what does the value passed as model in a Responses API call refer to?', o: ['The model family name in the catalog', 'The name of your model deployment', 'The Foundry resource name', 'The Azure subscription ID'], a: 1,
      why: 'Client code calls a deployment, so the model value is the deployment name you chose when deploying.',
      not: ['The catalog name identifies the model in general; your code calls your specific deployment of it.', '', 'The resource name is part of the endpoint URL, not the model value.', 'The subscription ID is never sent as the model.'],
      clue: '"passed as model"', obj: '2.1.2', area: 'foundry', misc: 'Code calls the model by its catalog name.' },
    { q: 'Which responsibility belongs to the client application rather than the model deployment?', o: ['Running inference on the model', 'Applying the deployment\'s content filters', 'Collecting the user\'s input and displaying the result', 'Adjusting the model\'s parameters'], a: 2,
      why: 'Microsoft Learn assigns input collection, request formatting and display to the client; inference and safety happen on the server.',
      not: ['Inference runs on the server, in the deployment.', 'Guardrails are applied by the service, not the client.', '', 'Parameters are fixed by training; neither side adjusts them per request.'],
      clue: '"client application rather than the model deployment"', obj: '2.1.3', area: 'foundry' },
    { q: 'A developer pastes the Foundry resource key into a Python script stored in a public repository. What is the main risk?', o: ['The script will run more slowly', 'Anyone who finds the key can call the endpoint and run up charges on the resource', 'The model will stop accepting prompts', 'Nothing, because keys expire after each request'], a: 1,
      why: 'A key is a bearer secret: whoever holds it can call the service. Keys belong in a secure store such as Key Vault, or should be replaced with Entra ID.',
      not: ['Where a key is stored has no effect on speed.', '', 'The model keeps working - for whoever has the key.', 'Keys do not expire per request; they stay valid until regenerated.'],
      clue: '"public repository"', obj: '1.1.3', area: 'rai' }
  ],
  teach: { prompt: 'Describe, step by step, what happens between a user typing a question into a chat app and the answer appearing on screen.',
    points: ['The client builds a request with the input and deployment name', 'It authenticates with a key or Entra ID token at the endpoint', 'The deployment runs inference and applies safety', 'The response JSON comes back and the client displays the text'] },
  takeaways: [
    'An AI application is a client that sends requests to a model deployment and uses the response.',
    'Requests carry an endpoint, authentication and a JSON body; responses return JSON with the output.',
    'Your code refers to a deployment name, not a catalog model name.',
    'Protect keys as secrets, or use Microsoft Entra ID instead.'
  ]
});

/* ======================================================================
   00-12  AI agents
   ====================================================================== */
FOUND.push({
  id: '00-12', title: 'AI Agents: Models That Use Tools', short: 'AI agents',
  scope: 'supports', supports: ['1.3.1', '2.1.4', '2.1.5'], area: 'agents',
  prereq: ['00-10', '00-11'], learn: ['L3', 'L8'], mods: ['02-02'],
  outcomes: [
    'Describe an agent as a model plus instructions plus tools',
    'Tell a generative AI application and an agent apart',
    'Explain why tool permissions, grounding and human approval matter'
  ],
  problem: `<p>A customer writes: <em>"Where is my order 1042, and can you change the delivery address to my office?"</em> A chat model on its own cannot answer. It has never seen order 1042 and it has no way to change anything. It can only write text that sounds like an answer - which is worse than no answer.</p>`,
  plain: `<p>An <strong>AI agent</strong> is an application built on a generative model that can also <strong>use tools</strong>. Given a request, the model decides whether a tool would help - look up the order, search the policy documents, call the address-change API - uses it, reads the result, and then answers or acts. Microsoft Learn describes three parts: a <strong>model</strong>, <strong>instructions</strong> (a system prompt that defines its role), and <strong>tools</strong>.</p>`,
  example: `<p>A travel assistant that checks real flight availability and books a seat is an agent. A chat page that explains how airline baggage rules usually work, from what its model learned, is a generative AI application but not an agent: it uses no tools.</p>`,
  words: [
    ['Agent', 'An application built on a generative model that can use tools to complete tasks'],
    ['Instructions', 'The agent\'s system prompt: its role, behaviour and limits'],
    ['Tool', 'Something the agent can call to get information or take an action'],
    ['Knowledge tool', 'Gives access to information: search, documents, databases'],
    ['Action tool', 'Does something: sends an email, updates a record, calls an API'],
    ['Function calling', 'The model asks the application to run a specific function with specific arguments'],
    ['Multi-agent system', 'Several agents, each with a specialty, working together']
  ],
  model: function () { return vAgent([
    { t: 'Search', s: 'web or documents' },
    { t: 'Data', s: 'a database or knowledge base' },
    { t: 'API', s: 'an order or booking system' },
    { t: 'Application', s: 'email, calendar, code interpreter' }
  ], 'Simplified teaching model. The model does not run tools itself: it asks for a tool call, the agent runtime executes it, and the result goes back to the model.'); },
  concept: `<p>The difference between a generative application and an agent is <strong>tools</strong>. Plain generative interaction is <em>prompt in, response out</em>. An agent adds a loop: the model sees descriptions of the tools it is allowed to use, can request one, receives the tool's result, and continues until it can respond. Microsoft's summary: <em>tools are actions, knowledge is context</em>. Agents can also collaborate in <strong>multi-agent systems</strong>, each handling part of a larger task.</p>`,
  how: `<p>Each tool comes with a description of what it does and what inputs it needs. When a request arrives, the model produces either a normal answer or a structured <strong>tool call</strong> ("call get_order with order_id 1042"). The agent runtime runs the call with the permissions it has been given and returns the result to the model, which may call another tool or write the final answer. Grounding works the same way: a knowledge tool retrieves relevant content and the answer can cite it.</p>`,
  ms: `<p><strong>Foundry Agent Service</strong> hosts agents. In the Foundry portal you create a <strong>prompt agent</strong> by choosing a model, writing instructions and attaching tools - for example <strong>web search</strong>, <strong>file search</strong>, <strong>code interpreter</strong>, custom <strong>functions</strong> or <strong>OpenAPI</strong> tools - and knowledge through <strong>Foundry IQ</strong>. You test it in the playground, save it, and call it from a client application by referencing the agent by name through the Foundry SDK.</p>`,
  compare: ['app-vs-agent', 'context-vs-grounding'],
  distinctions: `<p><strong>Generative application versus agent.</strong> If the scenario needs only generated text from the model's own training, it is a generative application. If it must look things up in live systems or act on the world, it is an agent.</p>
<p><strong>Knowledge versus action tools.</strong> Reading the order status is knowledge; changing the address is an action, and actions deserve stricter control.</p>`,
  rai: `<p><em>Accountability and safety:</em> give an agent only the tools and permissions its job needs, and require a person to approve consequential actions such as payments or deletions. <em>Reliability:</em> tool results can be wrong or malicious - Foundry guardrails can scan tool calls and tool responses (preview). <em>Transparency:</em> grounded answers should cite their sources.</p>`,
  scenario: `<p>An IT help desk wants an assistant that answers questions from internal how-to documents and can reset a user's password after confirming their identity. Answering from documents needs a knowledge tool; resetting the password needs an action tool, with identity checks and approval rules. Together, that is an agent.</p>`,
  explore: { widget: 'agent', title: 'Step through an agent',
    intro: 'Pick a request and choose which tools the agent has. Then step through what happens. The steps are scripted to show the pattern Foundry agents follow; no model is running. Try removing a tool, and try requiring approval for actions.' },
  observe: `<p>Without the Orders API the agent cannot know where order 1042 is - and a well-instructed agent says so instead of inventing an answer. With approval required, the address change pauses for a person. Notice that the tool result goes back to the model before the user sees anything: the model writes the answer from the tool's data.</p>`,
  check: [
    { q: 'A solution must check live stock levels in a warehouse system and then place a reorder when stock is low, using an AI model to decide what to do. Which concept describes it?', o: ['A generative AI application with a longer prompt', 'An AI agent that uses tools', 'Sentiment analysis', 'Information extraction'], a: 1,
      why: 'The model must call external systems - read stock, place an order. A model that decides when to use tools is an agent.',
      not: ['A longer prompt adds text, but cannot read a live system or place an order.', '', 'Sentiment classifies opinion in text.', 'Extraction pulls fields from content; it does not take actions.'],
      clue: '"check live stock" and "place a reorder"', obj: '1.3.1', area: 'agents', misc: 'Any chat-based solution is an agent.' },
    { q: 'An agent must answer employees\' questions using the company\'s internal policy PDFs. What should be added to it?', o: ['The web search tool', 'A file search or knowledge tool with the policy documents', 'A higher temperature', 'An image-generation model'], a: 1,
      why: 'Internal documents are reached through a knowledge tool such as file search or a Foundry IQ knowledge base, which grounds answers in them.',
      not: ['Web search finds public internet content, not internal PDFs.', '', 'Temperature changes variety, not what the agent knows.', 'Nothing visual needs creating.'],
      clue: '"internal policy PDFs"', obj: '2.1.4', area: 'agents' },
    { q: 'Which three parts does Microsoft Learn identify in an AI agent?', o: ['A model, instructions and tools', 'A keyboard, a screen and a database', 'An OCR engine, a schema and a validator', 'Training data, labels and clusters'], a: 0,
      why: 'An agent combines a generative model, instructions that define its role, and tools it can use.',
      not: ['', 'Those are parts of a computer, not of an agent.', 'Those describe an information-extraction pipeline.', 'Those are machine learning training concepts.'],
      clue: '"three parts"', obj: '2.1.4', area: 'agents' }
  ],
  teach: { prompt: 'Explain the difference between a generative AI application and an AI agent, with one example of each.',
    points: ['A generative app: prompt in, response out, from the model alone', 'An agent: model + instructions + tools', 'The model decides when to call a tool; the result goes back to the model', 'Tools need limited permissions and approval for consequential actions'] },
  takeaways: [
    'An agent is a model plus instructions plus tools.',
    'Tools let it retrieve information (knowledge) or act (actions); results go back to the model.',
    'In Foundry: create a prompt agent in the portal, attach tools and knowledge, call it from code by name.',
    'Limit tool permissions and keep a person in the loop for consequential actions.'
  ]
});
