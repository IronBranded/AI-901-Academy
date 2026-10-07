/* Module 0 - Part 4: building blocks, responsibility, synthesis (00-13 to 00-17).
   Grounded in Microsoft Learn "Get started with AI in Azure" (Azure structure,
   endpoints, REST example), "Get started with generative AI and agents in
   Azure" (Python clients), "Introduction to AI concepts" (responsible AI) and
   the Azure CLI reference for Foundry model deployments. */

/* ======================================================================
   00-13  APIs, SDKs and CLIs
   ====================================================================== */
FOUND.push({
  id: '00-13', title: 'APIs, SDKs and CLIs', short: 'APIs, SDKs, CLIs',
  scope: 'supports', supports: ['2.1.3', '2.1.5', '2.2.1', '2.4.4'], area: 'foundry',
  prereq: ['00-11'], learn: ['L2'], mods: ['ENV', '02-01'],
  outcomes: [
    'Explain an API, a REST API, an SDK and a CLI in plain terms',
    'Recognize the same Foundry task done through REST and through the Python SDK',
    'Tell managing Azure resources (control plane) apart from using a model (data plane)'
  ],
  problem: `<p>Three colleagues all "talk to Foundry". One sends web requests from a tool that has no Azure library. One writes Python. One types commands in a terminal to create resources before anyone can build anything. They are using an <strong>API</strong>, an <strong>SDK</strong> and a <strong>CLI</strong> - three doors into the same service.</p>`,
  plain: `<p>An <strong>API</strong> (application programming interface) is a defined way for one piece of software to ask another for something: which requests you may make, what data to send and what comes back. A <strong>REST API</strong> does this over ordinary web requests: a URL, a method such as POST, headers, and a JSON body. An <strong>SDK</strong> (software development kit) is a library for a programming language that builds those requests for you. A <strong>CLI</strong> (command-line interface) lets you type commands - in Azure, mostly to create and manage resources.</p>`,
  example: `<p>Ordering food: the restaurant's menu and order form are the API. Phoning the order in with exact wording is REST. Using the restaurant's app, which fills in the form for you, is the SDK. Calling the manager to open a new branch is closer to the CLI: managing the business rather than ordering a meal. (An analogy only - the precise definitions are above.)</p>`,
  words: [
    ['API', 'A defined way for software to make requests to a service and get responses'],
    ['REST', 'An API style built on web requests: URL, HTTP method, headers, JSON body'],
    ['HTTP method', 'The verb of a web request, such as GET (read) or POST (send data)'],
    ['JSON', 'A text format for structured data: {"name": "value"}'],
    ['SDK (client library)', 'Code for a programming language that builds and sends API requests for you'],
    ['CLI', 'A text-based tool where typed commands act on services; the Azure CLI command is az'],
    ['Control plane / data plane', 'Managing resources (create, configure, delete) versus using them (call a model)']
  ],
  model: function () { return vFlow([
    { t: 'Your code or commands', s: 'what you write' },
    { t: 'REST, SDK or CLI', s: 'three ways in', k: 'd2' },
    { t: 'Endpoint', s: 'URL + credentials' },
    { t: 'Azure / Foundry', s: 'the service', k: 'acc' }
  ], 'Simplified teaching model. SDKs and the CLI both end up sending REST requests; they save you from writing them by hand.'); },
  concept: `<p>Microsoft Learn notes that Foundry resources are consumed as APIs through <strong>endpoints</strong>, and that these are REST interfaces. Most developers prefer <strong>SDKs</strong>, which wrap the REST interface in a library for Python, JavaScript, C# or Java. The AI-901 study guide states that you should be familiar with REST APIs, SDKs and CLIs.</p>
<p>The CLI is usually about the <strong>control plane</strong>: creating a Foundry resource, deploying a model, listing deployments. Sending prompts to a model is <strong>data plane</strong> work, done with REST or an SDK.</p>`,
  how: `<p>All three need the same three things: <strong>where</strong> (the endpoint), <strong>who</strong> (a key or a Microsoft Entra ID token), and <strong>what</strong> (the request). The REST version spells them out in full; the SDK version reads them from your environment and objects; the CLI version uses the identity you signed in with (<code>az login</code>).</p>`,
  ms: `<p>For AI-901: the <strong>Foundry SDK</strong> for Python is the <code>azure-ai-projects</code> package (with <code>azure-identity</code> for sign-in), which gives you a project client and an OpenAI-compatible client for the <strong>Responses API</strong>. The <strong>Azure CLI</strong> manages resources, for example <code>az cognitiveservices account deployment list</code> to list a Foundry resource's model deployments. Foundry Tools such as Azure Language, Azure Speech and Content Understanding have their own client libraries and REST APIs.</p>`,
  visual: function () { return '<div data-widget="codewalk" data-set="three-ways"></div>'; },
  compare: ['api-sdk-cli'],
  distinctions: `<p><strong>REST versus SDK</strong> is about convenience, not capability: the SDK sends REST requests for you. Choose REST when no SDK exists for your language or you need full control.</p>
<p><strong>CLI versus SDK</strong> is mostly about purpose: the CLI is for people and scripts managing Azure; the SDK is for applications using the service.</p>`,
  rai: `<p><em>Security:</em> whichever door you use, credentials are the key to it. Prefer Microsoft Entra ID; when a key is unavoidable, read it from a secure store or environment variable rather than writing it into code or commands that end up in a repository.</p>`,
  scenario: `<p>A platform engineer scripts the creation of a Foundry resource and two model deployments for every new team, while the teams' web apps call those deployments from Python. The engineer's script uses the Azure CLI (control plane); the web apps use the Foundry SDK (data plane).</p>`,
  explore: { widget: 'sorter', title: 'REST, SDK or CLI?', data: 'api-sdk-cli',
    intro: 'Read the same task in three forms in the walkthrough above, then decide which door fits each situation below.' },
  observe: `<p>The REST request and the Python code ask the model the same question. The difference is how much you write yourself. The CLI line does something else entirely: it reports what is deployed. That control-plane versus data-plane split is worth remembering.</p>`,
  check: [
    { q: 'A developer\'s app runs on a platform with no Azure SDK available, but it can send HTTPS requests. How can it call a Foundry model deployment?', o: ['It cannot; Foundry requires the Python SDK', 'By sending REST requests to the endpoint with the right headers and JSON body', 'By running Azure CLI commands from inside the app', 'By emailing the prompt to the deployment'], a: 1,
      why: 'Foundry endpoints are REST interfaces. Any software that can make HTTPS requests can call them; SDKs are a convenience, not a requirement.',
      not: ['SDKs make calls easier but are not required.', '', 'The CLI manages resources; it is not a way for an app to chat with a model.', 'Deployments accept API requests, not email.'],
      clue: '"no Azure SDK" but "can send HTTPS requests"', obj: '2.1.3', area: 'foundry', misc: 'You need an SDK to use a cloud AI service.' },
    { q: 'An administrator wants a repeatable script that lists every model deployment on a Foundry resource. Which tool fits best?', o: ['The Azure CLI', 'Speech synthesis markup', 'A system prompt', 'The Foundry playground'], a: 0,
      why: 'Listing deployments is control-plane management, which the Azure CLI does with az cognitiveservices account deployment list.',
      not: ['', 'SSML controls synthetic speech; it has nothing to do with resources.', 'A system prompt shapes a model\'s answers; it cannot enumerate Azure resources.', 'The playground is for testing prompts interactively, not for repeatable scripts.'],
      clue: '"repeatable script" and "lists every deployment"', obj: '1.2.3', area: 'foundry' },
    { q: 'What does an SDK such as the Foundry SDK for Python do?', o: ['It trains the model on your data', 'It provides a library that builds and sends API requests for you', 'It replaces the need for an endpoint', 'It runs the model on your laptop instead of Azure'], a: 1,
      why: 'An SDK wraps the REST interface in a language-specific library, so you call methods instead of hand-writing requests.',
      not: ['Training is a separate process; the SDK is about calling services.', '', 'The SDK still sends requests to the service\'s endpoint.', 'The model still runs in Azure; the SDK only handles the communication.'],
      clue: '"what does an SDK do"', obj: '2.1.3', area: 'foundry' }
  ],
  teach: { prompt: 'Explain the difference between an API, an SDK and a CLI to someone who has never programmed.',
    points: ['An API is the agreed way to make requests to a service', 'REST does it with web requests and JSON', 'An SDK is a library that builds those requests for you', 'A CLI is typed commands, mostly for managing resources'] },
  takeaways: [
    'An API defines the requests a service accepts; REST APIs use URLs, methods, headers and JSON.',
    'An SDK builds the requests for you in your programming language.',
    'The Azure CLI is mostly for managing resources (control plane); apps use REST or SDKs to call models (data plane).',
    'Every route needs an endpoint, credentials and a request.'
  ]
});

