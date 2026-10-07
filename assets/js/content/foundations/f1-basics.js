/* Module 0 - Before we build AI.  Part 1: the basics (00-01 to 00-04).

   Every foundation lesson follows the Academy lesson anatomy:
   problem -> plain English -> example -> words -> mental model -> concept ->
   how it works -> Microsoft translation -> visual -> distinctions ->
   responsible AI -> scenario -> exploration -> exam lens -> check -> teach back.

   scope:    'foundation' = not measured directly by AI-901 but needed to
             understand what is; 'supports' = teaches part of the listed objectives.
   supports: objective ids from objectives.js.
   check:    { q, o, a, why, not[] (one per option, '' for the answer), clue,
               obj (objective id or null), area, misc (misconception tested) }
   Teaching grounded in Microsoft Learn "Introduction to AI concepts" and
   "Introduction to generative AI and agents" (AI-901 learning path 1). */

var FOUND = [];
var FOUND_STAGES = [
  { id: 'basics',   title: 'What AI is',                  lessons: ['00-01', '00-02', '00-03', '00-04'] },
  { id: 'workloads',title: 'What AI can do',              lessons: ['00-05', '00-06', '00-07', '00-08'] },
  { id: 'genai',    title: 'Generative AI and agents',    lessons: ['00-09', '00-10', '00-11', '00-12'] },
  { id: 'blocks',   title: 'The building blocks you will touch', lessons: ['00-13', '00-14', '00-15'] },
  { id: 'together', title: 'Doing it responsibly, end to end', lessons: ['00-16', '00-17'] }
];

/* ======================================================================
   00-01  What is artificial intelligence?
   ====================================================================== */
