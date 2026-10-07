/* explore-data.js - data for the Module 0 explorations.
   SORTS:     scenario sorters (choose the best fit, read why).
   CODEWALK:  code shown line by line with a plain-English explanation per line.
              Code shapes follow Microsoft Learn samples: the Foundry SDK chat
              client and REST call in "Get started with AI in Azure" /
              "Get started with generative AI and agents in Azure", and the
              Azure CLI deployment list command in the Foundry Models docs.
   PYREAD:    predict-the-output reading questions for the Python primer. */

var SORTS = {
  'workloads-intro': {
    opts: ['Generative AI', 'Agentic AI', 'Text analysis', 'Speech', 'Computer vision', 'Information extraction'],
    items: [
      { t: 'Turn recorded customer calls into searchable written transcripts.', a: 3, why: 'Audio in, text out: speech recognition.' },
      { t: 'Find every car in a parking-lot camera image and report where each one is.', a: 4, why: 'Image in, objects and locations out: object detection, a computer vision task.' },
      { t: 'Read the vendor, date and total from photographed receipts into an expense system.', a: 5, why: 'Named fields out of an image of a document: information extraction (OCR, then field mapping).' },
      { t: 'Write a first draft of a product description from five bullet points.', a: 0, why: 'New text created from a prompt: generative AI.' },
      { t: 'Tell whether each of 10,000 product reviews is positive, neutral or negative.', a: 2, why: 'Text in, a category out: sentiment analysis, a text-analysis technique.' },
      { t: 'Check a customer\'s order in the order system and rebook the delivery if it is late.', a: 1, why: 'The AI must use tools - read the order system, change the booking. That is an agent.' },
      { t: 'Read a news article aloud in a natural voice for a podcast feed.', a: 3, why: 'Text in, audio out: speech synthesis.' },
      { t: 'List the people, organizations and places mentioned in each news article.', a: 2, why: 'Free text in, named entities out: entity detection. It is not extraction, because there is no fixed form or schema of fields.' }
    ]
  },
  'prediction-types': {
    opts: ['Classification', 'Regression', 'Clustering', 'Generation'],
    items: [
      { t: 'Will this patient miss their appointment?', a: 0, why: 'Yes or no: a category, so classification (binary).' },
      { t: 'How many litres of milk will this store sell tomorrow?', a: 1, why: 'A quantity: regression.' },
      { t: 'Which of our 50,000 customers behave similarly, with no groups defined in advance?', a: 2, why: 'Groups discovered without labels: clustering.' },
      { t: 'Which of five product categories does this item belong to?', a: 0, why: 'One of several known categories: multiclass classification.' },
      { t: 'Write a thank-you note to each customer who left a review.', a: 3, why: 'New text: generation.' },
      { t: 'What will this house sell for?', a: 1, why: 'A price is a number: regression.' },
      { t: 'Is this transaction fraudulent?', a: 0, why: 'Fraud or not: classification.' },
      { t: 'Create a logo concept from a short description.', a: 3, why: 'A new image: generation.' }
    ]
  },
  'api-sdk-cli': {
    opts: ['REST API', 'SDK', 'Azure CLI'],
    items: [
      { t: 'A Python web app needs to send user questions to a model deployment and show the answers.', a: 1, why: 'An application in a supported language: use the SDK, which builds the requests for you.' },
      { t: 'An administrator wants a script that lists the model deployments on a Foundry resource.', a: 2, why: 'Managing resources from a script is control-plane work, which the Azure CLI does.' },
      { t: 'A tool written in a language with no Azure library must call a model deployment over HTTPS.', a: 0, why: 'Without an SDK, send REST requests directly: endpoint, headers and a JSON body.' },
      { t: 'A developer wants to see exactly which headers and JSON body reach the endpoint, to debug a failing call.', a: 0, why: 'Writing the REST request by hand shows every header and field.' },
      { t: 'A team creates the same Foundry resource and resource group for each new project, every time, from the command line.', a: 2, why: 'Repeatable resource creation from the command line is a CLI job.' },
      { t: 'A C# desktop app calls a Foundry agent and wants typed objects rather than raw JSON.', a: 1, why: 'SDKs return typed objects in your language instead of raw JSON.' }
    ]
  },
  'rai': {
    opts: ['Fairness', 'Reliability and safety', 'Privacy and security', 'Inclusiveness', 'Transparency', 'Accountability'],
    items: [
      { t: 'A loan model approves applicants from one postcode far less often than others with similar finances.', a: 0, why: 'Similar people, different outcomes: fairness. Not inclusiveness - these applicants can use the system; they are treated unequally by it.' },
      { t: 'A self-driving forklift is tested in poor lighting, on wet floors and with failed sensors before release.', a: 1, why: 'Behaving as intended in unusual conditions: reliability and safety.' },
      { t: 'Customer prompts must never be visible to other customers, and personal details in them must be protected.', a: 2, why: 'Protecting personal data: privacy and security.' },
      { t: 'A support assistant must work with screen readers and offer live captions.', a: 3, why: 'Usable by people with disabilities: inclusiveness. Not fairness - this is about access to the system, not outcomes of its decisions.' },
      { t: 'Users must be told that they are talking to an AI system and what it cannot do.', a: 4, why: 'Disclosure and limits: transparency. Not accountability - nobody is being made answerable here.' },
      { t: 'A named review board approves each release and answers for the system\'s outcomes.', a: 5, why: 'People answerable through governance: accountability. Not transparency - the board owns the system; it is not explaining it to users.' },
      { t: 'A medical triage model refuses to make a recommendation when its confidence is below 0.8 and refers the case to a nurse.', a: 1, why: 'Failing safely when uncertain: reliability and safety (with human oversight).' },
      { t: 'A company documents its model\'s intended uses, known limitations and the kind of data it was trained on.', a: 4, why: 'Helping people understand the system and its limits: transparency.' }
    ]
  },
  'together': {
    opts: ['Speech recognition', 'Speech synthesis', 'Computer vision', 'Text analysis', 'Information extraction', 'Generative AI', 'Agent tool call'],
    items: [
      { t: 'Hotel app: a guest says "Book me a table for two at eight."', a: 0, why: 'The spoken request must first become text (or go to an audio-capable model).' },
      { t: 'Hotel app: the restaurant booking system is checked and the table reserved.', a: 6, why: 'Reading and changing an external system is a tool call made by an agent.' },
      { t: 'Hotel app: the confirmation is read back to the guest.', a: 1, why: 'Text to audio: speech synthesis.' },
      { t: 'Expense tool: the merchant and total are read from a photo of a receipt.', a: 4, why: 'Named fields from a document image: information extraction.' },
      { t: 'Expense tool: a short, friendly explanation of why the claim was rejected is drafted.', a: 5, why: 'New text: generative AI.' },
      { t: 'Social media monitor: each post mentioning the brand is labelled positive or negative.', a: 3, why: 'Sentiment analysis on text.' },
      { t: 'Quality control: a camera finds scratches on each phone screen and marks where they are.', a: 2, why: 'Finding and locating things in images: computer vision (object detection).' }
    ]
  }
};