/* ======================================================================
   00-14  Python primer
   ====================================================================== */
FOUND.push({
  id: '00-14', title: 'Python Primer: Reading an AI Client', short: 'Python primer',
  scope: 'foundation', supports: ['2.1.3', '2.1.5', '2.2.1', '2.2.3', '2.3.3', '2.4.4'], area: 'foundry',
  prereq: ['00-13'], learn: ['L2'], mods: ['02-01', '02-02', '02-03'],
  outcomes: [
    'Read a short Python client and say what it sends and what it prints',
    'Recognize imports, variables, environment variables, keyword arguments, lists, dictionaries and attributes',
    'Know what pip install and a virtual environment are for'
  ],
  problem: `<p>The AI-901 audience profile says you need knowledge of Python syntax, and the exam's implementation objectives describe "lightweight" applications - usually a single short Python file. You do not need to be a programmer. You need to read fifteen lines and know what they do.</p>`,
  plain: `<p>An AI client script almost always follows the same recipe: <strong>bring in tools</strong> (import), <strong>read settings</strong> (the endpoint, from the environment), <strong>create a client</strong> (an object that knows how to talk to the service), <strong>make a call</strong> (send input with some options), and <strong>use the result</strong> (print a field from the response).</p>`,
  example: `<p>The walkthrough below is the shape of the chat client in Microsoft Learn's AI-901 training: connect to a Foundry project with your Microsoft Entra identity, get an OpenAI-compatible client, send a prompt to a deployment, print the reply. Click each line to see what it means.</p>`,
  words: [
    ['import', 'Brings a library into the script so you can use it'],
    ['Variable', 'A name that holds a value: endpoint = "https://..."'],
    ['String', 'Text in quotes; an f-string such as f"Hi {name}" inserts values into text'],
    ['Environment variable', 'A setting stored outside the code, read with os.environ["NAME"]'],
    ['Function / method call', 'Running named code with arguments: client.responses.create(model=..., input=...)'],
    ['Keyword argument', 'An argument passed by name, such as temperature=0.2'],
    ['List and dictionary', '[a, b] is an ordered list; {"role": "user"} maps names to values'],
    ['Attribute', 'A value on an object, read with a dot: response.output_text'],
    ['pip / virtual environment', 'pip installs packages; a virtual environment keeps them separate per project']
  ],
  model: function () { return vFlow([
    { t: 'Import', s: 'libraries' },
    { t: 'Read settings', s: 'endpoint from the environment' },
    { t: 'Create client', s: 'with credentials', k: 'd2' },
    { t: 'Call', s: 'input + options', k: 'acc' },
    { t: 'Use result', s: 'print response.output_text', k: 'ok' }
  ], 'The recipe nearly every AI-901 client script follows, whether it calls a model, an agent, Speech or Content Understanding.'); },
  concept: `<p>Python reads top to bottom. Lines starting with <code>#</code> are comments. Indentation matters: lines indented under <code>with</code>, <code>for</code> or <code>def</code> belong to that block. Calls use parentheses, and arguments are often named (<code>model=...</code>), so you can read what each value is for. Results are objects: you reach inside them with dots (<code>response.output_text</code>) or with square brackets for lists and dictionaries (<code>items[0]</code>, <code>message["role"]</code>).</p>`,
  how: `<p>Before a script runs, its libraries are installed with <code>pip install</code>, ideally inside a <strong>virtual environment</strong> so each project has its own set. Settings such as the project endpoint are put in <strong>environment variables</strong> so the same code works on any machine and no secret is written into the file. <code>DefaultAzureCredential</code> then finds an identity to sign in with - your <code>az login</code> on a laptop, or a managed identity in Azure.</p>`,
  ms: `<p>The packages you will see most in AI-901 material are <code>azure-ai-projects</code> (the Foundry SDK: <code>AIProjectClient</code>), <code>azure-identity</code> (<code>DefaultAzureCredential</code>) and <code>openai</code> (the client returned by <code>get_openai_client()</code> for the Responses API). The same reading skills apply to the Speech SDK and the Content Understanding client.</p>`,
  visual: function () { return '<div data-widget="codewalk" data-set="chat-client"></div>'; },
  distinctions: `<p><strong>Reading versus writing code.</strong> AI-901 expects you to recognize what code does and to complete it - for example, which method gets an OpenAI client from a project, or which value goes in <code>model=</code>. You will not be asked to design a program.</p>`,
  rai: `<p><em>Security:</em> look for secrets in code. A key or password written directly into a script is a defect, wherever the script is going; settings belong in environment variables or a vault, and Entra ID removes the need for keys altogether.</p>`,
  scenario: `<p>A colleague's script prints "Connected" and then fails on the line that calls <code>responses.create</code>, with an error saying the deployment was not found. Reading the code, you see <code>model="gpt-4.1"</code> - the catalog name - while their deployment is called <code>chat-prod</code>. The value must be the deployment name.</p>`,
  explore: { widget: 'pyread', title: 'Predict what the code does',
    intro: 'Read each short snippet and choose what it does or prints. These are reading exercises: nothing is executed.' },
  observe: `<p>Each question used the same recipe: find the input, find the call, find which field of the result is used. If you can trace those three, you can read every client in the exam modules.</p>`,
  check: [
    { q: 'In the line response = openai_client.responses.create(model="chat-prod", input="Hello"), what is "chat-prod"?', o: ['The name of a Python package', 'The name of a model deployment', 'The user\'s prompt', 'An environment variable'], a: 1,
      why: 'The model argument names the deployment to call.',
      not: ['Packages are installed with pip and imported; they are not passed as model.', '', 'The prompt is the input argument, "Hello".', 'An environment variable would be read with os.environ["..."].'],
      clue: '"model=" keyword argument', obj: '2.1.3', area: 'foundry' },
    { q: 'Why do Microsoft\'s sample clients read the endpoint with os.environ["PROJECT_ENDPOINT"] instead of typing the URL into the script?', o: ['Python cannot store URLs in variables', 'So settings stay outside the code and the same script works in any environment without exposing configuration in the repository', 'Environment variables make the request faster', 'The SDK refuses URLs written in code'], a: 1,
      why: 'Environment variables keep configuration (and any secrets) out of source code, and let the same script run in different environments.',
      not: ['Python stores URLs in variables without any problem.', '', 'Where a value comes from has no effect on request speed.', 'The SDK accepts the endpoint however you provide it.'],
      clue: '"instead of typing the URL into the script"', obj: '2.1.3', area: 'foundry' },
    { q: 'What does print(response.output_text) display in a Foundry chat client?', o: ['The HTTP headers of the request', 'The generated text of the model\'s response', 'The deployment\'s rate limit', 'The user\'s original prompt'], a: 1,
      why: 'output_text is a convenience attribute on the response object that holds the generated text.',
      not: ['Headers are part of the request, not this attribute.', '', 'Rate limits are deployment settings, not in the response text.', 'The prompt is what was sent; output_text is what came back.'],
      clue: '"output_text"', obj: '2.1.3', area: 'foundry' }
  ],
  teach: { prompt: 'Walk through a five-line AI client script and explain what each line is for, in plain English.',
    points: ['Imports bring in the libraries', 'Settings come from environment variables', 'A client is created with credentials', 'A call sends input to a named deployment', 'A field of the result is printed'] },
  takeaways: [
    'AI-901 needs code reading, not software design.',
    'Most clients: import, read settings, create a client, call it, use the result.',
    'Named arguments tell you what each value is; dots and brackets reach into results.',
    'Settings and secrets live outside code; Entra ID avoids keys entirely.'
  ]
});

