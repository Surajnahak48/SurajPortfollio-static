/*
 * All site content lives here (this replaces the Django database + admin).
 * Edit this file to add or change blogs, projects, certificates, and research.
 *
 *  - Dates use YYYY-MM-DD.
 *  - Image paths are relative to the site root, e.g. "uploads/blog_images/my-post.png".
 *  - Blog "content" and research "abstract" are HTML.
 *  - Blog/research "id" must be unique: it is used in the page link (read.html?id=13).
 *  - Project status: "completed" | "in_progress" | "planned".
 *  - Research status: "published" | "under_review" | "in_progress".
 *  - site.url is the live address of the site (no trailing slash). Used for SEO.
 *  - Blog/research "slug" is the page address: blog/<slug>.html. Keep it stable once live.
 *  - After editing this file run:  node tools/build.js   (creates blog pages, sitemap, SEO tags).
 *  - Set site.resume to a file path (e.g. "uploads/resume.pdf") to show the Resume link.
 */
window.SITE_DATA = {
  "site": {
    "name": "Suraj Nahak",
    "url": "https://surajnahak.in",
    "tagline": "AI/ML Software Engineer — Algorithms & Research",
    "heroSubtitle": "I design algorithms, train models and build the software around them, taking an idea from research to a working product.",
    "about": "AI/ML Software Engineer — Algorithms & Research\r\nI design algorithms, train models and build the software around them, taking an idea from research to a working product.",
    "copyright": "© 2026 Suraj Nahak. All Rights Reserved.",
    "resume": ""
  },
  "socialLinks": [
    {
      "platform": "reddit",
      "url": "https://redit.com"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com"
    },
    {
      "platform": "github",
      "url": "https://guthub.com"
    },
    {
      "platform": "instagram",
      "url": "https://instagram.com"
    },
    {
      "platform": "telegram",
      "url": "https://telegram.com"
    }
  ],
  "categories": [
    "Algorithms",
    "Automation",
    "MLOps",
    "Machine Learning",
    "Research"
  ],
  "projects": [
    {
      "title": "SpendRoast: Android Expense Tracker",
      "description": "My own Android app. It reads bank and UPI SMS on the phone and turns them into a clear monthly spending history, then roasts your habits with a rule-based coach. Local-first and private: no account, no backend, and financial data never leaves the device. Includes budgets, analytics, CSV import/export, app lock and an optional on-device AI chat. Coming soon to Google Play.",
      "image": "uploads/projects/spendroast.png",
      "tech": [
        "Kotlin",
        "Jetpack Compose",
        "Room",
        "On-device AI",
        "Google Play Billing"
      ],
      "status": "in_progress",
      "featured": true,
      "date": "2026-10-27"
    },
    {
      "title": "HRMS Software: Web & Android App",
      "image": "uploads/projects/hrms.svg",
      "description": "Built and maintained a Human Resource Management System (HRMS) with a web app and a companion Android app, from feature development through bug fixes and day-to-day stability. Details kept general due to confidentiality.",
      "tech": [
        "Web App",
        "Android",
        "Mobile App Development",
        "HRMS",
        "App Maintenance"
      ],
      "status": "completed",
      "featured": true,
      "date": "2026-03-30"
    }
  ],
  "certificates": [
    {
      "title": "Machine Learning Course",
      "issuer": "CloudyML",
      "date": "2025-02-22",
      "credentialId": "CloudyML/ML1/A/235C",
      "description": "Completed CloudyML's Machine Learning course, working through the core ML workflow of preparing data, training models and evaluating them. It built the groundwork for the machine learning systems I work on today.",
      "image": "uploads/certificates/cloudyml-machine-learning-course.jpg",
      "link": "uploads/certificates/cloudyml-machine-learning-course.pdf",
      "tags": [
        "Machine Learning",
        "Python",
        "Model Training"
      ]
    },
    {
      "title": "Python Course",
      "issuer": "CloudyML",
      "date": "2024-12-25",
      "credentialId": "CloudyML/CMLP1/A/9E9E",
      "description": "Completed CloudyML's Python course, building a solid base in Python programming. Python is now the language I use every day for machine learning, automation scripts and back-end work.",
      "image": "uploads/certificates/cloudyml-python-course.jpg",
      "link": "uploads/certificates/cloudyml-python-course.pdf",
      "tags": [
        "Python",
        "Programming"
      ]
    }
  ],
  "research": [],
  "blogs": [
    {
      "id": 13,
      "slug": "choosing-a-baseline",
      "title": "Choosing a baseline before you train anything",
      "author": "Suraj Nahak",
      "date": "2026-10-12",
      "category": "Machine Learning",
      "tags": [
        "Baselines",
        "Evaluation",
        "ML"
      ],
      "excerpt": "Before I write a single line of model code, I want to know what number I'm trying to beat. Here's why, and how I pick it.",
      "image": "uploads/blog_images/demo-choosing-a-baseline-before-you-train-any.png",
      "content": "<p>I used to start projects the fun way: open a notebook, load the data, and go straight for the interesting model. A week later I'd have an F1 of 0.81 and no idea whether that was good. Was the problem easy? Was 0.81 what you'd get by guessing? I couldn't say, because I'd never checked.</p><p>These days the first thing I build is the most boring model I can think of. It takes ten minutes and it changes how I read every result after it.</p><h2>Start embarrassingly simple</h2><p>For classification, my first baseline is \"always predict the most common class\". For regression, it's \"always predict the mean\". It sounds pointless, but it tells you the floor. If 92% of your labels are the same class, 92% accuracy is not an achievement. It's the starting line.</p><pre><code>from sklearn.dummy import DummyClassifier\n\nbaseline = DummyClassifier(strategy=&quot;most_frequent&quot;)\nbaseline.fit(X_train, y_train)\nprint(&quot;floor:&quot;, baseline.score(X_test, y_test))</code></pre><p>After that I add one step up: a logistic regression or a small gradient-boosted tree with default settings. No tuning, no feature engineering beyond what's needed to make it run. This is the number a fancier model has to clearly beat to be worth the extra complexity.</p><h2>Decide the metric before you look at results</h2><p>This one took me a while to learn. If you pick the metric after seeing the numbers, you'll pick whichever one makes your model look best, without even meaning to. So I write it down first, usually in the README: \"We care about recall on the positive class at 90% precision.\" Once it's written down, I'm much less likely to quietly move the goalposts later.</p><h2>Keep the baseline in every table</h2><p>Every results table I share has the baseline as its first row. It's a small habit, but it stops conversations like \"the new model gets 0.84!\" from going anywhere until someone asks \"compared to what?\"</p><p>It also catches bugs. More than once, a model that looked great turned out to barely beat the dummy, and that's what made me go looking for the leak in the pipeline.</p><h2>When the baseline wins</h2><p>Sometimes the simple model is good enough. That's not a failure. A logistic regression that's 2% worse but trains in seconds, is easy to explain, and never surprises anyone in production is often the right thing to ship. Having the baseline there is what lets you make that call on purpose instead of by accident.</p><p>So: dumb model first, metric written down, baseline in every table. It's not glamorous, but it's saved me more time than any clever trick.</p>"
    },
    {
      "id": 15,
      "slug": "data-leakage-validation",
      "title": "Why your validation score lies: data leakage",
      "author": "Suraj Nahak",
      "date": "2026-09-24",
      "category": "Machine Learning",
      "tags": [
        "Data Leakage",
        "Validation",
        "Pitfalls"
      ],
      "excerpt": "The scariest bugs in ML don't crash anything. They just make your validation score look better than it should. Some leaks I've learned to check for.",
      "image": "uploads/blog_images/demo-why-your-validation-score-lies-data-leak.png",
      "content": "<p>A validation score that's too good should worry you more than one that's too low. A bad score at least tells you something honest. A suspiciously high one usually means information from the test set has leaked into training somewhere, and the model is getting credit for an answer it already saw.</p><p>Here are the leaks I check for now, roughly in the order I've been bitten by them.</p><h2>1. Preprocessing before the split</h2><p>This is the classic one. You scale or impute the whole dataset, then split it. The mean and standard deviation you used were partly computed from the test rows, so the test set isn't really unseen anymore.</p><p>The fix is to put every preprocessing step inside a pipeline, so it's fit on the training fold only:</p><pre><code>from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))\nscores = cross_val_score(model, X, y, cv=5)</code></pre><h2>2. The same person (or patient, or device) on both sides</h2><p>If your data has several rows per user, a random split will happily put some of a user's rows in train and the rest in test. The model learns to recognise the user, not the pattern. Scores look great, then real users show up and it falls apart.</p><p>Use a grouped split, and add a quick test so it can't silently regress:</p><pre><code>from sklearn.model_selection import GroupKFold\n\ncv = GroupKFold(n_splits=5)\nfor train_idx, test_idx in cv.split(X, y, groups=df[&quot;user_id&quot;]):\n    overlap = set(df.user_id.iloc[train_idx]) &amp; set(df.user_id.iloc[test_idx])\n    assert not overlap</code></pre><h2>3. Features from the future</h2><p>This is the hardest one to spot. A column like <code>days_until_churn</code> or <code>final_status</code> obviously knows the answer. But it's often subtler: a \"last updated\" timestamp that only changes after the event, or an aggregate computed over the whole history including dates after the prediction point.</p><p>My rule: for every feature, ask \"would I actually have this value at the moment I need to make the prediction?\" If the answer is \"not quite\", it goes.</p><h2>4. Time series split randomly</h2><p>If the data has a time order, shuffle-and-split lets the model train on Tuesday and get tested on Monday. Always split by time: train on the past, validate on what comes after.</p><h2>A quick sanity check</h2><p>When a score surprises me, I train a model to predict whether a row came from train or test. If it can tell them apart easily, something about the split is off. And if one feature is doing all the work in the real model, I look at that feature very closely before celebrating.</p><p>None of these leaks throw errors. That's the whole problem. You only catch them if you go looking.</p>"
    },
    {
      "id": 16,
      "slug": "dynamic-programming-explained",
      "title": "Dynamic programming without the fear",
      "author": "Suraj Nahak",
      "date": "2026-09-15",
      "category": "Algorithms",
      "tags": [
        "Algorithms",
        "Dynamic Programming",
        "Python"
      ],
      "excerpt": "Dynamic programming has a reputation for being hard. Most of the difficulty goes away once you write the slow recursive version first.",
      "image": "uploads/blog_images/demo-dynamic-programming-without-the-fear.png",
      "content": "<p>For a long time, dynamic programming was the topic I quietly hoped wouldn't come up. The solutions I read looked like magic: a 2D table, some indices, and a loop that somehow produced the answer. I could follow them, but I couldn't have written one.</p><p>What finally made it click was realising that almost nobody writes the table first. You write the slow, obvious recursive solution, and then you make it fast.</p><h2>Step 1: write the brute force recursion</h2><p>Take the classic coin change problem: what's the fewest coins that add up to an amount? Forget efficiency and just describe the choice. For any amount, I can use one coin of some value, then solve the smaller problem that's left.</p><pre><code>def min_coins(amount, coins):\n    if amount == 0:\n        return 0\n    if amount &lt; 0:\n        return float(&quot;inf&quot;)\n    return 1 + min(min_coins(amount - c, coins) for c in coins)</code></pre><p>This is correct, and it's painfully slow, because it solves the same sub-amounts over and over again.</p><h2>Step 2: remember answers you've already computed</h2><p>That repetition is the whole signal. If a function gets called with the same arguments many times, cache it. In Python that's a single line:</p><pre><code>from functools import lru_cache\n\ndef min_coins(amount, coins):\n    @lru_cache(maxsize=None)\n    def solve(a):\n        if a == 0:\n            return 0\n        if a &lt; 0:\n            return float(&quot;inf&quot;)\n        return 1 + min(solve(a - c) for c in coins)\n\n    result = solve(amount)\n    return -1 if result == float(&quot;inf&quot;) else result</code></pre><p>That's dynamic programming. Really. Each sub-amount is now solved once, so the running time drops from exponential to <code>amount × len(coins)</code>.</p><h2>Step 3 (optional): turn it into a table</h2><p>If recursion depth becomes a problem, or you want to save memory, you can flip it around and fill the answers bottom-up, smallest amount first:</p><pre><code>def min_coins(amount, coins):\n    best = [0] + [float(&quot;inf&quot;)] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c &lt;= a:\n                best[a] = min(best[a], best[a - c] + 1)\n    return -1 if best[amount] == float(&quot;inf&quot;) else best[amount]</code></pre><p>Compare this with the memoized version and you'll see it's the same logic. <code>best[a]</code> is just <code>solve(a)</code> written down in advance. The tables that used to scare me were never the starting point. They're what's left after a couple of mechanical steps.</p><h2>The two questions I ask now</h2><ul><li><strong>What's the state?</strong> The smallest set of values that fully describes a sub-problem (here, just the remaining amount).</li><li><strong>What's the choice?</strong> What decision do I make at each step, and how does it shrink the state?</li></ul><p>If I can answer both, the recursion more or less writes itself, and the rest is caching.</p>"
    },
    {
      "id": 17,
      "slug": "notebook-to-production-model-service",
      "title": "From notebook to service: packaging a model",
      "author": "Suraj Nahak",
      "date": "2026-09-06",
      "category": "MLOps",
      "tags": [
        "MLOps",
        "Docker",
        "Deployment"
      ],
      "excerpt": "A model that only runs in your notebook isn't finished. This is the minimum I do to turn one into something other people can actually call.",
      "image": "uploads/blog_images/demo-from-notebook-to-service-packaging-a-mod.png",
      "content": "<p>Every ML project I've worked on hits the same point: the model works in the notebook, and someone asks \"great, how do we use it?\" The honest answer is usually \"you'd have to run my notebook, in my environment, with the cells in the right order.\"</p><p>This post covers the minimum I do now to get from that point to a small service someone else can run. Nothing fancy, just the parts that tend to get skipped.</p><h2>Get the logic out of the notebook</h2><p>First, I move the preprocessing and prediction code into a plain Python module. The notebook is fine for exploring, but it hides state: a variable defined in a cell you deleted, or a cell that was run twice. A module run from a clean start can't hide anything.</p><p>The most important part is to save the preprocessing <em>with</em> the model. If the scaler or encoder lives in a separate step, sooner or later someone will use the wrong one.</p><pre><code>import joblib\nfrom sklearn.pipeline import make_pipeline\n\npipeline = make_pipeline(preprocessor, model)\npipeline.fit(X_train, y_train)\njoblib.dump(pipeline, &quot;model.joblib&quot;)</code></pre><h2>Wrap it in a tiny API</h2><p>I usually reach for FastAPI because it validates the input for me. If a request is missing a field, the caller gets a clear error instead of a confusing stack trace from deep inside scikit-learn.</p><pre><code>from fastapi import FastAPI\nfrom pydantic import BaseModel\nimport joblib\n\napp = FastAPI()\npipeline = joblib.load(&quot;model.joblib&quot;)  # load once at startup, not per request\nMODEL_VERSION = &quot;2026-09-01&quot;\n\nclass Features(BaseModel):\n    age: int\n    plan: str\n    monthly_usage: float\n\n@app.post(&quot;/predict&quot;)\ndef predict(f: Features):\n    row = [[f.age, f.plan, f.monthly_usage]]\n    score = float(pipeline.predict_proba(row)[0, 1])\n    return {&quot;score&quot;: score, &quot;model_version&quot;: MODEL_VERSION}</code></pre><p>Returning the model version with every prediction seems minor, but it's the first thing you want when someone reports a strange result two months later.</p><h2>Put it in a container</h2><p>A Dockerfile pins the Python version and dependencies, so \"works on my machine\" becomes \"works on any machine with Docker\".</p><pre><code>FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [&quot;uvicorn&quot;, &quot;service:app&quot;, &quot;--host&quot;, &quot;0.0.0.0&quot;, &quot;--port&quot;, &quot;8000&quot;]</code></pre><p>Pin exact versions in <code>requirements.txt</code>, especially scikit-learn. A model pickled with one version is not guaranteed to load correctly in another.</p><h2>A short checklist before calling it done</h2><ul><li>Can someone build and run it from the README alone?</li><li>Is there a <code>/health</code> endpoint for whatever runs the container?</li><li>Does one test send a real example through the API and check the response shape?</li><li>Are predictions logged somewhere, so you can monitor them later?</li></ul><p>None of this is hard, but it's the difference between a model and a product. A model that people can actually call is usually more valuable than a slightly better one stuck in a notebook.</p>"
    },
    {
      "id": 20,
      "slug": "reproducible-ml-experiments",
      "title": "Keeping experiments reproducible",
      "author": "Suraj Nahak",
      "date": "2026-08-10",
      "category": "Research",
      "tags": [
        "Reproducibility",
        "Experiments",
        "Research"
      ],
      "excerpt": "If I can't rerun an experiment and get the same number, I don't really know what the number means. The small habits that keep my results reproducible.",
      "image": "uploads/blog_images/demo-keeping-experiments-reproducible.png",
      "content": "<p>A few months after an experiment, someone asks how you got a particular result. You find the notebook, run it again, and get a different number. Not wildly different, just different enough that you can't say which one to trust.</p><p>That's happened to me enough times that reproducibility is now part of how I set up a project from day one. None of it takes long, and it all pays off later.</p><h2>Fix the randomness</h2><p>The obvious step, and still the one most often forgotten. There's more than one random number generator in a typical ML stack, so I set them all in one place:</p><pre><code>import random, numpy as np, torch\n\ndef set_seed(seed: int = 42):\n    random.seed(seed)\n    np.random.seed(seed)\n    torch.manual_seed(seed)\n    torch.cuda.manual_seed_all(seed)</code></pre><p>Even with seeds set, GPU runs can still differ slightly. I'm fine with that, as long as I know roughly how big the noise is. Running the same config with three different seeds tells you whether a 0.5% improvement is real or just luck.</p><h2>Make the config a real object</h2><p>Hyperparameters scattered across notebook cells are where reproducibility goes to die. I keep them in one dataclass and save it next to the results of every run:</p><pre><code>from dataclasses import dataclass, asdict\nimport json\n\n@dataclass\nclass Config:\n    seed: int = 42\n    lr: float = 3e-4\n    batch_size: int = 64\n    epochs: int = 20\n    data_version: str = &quot;v3&quot;\n\ncfg = Config(lr=1e-4)\njson.dump(asdict(cfg), open(f&quot;runs/{run_name}/config.json&quot;, &quot;w&quot;), indent=2)</code></pre><h2>Version the data, not just the code</h2><p>Git tracks code, but most of my \"why is this different?\" moments came from the data changing underneath me. A re-exported CSV, a fixed label, a new filter upstream. At minimum I record a hash of the training file with each run. For bigger projects, a tool like DVC does this properly.</p><h2>Record the environment</h2><p>A <code>pip freeze</code> saved with each run is cheap and has saved me more than once, when a library update quietly changed a default.</p><h2>What a run folder looks like for me</h2><ul><li><code>config.json</code>: every setting used</li><li><code>git_commit.txt</code>: the exact code version</li><li><code>data_hash.txt</code>: which data it saw</li><li><code>requirements.txt</code>: library versions</li><li><code>metrics.json</code>: the results</li></ul><p>With those five files I can explain any number I've reported, and that's really the point. A result you can't reproduce is just an anecdote.</p>"
    },
    {
      "id": 21,
      "slug": "python-automation-scripts",
      "title": "Automating repetitive work with small Python tools",
      "author": "Suraj Nahak",
      "date": "2026-08-01",
      "category": "Automation",
      "tags": [
        "Automation",
        "Python",
        "Tools"
      ],
      "excerpt": "Some of the most useful code I've written is under 50 lines. Why I keep writing small scripts for the boring parts of my work, and how I keep them safe to run.",
      "image": "uploads/blog_images/demo-automating-repetitive-work-with-small-py.png",
      "content": "<p>Some of the code I'm happiest with isn't a model or a system. It's a 40-line script that renames files, or one that pulls a report every Monday so nobody has to do it by hand. They're not impressive, but they get used every week.</p><h2>When is it worth automating?</h2><p>My rough rule: if I've done the same manual task three times and expect to do it again, I write a script. The first time I'm still learning what the task actually is. By the third, I know the steps well enough to write them down, and writing them down in Python isn't much more work than writing them in a document.</p><p>The other signal is when a task is easy to get slightly wrong. Copying numbers between spreadsheets, renaming hundreds of files, cleaning the same columns every export. People make small mistakes on tedious work. Scripts don't get bored.</p><h2>A shape that works for almost everything</h2><p>Most of my small tools look like this: take a folder or file as input, process each item, print what changed. The one feature I always add is <code>--dry-run</code>, which shows what <em>would</em> happen without touching anything.</p><pre><code>import argparse\nfrom pathlib import Path\n\ndef main():\n    parser = argparse.ArgumentParser(description=&quot;Tidy up exported report files.&quot;)\n    parser.add_argument(&quot;folder&quot;, type=Path)\n    parser.add_argument(&quot;--dry-run&quot;, action=&quot;store_true&quot;)\n    args = parser.parse_args()\n\n    for path in sorted(args.folder.glob(&quot;*.csv&quot;)):\n        new_name = path.name.lower().replace(&quot; &quot;, &quot;_&quot;)\n        if new_name == path.name:\n            continue\n        print(f&quot;{path.name}  -&gt;  {new_name}&quot;)\n        if not args.dry_run:\n            path.rename(path.with_name(new_name))\n\nif __name__ == &quot;__main__&quot;:\n    main()</code></pre><p>The dry run is what makes me (and anyone else) actually trust the script. You run it once, read the output, and only then let it change things.</p><h2>Things I've learned the hard way</h2><ul><li><strong>Never overwrite the original.</strong> Write to a new folder, or keep a backup. Undo isn't free in a script.</li><li><strong>Make it safe to run twice.</strong> If it crashes halfway, running it again should just finish the job, not double everything.</li><li><strong>Print what you did.</strong> A silent script that \"worked\" is hard to trust.</li><li><strong>Put a usage example at the top.</strong> In six months you won't remember the arguments.</li></ul><h2>Don't over-build it</h2><p>It's tempting to turn a useful script into a proper tool with a config system, plugins and a GUI. Usually that's a mistake. The value was in it being small and quick to change. I only add structure when the script actually needs it, for example when other people start relying on it.</p><p>If there's a task you dread every week, it's probably a good candidate. Start with the dry run.</p>"
    }
  ]
};