FOUND.push({
  id: '00-01', title: 'What Is Artificial Intelligence?', short: 'What AI is',
  scope: 'supports', supports: ['1.3.1'], area: 'workloads',
  prereq: [], learn: ['L1'], mods: ['01-03'],
  outcomes: [
    'Explain AI in one or two plain sentences, without the word "intelligent"',
    'Recognize that AI output is a learned estimate, not a guaranteed fact',
    'Name the six kinds of AI capability AI-901 is built around'
  ],
  problem: `<p>A support team receives about 3,000 customer emails a day. Before anyone can help, someone has to read each email and decide what it is: a complaint, a billing question, a technical fault or a general question. A person does this in seconds. Writing a computer program that does it is surprisingly hard, because customers describe the same problem in thousands of different ways.</p>
<p>Tasks like this one - reading language, recognizing what is in a picture, turning speech into text, drafting a reply - are where artificial intelligence earns its place.</p>`,
  plain: `<p><strong>Artificial intelligence (AI)</strong> is software that does tasks we normally associate with human abilities: understanding language, recognizing what is in an image, transcribing speech, or creating text and pictures.</p>
<p>Most AI today works by learning patterns from a large number of examples, rather than following only rules that a programmer typed in. The result is software that can handle inputs it has never seen before - and that can also be wrong, because a learned pattern is an estimate, not a certainty.</p>`,
  example: `<p>You already use AI daily. Your email provider moves junk mail into a spam folder. Your phone groups photos of the same person. A map app turns your spoken destination into text. A chat assistant drafts a paragraph when you describe what you want. Each of these takes an input (an email, a photo, audio, a request) and produces an output that a person would otherwise have produced.</p>`,
  words: [
    ['Artificial intelligence (AI)', 'Software that performs tasks associated with human abilities, such as understanding language or images'],
    ['Model', 'The part of an AI system that has learned patterns from data and turns new input into output'],
    ['Capability', 'What a kind of AI can do: analyze text, recognize speech, detect objects, generate content'],
    ['Workload', 'A category of problem AI is used for. AI-901 names six of them'],
    ['Prediction', 'An output the model estimates from learned patterns. It can be wrong']
  ],
  model: function () { return vIPO([
    { r: 'Real-world problem', t: 'Sort 3,000 emails a day' },
    { r: 'Type of data', t: 'Text', s: 'or images, audio, documents' },
    { r: 'AI capability', t: 'Text analysis', s: 'classify each email' },
    { r: 'Model', t: 'Learned from examples', k: 'd2' },
    { r: 'Output', t: '"Billing question"', s: 'with a confidence score', k: 'ok' },
    { r: 'Used by', t: 'Routing to the billing team' }
  ], 'The Academy\'s recurring mental model. Every lesson fills in the same boxes: what goes in, what capability runs, what comes out and who uses it.'); },
  concept: `<p>"AI" is an umbrella term rather than one technology. Inside it, <strong>machine learning</strong> is the main way AI is built today: an algorithm learns patterns from examples. <strong>Generative AI</strong> is a branch of AI that creates new content - text, images, code, audio - instead of only labelling or scoring what it is given. <strong>Agents</strong> are applications built on generative AI that can also use tools to get tasks done.</p>
<p>AI-901 does not ask you to build these technologies from scratch. It asks you to recognize what each kind of AI does, choose the right one for a scenario, and use Microsoft Foundry to put it to work.</p>`,
  how: `<p>An AI model has been <strong>trained</strong>: shown many examples until its internal settings capture useful patterns. When it later receives new input, it calculates the most likely output based on those patterns. That is why AI services commonly return a <strong>confidence score</strong> alongside a result, and why a well-designed system checks low-confidence results instead of acting on them blindly.</p>`,
  ms: `<p>Microsoft's platform for building AI solutions on Azure is <strong>Microsoft Foundry</strong>. It brings together a catalog of <strong>models</strong> you can deploy, an <strong>agent</strong> service, ready-made <strong>Foundry Tools</strong> (such as Azure Speech, Azure Language, Azure Vision and Azure Content Understanding), and <strong>knowledge</strong> sources that ground answers in your own data. You will meet each piece later, once the idea behind it is clear.</p>`,
  visual: function () { return vCards([
    { t: 'Generative AI', s: 'A prompt goes in; new text, images or code come out', k: 'd1' },
    { t: 'Agentic AI', s: 'A goal goes in; the agent uses tools to complete it', k: 'd1' },
    { t: 'Text analysis', s: 'Text goes in; sentiment, key phrases, entities or a summary come out', k: 'd2' },
    { t: 'Speech', s: 'Audio becomes text, or text becomes audio', k: 'd2' },
    { t: 'Computer vision', s: 'Images go in; labels, locations or descriptions come out', k: 'd2' },
    { t: 'Information extraction', s: 'Documents, images, audio or video go in; named fields come out', k: 'd2' }
  ], 'The six workloads named in the AI-901 skills outline. Most scenarios describe exactly one of them.'); },
  compare: ['trad-vs-ai'],
  distinctions: `<p><strong>AI is not the same as automation.</strong> A script that copies files every night is automation; nothing is learned and nothing is estimated. AI is useful when the input varies too much for fixed rules.</p>
<p><strong>AI output is not understanding in the human sense.</strong> A model produces output that fits the patterns it learned. It has no intentions and no built-in way of knowing whether its output is true. Treat output as a well-informed estimate that still needs checking where it matters.</p>`,
  rai: `<p>Because models learn from data, they can repeat the gaps and biases in that data, and because they estimate, they can be confidently wrong. Microsoft describes six principles for responsible AI - fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability. Lesson 00-16 covers them; every lesson flags where they apply.</p>`,
  scenario: `<p>A museum wants visitors to photograph an exhibit, ask a question about it out loud, and hear the answer. Before any product is chosen, list the capabilities: <em>computer vision</em> to interpret the photo, <em>speech recognition</em> to turn the question into text, <em>generative AI</em> to compose an answer, and <em>speech synthesis</em> to read it aloud. Decomposing a scenario into capabilities like this is the core skill the exam tests.</p>`,
  explore: { widget: 'sorter', title: 'Which kind of AI does each task need?', data: 'workloads-intro',
    intro: 'Each card describes a real need. Choose the AI workload that fits, then read why. Look at what goes in and what has to come out.' },
  observe: `<p>Notice that you could decide every case without knowing a single product name. You looked at the <strong>type of input</strong> and the <strong>kind of output</strong>. Keep using that method; it carries through the whole exam.</p>`,
  check: [
    { q: 'An insurer wants software to read incoming claim emails and label each one as "new claim", "status question" or "complaint". What is this task?', o: ['Generating new text from a prompt', 'Analyzing text and assigning a category', 'Converting speech to text', 'Extracting named fields from a scanned form'], a: 1,
      why: 'The input is text and the output is one of a fixed set of categories. That is text analysis, specifically classifying text.',
      not: ['Nothing new is being written; the output is a label chosen from three options.', '', 'The emails are already text. Speech recognition starts from audio.', 'The input is free-form email, not a form, and the output is a category, not field values such as an amount or a date.'],
      clue: '"label each one as" one of three options', obj: '1.3.1', area: 'language', misc: 'Any task involving text means generative AI.' },
    { q: 'A model labels a photo "golden retriever" with a confidence of 0.62. What is the most accurate way to describe that output?', o: ['A certain fact, because the model was trained on many dog photos', 'The model\'s estimate, which is fairly uncertain and may be wrong', 'A random guess with no relationship to the photo', 'A rule the developer wrote for golden retrievers'], a: 1,
      why: 'Models produce estimates from learned patterns. A confidence of 0.62 means the model is far from sure, so an application might ask a person to check.',
      not: ['Training on many examples makes the estimate better informed, not certain.', '', 'The output is based on patterns in the photo; it is uncertain, not random.', 'Nobody wrote a golden-retriever rule; the pattern was learned from labelled examples.'],
      clue: '"confidence of 0.62"', obj: null, area: 'ml', misc: 'AI output is either right or random.' },
    { q: 'Which statement best describes how most modern AI systems are built?', o: ['Programmers write an explicit rule for every possible input', 'A model learns patterns from many examples and applies them to new input', 'The system searches the internet for the answer to each request', 'The system copies a human expert\'s decision for each case'], a: 1,
      why: 'Machine learning - learning patterns from examples - is the basis of most modern AI, including generative AI.',
      not: ['That describes traditional software. It breaks down when inputs vary as much as language or images do.', '', 'Some solutions add web search as a tool, but that is not how the model itself works.', 'Human decisions may be used as training examples, but the model generalizes from them rather than copying each one.'],
      clue: '"most modern AI systems"', obj: null, area: 'ml' }
  ],
  teach: { prompt: 'Explain to a friend who has never studied AI what AI is and why its answers can be wrong. Do not use the words "intelligent" or "smart".',
    points: ['It learns patterns from many examples', 'It turns new input into output (a label, text, an image, a transcript)', 'Its output is an estimate, so it can be wrong', 'At least one everyday example'] },
  takeaways: [
    'AI performs tasks associated with human abilities by applying patterns learned from examples.',
    'Its output is an estimate. Confidence scores and human checks exist because estimates can be wrong.',
    'AI-901 is built around six workloads: generative AI, agents, text analysis, speech, computer vision and information extraction.',
    'Identify a workload from what goes in and what must come out, before thinking about products.'
  ]
});