/* ======================================================================
   00-15  Azure resource primer
   ====================================================================== */
FOUND.push({
  id: '00-15', title: 'Azure Resource Primer: Where AI Lives', short: 'Azure resources',
  scope: 'supports', supports: ['1.2.3', '2.1.2'], area: 'foundry',
  prereq: ['00-11'], learn: ['L2'], mods: ['ENV', '01-02', '02-01'],
  outcomes: [
    'Describe tenant, subscription, resource group and resource',
    'Describe a Foundry resource and a Foundry project, and what lives in each',
    'Recognize region, quota and access control as settings that affect AI solutions'
  ],
  problem: `<p>Before you can deploy a single model, Azure asks you several questions: which subscription pays, which resource group it goes in, which region it runs in, and who may use it. If those words mean nothing yet, the Foundry portal's first screen is confusing for no good reason.</p>`,
  plain: `<p>Azure organizes everything in nested containers. Your organization's <strong>tenant</strong> is its home in Microsoft's cloud, holding users and identities. A <strong>subscription</strong> is a billing container. A <strong>resource group</strong> is a folder of related resources you manage together. A <strong>resource</strong> is one thing you create - a storage account, a database, or a <strong>Foundry resource</strong>. Inside a Foundry resource you create <strong>projects</strong>, and inside projects you deploy models and build agents.</p>`,
  example: `<p>A university's tenant holds every staff and student account. The research department's subscription pays for its cloud use. A resource group called "rg-chatbot" holds everything for one chatbot. In it, a Foundry resource provides the AI capability, and a project inside it holds the chatbot's model deployment and agent.</p>`,
  words: [
    ['Tenant', 'An organization\'s home in Microsoft\'s cloud: users, groups, identities and policies'],
    ['Subscription', 'A billing container for resources, with its own quotas and access control'],
    ['Resource group', 'A folder of related resources managed, secured and deleted together'],
    ['Resource', 'An individual service you create, such as a Foundry resource'],
    ['Region', 'The Azure location where a resource is deployed; affects which models are available'],
    ['Foundry resource', 'The Azure resource that provides models, the agent service, governance and security'],
    ['Foundry project', 'A workspace inside a Foundry resource for agents, evaluations, files, indexes and connections'],
    ['RBAC', 'Role-based access control: who can do what, at which level']
  ],
  model: function () { return vNest([
    { t: 'Tenant', s: 'your organization\'s identities' },
    { t: 'Subscription', s: 'billing and quotas', k: 'acc' },
    { t: 'Resource group', s: 'a folder for one solution', k: 'd2' },
    { t: 'Foundry resource', s: 'models, agent service, security boundary', k: 'd1' },
    { t: 'Foundry project', s: 'your workspace', k: 'ok', chips: ['model deployments', 'agents', 'files and indexes', 'evaluations', 'connections'] }
  ], 'Each box sits inside the one around it. Settings and permissions applied to an outer box flow down to what is inside.'); },
  concept: `<p>Microsoft Learn describes the Foundry resource as the <strong>Azure resource</strong> that provides the platform: access to models, Foundry's agent service, deployment governance, monitoring, security boundaries, quotas and operational controls. A <strong>Foundry project</strong> is a <strong>workspace</strong> inside it where you build agents, evaluations, files, vector indexes and connections. One team might have one Foundry resource and many projects, one per AI use case.</p>`,
  how: `<p>When you create a resource you choose its <strong>region</strong> (which also affects which models you can deploy), its pricing tier and its access controls. Access is granted with <strong>roles</strong> at any level, and roles assigned higher up apply to everything below. Quotas - such as how many tokens per minute a subscription can use for a model in a region - also live at this level, which is why a deployment can fail even when the code is correct.</p>`,
  ms: `<p>You can create a Foundry resource and project in the <strong>Foundry portal</strong>, the <strong>Azure portal</strong>, or programmatically with the CLI or templates. The Azure portal is where you see the resource group, costs and access control; the Foundry portal is where you work with models, agents and tools.</p>`,
  compare: ['resource-vs-project'],
  distinctions: `<p><strong>Foundry resource versus project.</strong> The resource is the Azure object that provides capabilities and holds the security and billing boundary. The project is the workspace where a team builds one solution.</p>
<p><strong>Resource group versus subscription.</strong> The subscription pays; the resource group organizes. Deleting a resource group deletes everything in it - a convenient way to clean up a lab.</p>`,
  rai: `<p><em>Accountability and security:</em> the hierarchy is where governance lives - who owns each subscription, who can deploy models, which policies apply. Grant the narrowest role that does the job, at the narrowest level.</p>`,
  scenario: `<p>A company wants each product team to experiment with AI separately, but with one place to manage security, networking and cost. One Foundry resource with a project per team fits: shared governance at the resource, separate workspaces in the projects.</p>`,
  explore: { widget: 'hierarchy', title: 'Explore the hierarchy',
    intro: 'Select each level to see what it is, what you decide there, and why it matters for an AI solution. Open all six to finish.' },
  observe: `<p>Notice where each decision lives: who pays (subscription), what gets cleaned up together (resource group), where data is processed and which models exist (the region of the resource), and what one team works on (project).</p>`,
  check: [
    { q: 'A team wants a workspace in which to build and test its own agents and evaluations, under the security and networking settings the organization already configured. What should it create?', o: ['A new Azure tenant', 'A Foundry project inside the existing Foundry resource', 'A new subscription', 'A resource group with no resources'], a: 1,
      why: 'A project is the workspace for agents, evaluations, files and connections, and it inherits settings from its parent Foundry resource.',
      not: ['A tenant is an entire organization\'s identity boundary - far too large.', '', 'A subscription is a billing container; it would not give the team a workspace by itself.', 'An empty resource group provides no AI capability.'],
      clue: '"workspace" and "settings already configured"', obj: '2.1.2', area: 'foundry' },
    { q: 'Which Azure container is primarily a billing boundary for resources?', o: ['Resource group', 'Subscription', 'Foundry project', 'Deployment'], a: 1,
      why: 'A subscription ties usage to a payment method and sets boundaries for cost, quotas and access.',
      not: ['A resource group organizes resources; billing rolls up to the subscription.', '', 'A project is a workspace inside a Foundry resource.', 'A deployment makes one model callable; it is not a billing container.'],
      clue: '"billing boundary"', obj: null, area: 'foundry' },
    { q: 'A model you want is not offered when you try to deploy it. Which resource setting is the most likely reason?', o: ['The resource group name', 'The region of the Foundry resource', 'The project description', 'The colour theme of the portal'], a: 1,
      why: 'Model availability varies by region, so the region chosen for the Foundry resource determines what you can deploy.',
      not: ['Resource group names have no effect on available models.', '', 'Descriptions are labels only.', 'Portal appearance has nothing to do with model availability.'],
      clue: '"not offered"', obj: '1.2.3', area: 'models' }
  ],
  teach: { prompt: 'Explain the difference between a Foundry resource and a Foundry project, and where each sits in Azure.',
    points: ['Tenant > subscription > resource group > resource', 'The Foundry resource provides models, agent service and the security boundary', 'A project is a workspace inside it for one solution', 'Region and roles are set at the resource level and flow down'] },
  takeaways: [
    'Tenant (identity) > subscription (billing) > resource group (folder) > resource.',
    'A Foundry resource provides the AI platform; projects are workspaces inside it.',
    'Region affects which models you can deploy; quotas and roles affect what succeeds.',
    'Deleting a resource group removes everything in it.'
  ]
});