var CODEWALK = {
  'three-ways': {
    title: 'The same Foundry project, three ways in',
    tabs: [
      { name: 'REST', lang: 'bash', note: 'Send a prompt to a deployment by writing the web request yourself. Shape from Microsoft Learn; the api-version shown is the one Microsoft Learn used and may have been updated since.',
        lines: [
          ['curl -X POST "https://<resource>.services.ai.azure.com/api/projects/<project>/openai/responses?api-version=2025-11-15-preview" \\', 'Send an HTTP POST to the project\'s Responses endpoint. The URL names your Foundry resource and project.'],
          ['  -H "Content-Type: application/json" \\', 'A header saying the body is JSON.'],
          ['  -H "Authorization: Bearer $AUTH_TOKEN" \\', 'A header carrying a Microsoft Entra ID access token: who is asking.'],
          ['  -d \'{"model": "gpt-4.1-mini", "input": "What is an AI application?"}\'', 'The JSON body: which deployment to call (model) and the prompt (input).']
        ] },
      { name: 'Python SDK', lang: 'python', note: 'The same request, built for you by the Foundry SDK. Shape follows the Foundry SDK sample on Microsoft Learn.',
        lines: [
          ['from azure.identity import DefaultAzureCredential', 'Import the sign-in helper; it finds an identity such as your az login.'],
          ['from azure.ai.projects import AIProjectClient', 'Import the Foundry SDK project client.'],
          ['project = AIProjectClient(endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>", credential=DefaultAzureCredential())', 'Create a client for your project endpoint, signed in with Entra ID. This replaces the URL and the Authorization header.'],
          ['openai = project.get_openai_client()', 'Ask the project for an OpenAI-compatible client that calls the Responses API.'],
          ['response = openai.responses.create(model="gpt-4.1-mini", input="What is an AI application?")', 'The same body as the REST call - deployment and prompt - as named arguments.'],
          ['print(response.output_text)', 'Print the generated text. The SDK parsed the JSON response for you.']
        ] },
      { name: 'Azure CLI', lang: 'bash', note: 'A different job: managing the resource, not chatting with the model. Command from the Foundry Models documentation.',
        lines: [
          ['az login', 'Sign in to Azure in the terminal. Later commands use this identity.'],
          ['az cognitiveservices account deployment list \\', 'List the model deployments on a Foundry resource (Foundry resources use the cognitiveservices command group).'],
          ['  --name <foundry-resource-name> \\', 'Which Foundry resource.'],
          ['  --resource-group <resource-group> \\', 'Which resource group it is in.'],
          ['  -o table', 'Show the result as a readable table.']
        ] }
    ]
  },
  'chat-client': {
    title: 'A lightweight chat client, line by line',
    tabs: [
      { name: 'chat.py', lang: 'python', note: 'The shape of the Foundry SDK chat client in Microsoft Learn\'s AI-901 training. Before running it you would pip install azure-ai-projects and azure-identity, set PROJECT_ENDPOINT, and run az login.',
        lines: [
          ['import os', 'Bring in Python\'s os module, used to read environment variables.'],
          ['from azure.identity import DefaultAzureCredential', 'Bring in the class that signs you in with Microsoft Entra ID without a key.'],
          ['from azure.ai.projects import AIProjectClient', 'Bring in the Foundry SDK\'s project client.'],
          ['', ''],
          ['project = AIProjectClient(', 'Create a project client object and store it in the variable project. The call continues over the next lines.'],
          ['    endpoint=os.environ["PROJECT_ENDPOINT"],', 'Keyword argument: the project endpoint, read from an environment variable rather than typed into the code.'],
          ['    credential=DefaultAzureCredential(),', 'Keyword argument: the identity to use. The project endpoint accepts Entra ID, not keys.'],
          [')', 'End of the call.'],
          ['openai = project.get_openai_client()', 'Get an OpenAI-compatible client from the project. This is the object that talks to model deployments.'],
          ['', ''],
          ['response = openai.responses.create(', 'Call the Responses API. Everything up to the closing bracket is the request.'],
          ['    model="chat-prod",', 'The deployment to call - your deployment name, not the catalog model name.'],
          ['    instructions="You are a concise assistant for Contoso staff.",', 'The system prompt: role, tone and rules for this response.'],
          ['    input="What is an AI application?",', 'The user prompt.'],
          [')', 'Send the request and wait for the response object.'],
          ['print(response.output_text)', 'Print the generated text, read from the response object\'s output_text attribute.']
        ] }
    ]
  }
};