/* ======================================================================
   00-02  Traditional software vs AI
   ====================================================================== */
FOUND.push({
  id: '00-02', title: 'Traditional Software vs AI', short: 'Software vs AI',
  scope: 'foundation', supports: ['1.3.1', '1.2.1'], area: 'ml',
  prereq: ['00-01'], learn: ['L1'], mods: ['01-03'],
  outcomes: [
    'Describe the difference between rules a developer writes and patterns a model learns',
    'Recognize which problems suit fixed rules and which suit AI',
    'Explain why the same AI input can produce different output, and fixed rules cannot'
  ],
  problem: `<p>An email provider wants to block spam. The first attempt is a list of rules: <em>if the subject contains "FREE", mark it as spam</em>. It works for a week. Then spammers write "FR3E", and an honest email that says "free lunch on Friday" gets blocked. Every fix adds another rule, and the list never ends.</p>`,
  plain: `<p><strong>Traditional software</strong> follows instructions a programmer wrote down. Give it the same input and it produces the same output, every time, because the rules never change.</p>
<p>An <strong>AI model</strong> is built differently. Instead of writing the rules, you give a learning algorithm many examples together with the right answers - thousands of emails already marked "spam" or "not spam". The algorithm finds the patterns that separate them. The result, the model, applies those patterns to emails it has never seen.</p>`,
  example: `<p>A tax calculator should be traditional software: the rules are published, exact and must be applied the same way for everyone. A spam filter suits AI: spam changes constantly and no one can list every way of writing it.</p>`,
  words: [
    ['Rule', 'An instruction written by a developer: if this, then that'],
    ['Deterministic', 'Always gives the same output for the same input'],
    ['Learned pattern', 'A relationship a model found in examples, stored as numbers rather than written rules'],
    ['Training example', 'An input paired with the correct answer, used to teach a model'],
    ['Probabilistic', 'Output based on likelihoods, so it comes with uncertainty']
  ],
  model: function () { return vVs(
    { t: 'Traditional software', items: ['Input', 'Explicit rules written by developers', 'Output'] },
    { t: 'AI system', k: 'acc', items: ['Input', 'A model whose patterns were learned from examples', 'Prediction or generated result'] },
    'A simplified teaching model. Real AI applications contain plenty of ordinary code around the model: it collects the input, calls the model, and decides what to do with the result.'); },
  concept: `<p>The difference is <em>where the logic comes from</em>. In traditional software it is written by hand and can be read line by line. In machine learning it is <strong>learned from data</strong> and stored as numeric settings inside the model, usually far too many to read.</p>
<p>That has two consequences. Learned patterns cope with variation that rules cannot ("FR3E", "fr-ee", "no-cost prize"). And the model is only as good as the examples it learned from: it can be wrong, and you cannot fix it by editing a line of code.</p>`,
  how: `<p>Many AI models do not output a bare answer. A classifier calculates a score for each possible answer and the application picks the highest one, often only if it passes a <strong>threshold</strong>. Generative models go further: they choose each word from a range of likely words, which is why asking the same question twice can produce two different wordings. Lesson 00-09 shows this happening.</p>`,
  ms: `<p>Microsoft Foundry lets you use models without training them yourself. <strong>Foundry Tools</strong> such as Azure Language and Azure Vision contain models Microsoft has already trained for specific tasks. The <strong>Foundry model catalog</strong> contains general-purpose models from Microsoft and other providers. In AI-901 you choose and use models; building and training custom ones is outside the exam.</p>`,
  compare: ['trad-vs-ai'],
  distinctions: `<p><strong>Rules are not wrong; they are a different tool.</strong> When the logic is exact and must be explainable line by line - tax, payroll, access checks - write rules. When the input is messy and varied - language, images, audio - learned patterns usually win.</p>
<p><strong>Most real solutions mix both.</strong> An AI model classifies an email; ordinary code then routes it, logs it and enforces business rules.</p>`,
  rai: `<p>A rule reflects the assumptions of the person who wrote it; a model reflects the examples it learned from. If those examples under-represent some customers, the model can treat them worse without anyone writing a biased line of code. That is a <em>fairness</em> concern, and it is why training data has to be examined, not just collected.</p>`,
  scenario: `<p>A bank needs two systems: one that calculates interest owed to the cent, and one that flags transactions that look like fraud. The first is traditional software, because the calculation is exact and must be auditable. The second suits AI, because fraud patterns shift faster than anyone can write rules.</p>`,
  explore: { widget: 'rulesmodel', title: 'Rules versus learned patterns',
    intro: 'Type an email subject. The left side applies three hand-written rules. The right side applies word weights of the kind a model learns from labelled examples (hand-set here so you can read them). Try the suggested inputs, then your own.' },
  observe: `<p>The rules failed in both directions: they missed "FR3E" and flagged a harmless lunch invitation. The weighted model scored both sensibly because it weighs many words together. But look at its explanation: the decision comes from numbers, not from a sentence you can read. That trade-off - flexibility versus explainability - follows AI everywhere, and is why transparency matters.</p>`,
  check: [
    { q: 'A payroll system must calculate overtime pay exactly as defined in a labour agreement, and auditors must be able to trace every calculation. Which approach fits best?', o: ['A machine learning model trained on past payslips', 'Traditional software with explicit rules', 'A generative AI model prompted with the agreement', 'An AI agent with a calculator tool'], a: 1,
      why: 'The rules are known, exact and must be auditable. Explicit rules give the same result every time and can be traced line by line.',
      not: ['A learned model approximates the past; it can be wrong and is hard to audit.', '', 'Generated text can vary between runs and is not guaranteed to be correct, which is unacceptable for pay.', 'An agent adds a model that decides what to do. Nothing here needs deciding; the rules are fixed.'],
      clue: '"exactly as defined" and "trace every calculation"', obj: null, area: 'ml', misc: 'AI is always the more advanced, and therefore better, choice.' },
    { q: 'Spammers keep changing the spelling of words such as "free" to slip past a filter. Why does a machine learning model cope better than a list of rules?', o: ['It checks every email against a database of all known spam', 'It weighs many patterns learned from examples, so it can generalize to variations nobody listed', 'It is deterministic, so it never makes mistakes', 'It reads the sender\'s intent'], a: 1,
      why: 'A trained model combines many learned signals, so it can recognize spam it has never seen exactly, including new spellings.',
      not: ['Matching against known spam is a lookup, and it fails on anything new.', '', 'Models are probabilistic and do make mistakes; rules are the deterministic ones.', 'A model has no access to intent; it scores patterns in the text.'],
      clue: '"keep changing" - variation no list can anticipate', obj: null, area: 'ml', misc: 'Models understand intent.' },
    { q: 'You send the same request twice to a generative AI model and get two differently worded answers. What explains this?', o: ['The model was retrained between the two requests', 'The model chooses each word from several likely options, so output can vary', 'The second request was processed by a different rule set', 'One of the two answers must be a malfunction'], a: 1,
      why: 'Generative models pick each token from a probability distribution. Unless settings such as temperature make the choice nearly fixed, wording varies between runs.',
      not: ['Models are not retrained per request; the same deployed model answered both.', '', 'There is no rule set choosing words; the variation comes from probability.', 'Variation is normal behaviour for a generative model, not a fault.'],
      clue: '"same request twice" and "differently worded"', obj: '1.2.1', area: 'genai' }
  ],
  teach: { prompt: 'Explain the difference between traditional software and an AI model to someone who has never studied AI. Use one example where each is the better choice.',
    points: ['Traditional software follows rules a person wrote; same input, same output', 'A model learns patterns from examples and applies them to new input', 'Models can be wrong and are harder to explain', 'Rules suit exact logic; AI suits varied input such as language or images'] },
  takeaways: [
    'Traditional software runs rules a developer wrote. An AI model applies patterns it learned from examples.',
    'Learned patterns handle variation that rules cannot, but they can be wrong and are harder to explain.',
    'Choose rules for exact, auditable logic and AI for messy input such as text, images and audio.',
    'Real solutions combine both: ordinary code around a model.'
  ]
});