/* ======================================================================
   00-16  Responsible AI
   ====================================================================== */
FOUND.push({
  id: '00-16', title: 'Responsible AI: Why Accuracy Is Not Enough', short: 'Responsible AI',
  scope: 'supports', supports: ['1.1.1', '1.1.2', '1.1.3', '1.1.4', '1.1.5', '1.1.6'], area: 'rai',
  prereq: ['00-03'], learn: ['L1'], mods: ['01-01'],
  outcomes: [
    'Name Microsoft\'s six responsible AI principles and the question each one asks',
    'Match a scenario to the principle it concerns, including the neighbouring principle it is not',
    'Connect each principle to a practical measure'
  ],
  problem: `<p>A lender's new approval model is 95% accurate on test data. Six months later, an analysis shows that applicants from two neighbourhoods with similar finances to everyone else are declined twice as often. Nobody wrote a biased rule. The model learned the pattern from historical decisions. The model was accurate - and still harmful.</p>`,
  plain: `<p><strong>Responsible AI</strong> is the practice of designing, building and running AI so that it does not cause harm, from the first idea to everyday operation. Microsoft frames it as six principles. Four describe how the system behaves: <strong>fairness</strong>, <strong>reliability and safety</strong>, <strong>privacy and security</strong>, and <strong>inclusiveness</strong>. Two underpin all of them: <strong>transparency</strong> and <strong>accountability</strong>.</p>`,
  example: `<p>Microsoft Learn's own examples: an admissions system tested so it judges applications on relevant criteria only (fairness); a robot that will not act when its object detection is below a confidence threshold (reliability and safety); an airport face-recognition system that deletes images as soon as they are no longer needed (privacy and security); a speech-based agent that also shows captions (inclusiveness); a bank that tells customers AI is used in loan decisions and describes its training data (transparency); and a governance framework that makes the organization answerable (accountability).</p>`,
  words: [
    ['Fairness', 'Similar people get similar outcomes; bias in data does not become discrimination'],
    ['Reliability and safety', 'The system behaves as intended, including in unusual conditions, and fails safely'],
    ['Privacy and security', 'Personal and organizational data is protected; the system resists misuse'],
    ['Inclusiveness', 'Everyone can use and benefit from it, including people with disabilities'],
    ['Transparency', 'People understand that AI is involved, how it works and its limits'],
    ['Accountability', 'People and organizations answer for the system, through governance'],
    ['Guardrails', 'Controls that detect and block harmful input or output, such as content filters']
  ],
  model: function () { return vPillars([
    { t: 'Fairness', s: 'Do similar people get similar outcomes?' },
    { t: 'Reliability and safety', s: 'Does it behave as intended, even when conditions are unusual?' },
    { t: 'Privacy and security', s: 'Is data protected, and does it resist attack?' },
    { t: 'Inclusiveness', s: 'Can everyone use it?' }
  ], [
    { t: 'Transparency', s: 'Do people understand what it is and what it cannot do?' },
    { t: 'Accountability', s: 'Who answers for it?' }
  ], 'Four behaviours on a two-part foundation. Learn the question each principle asks; exam scenarios describe the situation, not the principle\'s name.'); },
  concept: `<p>The principles come from how AI is built. Models learn from data selected by people, so <strong>fairness</strong> is at risk when that data carries bias. Models are probabilistic, so <strong>reliability and safety</strong> require testing and thresholds. Data may include personal information, so <strong>privacy and security</strong> covers both the training data and what the model might reveal. Solutions should not exclude anyone, hence <strong>inclusiveness</strong>. AI can feel like magic, so <strong>transparency</strong> means explaining how it works and its limits. And because the system cannot be held responsible, <strong>accountability</strong> sits with the people and organizations that build and run it.</p>`,
  how: `<p>Responsible AI is applied across the whole lifecycle: decide whether AI is appropriate at all, examine the data, test for errors and unequal outcomes, add guardrails, disclose AI use, monitor in operation, and keep a named owner. Content filters are one tool among many, not the whole answer.</p>`,
  ms: `<p>In Microsoft Foundry: <strong>guardrails</strong> (powered by Azure AI Content Safety) scan user input and model output for categories such as hate, sexual content, violence and self-harm, and for prompt attacks; <strong>evaluators</strong> score outputs for quality and safety, including bias; <strong>model cards</strong> and transparency documentation describe each model's limits; <strong>Microsoft Entra ID and RBAC</strong> control access; and generated images carry <strong>Content Credentials</strong>.</p>`,
  compare: ['rai-neighbours'],
  distinctions: `<p><strong>Fairness versus inclusiveness.</strong> Fairness is about outcomes for people the system makes decisions about. Inclusiveness is about who can use the system at all.</p>
<p><strong>Transparency versus accountability.</strong> Transparency: people understand the system. Accountability: specific people answer for it. Telling users that AI is involved is transparency; naming an owner who signs off each release is accountability.</p>
<p><strong>Reliability and safety versus privacy and security.</strong> The first is about the system doing the right thing; the second is about protecting data and resisting attackers.</p>`,
  rai: `<p>This whole lesson is the responsible AI lens. From here on, each lesson's lens section points to the principles most at stake for that kind of AI.</p>`,
  scenario: `<p>A job-application screening tool must: work with screen readers (inclusiveness); give comparable candidates comparable scores regardless of gender (fairness); tell candidates that AI assists the screening (transparency); never expose other applicants' CVs (privacy and security); have a named HR owner who reviews its results quarterly (accountability); and refuse to score when the CV cannot be read reliably (reliability and safety).</p>`,
  explore: { widget: 'sorter', title: 'Which principle is it?', data: 'rai',
    intro: 'Each card describes a requirement or a problem. Choose the principle it concerns. The explanations point out the neighbouring principle that is easy to confuse.' },
  observe: `<p>Most mistakes come from the pairs: fairness and inclusiveness, transparency and accountability. Ask the principle's question - <em>who gets which outcome?</em>, <em>who can use it?</em>, <em>do people understand it?</em>, <em>who answers for it?</em> - and the answer usually becomes clear.</p>`,
  check: [
    { q: 'A recruiting model trained on ten years of hiring decisions scores applicants from some universities consistently lower, even with matching experience. Which principle is most directly at risk?', o: ['Inclusiveness', 'Fairness', 'Transparency', 'Privacy and security'], a: 1,
      why: 'Comparable people receiving different outcomes, inherited from historical data, is a fairness problem.',
      not: ['Inclusiveness is about whether people can use the system; these applicants can use it, but are scored unequally.', '', 'Explaining the model would not stop it treating the groups differently.', 'No data is exposed or attacked here.'],
      clue: '"matching experience" but "consistently lower"', obj: '1.1.1', area: 'rai', misc: 'Fairness and inclusiveness are the same principle.' },
    { q: 'A bank must tell customers that an AI system helps decide loan applications, and describe what data it uses. Which principle does this address?', o: ['Accountability', 'Transparency', 'Reliability and safety', 'Fairness'], a: 1,
      why: 'Making people aware that AI is used, how it works and what its limits are is transparency.',
      not: ['Accountability is about who answers for the system, not what customers are told.', '', 'Reliability concerns whether the system behaves as intended.', 'Fairness concerns equitable outcomes, which disclosure alone does not ensure.'],
      clue: '"tell customers that an AI system helps decide"', obj: '1.1.5', area: 'rai', misc: 'Transparency and accountability are interchangeable.' },
    { q: 'A voice assistant also displays its answers as text so that people with hearing loss can use it. Which principle does this support?', o: ['Inclusiveness', 'Privacy and security', 'Accountability', 'Fairness'], a: 0,
      why: 'Designing so that people with disabilities are not excluded is inclusiveness.',
      not: ['', 'Captions do not protect data.', 'Captions do not establish who is answerable.', 'Fairness is about outcomes for people the system decides about; this is about access to the system.'],
      clue: '"so that people with hearing loss can use it"', obj: '1.1.4', area: 'rai' }
  ],
  teach: { prompt: 'Explain why a highly accurate AI system can still be irresponsible. Use one principle in your answer.',
    points: ['Accuracy is an average; errors can fall on particular groups', 'Accurate systems can still leak data, exclude users or be misunderstood', 'Responsibility applies across the lifecycle, not only in testing', 'People, not the model, are accountable'] },
  takeaways: [
    'Six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability.',
    'Learn the question each asks; scenarios describe situations, not principle names.',
    'The confusable pairs are fairness/inclusiveness and transparency/accountability.',
    'Foundry supports the principles with guardrails, evaluators, model documentation, access control and Content Credentials.'
  ]
});