var PYREAD = [
  { code: 'name = "Foundry"\nprint(f"Hello, {name}!")', q: 'What is printed?', o: ['Hello, {name}!', 'Hello, Foundry!', 'Hello, name!', 'An error, because name is not defined'], a: 1,
    why: 'An f-string replaces {name} with the variable\'s value.' },
  { code: 'messages = [\n    {"role": "system", "content": "Be brief."},\n    {"role": "user", "content": "Hi"}\n]\nprint(messages[1]["role"])', q: 'What is printed?', o: ['system', 'user', 'Hi', 'Be brief.'], a: 1,
    why: 'Lists count from 0, so messages[1] is the second dictionary; ["role"] reads its role value, "user".' },
  { code: 'deployments = ["chat-prod", "embed-1"]\nfor d in deployments:\n    print(d)', q: 'What does the loop do?', o: ['Prints the number 2', 'Prints each deployment name on its own line', 'Creates two deployments', 'Prints nothing, because the list is not called'], a: 1,
    why: 'for d in deployments repeats the indented line once per item, printing each name.' },
  { code: 'response = client.responses.create(\n    model="chat-prod",\n    input="Summarize this text.",\n    max_output_tokens=200,\n)', q: 'What does max_output_tokens=200 do?', o: ['Limits the prompt to 200 tokens', 'Caps the length of the generated response', 'Sets the deployment\'s rate limit to 200 tokens per minute', 'Makes the answer more random'], a: 1,
    why: 'max_output_tokens caps how long the generated response can be. Rate limits are deployment settings; randomness is temperature.' },
  { code: 'import os\nendpoint = os.environ["PROJECT_ENDPOINT"]', q: 'Where does the value of endpoint come from?', o: ['It is typed into the script', 'From an environment variable named PROJECT_ENDPOINT', 'From the Azure portal automatically', 'From the user\'s keyboard when the script runs'], a: 1,
    why: 'os.environ reads environment variables, which are set outside the code before the script runs.' }
];