/* ======================================================================
   00-03  Data and models
   ====================================================================== */
FOUND.push({
  id: '00-03', title: 'Data, Training and Models', short: 'Data and models',
  scope: 'supports', supports: ['1.2.1', '1.2.2'], area: 'ml',
  prereq: ['00-02'], learn: ['L1'], mods: ['01-02'],
  outcomes: [
    'Describe data, features, labels, training, a model and inference in plain terms',
    'Explain why the quality of training data limits the quality of a model',
    'Recognize that in AI-901 you mostly use already-trained models (inference)'
  ],
  problem: `<p>A fruit wholesaler sorts thousands of pieces of fruit a day. A camera and a scale record each item's weight and colour. Could the system learn to tell apples from oranges on its own, from the items workers have already sorted?</p>`,
  plain: `<p>Yes - that is exactly what machine learning does. Each sorted piece of fruit is an <strong>example</strong>. The measurements (weight, colour) are its <strong>features</strong>. The answer a worker gave (apple or orange) is its <strong>label</strong>. <strong>Training</strong> means running an algorithm over thousands of labelled examples until it finds a reliable way to get from features to label. What training produces is the <strong>model</strong>.</p>
<p>Later, a new piece of fruit arrives with no label. The model looks at its features and predicts the label. Using a trained model on new input is called <strong>inference</strong>.</p>`,
  example: `<p>Your phone's photo app learned what faces look like from a huge number of labelled photos - that was training, done once, by the provider. Every time it finds a face in a new picture you take, that is inference, and it happens on every photo.</p>`,
  words: [
    ['Data', 'Recorded examples of the thing you want the AI to handle'],
    ['Feature', 'A measurable property of an example, such as weight or colour'],
    ['Label', 'The correct answer attached to a training example'],
    ['Training', 'Adjusting a model\'s internal settings until it fits the examples well'],
    ['Model', 'What training produces: a function that turns features into a prediction'],
    ['Parameters (weights)', 'The numbers inside a model that training adjusts'],
    ['Inference', 'Using a trained model to produce output from new input']
  ],
  model: function () { return vFlow([
    { t: 'Labelled examples', s: 'features + correct answers' },
    { t: 'Training', s: 'the algorithm adjusts parameters', k: 'd1' },
    { t: 'Model', s: 'learned parameters', k: 'acc' },
    { t: 'Inference', s: 'new input, no label', k: 'd2' },
    { t: 'Prediction', s: 'with a confidence', k: 'ok' }
  ], 'Simplified teaching model. Training happens once (or occasionally); inference happens every time the model is used.'); },
  concept: `<p>A model is a mathematical function with many adjustable numbers, called <strong>parameters</strong> or <strong>weights</strong>. Training repeatedly compares the model's predictions with the correct labels and nudges the parameters to reduce the error. Large language models have billions of parameters, trained on very large volumes of text.</p>
<p>The model never stores "the rule for an apple". It stores numbers that happen to separate apples from oranges well on the examples it saw. That is why it generalizes - and why it fails when new input looks unlike anything in the training data.</p>`,
  how: `<p>Two ideas carry through the rest of the course. First, <strong>a model's quality is bounded by its data</strong>: mislabelled, unrepresentative or too few examples produce a worse model, however clever the algorithm. Second, <strong>training is expensive and inference is cheap per call</strong>. Providers train large <em>foundation models</em> once; everyone else uses them through inference, sometimes adapting them with <em>fine-tuning</em> (further training on a smaller, specialized data set).</p>`,
  ms: `<p>In Microsoft Foundry you mostly do inference. The <strong>model catalog</strong> lists models that are already trained; you <strong>deploy</strong> one to make it callable, then send it input. Foundry Tools contain models Microsoft trained for specific jobs, such as reading text in images. Fine-tuning is available in Foundry for some models, but AI-901 focuses on choosing and using models rather than training them.</p>`,
  distinctions: `<p><strong>Training versus inference</strong> is the distinction to hold onto. If a scenario talks about providing labelled examples and producing a model, it is training. If it talks about sending new input to a model to get a result, it is inference - and in Foundry that is what you pay for, per request or per token.</p>`,
  rai: `<p>Data choices are where many responsible-AI problems begin. If the fruit photos all came from one farm, the model may fail on fruit from another. If loan data reflects past discrimination, a model trained on it can repeat that discrimination. <em>Reliability</em> and <em>fairness</em> both start with asking: does the training data represent the situations and people the model will meet?</p>`,
  scenario: `<p>A city wants to predict which streetlights will fail next month. It has ten years of maintenance records: each light's age, model, location and whether it failed. The records are the training data, the failure column is the label, and the model's monthly predictions are inference. If one district's records are missing, predictions for that district will be less reliable.</p>`,
  explore: { widget: 'knn', title: 'Train a tiny model in your browser',
    intro: 'This is real machine learning, kept small enough to see. Each dot is a labelled example (weight and redness of a piece of fruit). Add examples by choosing a label and clicking the chart, then move the grey test point and watch the prediction. The model is "k-nearest neighbours": it predicts the label most common among the three closest examples.' },
  observe: `<p>Three things to notice. Predictions near the boundary have lower confidence, because the nearest examples disagree. One mislabelled example near the test point can flip the prediction - data quality matters more than the algorithm. And the model has no opinion about fruit it has no examples for; far from any data, it is still forced to answer, which is how models fail on unfamiliar input.</p>`,
  check: [
    { q: 'A hospital has five years of patient records in which each record notes whether the patient was readmitted within 30 days. It wants a model that predicts readmission for new patients. In this data, what is the readmission column?', o: ['A feature', 'The label', 'A parameter', 'The inference'], a: 1,
      why: 'The label is the answer the model learns to predict. Readmission is what the hospital wants to predict, so in training data it is the label.',
      not: ['Features are the inputs used to make the prediction, such as age or diagnosis.', '', 'Parameters are numbers inside the model, set by training, not columns in the data.', 'Inference is the act of using the trained model on a new patient.'],
      clue: '"wants a model that predicts readmission"', obj: null, area: 'ml' },
    { q: 'A developer deploys a model from the Foundry model catalog and sends it a customer question. Which stage of the AI lifecycle is this?', o: ['Training', 'Labelling', 'Inference', 'Fine-tuning'], a: 2,
      why: 'Sending new input to an already-trained model to get a result is inference. That is what Foundry deployments are for.',
      not: ['Training adjusts a model\'s parameters using examples; the catalog model is already trained.', 'Labelling attaches correct answers to training examples.', '', 'Fine-tuning continues training on new data; here the model is only being used.'],
      clue: '"deploys a model from the catalog and sends it a question"', obj: '1.2.1', area: 'models', misc: 'Each request to a model trains it.' },
    { q: 'A model that recognizes product defects works well in the factory where its training photos were taken, but poorly in a second factory with different lighting. What is the most likely cause?', o: ['The model ran out of parameters', 'The training data did not represent the second factory\'s conditions', 'Inference is slower in the second factory', 'The model needs a higher confidence score'], a: 1,
      why: 'Models generalize from their training data. Photos taken under one lighting setup do not teach the model what defects look like under different lighting.',
      not: ['Parameter count is fixed by the model design; it does not run out.', '', 'Speed does not change which answer the model gives.', 'Confidence is an output of the model, not a setting that fixes the gap in its training data.'],
      clue: '"works well where its training photos were taken"', obj: '1.1.2', area: 'rai', misc: 'A model that is accurate in testing is accurate everywhere.' }
  ],
  teach: { prompt: 'Explain the difference between training and inference using an example that is not about fruit.',
    points: ['Training uses labelled examples to set the model\'s parameters', 'Inference uses the finished model on new input', 'Training is done once or occasionally; inference happens on every request', 'The model is only as good as its training data'] },
  takeaways: [
    'Examples have features (inputs) and labels (answers). Training fits a model to them.',
    'Inference is using a trained model on new input. In Foundry, that is most of what you do.',
    'A model is bounded by its data: unrepresentative or wrong examples produce unreliable or unfair predictions.',
    'Foundation models are trained once by providers; you deploy and call them, or adapt them with fine-tuning.'
  ]
});