/* ======================================================================
   00-17  Putting it together
   ====================================================================== */
FOUND.push({
  id: '00-17', title: 'Putting It Together: One Solution, Many Capabilities', short: 'Putting it together',
  scope: 'supports', supports: ['1.3.1'], area: 'workloads',
  prereq: ['00-12', '00-16'], learn: ['L1', 'L8'], mods: ['01-03'],
  outcomes: [
    'Break a realistic scenario into AI capabilities, from input and output',
    'Map each capability to its Microsoft implementation',
    'Place responsible AI controls in the end-to-end flow'
  ],
  problem: `<p>A museum wants an app in which visitors photograph an exhibit, ask about it out loud, and hear an answer based on the museum's own catalogue - and then buy a ticket for a related tour without leaving the conversation. No single capability does all of that.</p>`,
  plain: `<p>Real solutions combine capabilities. The skill AI-901 tests again and again is decomposition: for each step, ask <em>what goes in</em>, <em>what must come out</em>, and therefore <em>which capability</em> does the work. Products come last.</p>`,
  example: `<p>The museum app, step by step: the visitor's <strong>voice</strong> becomes text (speech recognition, or an audio-capable model); the <strong>photo</strong> is interpreted (a multimodal model); an <strong>agent</strong> combines both, retrieves the right catalogue entries (<strong>knowledge</strong> tool, grounding) and composes an answer (<strong>generative AI</strong>); a <strong>ticket</strong> is booked through an API (<strong>action</strong> tool, with confirmation); the answer is <strong>spoken</strong> back (speech synthesis).</p>`,
  words: [
    ['Decomposition', 'Splitting a scenario into steps, each with its own input, output and capability'],
    ['Orchestration', 'Coordinating several capabilities or tools in one solution; agents do this'],
    ['End to end', 'From the user\'s input to the final output, including everything in between']
  ],
  model: function () { return vFlow([
    { t: 'Voice question', s: 'audio' },
    { t: 'Speech recognition', s: 'or audio-capable model', k: 'd2' },
    { t: 'Agent', s: 'model + instructions', k: 'acc' },
    { t: 'Tools', s: 'image analysis, catalogue knowledge, ticket API', k: 'd2' },
    { t: 'Generated answer', s: 'grounded, with sources', k: 'ok' },
    { t: 'Speech synthesis', s: 'spoken reply', k: 'd2' }
  ], 'Simplified end-to-end model. Guardrails check what goes into and comes out of the model; a person confirms the purchase.'); },
  concept: `<p>Return to the central mental model from lesson 00-01: <em>problem, type of data, capability, model, application, output, use</em>. A complex solution is the same model repeated for each step, with an application or agent connecting the steps.</p>`,
  how: `<p>Map each step's input and output. Where the input is audio, think speech. Images: vision or extraction. Free text to be described: text analysis. Documents to fields: extraction. New content: generative AI. Live data or actions: tools, which means an agent. Then add the controls responsible AI requires at the points where things can go wrong.</p>`,
  ms: `<p>In Microsoft Foundry, the museum app could be one <strong>Foundry project</strong> containing a <strong>multimodal model deployment</strong>, a <strong>prompt agent</strong> with a <strong>Foundry IQ</strong> knowledge base over the catalogue and a custom tool for ticketing, <strong>Azure Speech in Foundry Tools</strong> (or a voice-based agent) for the spoken interaction, and <strong>guardrails</strong> on the agent - all called from a lightweight client app.</p>`,
  visual: function () { return '<div data-widget="picker"></div>'; },
  compare: ['predictive-vs-generative', 'app-vs-agent', 'extract-vs-generate'],
  distinctions: `<p>When a scenario mentions several capabilities, exam questions usually ask about <em>one</em> of them. Find the sentence that describes the step in question, then apply input-and-output reasoning to that step only.</p>`,
  rai: `<p>Map the principles onto the flow: transparency at the start (tell visitors it is AI), privacy on the photos and recordings, reliability through grounding and confidence checks, safety through guardrails, accountability through human confirmation of purchases, and inclusiveness through both voice and text interaction.</p>`,
  scenario: `<p>A hospital wants a system that transcribes doctor-patient consultations, extracts medication names and dosages into the patient record, drafts a plain-language summary for the patient, and lets the doctor approve it before it is sent. Speech recognition, then entity or field extraction, then generative summarization, with human approval as the accountability control.</p>`,
  explore: { widget: 'sorter', title: 'Decompose the scenario', data: 'together',
    intro: 'Use the picker above to explore inputs and outputs, then match each step of these scenarios to its capability.' },
  observe: `<p>Every decision used the same two questions. If you can answer "what goes in?" and "what must come out?" for a sentence in an exam scenario, you can nearly always name the capability.</p>`,
  check: [
    { q: 'A retailer\'s app lets shoppers photograph a product and ask, out loud, "Is this available in blue?" The app checks live stock and replies by voice. Which step requires an agent with a tool?', o: ['Turning the spoken question into text', 'Interpreting the photo', 'Checking live stock availability', 'Speaking the reply'], a: 2,
      why: 'Live stock is in an external system; reaching it requires a tool call, which is what makes the solution agentic.',
      not: ['That is speech recognition, a Foundry Tool or model capability with no external action.', 'A multimodal model can interpret the photo by itself.', '', 'That is speech synthesis.'],
      clue: '"checks live stock"', obj: '1.3.1', area: 'agents' },
    { q: 'An insurance company wants to process claim forms automatically and also generate a friendly letter to each claimant explaining the decision. Which pair of capabilities fits?', o: ['Object detection and speech synthesis', 'Information extraction for the forms and generative AI for the letters', 'Sentiment analysis and clustering', 'Speech recognition and image generation'], a: 1,
      why: 'Fields come out of the forms (extraction); new letter text is created (generation).',
      not: ['Neither detects objects in images nor speaks; the inputs are forms and the outputs are text.', '', 'Neither sentiment nor clustering pulls field values out of forms or writes letters.', 'There is no audio input and no image to create.'],
      clue: '"process claim forms" and "generate a letter"', obj: '1.3.1', area: 'workloads' },
    { q: 'In the museum app, visitors must be told that the guide is an AI system that can make mistakes. Where does this belong, and which principle does it serve?', o: ['In the client app at the start of the conversation; transparency', 'In the deployment\'s rate limit; reliability', 'In the training data; fairness', 'In the resource group name; accountability'], a: 0,
      why: 'Disclosing AI use and its limitations is transparency, and the client app is where users see it.',
      not: ['', 'A rate limit controls throughput and tells users nothing.', 'Training data does not reach users, and this is not about outcomes for groups.', 'Resource names are invisible to visitors.'],
      clue: '"told that the guide is an AI system"', obj: '1.1.5', area: 'rai' }
  ],
  teach: { prompt: 'Pick an app you use every day and break it into AI capabilities: for each, name the input, the output and the capability.',
    points: ['At least two separate steps', 'Each with an input type and an output type', 'Correct capability name for each', 'One responsible AI consideration'] },
  takeaways: [
    'Real solutions combine capabilities; decompose them step by step.',
    'Input and output decide the capability; products come last.',
    'Agents connect steps that need live data or actions.',
    'Responsible AI controls belong at specific points in the flow.'
  ]
});