/* ======================================================================
   00-04  Classification, regression and other predictions
   ====================================================================== */
FOUND.push({
  id: '00-04', title: 'Classification, Regression and Other Predictions', short: 'Kinds of prediction',
  scope: 'foundation', supports: ['1.3.1'], area: 'ml',
  prereq: ['00-03'], learn: ['L1'], mods: ['01-03'],
  outcomes: [
    'Tell classification, regression and clustering apart from the output they produce',
    'Recognize that many AI services are classifiers underneath (sentiment, image classification)',
    'Know that AI-901 does not test building these models - only recognizing the ideas'
  ],
  problem: `<p>A subscription company asks three questions. <em>Will this customer cancel next month?</em> <em>How much will this customer spend next year?</em> <em>Which customers behave alike, so marketing can treat them as groups?</em> All three are "predictions", yet each needs a different kind of answer: a category, a number, and groups nobody has defined yet.</p>`,
  plain: `<p><strong>Classification</strong> predicts a category: cancel or stay; spam or not spam; apple, orange or banana. <strong>Regression</strong> predicts a number: next year's spend, tomorrow's temperature, a house price. <strong>Clustering</strong> finds groups of similar items when no one has labelled them in advance.</p>
<p>The first two learn from examples that already include the correct answer, which is called <strong>supervised learning</strong>. Clustering works without answers, which is called <strong>unsupervised learning</strong>.</p>`,
  example: `<p>Marking an email as spam is classification. A delivery app estimating "arrives in 23 minutes" is regression. A music service grouping listeners with similar tastes, without anyone deciding the groups first, is clustering.</p>`,
  words: [
    ['Classification', 'Predicting which category something belongs to. Binary: two categories; multiclass: more than two'],
    ['Regression', 'Predicting a numeric value'],
    ['Clustering', 'Grouping similar items without predefined labels'],
    ['Supervised learning', 'Learning from examples that include the correct answer'],
    ['Unsupervised learning', 'Finding structure in examples that have no answers attached']
  ],
  model: function () { return vCards([
    { t: 'Classification', s: 'Which category? Cancel or stay; positive, neutral or negative.', tag: 'output: a label' },
    { t: 'Regression', s: 'What number? Spend, price, minutes to arrival.', tag: 'output: a number' },
    { t: 'Clustering', s: 'Which items belong together? Groups found without labels.', tag: 'output: groups' },
    { t: 'Generation', s: 'Create something new: text, an image, code.', tag: 'output: new content', k: 'd1' }
  ], 'Ask what kind of output is needed and the prediction type usually follows. Generation is covered in 00-09.'); },
  concept: `<p>These ideas matter for AI-901 because they sit underneath services you will choose between. <strong>Sentiment analysis</strong> is text classification (positive, neutral, negative). <strong>Image classification</strong> assigns a label to a whole image. <strong>Language detection</strong> classifies text by language. Recognizing "this is really a classification problem" helps you pick the right service.</p>`,
  how: `<p>A classifier usually returns a score for every category, and the application reports the highest. A regression model returns a number, often with a range. A clustering algorithm measures how similar items are - for example, by distance between their features - and groups close items together. None of this requires maths for AI-901; it requires recognizing the output.</p>`,
  ms: `<p>Many Foundry Tools are prebuilt classifiers: Azure Language returns sentiment labels with confidence scores, and vision models return image labels. Training your own regression or clustering models is done with Azure Machine Learning, which is <strong>outside the AI-901 skills outline</strong> - unlike the older AI-900 exam, AI-901 has no machine learning domain.</p>`,
  compare: ['class-reg-clust', 'predictive-vs-generative'],
  distinctions: `<p><strong>Classification versus regression</strong> is about the output, not the input. "Predict the price" is regression even when the inputs are categories such as neighbourhood. "Predict whether the price will rise" is classification, because the answer is yes or no.</p>
<p><strong>Classification versus clustering</strong> is about whether the categories exist in advance. If someone defined the categories and labelled examples, it is classification. If the groups are discovered, it is clustering.</p>`,
  rai: `<p>Classifiers make decisions about people surprisingly often: approve or decline, fraud or genuine, shortlist or reject. When a classifier's errors fall more heavily on one group of people, that is a fairness failure even if overall accuracy is high.</p>`,
  scenario: `<p>A retailer wants to (1) forecast next week's sales per store, (2) flag returns that look fraudulent, and (3) discover natural customer segments. In order: regression (a number), classification (fraud or not) and clustering (groups not defined in advance).</p>`,
  explore: { widget: 'sorter', title: 'Category, number or groups?', data: 'prediction-types',
    intro: 'For each business question, choose the kind of prediction it needs. Decide from the shape of the answer.' },
  observe: `<p>The question words are a good shortcut: "which", "whether" and "is it" usually mean classification; "how much", "how many" and "how long" mean regression; "which ones are similar" with no predefined groups means clustering; "write", "draft" and "create" mean generation.</p>`,
  check: [
    { q: 'An airline wants to estimate how many minutes late each flight will be. What kind of prediction is this?', o: ['Classification', 'Regression', 'Clustering', 'Generation'], a: 1,
      why: 'The output is a number of minutes, so this is regression.',
      not: ['Classification would answer a category question, such as "late or on time".', '', 'Clustering groups similar flights; it does not estimate a value.', 'Nothing new is being created; a quantity is being estimated.'],
      clue: '"how many minutes"', obj: null, area: 'ml' },
    { q: 'A bank has thousands of transactions, none labelled, and wants to discover groups of transactions with similar behaviour. Which approach fits?', o: ['Supervised classification', 'Regression', 'Unsupervised clustering', 'Speech synthesis'], a: 2,
      why: 'No labels exist and the groups are to be discovered. That is clustering, an unsupervised technique.',
      not: ['Classification needs predefined categories and labelled examples, which the bank does not have.', 'Regression predicts a number for each item, not groups.', '', 'Speech synthesis turns text into audio and has nothing to do with this problem.'],
      clue: '"none labelled" and "discover groups"', obj: null, area: 'ml', misc: 'Any grouping task is classification.' },
    { q: 'Sentiment analysis labels a product review as positive, neutral or negative. Underneath, what kind of task is it?', o: ['Regression', 'Clustering', 'Text classification', 'Image generation'], a: 2,
      why: 'It assigns one of a fixed set of categories to a piece of text, which is classification.',
      not: ['The output is a category, not a number, even if a confidence score comes with it.', 'The categories are fixed in advance, so this is not clustering.', '', 'The input and output are both about text; no image is involved.'],
      clue: '"positive, neutral or negative"', obj: '1.3.2', area: 'language' }
  ],
  teach: { prompt: 'Explain classification without using the word "classification", then explain how regression differs.',
    points: ['Choosing one answer from a set of known categories', 'Regression produces a number instead of a category', 'Both learn from examples that include the right answer', 'Clustering differs because the groups are not known in advance'] },
  takeaways: [
    'Classification predicts a category, regression predicts a number, clustering discovers groups.',
    'Classification and regression are supervised; clustering is unsupervised.',
    'Sentiment analysis, language detection and image classification are all classification underneath.',
    'AI-901 has no machine learning domain: recognize these ideas, do not expect to build them.'
  ]
});
