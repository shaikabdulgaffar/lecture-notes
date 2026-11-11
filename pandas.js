/* =========================================================================
   pandas.js — Pandas library topics.
   Loaded by <script src="pandas.js"> in index.html (after app.js).
   Add further Pandas topics below with more registerTopic({...}) calls.
   ========================================================================= */

/* ---- Pandas Introduction (theory-only visual + runnable demo) ----------- */
(function () {
  const section = (num, title, body) => `
    <section class="intro-section">
      <div class="intro-section-head">
        ${num ? `<span class="intro-section-num">${num}</span>` : ""}
        <h3 class="intro-section-title">${title}</h3>
      </div>
      ${body}
    </section>`;

  const p = (text) => `<p class="intro-section-body">${text}</p>`;

  const chips = (items) => `
    <div class="intro-chip-grid">
      ${items.map(([icon, text]) => `<span class="intro-chip"><i class="${icon}"></i>${text}</span>`).join("")}
    </div>`;

  const callout = (icon, html) => `
    <div class="intro-callout">
      <i class="${icon}"></i>
      <div class="intro-callout-body">${html}</div>
    </div>`;

  const table = (heads, rows) => `
    <div class="intro-table-wrap">
      <table class="intro-table">
        <thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;

  const bullets = (items) => `<ul class="intro-bullets">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;

  // A code example with its own copy button (handled in app.js via data-copy-code).
  const codeBlock = (label, code) => `
    <div class="intro-code">
      <div class="intro-code-header">
        <span class="intro-code-label"><i class="fa-brands fa-python"></i> ${label}</span>
        <button class="copy-btn" type="button" data-copy-code><i class="fa-regular fa-copy"></i><span>Copy code</span></button>
      </div>
      <pre><code>${escapeHtml(code)}</code></pre>
    </div>`;

  // Folder (next to index.html) that holds the topic images.
  const IMAGE_DIR = "attachments/";

  // Image slot: shows the picture if the file exists in IMAGE_DIR, otherwise
  // a dashed placeholder that names the exact path to add.
  const figure = (file, alt) => `
    <figure class="intro-figure" data-scale="1">
      <div class="intro-figure-stage">
        <img src="${IMAGE_DIR + file}" alt="${alt}" onerror="this.closest('.intro-figure').classList.add('is-missing')">
      </div>
      <div class="intro-figure-tools" role="group" aria-label="Image controls">
        <button class="img-tool-btn" type="button" data-img-action="full" title="View full screen" aria-label="View image full screen"><i class="fa-solid fa-expand"></i></button>
        <button class="img-tool-btn" type="button" data-img-action="in" title="Zoom in image" aria-label="Zoom in image"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
        <button class="img-tool-btn" type="button" data-img-action="out" title="Zoom out image" aria-label="Zoom out image" disabled><i class="fa-solid fa-magnifying-glass-minus"></i></button>
      </div>
      <div class="intro-figure-missing"><i class="fa-regular fa-image"></i><span>Add image: <code>${IMAGE_DIR + file}</code></span></div>
    </figure>`;

  const numlist = (cls, items) => `
    <ol class="intro-numlist ${cls}">
      ${items.map(([title, text]) => `<li><strong>${title}</strong> – ${text}</li>`).join("")}
    </ol>`;

  registerTopic({
    library: "pandas",
    id: "introduction",
    title: "Pandas Introduction",
    difficulty: "Beginner",
    summary: "What Pandas is, where it came from, the problem it solves, and how Series and DataFrames work.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        <div class="intro-hero">
          <span class="intro-hero-badge"><i class="fa-solid fa-table"></i></span>
          <div>
            <h2 class="intro-hero-title">Pandas</h2>
            <p class="intro-hero-tag">Python's library for data manipulation, analysis and processing</p>
          </div>
        </div>

        ${section("1", "Definition and Nomenclature",
          p("Pandas is an open-source Python library designed for data manipulation, data analysis, and data processing. It provides high-performance, easy-to-use data structures and tools for working with structured data.") +
          callout("fa-solid fa-tag", `<p><strong>Name origin:</strong> the name is derived from the econometric and statistical term “Panel Data”, which refers to multidimensional structured data observed over time. The library was designed to handle such structured datasets efficiently.</p>`) +
          p("<br>Pandas can ingest and process data from a variety of sources:") +
          chips([
            ["fa-solid fa-file-csv", "CSV files"],
            ["fa-solid fa-file-excel", "Excel spreadsheets"],
            ["fa-solid fa-database", "SQL database tables"],
            ["fa-solid fa-file-code", "JSON data"],
            ["fa-solid fa-chart-pie", "Statistical datasets"],
            ["fa-solid fa-briefcase", "Business datasets"],
          ])
        )}

        ${section("2", "Historical Development",
          table(["Year", "Milestone"], [
            ["2008", "Development of Pandas commenced."],
            ["2009", "Pandas became an open-source project."],
            ["2010s", "Adoption increased significantly in data science and analytics."],
            ["2015", "Pandas became a NumFOCUS-sponsored project."],
            ["Present", "One of the most widely used Python libraries for data analysis."],
          ]) +
          callout("fa-solid fa-user-tie", `
            <p><strong>Creator:</strong> Wes McKinney</p>
            <p><strong>Organization:</strong> AQR Capital Management (a quantitative investment management company)</p>
            <p><strong>Motivation:</strong> the need for a powerful Python tool to manipulate and analyze financial data. NumPy provided numerical computing capabilities, but a more convenient solution was required for tabular and labeled data.</p>`)
        )}

        ${section("3", "The Problem Pandas Solves",
          callout("fa-solid fa-hourglass-half", `<p><strong>Before Pandas</strong></p><p>Data scientists relied on Python lists, NumPy arrays, dictionaries, and custom functions to handle structured data. Working with large datasets using these tools became inconvenient and inefficient, as each operation required manually coded solutions.</p>`) +
          callout("fa-solid fa-bolt", `<p><strong>With Pandas</strong></p><p>Pandas introduced specialized data structures that made common data operations significantly easier. A single library now provides multiple integrated tools:</p>`) +
          chips([
            ["fa-solid fa-filter", "Filtering"],
            ["fa-solid fa-arrow-down-wide-short", "Sorting"],
            ["fa-solid fa-link", "Joining"],
            ["fa-solid fa-layer-group", "Grouping"],
            ["fa-solid fa-eraser", "Missing-value handling"],
            ["fa-solid fa-arrows-rotate", "Data transformation"],
          ]) +
          callout("fa-solid fa-lightbulb", `<p><strong>Takeaway:</strong> Pandas converts raw data into analysis-ready data, making it easier to analyze and understand.</p>`)
        )}

        ${section("4", "Core Functions of Pandas",
          p("Pandas transforms raw data into a structured, analyzable form through four primary functions:") +
          table(["Function", "What it covers"], [
            ["Data Access &amp; Organization", "Read the data · Organize the data · Select required information · Filter records"],
            ["Data Cleaning", "Clean incorrect data · Handle missing values · Remove duplicate records"],
            ["Data Analysis", "Calculate statistics · Group data · Combine datasets · Analyze trends"],
            ["Data Preparation", "Prepare data for visualization · Prepare data for machine learning"],
          ])
        )}

        ${section("5", "Features of Pandas",
          table(["Feature", "Description"], [
            ["Data Structures", "Series (1D) and DataFrame (2D)"],
            ["Data Cleaning", "Tools for handling missing, incorrect, or duplicate data"],
            ["Data Selection", "Efficient indexing and selection mechanisms"],
            ["Data Filtering", "Conditional extraction of records"],
            ["Data Aggregation", "Summary statistics and grouped computations"],
            ["Grouping", "Split-apply-combine operations"],
            ["Data Integration", "Merging and joining datasets"],
            ["File Handling", "Reading from and writing to multiple file formats"],
          ])
        )}

        ${section("6", "Applications of Pandas",
          p("Pandas is utilized across multiple domains:") +
          table(["Domain", "How Pandas is used"], [
            ["Data Analytics", "Exploratory data analysis and reporting"],
            ["Data Science", "End-to-end data workflows"],
            ["Business Analytics", "Business intelligence and decision support"],
            ["Machine Learning", "Feature engineering and data preprocessing"],
            ["Scientific Research", "Handling experimental and observational data"],
            ["Education", "Teaching data manipulation and analysis"],
          ])
        )}

        ${section("7", "Advantages of Pandas",
          numlist("is-pro", [
            ["Easy to Use", "intuitive API and syntax"],
            ["Powerful Data Structures", "Series and DataFrame"],
            ["Excellent Data Cleaning Capabilities", "robust handling of missing and inconsistent data"],
            ["Works Well with Other Python Libraries", "interoperability with NumPy, Matplotlib, Scikit-learn, etc."],
            ["Supports Multiple Data Formats", "CSV, Excel, SQL, JSON, and more"],
            ["Powerful Grouping and Aggregation", "efficient split-apply-combine operations"],
            ["Open Source", "freely available and community-supported"],
            ["Excellent for Tabular Data", "optimized for structured, spreadsheet-like data"],
          ])
        )}

        ${section("8", "Disadvantages of Pandas",
          numlist("is-con", [
            ["High Memory Usage", "in-memory processing can be resource-intensive"],
            ["Not Ideal for Extremely Large Datasets", "performance degrades with data that exceeds available memory"],
            ["Performance Limitations", "not optimized for all computational workloads"],
            ["Learning Curve", "requires time to master its full capabilities"],
            ["Not Primarily a Visualization Library", "relies on external libraries (e.g., Matplotlib, Seaborn) for visualization"],
          ])
        )}

        ${section("9.1", "Comparative Analysis: Pandas vs. NumPy",
          table(["Aspect", "NumPy", "Pandas"], [
            ["Purpose", "Numerical computing", "Data manipulation and analysis"],
            ["Data Structures", "Mainly arrays", "Series and DataFrames"],
            ["Data Types", "Primarily numerical data", "Numerical + categorical + textual data"],
            ["Labels", "Less focus on labels", "Strong support for labels"],
            ["Main Operations", "Mathematical operations", "Data cleaning and analysis"],
            ["Common Use", "Scientific computing", "Business/data analytics"],
          ])
        )}

        ${section("9.2", "Comparative Analysis: Pandas vs. Excel",
          table(["Aspect", "Excel", "Pandas"], [
            ["Interface", "GUI-based", "Programming-based"],
            ["Analysis", "Good for manual analysis", "Good for automated analysis"],
            ["Workflow", "Suitable for interactive spreadsheets", "Suitable for repeatable workflows"],
            ["Flexibility", "Limited programming flexibility", "Highly programmable"],
            ["Operations", "Manual operations are common", "Operations can be automated"],
            ["Typical Use", "Good for smaller business tasks", "Excellent for data-processing workflows"],
          ])
        )}

        ${section("10", "Core Data Structures: Series vs. DataFrame",
          table(["Feature", "Pandas Series", "Pandas DataFrame"], [
            ["Dimensionality", "1D (one-dimensional)", "2D (two-dimensional)"],
            ["Structure", "A single column with an index", "A spreadsheet-like table with rows and columns"],
            ["Data Types", "Contains elements of a single data type", "Can contain heterogeneous data types across columns"],
            ["Conceptual Analogy", "A standard Python list or a single Excel column", "A Python dictionary of lists or a full Excel sheet"],
            ["Creation Method", "<code>pd.Series(data)</code>", "<code>pd.DataFrame(data)</code>"],
          ])
        )}
      `;
    },
  });

  /* ---- Indexing and Slicing (Series + DataFrame, loc / iloc) ---------------- */
  // Small datasets drive every diagram AND every printed output, so the pictures,
  // the code and the results always agree. mark = tag a row as the slice end.
  const DS_S  = { series: true, idx: [0, 1, 2, 3], cols: ["value"], data: [[10], [20], [30], [40]] };
  const DS_C  = { series: true, idx: ["Ali", "Ayesha", "Ravi"], cols: ["value"], data: [[85], [92], [76]] };
  const DS_DF = { idx: [0, 1, 2, 3], cols: ["ID", "Name", "Age"], data: [[101, "Ali", 20], [102, "Ayesha", 21], [103, "Ravi", 19], [104, "John", 22]] };
  const DS_DI = { idxName: "ID", idx: [101, 102, 103, 104], cols: ["Name", "Age"], data: [["Ali", 20], ["Ayesha", 21], ["Ravi", 19], ["John", 22]] };
  const R4 = [0, 1, 2, 3];

  const IX = {
    sI0: { d: DS_S, code: "print(s.iloc[0])",          r: [0],       c: [0], kind: "scalar" },
    sL2: { d: DS_S, code: "print(s.loc[2])",           r: [2],       c: [0], kind: "scalar" },
    sIM: { d: DS_S, code: "print(s.iloc[[0, 2]])",     r: [0, 2],    c: [0], kind: "series" },
    sLM: { d: DS_S, code: "print(s.loc[[0, 2]])",      r: [0, 2],    c: [0], kind: "series" },
    sIS: { d: DS_S, code: "print(s.iloc[0:3])",        r: [0, 1, 2], c: [0], kind: "series", mark: { 3: "x" } },
    sLS: { d: DS_S, code: "print(s.loc[0:2])",         r: [0, 1, 2], c: [0], kind: "series", mark: { 2: "i" } },
    cL:  { d: DS_C, code: 's.loc["Ayesha"]',           r: [1],       c: [0], kind: "scalar" },
    cI:  { d: DS_C, code: "s.iloc[1]",                 r: [1],       c: [0], kind: "scalar" },
    cS:  { d: DS_C, code: 'print(s.loc["Ali":"Ayesha"])', r: [0, 1], c: [0], kind: "series", mark: { 1: "i" } },
    dI0: { d: DS_DF, code: "print(df.iloc[0])",        r: [0],       c: [0, 1, 2], kind: "row" },
    dIM: { d: DS_DF, code: "print(df.iloc[[0, 2]])",   r: [0, 2],    c: [0, 1, 2], kind: "frame" },
    dIR: { d: DS_DF, code: "print(df.iloc[0:2])",      r: [0, 1],    c: [0, 1, 2], kind: "frame", mark: { 2: "x" } },
    dL1: { d: DS_DI, code: "print(df.loc[101])",       r: [0],       c: [0, 1], kind: "row" },
    dLM: { d: DS_DI, code: "print(df.loc[[101, 103]])", r: [0, 2],    c: [0, 1], kind: "frame" },
    dLR: { d: DS_DI, code: "print(df.loc[101:103])",   r: [0, 1, 2], c: [0, 1], kind: "frame", mark: { 2: "i" } },
    k1:  { d: DS_DI, code: 'print(df["Name"])',        r: R4,        c: [0],    kind: "col" },
    k2:  { d: DS_DI, code: 'print(df[["Name", "Age"]])', r: R4,      c: [0, 1], kind: "frame" },
    k3:  { d: DS_DI, code: 'print(df.loc[:, "Name":"Age"])', r: R4,  c: [0, 1], kind: "frame" },
    t1:  { d: DS_DI, code: "print(df.iloc[0:2, 0:2])", r: [0, 1],    c: [0, 1], kind: "frame", mark: { 2: "x" } },
    t2:  { d: DS_DI, code: 'print(df.loc[101:103, "Name":"Age"])', r: [0, 1, 2], c: [0, 1], kind: "frame", mark: { 2: "i" } },
  };
  const KIND = { scalar: "a single value", series: "a Series", col: "a Series", row: "a Series", frame: "a DataFrame" };

  // Prints a Series the way pandas does.
  const ixPrint = (labs, vals, name, idxName) => {
    const lw = Math.max(...labs.map((s) => s.length)), vw = Math.max(...vals.map((v) => String(v).length));
    const dt = vals.every((v) => typeof v === "number") ? "int64" : "object";
    return (idxName ? idxName + "\n" : "") + labs.map((l, i) => l.padEnd(lw) + "    " + String(vals[i]).padStart(vw)).join("\n") +
      `\n${name !== undefined ? `Name: ${name}, ` : ""}dtype: ${dt}`;
  };
  const ixOut = (e) => {
    const d = e.d, rs = e.r, cs = e.c, v = (i, j) => d.data[i][j];
    if (e.kind === "scalar") return String(v(rs[0], cs[0]));
    if (e.kind === "series" || e.kind === "col") return ixPrint(rs.map((i) => String(d.idx[i])), rs.map((i) => v(i, cs[0])), d.series ? undefined : d.cols[cs[0]], d.idxName);
    if (e.kind === "row") return ixPrint(cs.map((j) => d.cols[j]), cs.map((j) => v(rs[0], j)), d.idx[rs[0]]);
    const w = cs.map((j) => Math.max(d.cols[j].length, ...rs.map((i) => String(v(i, j)).length)));
    const iw = Math.max((d.idxName || "").length, ...rs.map((i) => String(d.idx[i]).length));
    const head = " ".repeat(iw) + cs.map((j, k) => "  " + d.cols[j].padStart(w[k])).join("");
    return [head, ...(d.idxName ? [d.idxName] : []),
      ...rs.map((i) => String(d.idx[i]).padEnd(iw) + cs.map((j, k) => "  " + String(v(i, j)).padStart(w[k])).join(""))].join("\n");
  };
  const ixAll = (d) => ixOut({ d, r: d.idx.map((_, i) => i), c: d.cols.map((_, j) => j), kind: d.series ? "series" : "frame" });

  // Diagram: blue = labels, green = positions; chosen cells pop in one by one;
  // slice-end rows are tagged "end included" / "end excluded".
  const ixGrid = (d, e, pos, caption) => {
    let n = 0;
    const has = !!e;
    const head = d.cols.map((h, j) => `<th>${h}${pos && d.cols.length > 1 ? `<small>pos ${j}</small>` : ""}</th>`).join("");
    const body = d.data.map((row, i) => {
      const tag = has && e.mark && e.mark[i];
      return `<tr><th>${d.idx[i]}${pos ? `<small>pos ${i}</small>` : ""}${tag ? `<small class="idx-tag ${tag}">${tag === "x" ? "end excluded" : "end included"}</small>` : ""}</th>` +
        row.map((v, j) => {
          const on = has && e.r.includes(i) && e.c.includes(j);
          return `<td class="${on ? "is-sel" : has ? "is-dim" : ""}"${on ? ` style="--i:${n++}"` : ""}>${v}</td>`;
        }).join("") + "</tr>";
    }).join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner">${d.idxName || ""}</th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
      (caption ? `<p class="idx-cap">${caption}</p>` : "");
  };

  // Code, picture, output, then the explanation (the order used in the notes).
  const ixEx = (key, after) => {
    const e = IX[key];
    return codeBlock("Code", e.code) +
      ixGrid(e.d, e, false, `Highlighted cells are selected. Result: <strong>${KIND[e.kind]}</strong>`) +
      codeBlock("Output", ixOut(e)) + (after ? p(after) : "");
  };
  const sub = (num, title) => `<h4 class="intro-subhead">${num} ${title}</h4>`;
  const part = (title) => section("", title, "").replace('class="intro-section"', 'class="intro-section idx-part"');

  registerTopic({
    library: "pandas",
    id: "indexing",
    title: "Indexing and Slicing",
    difficulty: "Beginner",
    summary: "Access specific data in a Series or DataFrame by label or position with loc and iloc, and select ranges with slicing.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        <div class="intro-hero">
          <span class="intro-hero-badge"><i class="fa-solid fa-crosshairs"></i></span>
          <div>
            <h2 class="intro-hero-title">Indexing, Slicing and Selecting</h2>
            <p class="intro-hero-tag">Accessing specific data from a Series or DataFrame</p>
          </div>
        </div>

        ${section("", "Introduction",
          p("In Pandas, indexing, slicing, and selecting are important operations used to access specific data from a Series or DataFrame.") +
          p("These operations help us retrieve individual values, select multiple elements, extract rows and columns, and work with specific portions of a dataset.") +
          p("For example, in a student database, we may want to retrieve one student’s marks, select the first five students, or display only the names and ages of students. Pandas provides indexing and slicing techniques to perform these operations efficiently.")
        )}

        ${part("Part 1: Introduction to Indexing and Slicing")}

        ${section("1", "What is indexing in Pandas?",
          callout("fa-solid fa-book", `<p><strong>Definition:</strong> Indexing is the process of accessing specific elements or values in a Pandas Series or DataFrame using their positions or labels.</p>`) +
          p("Indexing allows us to retrieve individual values, rows, columns, or combinations of rows and columns.") +
          p("For example, consider the following student data:") +
          table(["Index", "Name", "Marks"], [["0", "Ali", "85"], ["1", "Ayesha", "92"], ["2", "Ravi", "76"], ["3", "John", "88"]]) +
          p("Using indexing, we can retrieve Ali’s marks, Ayesha’s record, or a specific column.")
        )}

        ${section("2", "Types of indexing in Pandas",
          p("Pandas provides two primary indexing methods:") +
          sub("A.", "Integer-position-based indexing: <code>iloc</code>") +
          p("<code>iloc</code> stands for integer-location-based indexing. It selects data using the integer positions of rows or columns, starting from <code>0</code>.") +
          codeBlock("Example", "df.iloc[0]") +
          p("This selects the first row of the DataFrame.") +
          sub("B.", "Label-based indexing: <code>loc</code>") +
          p("<code>loc</code> selects data using index labels and column names.") +
          codeBlock("Example", "df.loc[101]") +
          p("If <code>101</code> is a row index label, this selects the row labeled <code>101</code>.") +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> A row’s integer position and its index label are not necessarily the same. For example, the first row might have position <code>0</code> but label <code>101</code>.</p>`) +
          ixGrid(DS_DI, null, true, "<strong>Blue</strong> = labels (used by <code>loc</code>) &middot; <strong>Green</strong> = positions (used by <code>iloc</code>). The first row has position 0 but label 101.")
        )}

        ${section("3", "Difference between <code>loc</code> and <code>iloc</code>",
          table(["Feature", "loc", "iloc"], [
            ["Full form", "Label-based location", "Integer-location-based indexing"],
            ["Selection method", "Labels", "Integer positions"],
            ["Row example", "<code>df.loc[101]</code>", "<code>df.iloc[0]</code>"],
            ["Column example", '<code>df.loc[:, "Name"]</code>', "<code>df.iloc[:, 1]</code>"],
            ["Slicing rule", "Ending label included when present", "Ending position excluded"],
            ["Best used when", "Labels or column names are known", "Positions are known"],
          ]).replace('class="intro-table"', 'class="intro-table is-wrap"') +
          codeBlock("Example", "df.loc[101]    # Select row with label 101\ndf.iloc[0]     # Select the first row by position") +
          p("These two expressions select the same row only if the first row’s index label is <code>101</code>.")
        )}

        ${section("4", "What is slicing in Pandas?",
          callout("fa-solid fa-book", `<p><strong>Definition:</strong> Slicing is the process of selecting a range of elements, rows, or columns from a Series or DataFrame.</p>`) +
          p("Slicing is useful when we want to retrieve a continuous portion of data instead of selecting just one element. For example, we can select the first three rows of a DataFrame or a range of values from a Series.") +
          p("Pandas supports slicing through both <code>iloc</code> and <code>loc</code>.") +
          sub("A.", "Slicing using <code>iloc</code>") +
          codeBlock("Syntax", "DataFrame.iloc[start:end]") +
          p("The starting position is included, but the ending position is excluded.") +
          codeBlock("Example", "df.iloc[0:3]") +
          p("This selects row positions <code>0</code>, <code>1</code>, and <code>2</code>.") +
          sub("B.", "Slicing using <code>loc</code>") +
          codeBlock("Syntax", "DataFrame.loc[start_label:end_label]") +
          p("The starting label and ending label are included when the ending label exists and the slice follows the index order.") +
          codeBlock("Example", "df.loc[101:103]") +
          p("If the DataFrame has index labels <code>101</code>, <code>102</code>, <code>103</code>, and <code>104</code> in that order, this selects labels <code>101</code>, <code>102</code>, and <code>103</code>.")
        )}

        ${part("Part 2: Series: Indexing, Slicing, and Selecting Elements")}

        ${section("1", "What is a Series in Pandas?",
          p("A Series is a one-dimensional labeled data structure in Pandas. It stores a collection of values along with their corresponding index labels.") +
          p("Think of a Series as a single column of marks in a classroom, where each student has a corresponding index label.")
        )}

        ${section("2", "Creating a Series",
          codeBlock("Code", "import pandas as pd\n\ns = pd.Series([10, 20, 30, 40])\n\nprint(s)") +
          ixGrid(DS_S, null, true, "A Series is one labeled column: index labels on the left, values on the right.") +
          codeBlock("Output", ixAll(DS_S)) +
          bullets(["<code>0, 1, 2, 3</code> are the index labels.", "<code>10, 20, 30, 40</code> are the values.", "Pandas automatically creates a default integer index starting from <code>0</code>."])
        )}

        ${section("3", "Indexing in a Series",
          sub("A.", "Accessing a value using <code>iloc</code>") +
          p("<code>iloc</code> selects an element based on its integer position, starting from <code>0</code>.") +
          codeBlock("Syntax", "Series.iloc[position]") + ixEx("sI0", "Position <code>0</code> contains the value <code>10</code>.") +
          sub("B.", "Accessing a value using <code>loc</code>") +
          p("<code>loc</code> selects an element using its index label.") +
          codeBlock("Syntax", "Series.loc[label]") + ixEx("sL2", "The index label <code>2</code> corresponds to the value <code>30</code>.") +
          p("In this example, the default index labels and integer positions look similar. However, they are different concepts.")
        )}

        ${section("4", "Selecting multiple elements in a Series",
          sub("A.", "Using <code>iloc</code>") + ixEx("sIM", "Position <code>0</code> selects <code>10</code>, and position <code>2</code> selects <code>30</code>.") +
          sub("B.", "Using <code>loc</code>") + ixEx("sLM", "Here, <code>[0, 2]</code> represents index labels rather than positions.")
        )}

        ${section("5", "Slicing a Series",
          sub("A.", "Slicing using <code>iloc</code>") +
          codeBlock("Syntax", "Series.iloc[start:end]") + p("The ending position is excluded.") +
          ixEx("sIS", "Positions <code>0</code>, <code>1</code>, and <code>2</code> are selected. Position <code>3</code> is excluded.") +
          sub("B.", "Slicing using <code>loc</code>") +
          codeBlock("Syntax", "Series.loc[start_label:end_label]") + p("The ending label is included when it exists in the index and the slice follows the index order.") +
          ixEx("sLS", "The labels <code>0</code>, <code>1</code>, and <code>2</code> are included.")
        )}

        ${section("6", "Creating a Series with custom index labels",
          p("Instead of using the default integer index, we can create a Series with our own labels.") +
          codeBlock("Code", 's = pd.Series(\n    [85, 92, 76],\n    index=["Ali", "Ayesha", "Ravi"]\n)\n\nprint(s)') +
          ixGrid(DS_C, null, true, "Now labels and positions are clearly different: <strong>Ayesha</strong> is the label, <strong>1</strong> is the position.") +
          codeBlock("Output", ixAll(DS_C)) +
          p("Here, <code>Ali</code>, <code>Ayesha</code>, and <code>Ravi</code> are custom index labels.") +
          sub("A.", "Accessing a value by label") +
          codeBlock("Code", 'print(s.loc["Ayesha"])') + codeBlock("Output", "92") +
          p("The value <code>92</code> is selected using the label <code>\"Ayesha\"</code>.") +
          sub("B.", "Accessing a value by position") +
          codeBlock("Code", "print(s.iloc[1])") + codeBlock("Output", "92") +
          p("The value <code>92</code> is selected using position <code>1</code>. Both expressions return <code>92</code>, but <code>loc</code> uses the label <code>\"Ayesha\"</code>, whereas <code>iloc</code> uses position <code>1</code>.") +
          ixGrid(DS_C, IX.cL, true, "Same cell, two ways to reach it: by label (<code>loc</code>) or by position (<code>iloc</code>).") +
          sub("C.", "Slicing using custom labels") +
          ixEx("cS", "The slice includes both <code>\"Ali\"</code> and <code>\"Ayesha\"</code> because <code>loc</code> includes the ending label.")
        )}

        ${part("Part 3: DataFrame: Indexing, Slicing, and Selecting Rows and Columns")}

        ${section("1", "What is a DataFrame in Pandas?",
          p("A DataFrame is a two-dimensional labeled data structure consisting of rows and columns.") +
          p("Think of a DataFrame as a student information table containing student IDs, names, and ages.") +
          table(["ID", "Name", "Age"], [["101", "Ali", "20"], ["102", "Ayesha", "21"], ["103", "Ravi", "19"], ["104", "John", "22"]]) +
          p("A DataFrame contains:") +
          bullets(["<strong>Rows:</strong> Represent individual records.", "<strong>Columns:</strong> Represent attributes or variables.", "<strong>Index:</strong> Identifies rows using labels.", "<strong>Column names:</strong> Identify individual columns."])
        )}

        ${section("2", "Indexing in a DataFrame",
          p("Indexing means selecting specific rows, columns, or individual values from a DataFrame. Pandas provides two main indexing methods: <code>iloc</code> and <code>loc</code>.") +
          sub("A.", "<code>iloc</code>: integer-position-based indexing") +
          p("<code>iloc</code> selects rows and columns using integer positions, starting from <code>0</code>.") +
          codeBlock("Syntax", "DataFrame.iloc[row_position, column_position]") +
          bullets(["Uses integer positions, slices, or lists of integers.", "Position counting starts from <code>0</code>.", "The ending position is excluded in slicing."]) +
          p("<strong>Use case:</strong> when you know the position of a row or column.") +
          sub("B.", "<code>loc</code>: label-based indexing") +
          p("<code>loc</code> selects rows and columns using their labels, such as row index labels and column names.") +
          codeBlock("Syntax", "DataFrame.loc[row_label, column_label]") +
          bullets(["Uses labels, lists of labels, slices, or Boolean conditions.", "The ending label is included in slicing when it exists in the index and the slice follows the index order."]) +
          p("<strong>Use case:</strong> when you know the row label or column name.")
        )}

        ${section("3", "Creating a DataFrame",
          codeBlock("Code", 'import pandas as pd\n\ndata = {\n    "ID": [101, 102, 103, 104],\n    "Name": ["Ali", "Ayesha", "Ravi", "John"],\n    "Age": [20, 21, 19, 22]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)') +
          ixGrid(DS_DF, null, true, "Row labels (blue) are the default <code>0–3</code>; positions (green) match them for now.") +
          codeBlock("Output", ixAll(DS_DF)) +
          p("The DataFrame contains four rows and three columns. The default row index labels are <code>0</code>, <code>1</code>, <code>2</code>, and <code>3</code>.")
        )}

        ${section("4", "Selecting rows using <code>iloc</code>",
          sub("A.", "Selecting a single row") + ixEx("dI0", "<code>df.iloc[0]</code> selects the row at position <code>0</code>. The result is a Series.") +
          sub("B.", "Selecting multiple rows") + ixEx("dIM", "Positions <code>0</code> and <code>2</code> select Ali’s and Ravi’s records.") +
          sub("C.", "Selecting a range of rows") + ixEx("dIR", "Positions <code>0</code> and <code>1</code> are selected because the ending position <code>2</code> is excluded.")
        )}

        ${section("5", "Selecting rows using <code>loc</code>",
          p("To understand label-based indexing, set the <code>ID</code> column as the DataFrame index.") +
          codeBlock("Code", 'df = df.set_index("ID")\n\nprint(df)') +
          ixGrid(DS_DI, null, true, "After <code>set_index(\"ID\")</code> the row labels become 101–104, while positions still start at 0.") +
          codeBlock("Output", ixAll(DS_DI)) +
          p("Now, <code>101</code>, <code>102</code>, <code>103</code>, and <code>104</code> are the row index labels.") +
          sub("A.", "Selecting a single row by label") + ixEx("dL1", "This selects the row whose index label is <code>101</code>.") +
          sub("B.", "Selecting multiple rows by labels") + ixEx("dLM", "The list <code>[101, 103]</code> specifies the row labels to select.") +
          sub("C.", "Selecting a range of rows by labels") + ixEx("dLR", "The ending label <code>103</code> is included.")
        )}

        ${section("6", "Selecting columns in a DataFrame",
          sub("A.", "Selecting a single column") + ixEx("k1", "<code>df[\"Name\"]</code> returns the <code>Name</code> column as a Series.") +
          sub("B.", "Selecting multiple columns") + ixEx("k2", "The expression <code>df[[\"Name\", \"Age\"]]</code> returns a DataFrame containing both columns.") +
          callout("fa-solid fa-lightbulb", `<p><strong>Remember:</strong></p>`) +
          codeBlock("Remember", 'df["Name"]              # Single column: Series\ndf[["Name", "Age"]]     # Multiple columns: DataFrame') +
          sub("C.", "Selecting a range of columns using <code>loc</code>") + ixEx("k3", "") +
          bullets(["The first colon (<code>:</code>) selects all rows.", "<code>\"Name\":\"Age\"</code> selects columns from <code>Name</code> through <code>Age</code>.", "Both column labels are included."])
        )}

        ${section("7", "Selecting rows and columns together",
          sub("A.", "Using <code>iloc</code>") +
          p("Select the first two rows and the first two columns.") + ixEx("t1", "") +
          bullets(["<code>0:2</code> before the comma selects row positions <code>0</code> and <code>1</code>.", "<code>0:2</code> after the comma selects column positions <code>0</code> and <code>1</code>.", "Both ending positions are excluded."]) +
          sub("B.", "Using <code>loc</code>") +
          p("Select rows with labels <code>101</code> to <code>103</code> and columns from <code>Name</code> to <code>Age</code>.") + ixEx("t2", "") +
          bullets(["<code>101:103</code> selects row labels <code>101</code>, <code>102</code>, and <code>103</code>.", "<code>\"Name\":\"Age\"</code> selects both columns.", "The ending row and column labels are included."])
        )}
      `;
    },
  });

  /* ---- Filtering (boolean indexing) with True/False mask diagrams ---------- */
  // Each example carries a real predicate, so the mask, the highlighted rows and
  // the printed output are all computed from the same rule as the code shown.
  const F4 = { cols: ["Name", "Age", "Marks"], rows: [["Ali", 20, 85], ["Ayesha", 21, 90], ["Ravi", 19, 70], ["John", 25, 95]] };
  const F5 = { cols: F4.cols, rows: [...F4.rows, ["Sara", 22, 88]] };
  const frow = (d, i) => ({ Name: d.rows[i][0], Age: d.rows[i][1], Marks: d.rows[i][2] });

  const FX = {
    s1: { ds: F4, code: 'df[df["Age"] > 20]',        f: (r) => r.Age > 20 },
    s2: { ds: F4, code: 'df[df["Marks"] < 90]',      f: (r) => r.Marks < 90 },
    s3: { ds: F4, code: 'df[df["Age"] >= 20]',       f: (r) => r.Age >= 20 },
    s4: { ds: F4, code: 'df[df["Marks"] <= 85]',     f: (r) => r.Marks <= 85 },
    s5: { ds: F4, code: 'df[df["Name"] == "Ali"]',   f: (r) => r.Name === "Ali" },
    s6: { ds: F4, code: 'df[df["Age"] != 20]',       f: (r) => r.Age !== 20 },
    m1: { ds: F4, note: "Students with Age > 20 AND Marks > 80", code: 'df[(df["Age"] > 20) & (df["Marks"] > 80)]', f: (r) => r.Age > 20 && r.Marks > 80 },
    m2: { ds: F4, note: "Students with Age < 20 OR Marks > 90", code: 'df[(df["Age"] < 20) | (df["Marks"] > 90)]', f: (r) => r.Age < 20 || r.Marks > 90 },
    m3: { ds: F4, note: "Students whose Age is NOT greater than 20", code: 'df[~(df["Age"] > 20)]', f: (r) => !(r.Age > 20) },
    m4: { ds: F4, note: "(Age > 20 AND Marks > 80) OR Name == 'Ali'", code: 'df[((df["Age"] > 20) & (df["Marks"] > 80)) | (df["Name"] == "Ali")]', f: (r) => (r.Age > 20 && r.Marks > 80) || r.Name === "Ali" },
    p1: { ds: F5, note: "Select students whose name is Ali or John", code: 'df[df["Name"].isin(["Ali", "John"])]', f: (r) => ["Ali", "John"].includes(r.Name) },
    p2: { ds: F5, note: "Select students with Age between 20 and 22", code: 'df[df["Age"].between(20, 22)]', f: (r) => r.Age >= 20 && r.Age <= 22 },
    p3: { ds: F5, note: "Names containing 'a' or 'A'", code: 'df[df["Name"].str.contains("a", case=False)]', f: (r) => r.Name.toLowerCase().includes("a") },
    p4: { ds: F5, note: "Names starting with 'A'", code: 'df[df["Name"].str.startswith("A")]', f: (r) => r.Name.startsWith("A") },
    p5: { ds: F5, note: "Names ending with 'n'", code: 'df[df["Name"].str.endswith("n")]', f: (r) => r.Name.endsWith("n") },
    p6: { ds: F5, note: "Students with Marks > 85", code: 'df.query("Marks > 85")', f: (r) => r.Marks > 85 },
    p7: { ds: F5, note: "Age > 20 and Marks >= 90", code: 'df.query("Age > 20 and Marks >= 90")', f: (r) => r.Age > 20 && r.Marks >= 90 },
  };

  // Printed table for the chosen row positions, formatted like pandas.
  const fOut = (d, keep) => {
    const w = d.cols.map((c, j) => Math.max(c.length, ...keep.map((i) => String(d.rows[i][j]).length)));
    const iw = Math.max(...keep.map((i) => String(i).length));
    const head = " ".repeat(iw) + d.cols.map((c, j) => "  " + c.padStart(w[j])).join("");
    return [head, ...keep.map((i) => String(i).padEnd(iw) + d.rows[i].map((v, j) => "  " + String(v).padStart(w[j])).join(""))].join("\n");
  };
  const fKeep = (e) => e.ds.rows.map((_, i) => i).filter((i) => e.f(frow(e.ds, i)));
  const fAll = (d) => d.rows.map((_, i) => i);

  // The diagram: a True/False "mask" column; rows with True light up, the rest fade.
  const fGrid = (e, caption) => {
    let n = 0;
    const d = e.ds;
    const head = d.cols.map((c) => `<th>${c}</th>`).join("");
    const body = d.rows.map((row, i) => {
      const on = e.f(frow(d, i));
      const st = on ? ` style="--i:${n++}"` : "";
      return `<tr><th>${i}</th>${row.map((v) => `<td class="${on ? "is-sel" : "is-dim"}"${st}>${v}</td>`).join("")}<td class="fx-mask ${on ? "t" : "f"}">${on ? "True" : "False"}</td></tr>`;
    }).join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner"></th>${head}<th class="fx-mask-h">condition</th></tr></thead><tbody>${body}</tbody></table></div>` +
      (caption ? `<p class="idx-cap">${caption}</p>` : "");
  };

  const fEx = (key) => {
    const e = FX[key], kept = fKeep(e);
    return codeBlock("Code", (e.note ? "# " + e.note + "\n" : "") + e.code) +
      fGrid(e, `Each row gets <strong>True</strong> or <strong>False</strong>; only the True rows (highlighted) are kept: <strong>${kept.length} of ${e.ds.rows.length}</strong> rows.`) +
      codeBlock("Output", fOut(e.ds, kept));
  };
  const fData = (d, label) => codeBlock(label,
    ["import pandas as pd", "", "data = {",
      `    "Name": [${d.rows.map((r) => `"${r[0]}"`).join(", ")}],`,
      `    "Age": [${d.rows.map((r) => r[1]).join(", ")}],`,
      `    "Marks": [${d.rows.map((r) => r[2]).join(", ")}]`,
      "}", "df = pd.DataFrame(data)", "print(df)"].join("\n")) +
    codeBlock("Output", fOut(d, fAll(d)));

  const fExplorer = () => {
    const groups = [["Single", ["s1", "s2", "s3", "s4", "s5", "s6"]], ["Multiple", ["m1", "m2", "m3", "m4"]], ["Special", ["p1", "p2", "p3", "p4", "p5", "p6", "p7"]]];
    return `
      <div class="idx-explorer" id="fxExplorer">
        ${groups.map(([name, keys]) => `
          <div class="idx-group"><span class="idx-group-name">${name}</span>
            ${keys.map((k) => `<button type="button" class="idx-chip" data-k="${k}">${escapeHtml(FX[k].code)}</button>`).join("")}
          </div>`).join("")}
        <div class="idx-controls"><button type="button" class="idx-play" id="fxPlay"><i class="fa-solid fa-play"></i><span>Play all</span></button></div>
        <div class="idx-stage">
          <div class="idx-stage-top"><code class="idx-ex-code"></code><span class="idx-badge"></span></div>
          <div class="idx-ex-grid"></div>
          <pre class="idx-ex-out"></pre>
        </div>
      </div>`;
  };

  const mountFxExplorer = (panel) => {
    const root = panel.querySelector("#fxExplorer");
    const keys = Object.keys(FX);
    let cur = 0, timer = null;
    const show = (k) => {
      cur = keys.indexOf(k);
      const e = FX[k], kept = fKeep(e);
      root.querySelectorAll(".idx-chip").forEach((b) => b.classList.toggle("active", b.dataset.k === k));
      root.querySelector(".idx-ex-code").textContent = e.code;
      root.querySelector(".idx-badge").textContent = `${kept.length} of ${e.ds.rows.length} rows kept`;
      root.querySelector(".idx-ex-grid").innerHTML = fGrid(e);
      root.querySelector(".idx-ex-out").textContent = fOut(e.ds, kept);
    };
    const setPlay = (on) => {
      clearInterval(timer);
      timer = on ? setInterval(() => show(keys[(cur + 1) % keys.length]), 3000) : null;
      const b = root.querySelector("#fxPlay");
      b.classList.toggle("on", on);
      b.innerHTML = `<i class="fa-solid ${on ? "fa-pause" : "fa-play"}"></i><span>${on ? "Pause" : "Play all"}</span>`;
    };
    root.addEventListener("click", (ev) => {
      const chip = ev.target.closest("[data-k]");
      if (chip) { setPlay(false); show(chip.dataset.k); return; }
      if (ev.target.closest("#fxPlay")) setPlay(!timer);
    });
    show(keys[0]);
    return () => clearInterval(timer);
  };

  registerTopic({
    library: "pandas",
    id: "filtering",
    title: "Filtering Rows and Columns",
    difficulty: "Beginner",
    summary: "Select rows that satisfy conditions using boolean indexing, &, |, ~, isin(), between(), str methods and query().",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        <div class="intro-hero">
          <span class="intro-hero-badge"><i class="fa-solid fa-filter"></i></span>
          <div>
            <h2 class="intro-hero-title">Filtering Using Conditions</h2>
            <p class="intro-hero-tag">Keep only the rows that satisfy a condition</p>
          </div>
        </div>

        ${section("", "What is filtering?",
          p("In Pandas, filtering means selecting specific rows or columns from a DataFrame based on some conditions. This is one of the most important operations for data cleaning, analysis, and preprocessing.") +
          callout("fa-solid fa-circle-question", `<p><strong>Condition:</strong> a logical statement that checks values in a column (e.g., <code>Age &gt; 20</code>).</p>`) +
          p("Filtering is done using <strong>boolean indexing</strong>:") +
          codeBlock("Syntax", "df[condition]") +
          p("Result → a subset of the DataFrame containing only the rows that satisfy the condition.") +
          chips([["fa-solid fa-circle-question", "1. Write a condition"], ["fa-solid fa-list-check", "2. Pandas makes a True/False mask"], ["fa-solid fa-filter", "3. Only True rows are kept"]])
        )}

        ${section("1", "Filtering with a single condition",
          codeBlock("Syntax", 'df[df["column_name"] operator value]') +
          table(["Operator", "Meaning"], [
            ["<code>&gt;</code>", "greater than"], ["<code>&lt;</code>", "less than"],
            ["<code>&gt;=</code>", "greater than or equal to"], ["<code>&lt;=</code>", "less than or equal to"],
            ["<code>==</code>", "equal to"], ["<code>!=</code>", "not equal to"],
          ]) +
          sub("", "Example dataset") + fData(F4, "Example dataset") +
          sub("Case 1:", "Greater than (<code>&gt;</code>)") + fEx("s1") +
          sub("Case 2:", "Less than (<code>&lt;</code>)") + fEx("s2") +
          sub("Case 3:", "Greater than or equal to (<code>&gt;=</code>)") + fEx("s3") +
          sub("Case 4:", "Less than or equal to (<code>&lt;=</code>)") + fEx("s4") +
          sub("Case 5:", "Equal to (<code>==</code>)") + fEx("s5") +
          sub("Case 6:", "Not equal to (<code>!=</code>)") + fEx("s6") +
          callout("fa-solid fa-lightbulb", `<p>Single condition filtering lets us extract rows based on <strong>one column condition only</strong>.</p>`)
        )}

        ${section("2", "Filtering with multiple conditions",
          p("Sometimes we need to filter rows using more than one condition. In Pandas we use:") +
          table(["Symbol", "Meaning"], [
            ["<code>&amp;</code>", "AND: both conditions must be true"],
            ["<code>|</code>", "OR: at least one condition must be true"],
            ["<code>~</code>", "NOT: negates a condition"],
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> parentheses <code>()</code> are required around <strong>each</strong> condition. Use <code>&amp;</code>, <code>|</code>, <code>~</code> here, not the words <code>and</code>, <code>or</code>, <code>not</code>.</p>`) +
          sub("", "Example dataset") + fData(F4, "Example dataset") +
          sub("2.1", "AND condition (<code>&amp;</code>)") + p("Select rows where both conditions are true.") + fEx("m1") +
          sub("2.2", "OR condition (<code>|</code>)") + p("Select rows where at least one condition is true.") + fEx("m2") +
          sub("2.3", "NOT condition (<code>~</code>)") + p("Negates the condition → selects rows that do not satisfy the condition.") + fEx("m3") +
          sub("2.4", "Combining multiple conditions") + p("We can use AND + OR together with parentheses.") + fEx("m4")
        )}

        ${section("3", "Filtering with special function conditions",
          p("Apart from simple comparison operators (<code>&gt;</code>, <code>&lt;</code>, <code>==</code>, etc.), Pandas provides special functions to filter rows more efficiently. These are very useful when filtering by a list of values, ranges, or strings.") +
          sub("", "Example dataset") + fData(F5, "Example dataset") +
          sub("3.1", "<code>.isin()</code>: filter by multiple values") + p("Checks if column values are present in a given list.") + fEx("p1") +
          sub("3.2", "<code>.between()</code>: filter within a range") + p("Inclusive by default (includes both ends).") + fEx("p2") +
          sub("3.3", "<code>.str.contains()</code>: filter text (string matching)") + p("Works only on string columns. Can use <code>case=False</code> for ignoring case.") + fEx("p3") +
          sub("3.4", "<code>.str.startswith()</code> and <code>.str.endswith()</code>: string start/end filter") + fEx("p4") + fEx("p5") +
          sub("3.5", "<code>.query()</code>: SQL-like filtering") + p("An easier way to write multiple conditions.") + fEx("p6") + fEx("p7")
        )}

        ${section("", "Try it: Filter Explorer",
          p("Click any filter, or press <strong>Play all</strong>, to see the True/False mask and which rows survive.") +
          fExplorer()
        )}
      `;
      return mountFxExplorer(panel);
    },
  });

  const SR_CODE = {"s_create": "import pandas as pd\n\ndata = {\n    \"Product\": [\"Pen\", \"Book\", \"Pencil\", \"Notebook\"],\n    \"Sales\": [50, 200, 30, 150]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)", "s_idx_create": "df = pd.DataFrame(\n    {\n        \"Product\": [\"Pen\", \"Book\", \"Pencil\", \"Notebook\"],\n        \"Sales\": [50, 200, 30, 150]\n    },\n    index=[\"d\", \"a\", \"c\", \"b\"]\n)\n\nprint(df)", "s_sort_index": "print(df.sort_index())", "s_sort_index_desc": "print(df.sort_index(ascending=False))", "s_sv_asc": "print(df.sort_values(by=\"Sales\"))", "s_sv_desc": "print(df.sort_values(by=\"Sales\", ascending=False))", "s_multi_create": "data = {\n    \"Employee\": [\"Amit\", \"Riya\", \"John\", \"Sara\", \"Ali\"],\n    \"Department\": [\"East\", \"West\", \"East\", \"North\", \"West\"],\n    \"Sales\": [400, 250, 600, 350, 300]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)", "s_multi": "print(df.sort_values(by=[\"Department\", \"Sales\"]))", "s_multi_mixed": "print(df.sort_values(\n    by=[\"Department\", \"Sales\"],\n    ascending=[True, False]\n))", "s_nan_create": "data = {\n    \"Employee\": [\"Amit\", \"Riya\", \"John\", \"Sara\"],\n    \"Sales\": [400, None, 600, 350]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)", "s_nan_first": "print(df.sort_values(by=\"Sales\", na_position=\"first\"))", "s_nan_last": "print(df.sort_values(by=\"Sales\", na_position=\"last\"))", "r_create": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"Salesperson\": [\"Ali\", \"Ayesha\", \"Ravi\", \"John\", \"Sara\"],\n    \"Sales\": [500, 700, 500, 900, 300]\n})\n\ndf[\"Rank\"] = df[\"Sales\"].rank()\n\nprint(df)", "r_series": "sales = pd.Series([500, 700, 500, 900])\n\nprint(sales)", "r_average": "print(sales.rank(method=\"average\"))", "r_min": "print(sales.rank(method=\"min\"))", "r_max": "print(sales.rank(method=\"max\"))", "r_first": "print(sales.rank(method=\"first\"))", "r_dense": "print(sales.rank(method=\"dense\"))", "r_compare": "compare = pd.DataFrame({\"Sales\": sales})\n\nfor method in [\"average\", \"min\", \"max\", \"first\", \"dense\"]:\n    compare[method] = sales.rank(method=method)\n\nprint(compare)", "r_desc": "df[\"Position\"] = df[\"Sales\"].rank(\n    ascending=False,\n    method=\"dense\"\n)\n\nprint(df)", "a_create": "data = {\n    \"Name\": [\"Ali\", \"Ayesha\", \"Ravi\", \"John\", \"Sara\"],\n    \"Sales\": [500, 700, 400, 900, 600],\n    \"Region\": [\"East\", \"West\", \"East\", \"South\", \"North\"]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)", "a_select": "df = df[[\"Region\", \"Name\", \"Sales\"]]\n\nprint(df)", "a_rows": "df_rows = df.reindex([3, 0, 4, 1, 2])\n\nprint(df_rows)", "a_cols": "df_cols = df.reindex(\n    columns=[\"Sales\", \"Name\", \"Region\"]\n)\n\nprint(df_cols)"};
  const SR_OUT = {"s_create": "    Product  Sales\n0       Pen     50\n1      Book    200\n2    Pencil     30\n3  Notebook    150", "s_idx_create": "    Product  Sales\nd       Pen     50\na      Book    200\nc    Pencil     30\nb  Notebook    150", "s_sort_index": "    Product  Sales\na      Book    200\nb  Notebook    150\nc    Pencil     30\nd       Pen     50", "s_sort_index_desc": "    Product  Sales\nd       Pen     50\nc    Pencil     30\nb  Notebook    150\na      Book    200", "s_sv_asc": "    Product  Sales\nc    Pencil     30\nd       Pen     50\nb  Notebook    150\na      Book    200", "s_sv_desc": "    Product  Sales\na      Book    200\nb  Notebook    150\nd       Pen     50\nc    Pencil     30", "s_multi_create": "  Employee Department  Sales\n0     Amit       East    400\n1     Riya       West    250\n2     John       East    600\n3     Sara      North    350\n4      Ali       West    300", "s_multi": "  Employee Department  Sales\n0     Amit       East    400\n2     John       East    600\n3     Sara      North    350\n1     Riya       West    250\n4      Ali       West    300", "s_multi_mixed": "  Employee Department  Sales\n2     John       East    600\n0     Amit       East    400\n3     Sara      North    350\n4      Ali       West    300\n1     Riya       West    250", "s_nan_create": "  Employee  Sales\n0     Amit  400.0\n1     Riya    NaN\n2     John  600.0\n3     Sara  350.0", "s_nan_first": "  Employee  Sales\n1     Riya    NaN\n3     Sara  350.0\n0     Amit  400.0\n2     John  600.0", "s_nan_last": "  Employee  Sales\n3     Sara  350.0\n0     Amit  400.0\n2     John  600.0\n1     Riya    NaN", "r_create": "  Salesperson  Sales  Rank\n0         Ali    500   2.5\n1      Ayesha    700   4.0\n2        Ravi    500   2.5\n3        John    900   5.0\n4        Sara    300   1.0", "r_series": "0    500\n1    700\n2    500\n3    900\ndtype: int64", "r_average": "0    1.5\n1    3.0\n2    1.5\n3    4.0\ndtype: float64", "r_min": "0    1.0\n1    3.0\n2    1.0\n3    4.0\ndtype: float64", "r_max": "0    2.0\n1    3.0\n2    2.0\n3    4.0\ndtype: float64", "r_first": "0    1.0\n1    3.0\n2    2.0\n3    4.0\ndtype: float64", "r_dense": "0    1.0\n1    2.0\n2    1.0\n3    3.0\ndtype: float64", "r_compare": "   Sales  average  min  max  first  dense\n0    500      1.5  1.0  2.0    1.0    1.0\n1    700      3.0  3.0  3.0    3.0    2.0\n2    500      1.5  1.0  2.0    2.0    1.0\n3    900      4.0  4.0  4.0    4.0    3.0", "r_desc": "  Salesperson  Sales  Rank  Position\n0         Ali    500   2.5       3.0\n1      Ayesha    700   4.0       2.0\n2        Ravi    500   2.5       3.0\n3        John    900   5.0       1.0\n4        Sara    300   1.0       4.0", "a_create": "     Name  Sales Region\n0     Ali    500   East\n1  Ayesha    700   West\n2    Ravi    400   East\n3    John    900  South\n4    Sara    600  North", "a_select": "  Region    Name  Sales\n0   East     Ali    500\n1   West  Ayesha    700\n2   East    Ravi    400\n3  South    John    900\n4  North    Sara    600", "a_rows": "  Region    Name  Sales\n3  South    John    900\n0   East     Ali    500\n4  North    Sara    600\n1   West  Ayesha    700\n2   East    Ravi    400", "a_cols": "   Sales    Name Region\n0    500     Ali   East\n1    700  Ayesha   West\n2    400    Ravi   East\n3    900    John  South\n4    600    Sara  North"};
  const SR_GRID = {"s_df": {"idx": ["0", "1", "2", "3"], "cols": ["Product", "Sales"], "rows": [["Pen", "50"], ["Book", "200"], ["Pencil", "30"], ["Notebook", "150"]]}, "s_idx": {"idx": ["d", "a", "c", "b"], "cols": ["Product", "Sales"], "rows": [["Pen", "50"], ["Book", "200"], ["Pencil", "30"], ["Notebook", "150"]]}, "s_sort_index": {"idx": ["a", "b", "c", "d"], "cols": ["Product", "Sales"], "rows": [["Book", "200"], ["Notebook", "150"], ["Pencil", "30"], ["Pen", "50"]]}, "s_sv_asc": {"idx": ["c", "d", "b", "a"], "cols": ["Product", "Sales"], "rows": [["Pencil", "30"], ["Pen", "50"], ["Notebook", "150"], ["Book", "200"]]}, "s_sv_desc": {"idx": ["a", "b", "d", "c"], "cols": ["Product", "Sales"], "rows": [["Book", "200"], ["Notebook", "150"], ["Pen", "50"], ["Pencil", "30"]]}, "s_multi_df": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Employee", "Department", "Sales"], "rows": [["Amit", "East", "400"], ["Riya", "West", "250"], ["John", "East", "600"], ["Sara", "North", "350"], ["Ali", "West", "300"]]}, "s_multi": {"idx": ["0", "2", "3", "1", "4"], "cols": ["Employee", "Department", "Sales"], "rows": [["Amit", "East", "400"], ["John", "East", "600"], ["Sara", "North", "350"], ["Riya", "West", "250"], ["Ali", "West", "300"]]}, "s_multi_mixed": {"idx": ["2", "0", "3", "4", "1"], "cols": ["Employee", "Department", "Sales"], "rows": [["John", "East", "600"], ["Amit", "East", "400"], ["Sara", "North", "350"], ["Ali", "West", "300"], ["Riya", "West", "250"]]}, "s_nan_df": {"idx": ["0", "1", "2", "3"], "cols": ["Employee", "Sales"], "rows": [["Amit", "400.0"], ["Riya", "NaN"], ["John", "600.0"], ["Sara", "350.0"]]}, "s_nan_first": {"idx": ["1", "3", "0", "2"], "cols": ["Employee", "Sales"], "rows": [["Riya", "NaN"], ["Sara", "350.0"], ["Amit", "400.0"], ["John", "600.0"]]}, "r_df": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Salesperson", "Sales", "Rank"], "rows": [["Ali", "500", "2.5"], ["Ayesha", "700", "4.0"], ["Ravi", "500", "2.5"], ["John", "900", "5.0"], ["Sara", "300", "1.0"]]}, "r_compare": {"idx": ["0", "1", "2", "3"], "cols": ["Sales", "average", "min", "max", "first", "dense"], "rows": [["500", "1.5", "1.0", "2.0", "1.0", "1.0"], ["700", "3.0", "3.0", "3.0", "3.0", "2.0"], ["500", "1.5", "1.0", "2.0", "2.0", "1.0"], ["900", "4.0", "4.0", "4.0", "4.0", "3.0"]]}, "r_desc": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Salesperson", "Sales", "Rank", "Position"], "rows": [["Ali", "500", "2.5", "3.0"], ["Ayesha", "700", "4.0", "2.0"], ["Ravi", "500", "2.5", "3.0"], ["John", "900", "5.0", "1.0"], ["Sara", "300", "1.0", "4.0"]]}, "a_df": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Name", "Sales", "Region"], "rows": [["Ali", "500", "East"], ["Ayesha", "700", "West"], ["Ravi", "400", "East"], ["John", "900", "South"], ["Sara", "600", "North"]]}, "a_sel": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Region", "Name", "Sales"], "rows": [["East", "Ali", "500"], ["West", "Ayesha", "700"], ["East", "Ravi", "400"], ["South", "John", "900"], ["North", "Sara", "600"]]}, "a_rows": {"idx": ["3", "0", "4", "1", "2"], "cols": ["Region", "Name", "Sales"], "rows": [["South", "John", "900"], ["East", "Ali", "500"], ["North", "Sara", "600"], ["West", "Ayesha", "700"], ["East", "Ravi", "400"]]}, "a_cols": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Sales", "Name", "Region"], "rows": [["500", "Ali", "East"], ["700", "Ayesha", "West"], ["400", "Ravi", "East"], ["900", "John", "South"], ["600", "Sara", "North"]]}};

  /* ---- Sorting, Ranking and Rearranging ------------------------------------ */
  // Code, printed output and diagram data in SR_CODE / SR_OUT / SR_GRID were produced
  // by running the code in real pandas, so every picture matches what students see.
  const srEx = (key, label) => codeBlock(label || "Code", SR_CODE[key]) + codeBlock("Output", SR_OUT[key]);

  // Diagram: a small table. hlCols (+ optional hlRows) light up with the same pop animation as Indexing.
  const srGrid = (key, o) => {
    o = o || {};
    const g = SR_GRID[key], hc = o.hlCols || [], hr = o.hlRows || [];
    let n = 0;
    const head = g.cols.map((c) => `<th>${c}</th>`).join("");
    const body = g.rows.map((row, i) => `<tr><th>${g.idx[i]}</th>` + row.map((v, j) => {
      const on = hc.includes(g.cols[j]) && (!hr.length || hr.includes(i));
      return `<td class="${on ? "is-sel" : ""}"${on ? ` style="--i:${n++}"` : ""}>${v}</td>`;
    }).join("") + "</tr>").join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner"></th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
      (o.caption ? `<p class="idx-cap">${o.caption}</p>` : "");
  };

  const srHero = (icon, title, tag) => `
        <div class="intro-hero">
          <span class="intro-hero-badge"><i class="${icon}"></i></span>
          <div>
            <h2 class="intro-hero-title">${title}</h2>
            <p class="intro-hero-tag">${tag}</p>
          </div>
        </div>`;

  const srWrap = (html) => html.replace('class="intro-table"', 'class="intro-table is-wrap"');

  /* ---- Sorting ------------------------------------------------------------- */
  registerTopic({
    library: "pandas",
    id: "sorting",
    title: "Sorting",
    difficulty: "Beginner",
    summary: "Arrange rows in order with sort_index() and sort_values(): ascending or descending, by one or several columns, and with missing values.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-arrow-down-wide-short", "Sorting Data in Pandas", "Arranging data in a particular order")}

        ${section("", "Introduction",
          p("When we work with business data, we often need to organize it to make it easier to understand and analyse.") +
          p("For example, a company may want to:") +
          bullets([
            "Arrange products based on their sales.",
            "Identify the salesperson with the highest sales.",
            "Arrange customers alphabetically.",
            "Display important columns in a particular order.",
          ]) +
          p("Pandas provides different methods to perform these operations. Three important concepts are covered in this series of topics:") +
          numlist("", [
            ["Sorting", "arranging data in a particular order (this topic)."],
            ["Ranking", "assigning positions to values."],
            ["Rearranging", "changing the order of rows and columns."],
          ])
        )}

        ${section("", "What is Sorting?",
          p("Sorting means arranging data in a particular order. There are two common sorting orders:") +
          bullets([
            "<strong>Ascending order:</strong> smallest to largest (A to Z).",
            "<strong>Descending order:</strong> largest to smallest (Z to A).",
          ]) +
          p("For example, consider the following sales data:") +
          srEx("s_create") +
          srGrid("s_df", { caption: "Rows are in the order they were entered: 0, 1, 2, 3." }) +
          p("Suppose a company wants to arrange its products based on sales. Pandas provides two important sorting methods:") +
          srWrap(table(["Method", "Sorts by"], [
            ["<code>sort_index()</code>", "the index labels of the rows"],
            ["<code>sort_values()</code>", "the actual values in one or more columns"],
          ]))
        )}

        ${section("1", "Sorting by index: <code>sort_index()</code>",
          sub("", "First, understand the index") +
          p("An index is a label used to identify each row in a DataFrame. By default, Pandas assigns numbers such as <code>0</code>, <code>1</code>, <code>2</code>, and <code>3</code>. We can also assign our own labels.") +
          srEx("s_idx_create") +
          srGrid("s_idx", { caption: "The row labels (blue) are now <code>d, a, c, b</code>: not in alphabetical order." }) +
          p("Now, suppose we want to arrange the rows alphabetically according to their index labels. We use <code>sort_index()</code>.") +
          codeBlock("Syntax", "DataFrame.sort_index(axis=0, ascending=True)") +
          srEx("s_sort_index") +
          srGrid("s_sort_index", { caption: "The rows moved so that the labels read <code>a, b, c, d</code>. The Sales values travel with their rows." }) +
          bullets([
            "<code>sort_index()</code> arranges rows based on their index labels.",
            "<code>axis=0</code> means sorting rows.",
            "<code>ascending=True</code> means increasing order. It is the default.",
          ]) +
          sub("", "Reverse order") +
          p("For reverse order, use <code>ascending=False</code>:") +
          srEx("s_sort_index_desc") +
          callout("fa-solid fa-lightbulb", `<p><strong>Remember:</strong> <code>sort_index()</code> sorts labels, not the actual sales values.</p>`)
        )}

        ${section("2", "Sorting by column values: <code>sort_values()</code>",
          p("This is one of the most commonly used sorting methods in business data analysis.") +
          p("Suppose a company wants to identify which product has the lowest or highest sales. We need to sort the actual values in the Sales column.") +
          codeBlock("Syntax", 'DataFrame.sort_values(by="ColumnName", ascending=True)') +
          sub("", "Ascending order (lowest first)") +
          srEx("s_sv_asc") +
          srGrid("s_sv_asc", { hlCols: ["Sales"], caption: "The <strong>Sales</strong> column (highlighted) now runs from smallest to largest." }) +
          sub("", "Descending order (highest first)") +
          p("To display the highest sales first:") +
          srEx("s_sv_desc") +
          srGrid("s_sv_desc", { hlCols: ["Sales"], caption: "The <strong>Sales</strong> column (highlighted) now runs from largest to smallest." }) +
          bullets([
            '<code>by="Sales"</code> specifies the column to sort.',
            "<code>ascending=True</code> sorts from lowest to highest.",
            "<code>ascending=False</code> sorts from highest to lowest.",
          ]) +
          callout("fa-solid fa-briefcase", `<p><strong>Business application:</strong> a sales manager can use this method to identify the best-selling and least-selling products.</p>`)
        )}

        ${section("3", "Sorting by multiple columns",
          p("Sometimes, we need to sort data using more than one column. For example, a company wants to arrange employees according to their department and then according to their sales.") +
          srEx("s_multi_create") +
          sub("", "Sort by Department, then Sales") +
          srEx("s_multi") +
          srGrid("s_multi", { hlCols: ["Department", "Sales"], caption: "Departments are in alphabetical order; inside each department the Sales run from low to high." }) +
          bullets([
            "First, Pandas sorts the data by Department.",
            "Then, it sorts Sales within each department.",
            "By default, both columns are sorted in ascending order.",
          ]) +
          sub("", "Different orders for different columns") +
          p("We can use different sorting orders for different columns by passing a list to <code>ascending</code>:") +
          srEx("s_multi_mixed") +
          srGrid("s_multi_mixed", { hlCols: ["Department", "Sales"], caption: "Department is A to Z, but Sales are now highest first inside each department." }) +
          bullets([
            "Department is sorted alphabetically.",
            "Sales are sorted from highest to lowest within each department.",
          ])
        )}

        ${section("4", "Handling missing values while sorting",
          p("Sometimes, datasets contain missing values (<code>NaN</code>). By default, Pandas places missing values at the bottom when sorting. We can control their position using <code>na_position</code>.") +
          srEx("s_nan_create") +
          srEx("s_nan_first") +
          srGrid("s_nan_first", { hlCols: ["Sales"], hlRows: [0], caption: "With <code>na_position=\"first\"</code>, the missing value (highlighted) moves to the top." }) +
          bullets([
            '<code>na_position="first"</code> – missing values appear first.',
            '<code>na_position="last"</code> – missing values appear last (default).',
          ]) +
          p("For comparison, here is the default behaviour:") +
          srEx("s_nan_last")
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Sort rows by their index labels", "<code>df.sort_index()</code>"],
            ["Sort by one column, lowest first", '<code>df.sort_values(by="Sales")</code>'],
            ["Sort by one column, highest first", '<code>df.sort_values(by="Sales", ascending=False)</code>'],
            ["Sort by several columns", '<code>df.sort_values(by=["Department", "Sales"])</code>'],
            ["Different order per column", '<code>df.sort_values(by=[...], ascending=[True, False])</code>'],
            ["Put missing values first", '<code>df.sort_values(by="Sales", na_position="first")</code>'],
          ]))
        )}
      `;
    },
  });

  /* ---- Ranking ------------------------------------------------------------- */
  registerTopic({
    library: "pandas",
    id: "ranking",
    title: "Ranking",
    difficulty: "Beginner",
    summary: "Assign positions to values with rank(): how ties are handled by average, min, max, first and dense, and how to rank from highest to lowest.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-ranking-star", "Ranking Data in Pandas", "Assigning positions to values")}

        ${section("", "What is Ranking?",
          p("Ranking means assigning a position or rank to each value based on its order.") +
          p("Think about an examination. Suppose five students receive the following marks:") +
          table(["Student", "Marks"], [["Ali", "80"], ["Ayesha", "95"], ["Ravi", "80"], ["John", "90"], ["Sara", "70"]]) +
          p("We want to identify the position of each student based on their marks. For this purpose, Pandas provides the <code>rank()</code> method.") +
          codeBlock("Syntax", 'Series.rank(method="average", ascending=True)') +
          callout("fa-solid fa-circle-info", `<p>By default, ranking is performed in ascending order, meaning the <strong>smallest value receives rank 1</strong>.</p>`)
        )}

        ${section("", "Example: ranking sales",
          srEx("r_create") +
          srGrid("r_df", { hlCols: ["Sales", "Rank"], hlRows: [0, 2], caption: "Ali and Ravi (highlighted) have equal sales, so they share a rank." }) +
          bullets([
            "Sara receives rank 1 because she has the lowest sales.",
            "Ali and Ravi have the same sales, so both receive rank 2.5.",
            "Ayesha receives rank 4.",
            "John receives rank 5.",
          ]) +
          callout("fa-solid fa-circle-question", `<p><strong>Why do Ali and Ravi receive 2.5?</strong> Because both occupy the second and third positions. Their average rank is (2 + 3) / 2 = 2.5. This is the default ranking method in Pandas.</p>`)
        )}

        ${section("1", "Ranking methods",
          p("When two or more values are equal, Pandas provides different methods to assign ranks. Consider these sales values:") +
          srEx("r_series") +
          sub("1.", "<code>average</code> (default)") +
          p("Assigns the average of the positions to equal values.") + srEx("r_average") +
          sub("2.", "<code>min</code>") +
          p("Assigns the smallest available rank to equal values.") + srEx("r_min") +
          sub("3.", "<code>max</code>") +
          p("Assigns the largest available rank to equal values.") + srEx("r_max") +
          sub("4.", "<code>first</code>") +
          p("Assigns ranks based on the order in which values appear.") + srEx("r_first") +
          sub("5.", "<code>dense</code>") +
          p("Assigns equal values the same rank without leaving gaps in the ranking.") + srEx("r_dense") +
          sub("", "All five methods side by side") +
          srEx("r_compare") +
          srGrid("r_compare", { hlCols: ["average", "min", "max", "first", "dense"], hlRows: [0, 2], caption: "Only the tied rows (highlighted) differ between methods. Rows 1 and 3 get the same rank every time, except that <code>dense</code> leaves no gap after the tie." }) +
          sub("", "Easy way to remember") +
          srWrap(table(["Method", "Meaning"], [
            ["<code>average</code>", "Average of tied ranks"],
            ["<code>min</code>", "Smallest tied rank"],
            ["<code>max</code>", "Largest tied rank"],
            ["<code>first</code>", "Based on appearance"],
            ["<code>dense</code>", "No gaps between ranks"],
          ]))
        )}

        ${section("2", "Ranking in descending order",
          p("In business, we often want to identify the highest-performing employee as Rank 1. For this, we use <code>ascending=False</code>.") +
          srEx("r_desc") +
          srGrid("r_desc", { hlCols: ["Position"], caption: "In the new <strong>Position</strong> column, John (highest sales) is 1. Ali and Ravi tie at 3 and Sara, with the lowest sales, is 4." }) +
          p("Now, the salesperson with the highest sales receives Rank 1.") +
          callout("fa-solid fa-briefcase", `<p><strong>Business application:</strong> ranking is useful for identifying top-performing employees, best-selling products, and high-performing branches.</p>`) +
          callout("fa-solid fa-lightbulb", `<p><strong>Sorting vs ranking:</strong> <code>sort_values()</code> moves the rows into a new order, while <code>rank()</code> leaves the rows where they are and adds a number that says each row's position.</p>`)
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Rank lowest to highest (default)", '<code>df["Sales"].rank()</code>'],
            ["Rank highest first", '<code>df["Sales"].rank(ascending=False)</code>'],
            ["Ties share the smallest rank", '<code>df["Sales"].rank(method="min")</code>'],
            ["Ties share the largest rank", '<code>df["Sales"].rank(method="max")</code>'],
            ["Break ties by order of appearance", '<code>df["Sales"].rank(method="first")</code>'],
            ["No gaps after ties", '<code>df["Sales"].rank(method="dense")</code>'],
          ]))
        )}
      `;
    },
  });

  /* ---- Rearranging --------------------------------------------------------- */
  registerTopic({
    library: "pandas",
    id: "rearranging",
    title: "Rearranging",
    difficulty: "Beginner",
    summary: "Change the order of columns by selection and the order of rows or columns with reindex().",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-arrows-up-down-left-right", "Rearranging Data in Pandas", "Changing the order of rows and columns")}

        ${section("", "What is Rearranging?",
          p("Rearranging means changing the order or position of rows and columns in a DataFrame.") +
          p("For example:") +
          bullets([
            "Moving the Region column before the Name column.",
            "Changing the order of rows.",
            "Displaying columns in a required sequence.",
          ]) +
          p("Consider this DataFrame:") +
          srEx("a_create") +
          srGrid("a_df", { caption: "Columns are in the order <strong>Name, Sales, Region</strong>; rows are labelled 0 to 4." })
        )}

        ${section("1", "Rearranging columns using selection",
          p("Suppose we want to display Region first, Name second, and Sales third. We can select the columns in our required order.") +
          srEx("a_select") +
          srGrid("a_sel", { hlCols: ["Region"], caption: "Region (highlighted) moved to the front. The data in each column did not change, only the order." }) +
          callout("fa-solid fa-circle-info", `<p><strong>Explanation:</strong> the order of column names inside the list determines their display order.</p>`)
        )}

        ${section("2", "Rearranging rows using <code>reindex()</code>",
          p("Sometimes, we want to display rows in a particular order. Pandas provides the <code>reindex()</code> method.") +
          srEx("a_rows") +
          srGrid("a_rows", { caption: "The rows now appear in the order 3, 0, 4, 1, 2. Each row keeps its original label." }) +
          bullets([
            "First, we specify the required index order.",
            "Pandas rearranges the rows according to that order.",
            "The original index labels remain unchanged.",
          ]) +
          sub("", "Rearranging columns with <code>reindex()</code>") +
          p("We can also rearrange columns using <code>reindex()</code>:") +
          srEx("a_cols") +
          srGrid("a_cols", { hlCols: ["Sales"], caption: "This displays the columns in the specified order: Sales, Name, Region." })
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Put columns in a chosen order", '<code>df[["Region", "Name", "Sales"]]</code>'],
            ["Put rows in a chosen order", "<code>df.reindex([3, 0, 4, 1, 2])</code>"],
            ["Put columns in a chosen order with reindex", '<code>df.reindex(columns=["Sales", "Name", "Region"])</code>'],
          ]))
        )}
      `;
    },
  });


  /* ---- Merging (joins with pd.merge) ------------------------------------ */
  // Same two small tables in every example, so students can compare the
  // four joins directly: customers 3 and 4 have no sales, and order 104
  // belongs to customer 5, who is not in the customers table.
  const joinDemo = (how, comment) => [
    "import pandas as pd",
    "",
    "customers = pd.DataFrame({",
    '    "CustomerID": [1, 2, 3, 4],',
    '    "Name": ["Asha", "Ravi", "Meera", "Kabir"],',
    "})",
    "sales = pd.DataFrame({",
    '    "OrderID": [101, 102, 103, 104],',
    '    "CustomerID": [1, 2, 2, 5],',
    '    "Amount": [250, 400, 150, 300],',
    "})",
    "",
    "# " + comment,
    `result = pd.merge(customers, sales, how="${how}", on="CustomerID")`,
    "print(result)",
  ].join("\n");

  // File names inside IMAGE_DIR. Rename here if your files are called something else.
  const MERGE_IMAGES = {
    types: "pandas-merge-join-types.png",
    inner: "pandas-merge-inner.png",
    outer: "pandas-merge-outer.png",
    left:  "pandas-merge-left.png",
    right: "pandas-merge-right.png",
    activity: "pandas-merge-activity.png",
  };

  // Activity data (matches the picture): customers 1 and 3 have no orders,
  // and the Tablet order belongs to customer 5, who is not in the customers table.
  const ACTIVITY_CODE = [
    "import pandas as pd",
    "",
    "# Step 1: create the two DataFrames",
    "customers = pd.DataFrame({",
    '    "CustomerID": [1, 2, 3, 4],',
    '    "Name": ["Ali", "Ayesha", "Ravi", "John"],',
    "})",
    "orders = pd.DataFrame({",
    '    "CustomerID": [2, 4, 4, 5],',
    '    "Product": ["Laptop", "Mobile", "Headphones", "Tablet"],',
    '    "Amount": [50000, 20000, 3000, 15000],',
    "})",
    "",
    "# Step 2: merge with each join type",
    'inner = pd.merge(customers, orders, how="inner", on="CustomerID")',
    'left  = pd.merge(customers, orders, how="left",  on="CustomerID")',
    'right = pd.merge(customers, orders, how="right", on="CustomerID")',
    'outer = pd.merge(customers, orders, how="outer", on="CustomerID")',
    "",
    'print("INNER JOIN"); print(inner); print()',
    'print("LEFT JOIN");  print(left);  print()',
    'print("RIGHT JOIN"); print(right); print()',
    'print("OUTER JOIN"); print(outer)',
    "",
    "# Step 3: answer the questions with code",
    "# Customers who never placed an order (NaN in Product after a left join)",
    'print(left[left["Product"].isna()]["Name"])',
    "# Orders that belong to an unknown customer (NaN in Name after a right join)",
    'print(right[right["Name"].isna()])',
  ].join("\n");

  const joinSection = (num, title, how, points, useCase, imageFile, imageAlt, comment) =>
    section(num, title,
      bullets(points) +
      callout("fa-solid fa-bullseye", `<p><strong>Use Case:</strong> ${useCase}</p>`) +
      codeBlock("Example", `pd.merge(customers, sales, how="${how}", on="CustomerID")`) +
      figure(imageFile, imageAlt) +
      codeBlock("Code example", joinDemo(how, comment))
    );

  registerTopic({
    library: "pandas",
    id: "merging",
    title: "Merging",
    difficulty: "Intermediate",
    summary: "Combine datasets with pd.merge() and see how inner, outer, left and right joins decide which rows appear.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        <div class="intro-hero">
          <span class="intro-hero-badge"><i class="fa-solid fa-code-merge"></i></span>
          <div>
            <h2 class="intro-hero-title">Merging</h2>
            <p class="intro-hero-tag">Combining datasets with pd.merge()</p>
          </div>
        </div>

        ${section("", "What is Merging?",
          bullets([
            "Merging is the process of combining two or more datasets into a single dataset.",
            "In real-world scenarios, data is often spread across multiple tables (like in relational databases).",
            "In Pandas, the function <code>pd.merge()</code> is mainly used for this purpose.",
            "Merging is done based on common columns (keys), such as <code>CustomerID</code>, <code>OrderID</code>, etc.",
          ])
        )}

        ${section("", "Syntax",
          codeBlock("Syntax", 'pd.merge(df1, df2, how="join_type", on="key_column")') +
          bullets([
            "<code>df1</code>, <code>df2</code> → DataFrames to merge.",
            '<code>how</code> → type of join (<code>"inner"</code>, <code>"outer"</code>, <code>"left"</code>, <code>"right"</code>).',
            "<code>on</code> → the column name on which merging happens (common column).",
          ])
        )}

        ${section("", "What are Joins?",
          bullets([
            "Join is a method of merging two datasets based on a common key.",
            "Concept comes from SQL (Structured Query Language), but Pandas supports the same.",
            "Joins decide which rows appear in the result depending on whether they exist in one or both DataFrames.",
          ])
        )}

        ${section("", "Types of Joins in Pandas",
          figure(MERGE_IMAGES.types, "The four join types in Pandas (inner, outer, left, right) shown as Venn diagrams")
        )}

        ${joinSection("1", "Inner Join", "inner",
          [
            "Returns only the rows that have matching values in both DataFrames.",
            "Intersection of sets.",
            "If a customer has no sales → they won’t appear.",
            "If a sale doesn’t belong to a customer → won’t appear.",
          ],
          "Find only customers who actually made purchases.",
          MERGE_IMAGES.inner, "Inner join: only the overlapping rows of customers and sales",
          "Inner join: only customers who have sales (and sales that have a customer)"
        )}

        ${joinSection("2", "Outer Join (Full Outer Join)", "outer",
          [
            "Returns all rows from both DataFrames.",
            "If there is no match → fills with NaN.",
            "Like a Union of sets.",
          ],
          "To see all customers and all sales (even unmatched ones).",
          MERGE_IMAGES.outer, "Outer join: all rows from both customers and sales",
          "Outer join: all customers and all sales, NaN where there is no match"
        )}

        ${joinSection("3", "Left Join", "left",
          [
            "Returns all rows from the left DataFrame + matching rows from right DataFrame.",
            "If there is no match in right → fills with NaN.",
            "Focuses on left DataFrame (customers).",
          ],
          "List all customers and their purchases (if any).",
          MERGE_IMAGES.left, "Left join: all customers plus their matching sales",
          "Left join: all customers, with their sales if any"
        )}

        ${joinSection("4", "Right Join", "right",
          [
            "Returns all rows from the right DataFrame + matching rows from left DataFrame.",
            "If no match in left → fills with NaN.",
            "Focuses on right DataFrame (sales).",
          ],
          "List all sales and include customer details (if available).",
          MERGE_IMAGES.right, "Right join: all sales plus their matching customers",
          "Right join: all sales, with customer details if available"
        )}

        ${section("", "Activity: Customers and Orders",
          p("A shop keeps its customers and its orders in two separate tables. Use <code>pd.merge()</code> to combine them and answer the questions below.") +
          figure(MERGE_IMAGES.activity, "Customers table (CustomerID, Name) and Orders table (CustomerID, Product, Amount)") +
          numlist("", [
            ["Create the data", "build the two DataFrames, <code>customers</code> and <code>orders</code>, exactly as shown in the picture."],
            ["Inner join", "merge on <code>CustomerID</code> with <code>how=\"inner\"</code>. How many rows do you get, and which customers appear?"],
            ["Left join", "merge with <code>how=\"left\"</code>. Which customers have <code>NaN</code> in Product and Amount? What does that tell you?"],
            ["Right join", "merge with <code>how=\"right\"</code>. Which order has <code>NaN</code> in Name, and why?"],
            ["Outer join", "merge with <code>how=\"outer\"</code>. How many rows do you get in total?"],
          ])
        )}
      `;
    },
  });

  /* ---- Handling Missing Values ---------------------------------------------- */
  // Code, printed output and diagram data in MV_CODE / MV_OUT / MV_GRID were produced
  // by running the code in real pandas, so every picture matches what students see.
  const MV_CODE = {"create": "import pandas as pd\n\n# Sample dataset with missing values\ndata = {\n    \"Name\": [\"Amit\", \"Ravi\", \"Sneha\", \"Priya\", None],\n    \"Age\": [25, None, 22, 28, 30],\n    \"Salary\": [50000, 60000, None, 52000, 58000]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)", "isnull": "print(df.isnull())", "isnull_sum": "print(df.isnull().sum())", "drop_rows": "print(df.dropna(axis=0))", "drop_cols": "print(df.dropna(axis=1))", "fill0": "print(df.fillna(0))", "mean": "mean_age = df[\"Age\"].mean()\n\ndf_mean = df[\"Age\"].fillna(mean_age)\n\nprint(df_mean)", "ffill": "print(df.ffill())", "bfill": "print(df.bfill())"};
  const MV_OUT = {"create": "    Name   Age   Salary\n0   Amit  25.0  50000.0\n1   Ravi   NaN  60000.0\n2  Sneha  22.0      NaN\n3  Priya  28.0  52000.0\n4    NaN  30.0  58000.0", "isnull": "    Name    Age  Salary\n0  False  False   False\n1  False   True   False\n2  False  False    True\n3  False  False   False\n4   True  False   False", "isnull_sum": "Name      1\nAge       1\nSalary    1\ndtype: int64", "drop_rows": "    Name   Age   Salary\n0   Amit  25.0  50000.0\n3  Priya  28.0  52000.0", "drop_cols": "Empty DataFrame\nColumns: []\nIndex: [0, 1, 2, 3, 4]", "fill0": "    Name   Age   Salary\n0   Amit  25.0  50000.0\n1   Ravi   0.0  60000.0\n2  Sneha  22.0      0.0\n3  Priya  28.0  52000.0\n4      0  30.0  58000.0", "mean": "0    25.00\n1    26.25\n2    22.00\n3    28.00\n4    30.00\nName: Age, dtype: float64", "ffill": "    Name   Age   Salary\n0   Amit  25.0  50000.0\n1   Ravi  25.0  60000.0\n2  Sneha  22.0  60000.0\n3  Priya  28.0  52000.0\n4  Priya  30.0  58000.0", "bfill": "    Name   Age   Salary\n0   Amit  25.0  50000.0\n1   Ravi  22.0  60000.0\n2  Sneha  22.0  52000.0\n3  Priya  28.0  52000.0\n4    NaN  30.0  58000.0"};
  const MV_GRID = {"df": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Name", "Age", "Salary"], "rows": [["Amit", "25.0", "50000.0"], ["Ravi", "NaN", "60000.0"], ["Sneha", "22.0", "NaN"], ["Priya", "28.0", "52000.0"], ["NaN", "30.0", "58000.0"]]}, "isnull": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Name", "Age", "Salary"], "rows": [["False", "False", "False"], ["False", "True", "False"], ["False", "False", "True"], ["False", "False", "False"], ["True", "False", "False"]]}, "fill0": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Name", "Age", "Salary"], "rows": [["Amit", "25.0", "50000.0"], ["Ravi", "0.0", "60000.0"], ["Sneha", "22.0", "0.0"], ["Priya", "28.0", "52000.0"], ["0", "30.0", "58000.0"]]}, "mean": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Age"], "rows": [["25.0"], ["26.25"], ["22.0"], ["28.0"], ["30.0"]]}, "ffill": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Name", "Age", "Salary"], "rows": [["Amit", "25.0", "50000.0"], ["Ravi", "25.0", "60000.0"], ["Sneha", "22.0", "60000.0"], ["Priya", "28.0", "52000.0"], ["Priya", "30.0", "58000.0"]]}, "bfill": {"idx": ["0", "1", "2", "3", "4"], "cols": ["Name", "Age", "Salary"], "rows": [["Amit", "25.0", "50000.0"], ["Ravi", "22.0", "60000.0"], ["Sneha", "22.0", "52000.0"], ["Priya", "28.0", "52000.0"], ["NaN", "30.0", "58000.0"]]}};

  const mvEx = (key, label) => codeBlock(label || "Code", MV_CODE[key]) + codeBlock("Output", MV_OUT[key]);

  // Diagram: a small table. sel = [[row, col], ...] cells that light up (same pop animation as Indexing);
  // dimRows / dimCols fade the rows or columns that Pandas throws away.
  const mvGrid = (key, o) => {
    o = o || {};
    const g = MV_GRID[key], sel = o.sel || [], dimRows = o.dimRows || [], dimCols = o.dimCols || [];
    let n = 0;
    const head = g.cols.map((c) => `<th>${c}</th>`).join("");
    const body = g.rows.map((row, i) => `<tr><th>${g.idx[i]}</th>` + row.map((v, j) => {
      const on = sel.some((s) => s[0] === i && s[1] === j);
      const dim = !on && (dimRows.includes(i) || dimCols.includes(j));
      return `<td class="${on ? "is-sel" : dim ? "is-dim" : ""}"${on ? ` style="--i:${n++}"` : ""}>${v}</td>`;
    }).join("") + "</tr>").join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner"></th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
      (o.caption ? `<p class="idx-cap">${o.caption}</p>` : "");
  };

  // The three missing cells of the sample dataset: [row, column].
  const MV_NAN = [[4, 0], [1, 1], [2, 2]];

  registerTopic({
    library: "pandas",
    id: "missing-values",
    title: "Handling Missing Values",
    difficulty: "Beginner",
    summary: "Detect missing values with isnull(), then deal with them by dropping (dropna) or imputing (fillna with a value or the mean, ffill, bfill).",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-eraser", "Handling Missing Values", "Detecting, dropping and filling NaN values")}

        ${section("", "Introduction",
          p("In real-world datasets, missing values (<code>NaN</code> / <code>None</code>) are very common. Missing values can occur due to:") +
          bullets([
            "Data entry errors.",
            "Sensor failure.",
            "Human errors in survey forms.",
            "Data corruption during transfer.",
          ]) +
          p("If they are not handled, missing values can:") +
          bullets([
            "Cause errors in model training.",
            "Lead to biased results.",
            "Reduce the accuracy of predictions.",
          ]) +
          callout("fa-solid fa-lightbulb", `<p><strong>Remember:</strong> handling missing values is a very important data preprocessing step.</p>`)
        )}

        ${section("1", "Detecting missing values",
          p("In Pandas, we mainly use two things:") +
          srWrap(table(["Code", "What it returns"], [
            ["<code>df.isnull()</code>", "<code>True</code> for every missing value, <code>False</code> otherwise"],
            ["<code>df.isnull().sum()</code>", "the count of missing values in each column"],
          ])) +
          sub("", "Example dataset with missing values") +
          mvEx("create") +
          mvGrid("df", { sel: MV_NAN, caption: "The three missing cells (highlighted): Name in row 4, Age in row 1 and Salary in row 2." }) +
          callout("fa-solid fa-circle-info", `<p><strong>Note:</strong> Age and Salary show as decimals (<code>25.0</code>, <code>50000.0</code>) because a column that contains <code>NaN</code> is stored as float. In a text column, <code>None</code> is also treated as missing; newer Pandas versions display it as <code>NaN</code>, older ones show <code>None</code>.</p>`) +
          sub("", "Detect missing values (True = missing)") +
          mvEx("isnull") +
          mvGrid("isnull", { sel: MV_NAN, caption: "<code>True</code> (highlighted) marks exactly the cells that were missing." }) +
          sub("", "Count missing values per column") +
          mvEx("isnull_sum") +
          p("Each column has one missing value.")
        )}

        ${section("2", "Handling missing values",
          p("There are two main strategies:") +
          chips([["fa-solid fa-trash-can", "Dropping: remove the missing data"], ["fa-solid fa-fill-drip", "Imputing: fill the missing data"]])
        )}

        ${section("2.1", "Dropping missing values",
          p("Used when the missing data is small and negligible. It removes the row or column that contains the missing values.") +
          sub("(a)", "Drop rows with missing values") +
          mvEx("drop_rows") +
          mvGrid("df", { dimRows: [1, 2, 4], sel: MV_NAN, caption: "Rows 1, 2 and 4 (faded) each contain a <code>NaN</code>, so they are removed. Only rows 0 and 3 remain." }) +
          sub("(b)", "Drop columns with missing values") +
          mvEx("drop_cols") +
          mvGrid("df", { dimCols: [0, 1, 2], caption: "Every column contains one <code>NaN</code>, so every column is dropped and an empty DataFrame is left." }) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Note:</strong> dropping is simple, but we lose data, so it is not always recommended. Here, <code>axis=1</code> deleted the whole dataset to get rid of three missing cells.</p>`)
        )}

        ${section("2.2", "Imputing missing values",
          p("Instead of dropping, we fill (impute) the missing values with meaningful values.") +
          sub("(a)", "Fill with a fixed value") +
          mvEx("fill0") +
          mvGrid("fill0", { sel: MV_NAN, caption: "Each missing cell (highlighted) now holds <code>0</code>." }) +
          sub("(b)", "Fill with the mean (for numerical data)") +
          mvEx("mean") +
          mvGrid("mean", { sel: [[1, 0]], caption: "The mean of the Age column is (25 + 22 + 28 + 30) / 4 = 26.25, and that value replaced the <code>NaN</code> in row 1." }) +
          bullets([
            '<code>df["Age"].mean()</code> ignores <code>NaN</code> when it calculates the average.',
            'To keep the result in the DataFrame, assign it back: <code>df["Age"] = df["Age"].fillna(mean_age)</code>.',
          ]) +
          sub("(c)", "Forward fill (fill with the previous value)") +
          mvEx("ffill") +
          mvGrid("ffill", { sel: MV_NAN, caption: "Each missing cell (highlighted) copied the value from the row above it." }) +
          callout("fa-solid fa-circle-info", `<p><strong>Older code:</strong> many books write <code>df.fillna(method="ffill")</code>. That form was deprecated in Pandas 2.1 and removed in Pandas 3, so use <code>df.ffill()</code> instead.</p>`) +
          sub("(d)", "Backward fill (fill with the next value)") +
          mvEx("bfill") +
          mvGrid("bfill", { sel: [[1, 1], [2, 2]], caption: "Age and Salary copied the value from the row below. The last row's Name is still <code>NaN</code>." }) +
          callout("fa-solid fa-circle-question", `<p><strong>Why is the last Name still missing?</strong> Backward fill takes the next value, and the last row has no row after it. In the same way, forward fill cannot fill a missing value in the very first row.</p>`)
        )}

        ${section("", "Dropping vs imputing",
          srWrap(table(["Aspect", "Dropping", "Imputing"], [
            ["Definition", "Remove missing rows or columns", "Replace missing values"],
            ["Data loss", "Yes (information removed)", "No (keeps data)"],
            ["Simplicity", "Very simple", "Requires a strategy"],
            ["Best for", "Large datasets with very few NaN", "Small or medium datasets, or when the data is valuable"],
            ["Risk", "Loss of valuable information", "Bias if the wrong imputation method is used"],
          ]))
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Find missing values", "<code>df.isnull()</code>"],
            ["Count missing values per column", "<code>df.isnull().sum()</code>"],
            ["Drop rows with missing values", "<code>df.dropna(axis=0)</code>"],
            ["Drop columns with missing values", "<code>df.dropna(axis=1)</code>"],
            ["Fill with a fixed value", "<code>df.fillna(0)</code>"],
            ["Fill with the mean", '<code>df["Age"].fillna(df["Age"].mean())</code>'],
            ["Fill with the previous value", "<code>df.ffill()</code>"],
            ["Fill with the next value", "<code>df.bfill()</code>"],
          ]))
        )}
      `;
    },
  });

  /* ---- Detecting and Fixing Outliers ---------------------------------------- */
  // Printed outputs below were produced by running the code in real pandas.
  // Put the three pictures in the attachments/ folder with these names
  // (rename here if your files are called something else).
  const OUT_IMAGES = {
    types:    "pandas-outliers-types.png",
    quartile: "pandas-outliers-quartiles.png",
    boxplot:  "pandas-outliers-boxplot.png",
  };

  const OUT_DATA = [
    "import pandas as pd",
    "",
    "data = {",
    '    "Employee": ["A", "B", "C", "D", "E",',
    '                 "F", "G", "H", "I", "J"],',
    '    "Salary": [25000, 28000, 30000, 27000, 26000,',
    "               29000, 31000, 28000, 30000, 500000]",
    "}",
    "",
    "df = pd.DataFrame(data)",
    "",
    "print(df)",
  ].join("\n");

  const OUT_DF_PRINT = [
    "  Employee  Salary",
    "0        A   25000",
    "1        B   28000",
    "2        C   30000",
    "3        D   27000",
    "4        E   26000",
    "5        F   29000",
    "6        G   31000",
    "7        H   28000",
    "8        I   30000",
    "9        J  500000",
  ].join("\n");

  const OUT_DF_NO_J = OUT_DF_PRINT.split("\n").slice(0, 10).join("\n");

  registerTopic({
    library: "pandas",
    id: "outliers",
    title: "Detecting and Fixing Outliers",
    difficulty: "Intermediate",
    summary: "Spot unusual values with the IQR rule, box plots and Z-scores, then treat them by removal, median replacement or capping with clip().",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-chart-simple", "Detecting and Fixing Outliers", "Finding values that differ from the general pattern, and deciding what to do with them")}

        ${section("1", "Introduction to outliers",
          p("In data analysis, datasets may contain some values that are significantly different from the other observations. Such values are called <strong>outliers</strong>.") +
          callout("fa-solid fa-book", `<p><strong>Definition:</strong> an outlier is a data value that differs considerably from the general pattern or distribution of the remaining observations in a dataset.</p>`) +
          sub("", "Real-world example") +
          p("Consider the following monthly salaries of five employees in a company.") +
          table(["Employee", "Monthly Salary"], [["A", "25,000"], ["B", "28,000"], ["C", "30,000"], ["D", "27,000"], ["E", "5,00,000"]]) +
          p("Most employees earn between ₹25,000 and ₹30,000. However, Employee E has a salary of ₹5,00,000. This value is significantly higher than the other salaries and may be considered an outlier.") +
          callout("fa-solid fa-eye", `<p><strong>Example observation:</strong> an unusually high or unusually low value compared with the other observations is called an outlier.</p>`) +
          sub("", "Types of outliers") +
          numlist("", [
            ["Upper Outliers", "values that are unusually higher than the other observations."],
            ["Lower Outliers", "values that are unusually lower than the other observations."],
          ]) +
          figure(OUT_IMAGES.types, "Number-line illustration of a lower outlier and an upper outlier")
        )}

        ${section("2", "Causes of outliers",
          p("Outliers can occur for several reasons:") +
          numlist("", [
            ["Data Entry Errors", "incorrect values entered into a dataset. For example, entering ₹5,00,000 instead of ₹50,000."],
            ["Measurement Errors", "incorrect readings caused by faulty measuring instruments."],
            ["Genuine Variations", "actual observations that are significantly different from the others. For example, a senior executive earning a much higher salary than other employees."],
            ["Data Processing Errors", "errors caused by incorrect calculations, data merging, or data transformation."],
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> every outlier is not necessarily an error. Before removing or modifying an outlier, a data analyst must investigate its cause.</p>`)
        )}

        ${section("3", "Why is outlier detection important?",
          p("Outliers can influence the results of data analysis and statistical modelling. Some important effects include:") +
          srWrap(table(["Area", "Effect of outliers"], [
            ["Mean", "Extreme values can significantly increase or decrease the arithmetic mean."],
            ["Standard Deviation", "Outliers can increase the measured spread of the dataset."],
            ["Data Visualization", "Extreme values can make it difficult to understand the distribution of normal observations."],
            ["Statistical Analysis", "Outliers may affect statistical conclusions."],
            ["Machine Learning", "Certain machine learning algorithms are sensitive to extreme values, which may affect model performance."],
            ["Business Decisions", "Incorrect treatment of unusual values can lead to misleading business conclusions."],
          ])) +
          callout("fa-solid fa-lightbulb", `<p><strong>Takeaway:</strong> detecting and appropriately handling outliers is an important part of data preprocessing.</p>`)
        )}

        ${section("4", "Creating a dataset in Pandas",
          p("Before detecting outliers, let us create a sample employee salary dataset using Pandas.") +
          codeBlock("Python program", OUT_DATA) +
          codeBlock("Output", OUT_DF_PRINT) +
          p("In this dataset, Employee J has a salary of ₹5,00,000, which appears unusually high compared with the other employees. We will use this dataset to demonstrate different outlier detection and treatment techniques.")
        )}

        ${section("5", "Detecting outliers using the IQR method",
          p("The Interquartile Range (IQR) method is a commonly used statistical technique for identifying potential outliers. It identifies values that fall significantly below or above the central portion of a dataset.") +

          sub("5.1", "Understanding quartiles") +
          p("Quartiles divide an ordered dataset into four equal parts. There are three important quartiles:") +
          bullets([
            "<strong>Q1 (First Quartile):</strong> the value below which approximately 25% of observations fall.",
            "<strong>Q2 (Second Quartile):</strong> the median of the dataset. Approximately 50% of observations fall below this value.",
            "<strong>Q3 (Third Quartile):</strong> the value below which approximately 75% of observations fall.",
          ]) +
          figure(OUT_IMAGES.quartile, "A dataset divided into four equal parts by Q1, Q2 (median) and Q3") +

          sub("5.2", "What is the Interquartile Range?") +
          p("The Interquartile Range (IQR) measures the spread of the middle 50% of observations in a dataset.") +
          codeBlock("Formula", "IQR = Q3 − Q1") +
          bullets(["Q1 = First Quartile", "Q3 = Third Quartile"]) +
          p("A larger IQR indicates greater spread among the middle 50% of observations.") +

          sub("5.3", "Calculating lower and upper bounds") +
          p("After calculating the IQR, we determine two boundaries to identify potential outliers.") +
          codeBlock("Formula", "Lower Bound = Q1 − (1.5 × IQR)\nUpper Bound = Q3 + (1.5 × IQR)") +
          callout("fa-solid fa-list-check", `<p><strong>Outlier identification rules</strong></p>
            <p>Values below the lower bound are identified as potential <strong>lower outliers</strong>.</p>
            <p>Values above the upper bound are identified as potential <strong>upper outliers</strong>.</p>
            <p>Values within these boundaries are not flagged as outliers by the IQR rule.</p>`) +

          sub("5.4", "Calculating Q1, Q3 and IQR using Pandas") +
          p("Pandas provides the <code>quantile()</code> function to calculate quartiles.") +
          codeBlock("Python program", 'Q1 = df["Salary"].quantile(0.25)\n\nQ3 = df["Salary"].quantile(0.75)\n\nIQR = Q3 - Q1\n\nprint("Q1:", Q1)\nprint("Q3:", Q3)\nprint("IQR:", IQR)') +
          codeBlock("Output", "Q1: 27250.0\nQ3: 30000.0\nIQR: 2750.0") +
          bullets(["Q1 is ₹27,250.", "Q3 is ₹30,000.", "IQR is ₹2,750."]) +
          p("Therefore, the middle 50% of salary observations have an interquartile range of ₹2,750.") +

          sub("5.5", "Calculating lower and upper bounds") +
          codeBlock("Python program", 'lower_bound = Q1 - (1.5 * IQR)\n\nupper_bound = Q3 + (1.5 * IQR)\n\nprint("Lower Bound:", lower_bound)\nprint("Upper Bound:", upper_bound)') +
          codeBlock("Output", "Lower Bound: 23125.0\nUpper Bound: 34125.0") +
          p("The calculated boundaries are a lower bound of ₹23,125 and an upper bound of ₹34,125. Any salary below ₹23,125 or above ₹34,125 is flagged as a potential outlier.") +

          sub("5.6", "Detecting outliers using conditional filtering") +
          p("We can identify outliers using Boolean conditions in Pandas.") +
          codeBlock("Python program", 'outliers = df[\n    (df["Salary"] < lower_bound) |\n    (df["Salary"] > upper_bound)\n]\n\nprint(outliers)') +
          codeBlock("Output", "  Employee  Salary\n9        J  500000") +
          p("The condition checks two possibilities:") +
          numlist("", [
            ["Lower check", "salary is less than the lower bound."],
            ["Upper check", "salary is greater than the upper bound."],
          ]) +
          p("The <code>|</code> operator represents the logical OR operation. Therefore, Employee J is identified as a potential outlier.") +
          srWrap(table(["Operator", "Meaning"], [
            ["<code>&amp;</code>", "logical AND"],
            ["<code>|</code>", "logical OR"],
            ["<code>~</code>", "logical NOT"],
          ]))
        )}

        ${section("6", "Visualizing outliers using a box plot",
          p("A box plot is a statistical visualization used to understand the distribution of numerical data and identify potential outliers. Python provides the <code>boxplot()</code> function through the Matplotlib library.") +
          codeBlock("Python program", 'import matplotlib.pyplot as plt\n\nplt.boxplot(df["Salary"])\n\nplt.title("Employee Salary - Outlier Detection")\nplt.ylabel("Salary")\n\nplt.show()') +
          sub("", "Understanding the box plot") +
          p("The important components of a box plot are:") +
          numlist("", [
            ["Box", "represents the interquartile range (IQR), covering the middle 50% of observations."],
            ["Median Line", "represents the median (Q2)."],
            ["Whiskers", "extend to the most extreme observations within the applicable 1.5 × IQR limits."],
            ["Individual Points", "observations beyond the whiskers are displayed separately and are potential outliers."],
          ]) +
          figure(OUT_IMAGES.boxplot, "Box plot with whiskers, Q1, median, Q3, IQR and one separate outlier point")
        )}

        ${section("7", "Fixing outliers in Pandas",
          p("After detecting outliers, the next step is to decide how to handle them. The commonly used approaches are:") +
          chips([
            ["fa-solid fa-trash-can", "1. Removing outliers"],
            ["fa-solid fa-equals", "2. Replacing with the median"],
            ["fa-solid fa-compress", "3. Capping (Winsorization)"],
          ]) +
          p("The appropriate technique depends on the reason for the outlier and the objective of the analysis.") +

          sub("7.1", "Method 1: Removing outliers") +
          p("Removing outliers means excluding observations that have been identified as unsuitable for a particular analysis. For example, suppose Employee J’s salary of ₹5,00,000 is confirmed to be an incorrect data-entry value. We can exclude this observation using Boolean filtering.") +
          codeBlock("Python program", 'df_removed = df[\n    (df["Salary"] >= lower_bound) &\n    (df["Salary"] <= upper_bound)\n]\n\nprint(df_removed)') +
          codeBlock("Output", OUT_DF_NO_J) +
          p("The program retains only the observations whose salaries fall within the lower and upper bounds. Employee J is excluded from the new DataFrame. The original DataFrame <code>df</code> remains unchanged because the result is stored in a separate DataFrame called <code>df_removed</code>.") +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> removing an observation should be justified. Genuine high or low values should not be deleted simply because they are statistically unusual.</p>`) +

          sub("7.2", "Method 2: Replacing outliers with the median") +
          p("Another technique is to replace the outlier with the median value of the dataset. The median is often preferred over the mean because it is less affected by extreme observations.") +
          sub("Step 1:", "Calculate the median") +
          codeBlock("Python program", 'median_value = df["Salary"].median()\n\nprint(median_value)') +
          codeBlock("Output", "28500.0") +
          p("The median salary is ₹28,500.") +
          sub("Step 2:", "Replace the outlier with the median") +
          codeBlock("Python program", 'df_median = df.copy()\n\ndf_median.loc[\n    (df_median["Salary"] < lower_bound) |\n    (df_median["Salary"] > upper_bound),\n    "Salary"\n] = median_value\n\nprint(df_median)') +
          codeBlock("Output", OUT_DF_NO_J + "\n9        J   28500") +
          bullets([
            "The original DataFrame is copied using <code>copy()</code>.",
            "The <code>loc[]</code> accessor identifies the rows containing outliers.",
            "The salary values in those rows are replaced with the median.",
            "Employee J’s salary changes from ₹5,00,000 to ₹28,500 in the cleaned dataset.",
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> median replacement is a statistical treatment, not a correction of the employee’s actual salary. It should be used only when appropriate for the analytical objective.</p>`) +

          sub("7.3", "Method 3: Capping outliers (Winsorization)") +
          p("Capping is a technique in which extreme values are limited to a specified lower or upper boundary instead of removing them. In Pandas, the <code>clip()</code> function can be used for this purpose.") +
          codeBlock("Python program", 'df_capped = df.copy()\n\ndf_capped["Salary"] = df_capped["Salary"].clip(\n    lower=lower_bound,\n    upper=upper_bound\n)\n\nprint(df_capped)') +
          codeBlock("Output", [
            "  Employee   Salary",
            "0        A  25000.0",
            "1        B  28000.0",
            "2        C  30000.0",
            "3        D  27000.0",
            "4        E  26000.0",
            "5        F  29000.0",
            "6        G  31000.0",
            "7        H  28000.0",
            "8        I  30000.0",
            "9        J  34125.0",
          ].join("\n")) +
          p("The <code>clip()</code> function restricts the values within the specified boundaries.") +
          bullets([
            "Values below the lower bound are changed to the lower bound.",
            "Values above the upper bound are changed to the upper bound.",
            "Values within the boundaries remain unchanged.",
          ]) +
          p("In this example, Employee J’s salary is capped at ₹34,125. The observation remains in the dataset, but its extreme value is limited.")
        )}

        ${section("8", "Comparison of outlier treatment methods",
          srWrap(table(["Method", "Description"], [
            ["Removal", "Excludes the outlier observation."],
            ["Median Replacement", "Replaces the outlier with the median value."],
            ["Capping", "Limits the outlier to the calculated boundary."],
          ])) +
          callout("fa-solid fa-lightbulb", `<p>There is no universally best method. The selection depends on the dataset, business context, and analytical objective.</p>`)
        )}

        ${section("9", "Detecting outliers using the Z-score method",
          p("Apart from the IQR method, the Z-score method is another statistical technique for identifying potential outliers. A Z-score measures how far an individual observation is from the mean in terms of standard deviations.") +
          sub("", "Z-score formula") +
          codeBlock("Formula", "Z = (X − μ) / σ") +
          bullets(["X = individual observation.", "μ = mean of the dataset.", "σ = standard deviation of the dataset."]) +
          sub("", "Common Z-score rule") +
          p("A commonly used threshold is:") +
          bullets([
            "Z-score greater than +3: potential <strong>upper outlier</strong>.",
            "Z-score less than −3: potential <strong>lower outlier</strong>.",
          ]) +
          p("In other words, observations more than three standard deviations away from the mean are flagged for investigation.") +
          codeBlock("Python program", 'from scipy import stats\n\ndf["Z_score"] = stats.zscore(df["Salary"])\n\noutliers = df[\n    df["Z_score"].abs() > 3\n]\n\nprint(outliers)') +
          codeBlock("Output", "Empty DataFrame\nColumns: [Employee, Salary, Z_score]\nIndex: []") +
          bullets([
            "<code>stats.zscore()</code> calculates the Z-score for each observation.",
            "<code>abs()</code> calculates the absolute value of each Z-score.",
            "The condition <code>&gt; 3</code> identifies observations whose absolute Z-score exceeds 3.",
          ]) +
          callout("fa-solid fa-circle-question", `<p><strong>Why is the output empty?</strong> Run <code>print(df[["Employee", "Z_score"]])</code> and you will see that Employee J has a Z-score of about <strong>2.9998</strong>, just under 3. With only 10 observations, the largest Z-score that is mathematically possible is √(10 − 1) = 3, and it is reached only if all the other values are identical. The extreme value inflates the mean and the standard deviation, so it partly hides itself. The IQR method is not affected in this way and caught Employee J, while the Z-score rule works better on larger datasets.</p>`) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> Z-score uses the mean and standard deviation, making it sensitive to extreme values. It is generally more suitable when the distribution is reasonably well behaved. For highly skewed datasets, the IQR method can be a useful alternative.</p>`)
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Find Q1 and Q3", '<code>df["Salary"].quantile(0.25)</code>, <code>df["Salary"].quantile(0.75)</code>'],
            ["Calculate the IQR", "<code>IQR = Q3 - Q1</code>"],
            ["Lower and upper bounds", "<code>Q1 - 1.5 * IQR</code>, <code>Q3 + 1.5 * IQR</code>"],
            ["Detect outliers", '<code>df[(df["Salary"] &lt; lower_bound) | (df["Salary"] &gt; upper_bound)]</code>'],
            ["Visualize outliers", '<code>plt.boxplot(df["Salary"])</code>'],
            ["Remove outliers", '<code>df[(df["Salary"] &gt;= lower_bound) &amp; (df["Salary"] &lt;= upper_bound)]</code>'],
            ["Replace with the median", '<code>df.loc[condition, "Salary"] = median_value</code>'],
            ["Cap outliers", '<code>df["Salary"].clip(lower=lower_bound, upper=upper_bound)</code>'],
            ["Z-score method", '<code>stats.zscore(df["Salary"])</code>'],
          ]))
        )}
      `;
    },
  });

  /* ---- Converting Data Types ------------------------------------------------ */
  // Printed outputs below were produced by running the code in real pandas (2.3).
  // Put the picture in the attachments/ folder with this name
  // (rename here if your file is called something else).
  const DT_IMAGES = { conversion: "pandas-dtype-conversion.png" };

  const DT_DATA = [
    "import pandas as pd",
    "",
    "data = {",
    '    "Employee": ["Ravi", "Ayesha", "John", "Ali"],',
    '    "Age": [25, 28, 30, 24],',
    '    "Salary": [25000.50, 32000.75, 45000.00, 28000.25],',
    '    "Experience": [2, 5, 7, 3]',
    "}",
    "",
    "df = pd.DataFrame(data)",
    "",
    "print(df)",
  ].join("\n");

  registerTopic({
    library: "pandas",
    id: "data-types",
    title: "Converting Data Types",
    difficulty: "Beginner",
    summary: "Check column types with dtypes and info(), then convert them with astype(), pd.to_numeric(), pd.to_datetime() and the category type, and handle conversion errors.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-arrows-rotate", "Converting Data Types in Pandas", "Making sure every column holds values in a suitable format")}

        ${section("1", "Introduction to data types",
          p("In data analysis, data is stored in different formats depending on the type of information it represents. For example:") +
          srWrap(table(["Information", "Type"], [
            ["Employee name", "Text"],
            ["Employee age", "Integer"],
            ["Employee salary", "Decimal number"],
            ["Joining date", "Date"],
            ["Employee status", "Boolean (True or False)"],
          ])) +
          p("When working with datasets in Pandas, every column has a particular data type.") +
          callout("fa-solid fa-book", `<p><strong>Definition:</strong> a data type defines the kind of values a variable or column can store and the operations that can be performed on those values.</p>`) +
          sub("", "Real-world example") +
          p("Consider an employee dataset:") +
          table(["Employee", "Age", "Salary", "Experience"], [["Ravi", "25", "25000.50", "2"], ["Ayesha", "28", "32000.75", "5"], ["John", "30", "45000.00", "7"]]) +
          bullets([
            "<strong>Employee</strong> contains text values.",
            "<strong>Age</strong> contains integer values.",
            "<strong>Salary</strong> contains decimal values.",
            "<strong>Experience</strong> contains integer values.",
          ]) +
          callout("fa-solid fa-circle-question", `<p><strong>Question for the class:</strong> can we calculate the average salary if the salary values are stored as text?</p>
            <p>The answer is: not directly using normal numerical operations. We must first convert the values into an appropriate numerical data type. This process is called <strong>Data Type Conversion</strong>.</p>`)
        )}

        ${section("2", "What is data type conversion?",
          callout("fa-solid fa-book", `<p><strong>Definition:</strong> data type conversion is the process of changing data from one type into another type.</p>`) +
          p("In Pandas, data type conversion is used to ensure that each column contains values in a suitable format for data processing and analysis.") +
          sub("", "Examples") +
          srWrap(table(["Original Data Type", "Converted Data Type", "Example"], [
            ["Integer", "Float", "<code>25</code> → <code>25.0</code>"],
            ["Float", "Integer", "<code>25.8</code> → <code>25</code>"],
            ["Integer", "String", '<code>25</code> → <code>"25"</code>'],
            ["String", "Integer", '<code>"25"</code> → <code>25</code>'],
            ["String", "Float", '<code>"25000.50"</code> → <code>25000.50</code>'],
            ["String", "Datetime", '<code>"2026-11-08"</code> → Timestamp'],
          ])) +
          figure(DT_IMAGES.conversion, "Data type conversion examples: integer to float, float to integer, string to integer and string to datetime")
        )}

        ${section("3", "Why is data type conversion important?",
          p("Data type conversion is an important step in data preprocessing. The main reasons include:") +
          srWrap(table(["Reason", "Why it matters"], [
            ["Correct Calculations", "Numerical operations require appropriate numerical data types."],
            ["Memory Management", "Using suitable data types can reduce unnecessary memory consumption."],
            ["Data Cleaning", "Incorrectly stored values can be converted into appropriate formats."],
            ["Date Analysis", "Date values must be converted into datetime format to perform date-related operations."],
            ["Machine Learning", "Many machine learning algorithms require properly formatted numerical input."],
            ["Data Consistency", "Consistent data types make datasets easier to process and analyse."],
          ])) +
          sub("", "Example") +
          p("Suppose a company’s salary column contains the following values:") +
          table(["Employee", "Salary"], [["Ravi", '"25000"'], ["Ayesha", '"30000"'], ["John", '"35000"']]) +
          p("Although the salary values look numeric, they are stored as strings. To perform numerical calculations, we need to convert them into an appropriate numerical type.")
        )}

        ${section("4", "Understanding data types in Pandas",
          p("Pandas provides different data types to store values in DataFrames and Series. Some commonly used Pandas data types are:") +
          srWrap(table(["Pandas Data Type", "Description", "Example"], [
            ["<code>int64</code>", "64-bit integer", "<code>25</code>"],
            ["<code>float64</code>", "64-bit decimal number", "<code>25.75</code>"],
            ["<code>object</code>", "General Python objects, often strings", '<code>"Ravi"</code>'],
            ["<code>bool</code>", "Boolean values", "<code>True</code>, <code>False</code>"],
            ["<code>string</code>", "Dedicated string data type", '<code>"Python"</code>'],
            ["<code>datetime64[ns]</code>", "Date and time values", "<code>2026-11-08</code>"],
          ])) +
          callout("fa-solid fa-circle-info", `<p><strong>Note:</strong> the exact data type selected by Pandas can depend on the values and how the column is created.</p>
            <p><strong>Pandas version:</strong> the outputs on this page come from Pandas 2.x. In Pandas 3, a text column is shown as <code>str</code> instead of <code>object</code>, and a datetime column may show <code>datetime64[us]</code> instead of <code>datetime64[ns]</code>. The conversion methods work the same way.</p>`)
        )}

        ${section("5", "Creating a DataFrame",
          p("Let us create a sample employee dataset to understand data type conversion.") +
          codeBlock("Python program", DT_DATA) +
          codeBlock("Output", "  Employee  Age    Salary  Experience\n0     Ravi   25  25000.50           2\n1   Ayesha   28  32000.75           5\n2     John   30  45000.00           7\n3      Ali   24  28000.25           3") +
          p("This DataFrame contains employee names, ages, salaries, and work experience.")
        )}

        ${section("6", "Checking data types using <code>dtypes</code>",
          p("Before converting data types, we should understand the existing data types of each column. Pandas provides the <code>dtypes</code> attribute to display the data type of every column.") +
          codeBlock("Syntax", "DataFrame.dtypes") +
          codeBlock("Python program", "print(df.dtypes)") +
          codeBlock("Output", "Employee       object\nAge             int64\nSalary        float64\nExperience      int64\ndtype: object") +
          bullets([
            "<strong>Employee</strong> is stored as <code>object</code>.",
            "<strong>Age</strong> is stored as <code>int64</code>.",
            "<strong>Salary</strong> is stored as <code>float64</code>.",
            "<strong>Experience</strong> is stored as <code>int64</code>.",
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> <code>dtypes</code> is an attribute, not a function. Therefore, we do not use parentheses.</p>`)
        )}

        ${section("7", "Checking DataFrame information using <code>info()</code>",
          p("Pandas also provides the <code>info()</code> method to display the structural information of a DataFrame.") +
          codeBlock("Syntax", "DataFrame.info()") +
          codeBlock("Python program", "df.info()") +
          codeBlock("Output", [
            "<class 'pandas.core.frame.DataFrame'>",
            "RangeIndex: 4 entries, 0 to 3",
            "Data columns (total 4 columns):",
            " #   Column      Non-Null Count  Dtype  ",
            "---  ------      --------------  -----  ",
            " 0   Employee    4 non-null      object ",
            " 1   Age         4 non-null      int64  ",
            " 2   Salary      4 non-null      float64",
            " 3   Experience  4 non-null      int64  ",
            "dtypes: float64(1), int64(2), object(1)",
            "memory usage: 260.0+ bytes",
          ].join("\n")) +
          p("The <code>info()</code> method provides:") +
          bullets([
            "Number of rows and columns.",
            "Column names.",
            "Number of non-null values.",
            "Data type of each column.",
            "Memory usage information.",
          ]) +
          sub("", "Difference between <code>dtypes</code> and <code>info()</code>") +
          srWrap(table(["dtypes", "info()"], [
            ["Displays data types of columns.", "Displays complete structural information."],
            ["It is an attribute.", "It is a method."],
            ["Gives a concise result.", "Gives more detailed information."],
          ]))
        )}

        ${section("8", "Converting data types using <code>astype()</code>",
          p("The <code>astype()</code> method is used to convert a Pandas Series or DataFrame column from one data type to another. It is one of the most commonly used methods for data type conversion in Pandas.") +
          codeBlock("Syntax", 'DataFrame["column_name"].astype(new_data_type)') +
          bullets([
            "<code>DataFrame</code> represents the DataFrame.",
            "<code>column_name</code> represents the column to convert.",
            "<code>new_data_type</code> represents the required data type.",
          ]) +
          callout("fa-solid fa-circle-info", `<p>The examples 8.1 to 8.3 continue with the same <code>df</code> from Section 5, so run them in order. That is why Age is already a float in 8.3.</p>`) +

          sub("8.1", "Converting integer to float") +
          p("Suppose the Age column contains integer values, and we want to convert them into floating-point values.") +
          codeBlock("Python program", 'df["Age"] = df["Age"].astype(float)\n\nprint(df["Age"])\nprint(df["Age"].dtype)') +
          codeBlock("Output", "0    25.0\n1    28.0\n2    30.0\n3    24.0\nName: Age, dtype: float64\n\nfloat64") +
          bullets([
            "Initially, the Age column contains integer values.",
            "<code>astype(float)</code> converts the integer values into floating-point values.",
            "The converted values are assigned back to the Age column.",
            "For example, <code>25</code> becomes <code>25.0</code>.",
          ]) +

          sub("8.2", "Converting float to integer") +
          p("Suppose we want to convert salary values into integers by removing their decimal portions.") +
          codeBlock("Python program", 'df["Salary"] = df["Salary"].astype(int)\n\nprint(df["Salary"])\nprint(df["Salary"].dtype)') +
          codeBlock("Output", "0    25000\n1    32000\n2    45000\n3    28000\nName: Salary, dtype: int64\n\nint64") +
          bullets([
            "The Salary column initially contains floating-point values.",
            "<code>astype(int)</code> converts them into integers.",
            "The fractional parts are discarded: <code>25000.50</code> becomes <code>25000</code> and <code>32000.75</code> becomes <code>32000</code>.",
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> converting a float to an integer using <code>astype(int)</code> truncates the fractional part; it does not round to the nearest integer. Notice that <code>32000.75</code> became <code>32000</code>, not <code>32001</code>.</p>`) +

          sub("8.3", "Converting integer to string") +
          p("Sometimes numerical values need to be stored as text. For example, an employee ID may contain digits but should be treated as an identifier rather than a number used in mathematical calculations.") +
          codeBlock("Python program", 'df["Age"] = df["Age"].astype(str)\n\nprint(df["Age"])\nprint(df["Age"].dtype)') +
          codeBlock("Output", "0    25.0\n1    28.0\n2    30.0\n3    24.0\nName: Age, dtype: object\n\nobject") +
          bullets([
            "The <code>astype(str)</code> method converts numerical values into strings.",
            "After conversion, the Age column stores text values rather than numerical values.",
            "The values show as <code>25.0</code> because Age was converted to float in 8.1.",
          ]) +
          callout("fa-solid fa-circle-info", `<p><strong>Note:</strong> in modern Pandas, <code>astype("string")</code> can also be used to create a dedicated Pandas string column.</p>`) +

          sub("8.4", "Converting string to integer") +
          p("Suppose a dataset contains numerical values stored as strings.") +
          codeBlock("Python program", 'data = {\n    "Age": ["25", "28", "30", "24"]\n}\n\ndf = pd.DataFrame(data)\n\ndf["Age"] = df["Age"].astype(int)\n\nprint(df)\nprint(df.dtypes)') +
          codeBlock("Output", "   Age\n0   25\n1   28\n2   30\n3   24\nAge    int64\ndtype: object") +
          bullets([
            "Initially, Age contains string values.",
            "<code>astype(int)</code> converts the string numbers into integers.",
            "After conversion, numerical operations can be performed on the column.",
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> <code>astype(int)</code> works when all non-missing values can be converted into valid integers. If the column contains invalid text such as <code>"Unknown"</code>, conversion will raise an error.</p>`)
        )}

        ${section("9", "Converting data types using <code>pd.to_numeric()</code>",
          p("The <code>pd.to_numeric()</code> function converts values into numerical data types. It is especially useful when numerical data is stored as strings or when a column contains invalid values.") +
          codeBlock("Syntax", 'pd.to_numeric(data, errors="raise")') +
          p("The <code>errors</code> parameter controls how invalid values are handled. Common options:") +
          srWrap(table(["Option", "Behaviour"], [
            ['<code>errors="raise"</code>', "Raises an error when conversion fails. This is the default."],
            ['<code>errors="coerce"</code>', "Converts invalid values into <code>NaN</code>."],
            ['<code>errors="ignore"</code>', "Retains the original values when conversion fails; deprecated in recent Pandas versions (and removed in Pandas 3). Avoid using it in new code."],
          ])) +
          sub("", "Example: converting string values into numbers") +
          codeBlock("Python program", 'import pandas as pd\n\ndata = {\n    "Marks": ["85", "90", "75", "95"]\n}\n\ndf = pd.DataFrame(data)\n\ndf["Marks"] = pd.to_numeric(df["Marks"])\n\nprint(df)\nprint(df.dtypes)') +
          codeBlock("Output", "   Marks\n0     85\n1     90\n2     75\n3     95\nMarks    int64\ndtype: object") +
          sub("", 'Example: handling invalid values using <code>errors="coerce"</code>') +
          p("Consider a dataset containing an invalid value.") +
          codeBlock("Python program", 'data = {\n    "Marks": ["85", "90", "Unknown", "75"]\n}\n\ndf = pd.DataFrame(data)\n\ndf["Marks"] = pd.to_numeric(\n    df["Marks"],\n    errors="coerce"\n)\n\nprint(df)') +
          codeBlock("Output", "   Marks\n0   85.0\n1   90.0\n2    NaN\n3   75.0") +
          bullets([
            "Valid numerical strings are converted into numbers.",
            'The invalid value <code>"Unknown"</code> cannot be converted into a number.',
            'Because we used <code>errors="coerce"</code>, the invalid value is converted into <code>NaN</code>.',
            "<code>NaN</code> represents a missing or unavailable numerical value.",
          ]) +
          callout("fa-solid fa-chalkboard-user", `<p><strong>Teaching point:</strong> after using <code>errors="coerce"</code>, analysts should inspect and handle the newly created missing values.</p>`)
        )}

        ${section("10", "Converting data types using <code>pd.to_datetime()</code>",
          p("In business datasets, dates are frequently stored as strings. For example:") +
          bullets(['<code>"2026-11-08"</code>', '<code>"08-11-2026"</code>', '<code>"November 08, 2026"</code>']) +
          p("To perform date-related operations, these values should be converted into Pandas datetime format. Pandas provides the <code>pd.to_datetime()</code> function for this purpose.") +
          codeBlock("Syntax", "pd.to_datetime(data)") +
          sub("", "Example: converting string to datetime") +
          codeBlock("Python program", 'data = {\n    "Employee": ["Ravi", "Ayesha", "John"],\n    "Joining_Date": [\n        "2026-01-15",\n        "2026-03-20",\n        "2026-06-10"\n    ]\n}\n\ndf = pd.DataFrame(data)\n\ndf["Joining_Date"] = pd.to_datetime(\n    df["Joining_Date"]\n)\n\nprint(df)\nprint(df.dtypes)') +
          codeBlock("Output", "  Employee Joining_Date\n0     Ravi   2026-01-15\n1   Ayesha   2026-03-20\n2     John   2026-06-10\nEmployee                object\nJoining_Date    datetime64[ns]\ndtype: object") +
          bullets([
            "Initially, the Joining_Date column contains string values.",
            "<code>pd.to_datetime()</code> converts these strings into datetime values.",
            "The column can now support date-related operations.",
          ]) +
          sub("", "Extracting the year, month and day") +
          codeBlock("Python program", 'df["Year"] = df["Joining_Date"].dt.year\n\ndf["Month"] = df["Joining_Date"].dt.month\n\ndf["Day"] = df["Joining_Date"].dt.day\n\nprint(df)') +
          codeBlock("Output", "  Employee Joining_Date  Year  Month  Day\n0     Ravi   2026-01-15  2026      1   15\n1   Ayesha   2026-03-20  2026      3   20\n2     John   2026-06-10  2026      6   10") +
          callout("fa-solid fa-circle-info", `<p>The <code>.dt</code> accessor provides date-related properties and operations for Pandas datetime columns.</p>`)
        )}

        ${section("11", 'Converting data types using <code>astype("category")</code>',
          p("Sometimes a column contains repeated categorical values. For example, an employee department column may contain values such as HR, Finance, IT, and Marketing. Instead of treating the values as general objects, we can convert them into the Pandas categorical data type.") +
          codeBlock("Python program", 'data = {\n    "Employee": ["Ravi", "Ayesha", "John", "Ali"],\n    "Department": ["HR", "IT", "Finance", "IT"]\n}\n\ndf = pd.DataFrame(data)\n\ndf["Department"] = df["Department"].astype("category")\n\nprint(df)\nprint(df.dtypes)') +
          codeBlock("Output", "  Employee Department\n0     Ravi         HR\n1   Ayesha         IT\n2     John    Finance\n3      Ali         IT\nEmployee        object\nDepartment    category\ndtype: object") +
          bullets([
            "The Department column initially contains general <code>object</code> values.",
            '<code>astype("category")</code> converts it into a categorical column.',
            "Pandas stores the categories and their corresponding codes.",
            "Categorical data types can reduce memory usage when a column contains a limited number of repeated values.",
            "They are also useful when working with categorical variables in data analysis.",
          ])
        )}

        ${section("12", "Handling data type conversion errors",
          p("During data preprocessing, some columns may contain invalid or inconsistent values. For example:") +
          codeBlock("Python program", 'data = {\n    "Age": ["25", "30", "Unknown", "28"]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df)') +
          codeBlock("Output", "       Age\n0       25\n1       30\n2  Unknown\n3       28") +
          p("If we directly execute:") +
          codeBlock("Python program", 'df["Age"] = df["Age"].astype(int)') +
          codeBlock("Error", "ValueError: invalid literal for int() with base 10: 'Unknown'") +
          p('Pandas raises a conversion error because <code>"Unknown"</code> is not a valid integer.') +
          sub("", 'Solution: using <code>pd.to_numeric()</code> with <code>errors="coerce"</code>') +
          codeBlock("Python program", 'df["Age"] = pd.to_numeric(\n    df["Age"],\n    errors="coerce"\n)\n\nprint(df)') +
          codeBlock("Output", "    Age\n0  25.0\n1  30.0\n2   NaN\n3  28.0") +
          p("Now the invalid value has been converted into <code>NaN</code>. We can identify missing values using:") +
          codeBlock("Python program", "print(df.isnull().sum())") +
          codeBlock("Output", "Age    1\ndtype: int64") +
          p("This indicates that one missing value exists in the Age column.") +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> data type conversion and missing-value handling are related preprocessing tasks, but they are not the same operation.</p>`)
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Check the type of every column", "<code>df.dtypes</code>"],
            ["Full structural information", "<code>df.info()</code>"],
            ["Integer to float", '<code>df["Age"].astype(float)</code>'],
            ["Float to integer (truncates)", '<code>df["Salary"].astype(int)</code>'],
            ["Number to string", '<code>df["Age"].astype(str)</code>'],
            ["String to integer", '<code>df["Age"].astype(int)</code>'],
            ["Strings to numbers", '<code>pd.to_numeric(df["Marks"])</code>'],
            ["Invalid values become NaN", '<code>pd.to_numeric(df["Marks"], errors="coerce")</code>'],
            ["Strings to dates", '<code>pd.to_datetime(df["Joining_Date"])</code>'],
            ["Year / month / day from a date", '<code>df["Joining_Date"].dt.year</code>'],
            ["Repeated labels to category", '<code>df["Department"].astype("category")</code>'],
          ]))
        )}
      `;
    },
  });

  /* ---- Renaming and Replacing ------------------------------------------------ */
  // Code, printed output and diagram data in RR_CODE / RR_OUT / RR_GRID were produced
  // by running the code in real pandas, step by step, so every picture matches what
  // students see. Both topics use the same small Customer / Amount table.
  const RR_CODE = {"rn_create": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"Cust_ID\": [1, 2, 3],\n    \"Amt\": [200, 300, 250]\n})\n\nprint(df)", "rn_one": "df.rename(columns={\"Cust_ID\": \"CustomerID\"}, inplace=True)\n\nprint(df)", "rn_multi": "df.rename(columns={\"CustomerID\": \"Customer_ID\", \"Amt\": \"Amount\"}, inplace=True)\n\nprint(df)", "rn_all": "df.columns = [\"ID\", \"Total_Amount\"]\n\nprint(df)", "ix_some": "df.rename(index={0: \"First\", 1: \"Second\"}, inplace=True)\n\nprint(df)", "ix_all": "df.index = [\"Row1\", \"Row2\", \"Row3\"]\n\nprint(df)", "rp_create": "import pandas as pd\n\ndf = pd.DataFrame(\n    {\"ID\": [1, 2, 3], \"Total_Amount\": [200, 300, 250]},\n    index=[\"Row1\", \"Row2\", \"Row3\"]\n)\n\nprint(df)", "rp_one": "df[\"Total_Amount\"] = df[\"Total_Amount\"].replace(200, 250)\n\nprint(df)", "rp_multi": "df[\"Total_Amount\"] = df[\"Total_Amount\"].replace({250: 260, 300: 350})\n\nprint(df)", "rp_all": "df.replace(260, 500, inplace=True)\n\nprint(df)", "rp_row": "df.loc[\"Row2\"] = [2, 400]\n\nprint(df)", "rp_cell": "df.loc[\"Row3\", \"Total_Amount\"] = 600\n\nprint(df)", "tx_create": "data = {\"Region\": [\"East\", \"West\", \"East\", \"North\"]}\n\ndf = pd.DataFrame(data)\n\nprint(df)", "tx_rep": "df[\"Region\"] = df[\"Region\"].replace({\"East\": \"E\", \"West\": \"W\", \"North\": \"N\"})\n\nprint(df)"};
  const RR_OUT = {"rn_create": "   Cust_ID  Amt\n0        1  200\n1        2  300\n2        3  250", "rn_one": "   CustomerID  Amt\n0           1  200\n1           2  300\n2           3  250", "rn_multi": "   Customer_ID  Amount\n0            1     200\n1            2     300\n2            3     250", "rn_all": "   ID  Total_Amount\n0   1           200\n1   2           300\n2   3           250", "ix_some": "        ID  Total_Amount\nFirst    1           200\nSecond   2           300\n2        3           250", "ix_all": "      ID  Total_Amount\nRow1   1           200\nRow2   2           300\nRow3   3           250", "rp_create": "      ID  Total_Amount\nRow1   1           200\nRow2   2           300\nRow3   3           250", "rp_one": "      ID  Total_Amount\nRow1   1           250\nRow2   2           300\nRow3   3           250", "rp_multi": "      ID  Total_Amount\nRow1   1           260\nRow2   2           350\nRow3   3           260", "rp_all": "      ID  Total_Amount\nRow1   1           500\nRow2   2           350\nRow3   3           500", "rp_row": "      ID  Total_Amount\nRow1   1           500\nRow2   2           400\nRow3   3           500", "rp_cell": "      ID  Total_Amount\nRow1   1           500\nRow2   2           400\nRow3   3           600", "tx_create": "  Region\n0   East\n1   West\n2   East\n3  North", "tx_rep": "  Region\n0      E\n1      W\n2      E\n3      N"};
  const RR_GRID = {"rn_create": {"idx": ["0", "1", "2"], "cols": ["Cust_ID", "Amt"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "rn_one": {"idx": ["0", "1", "2"], "cols": ["CustomerID", "Amt"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "rn_multi": {"idx": ["0", "1", "2"], "cols": ["Customer_ID", "Amount"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "rn_all": {"idx": ["0", "1", "2"], "cols": ["ID", "Total_Amount"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "ix_some": {"idx": ["First", "Second", "2"], "cols": ["ID", "Total_Amount"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "ix_all": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "rp_create": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "200"], ["2", "300"], ["3", "250"]]}, "rp_one": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "250"], ["2", "300"], ["3", "250"]]}, "rp_multi": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "260"], ["2", "350"], ["3", "260"]]}, "rp_all": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "500"], ["2", "350"], ["3", "500"]]}, "rp_row": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "500"], ["2", "400"], ["3", "500"]]}, "rp_cell": {"idx": ["Row1", "Row2", "Row3"], "cols": ["ID", "Total_Amount"], "rows": [["1", "500"], ["2", "400"], ["3", "600"]]}, "tx_create": {"idx": ["0", "1", "2", "3"], "cols": ["Region"], "rows": [["East"], ["West"], ["East"], ["North"]]}, "tx_rep": {"idx": ["0", "1", "2", "3"], "cols": ["Region"], "rows": [["E"], ["W"], ["E"], ["N"]]}};

  const rrEx = (key, label) => codeBlock(label || "Code", RR_CODE[key]) + codeBlock("Output", RR_OUT[key]);

  // Diagram: a small table. hlCols / hlIdx tag the column names / row labels that were renamed
  // (green tag, no extra CSS needed); sel = [[row, col], ...] are the cells whose value changed.
  const rrGrid = (key, o) => {
    o = o || {};
    const g = RR_GRID[key], hc = o.hlCols || [], hi = o.hlIdx || [], sel = o.sel || [], tag = o.tag || "renamed";
    let n = 0;
    const head = g.cols.map((c, j) => `<th>${c}${hc.includes(j) ? `<small class="idx-tag i">${tag}</small>` : ""}</th>`).join("");
    const body = g.rows.map((row, i) => `<tr><th>${g.idx[i]}${hi.includes(i) ? `<small class="idx-tag i">${tag}</small>` : ""}</th>` + row.map((v, j) => {
      const on = sel.some((s) => s[0] === i && s[1] === j);
      return `<td class="${on ? "is-sel" : ""}"${on ? ` style="--i:${n++}"` : ""}>${v}</td>`;
    }).join("") + "</tr>").join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner"></th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
      (o.caption ? `<p class="idx-cap">${o.caption}</p>` : "");
  };

  /* ---- Renaming ------------------------------------------------------------- */
  registerTopic({
    library: "pandas",
    id: "renaming",
    title: "Renaming",
    difficulty: "Beginner",
    summary: "Give columns and row labels clearer names with rename(), or replace all column names or all index labels at once.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-pen-to-square", "Renaming Rows and Columns", "Making column names and row labels meaningful and readable")}

        ${section("", "Introduction",
          p("When working with large datasets, we often need to:") +
          bullets([
            "<strong>Rename</strong> column names or row indexes, to make them meaningful and readable (this topic).",
            "<strong>Replace</strong> values in columns or rows, to clean incorrect, missing, or outdated data (next topic).",
          ]) +
          p("These operations are important for data cleaning, preprocessing, and preparing data for analysis or visualization.")
        )}

        ${section("1", "Purpose of renaming",
          p("Renaming helps in:") +
          bullets([
            "Making column names more descriptive.",
            "Following consistent naming conventions.",
            "Removing spaces or special characters in column names.",
            "Renaming index values for better readability.",
          ])
        )}

        ${section("2", "Renaming columns",
          p("Use the <code>rename()</code> method to rename one or more columns.") +
          codeBlock("Syntax", "DataFrame.rename(columns={'old_name': 'new_name'}, inplace=False)") +
          sub("", "Example dataset") +
          rrEx("rn_create") +
          rrGrid("rn_create", { caption: "Column names (<code>Cust_ID</code>, <code>Amt</code>) are short and cryptic; rows are labelled 0, 1, 2." }) +
          sub("Example 1:", "Renaming a single column") +
          rrEx("rn_one") +
          rrGrid("rn_one", { hlCols: [0], caption: "Only the <strong>Cust_ID</strong> header changed (tagged). The values underneath did not change." }) +
          bullets([
            "The dictionary maps the <strong>old name</strong> (key) to the <strong>new name</strong> (value).",
            "<code>inplace=True</code> changes the existing DataFrame. With the default <code>inplace=False</code>, <code>rename()</code> returns a new DataFrame and the original stays unchanged.",
          ]) +
          callout("fa-solid fa-lightbulb", `<p><strong>Tip:</strong> many programmers prefer <code>df = df.rename(columns={...})</code> to <code>inplace=True</code>. Both give the same result here.</p>`) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Important:</strong> if a name in the dictionary does not exist in the DataFrame (for example, a spelling mistake in the old name), <code>rename()</code> does not raise an error. It simply changes nothing, so always print the DataFrame to check.</p>`)
        )}

        ${section("3", "Renaming multiple columns",
          p("You can rename multiple columns by passing a dictionary with several key-value pairs.") +
          rrEx("rn_multi") +
          rrGrid("rn_multi", { hlCols: [0, 1], caption: "Both headers changed in one call: <code>CustomerID</code> became <code>Customer_ID</code> and <code>Amt</code> became <code>Amount</code>." })
        )}

        ${section("4", "Renaming all columns at once",
          p("You can directly assign a new list of column names to the DataFrame.") +
          rrEx("rn_all") +
          rrGrid("rn_all", { hlCols: [0, 1], caption: "Every column name was replaced by the new list, in order." }) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Note:</strong> the number of new names must match the number of existing columns. Otherwise Pandas raises a <code>ValueError</code>.</p>`)
        )}

        ${section("5", "Renaming a specific row index",
          p("You can rename a specific index label using the <code>index</code> parameter in <code>rename()</code>.") +
          rrEx("ix_some") +
          rrGrid("ix_some", { hlIdx: [0, 1], caption: "Rows 0 and 1 got new labels (tagged). The third row was not in the dictionary, so it keeps its label <code>2</code>." })
        )}

        ${section("6", "Renaming all index values",
          p("You can replace the entire index list at once.") +
          rrEx("ix_all") +
          rrGrid("ix_all", { hlIdx: [0, 1, 2], caption: "All three row labels were replaced. The list must contain exactly one label for every row." })
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Rename one or more columns", "<code>df.rename(columns={'old': 'new'})</code>"],
            ["Rename all columns at once", "<code>df.columns = ['A', 'B']</code>"],
            ["Rename some row labels", "<code>df.rename(index={0: 'First'})</code>"],
            ["Rename all row labels at once", "<code>df.index = ['Row1', 'Row2', 'Row3']</code>"],
          ]))
        )}
      `;
    },
  });

  /* ---- Replacing ------------------------------------------------------------ */
  registerTopic({
    library: "pandas",
    id: "replacing",
    title: "Replacing",
    difficulty: "Beginner",
    summary: "Correct or standardize data with replace(): one value, many values, a whole DataFrame, a row, a single cell, and text values.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-right-left", "Replacing Values in Pandas", "Correcting, standardizing and updating the data itself")}

        ${section("1", "Purpose of replacing",
          p("Replacing is used to:") +
          bullets([
            "Correct wrong or inconsistent data values.",
            "Standardize text (for example, \"yes\", \"Yes\", \"YES\" → \"Yes\").",
            "Fill missing or placeholder values.",
            "Change values based on conditions.",
          ]) +
          callout("fa-solid fa-circle-info", `<p><strong>Renaming vs replacing:</strong> renaming changes the <em>labels</em> (column names and row index), while replacing changes the <em>values</em> stored in the table.</p>`) +
          sub("", "Example dataset") +
          p("The examples below continue from the table at the end of the Renaming topic. Run them in order, because each step builds on the one before.") +
          rrEx("rp_create")
        )}

        ${section("2", "Replacing column values",
          p("Use <code>replace()</code> to substitute one or more values in a column.") +
          codeBlock("Syntax", "Series.replace(old_value, new_value)") +
          sub("Example 1:", "Replace a single value") +
          rrEx("rp_one") +
          rrGrid("rp_one", { sel: [[0, 1]], caption: "Every <code>200</code> in Total_Amount became <code>250</code> (highlighted)." }) +
          callout("fa-solid fa-lightbulb", `<p><strong>Remember:</strong> <code>replace()</code> returns a new column. To keep the change, assign it back: <code>df["Total_Amount"] = df["Total_Amount"].replace(200, 250)</code>.</p>`)
        )}

        ${section("3", "Replacing multiple values",
          p("You can replace several values at once using a dictionary of <code>{old: new}</code> pairs.") +
          rrEx("rp_multi") +
          rrGrid("rp_multi", { sel: [[0, 1], [1, 1], [2, 1]], caption: "<code>250</code> became <code>260</code> and <code>300</code> became <code>350</code>, both in one call (highlighted)." })
        )}

        ${section("4", "Replacing values in all columns",
          p("You can replace values across the entire DataFrame.") +
          rrEx("rp_all") +
          rrGrid("rp_all", { sel: [[0, 1], [2, 1]], caption: "Every <code>260</code> anywhere in the table became <code>500</code> (highlighted)." }) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Careful:</strong> <code>df.replace(260, 500)</code> looks at <strong>every</strong> column. If the ID column had also contained <code>260</code>, it would have changed too. To limit the change to one column, use <code>df["Column"].replace(...)</code>.</p>`)
        )}

        ${section("5", "Replacing row values",
          p("If you want to replace all values in a specific row, you can use <code>.loc[]</code>.") +
          rrEx("rp_row") +
          rrGrid("rp_row", { sel: [[1, 0], [1, 1]], caption: "The whole <code>Row2</code> was overwritten with <code>[2, 400]</code> (highlighted)." }) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Note:</strong> the list must have one value for every column. Here there are two columns (ID and Total_Amount), so the list has two values.</p>`)
        )}

        ${section("6", "Replacing a specific cell (row and column value)",
          p("To replace a specific value at a particular row and column, use <code>.loc[]</code> or <code>.at[]</code>.") +
          rrEx("rp_cell") +
          rrGrid("rp_cell", { sel: [[2, 1]], caption: "Only one cell changed: row <code>Row3</code>, column <code>Total_Amount</code> (highlighted)." }) +
          p("The same change can be written with <code>.at[]</code>, which is a faster way to access a single cell:") +
          codeBlock("Alternative", 'df.at["Row3", "Total_Amount"] = 600')
        )}

        ${section("7", "Replacing text values",
          p("You can replace text values too. This is useful in categorical or string columns.") +
          codeBlock("Example dataset", RR_CODE.tx_create) +
          codeBlock("Output", RR_OUT.tx_create) +
          rrEx("tx_rep") +
          rrGrid("tx_rep", { sel: [[0, 0], [1, 0], [2, 0], [3, 0]], caption: "<code>East</code> → <code>E</code>, <code>West</code> → <code>W</code>, <code>North</code> → <code>N</code>. Both East rows changed." })
        )}

        ${section("", "Renaming vs replacing",
          srWrap(table(["Aspect", "Renaming", "Replacing"], [
            ["What changes", "Labels: column names and row index", "Values stored in the cells"],
            ["Main method", "<code>rename()</code>, <code>df.columns</code>, <code>df.index</code>", "<code>replace()</code>, <code>.loc[]</code>, <code>.at[]</code>"],
            ["Typical use", "Readable, consistent names", "Cleaning and standardizing data"],
          ]))
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Replace one value in a column", '<code>df["Total_Amount"].replace(200, 250)</code>'],
            ["Replace several values", '<code>df["Total_Amount"].replace({250: 260, 300: 350})</code>'],
            ["Replace a value in the whole DataFrame", "<code>df.replace(260, 500)</code>"],
            ["Replace a whole row", '<code>df.loc["Row2"] = [2, 400]</code>'],
            ["Replace one cell", '<code>df.loc["Row3", "Total_Amount"] = 600</code>'],
            ["Replace text values", '<code>df["Region"].replace({"East": "E"})</code>'],
          ]))
        )}
      `;
    },
  });

  /* ---- String Operations on Categorical Data ------------------------------- */
  // Code, printed output and diagram data in SM_CODE / SM_OUT / SM_GRID were produced
  // by running the code in real pandas, so every picture matches what students see.
  const SM_CODE = {"c_create": "import pandas as pd\n\ndf = pd.DataFrame({\"Product\": [\"apple\", \"Banana\", \"MANGO\"]})\n\nprint(df)", "c_all": "# Convert to lowercase\ndf[\"lower\"] = df[\"Product\"].str.lower()\n\n# Convert to uppercase\ndf[\"upper\"] = df[\"Product\"].str.upper()\n\n# Convert to title case (first letter capital)\ndf[\"title\"] = df[\"Product\"].str.title()\n\nprint(df)", "s_create": "df = pd.DataFrame({\"Name\": [\" John\", \" Alice\", \"Bob \"]})\n\nprint(df)", "s_strip": "df[\"Cleaned\"] = df[\"Name\"].str.strip()\n\nprint(df)", "s_variants": "print(df[\"Name\"].str.lstrip().tolist())\nprint(df[\"Name\"].str.rstrip().tolist())", "r_create": "df = pd.DataFrame({\"Product\": [\"Pro_apple\", \"Pro_mango\", \"Pro_banana\"]})\n\nprint(df)", "r_rep": "df[\"Updated\"] = df[\"Product\"].str.replace(\"Pro_\", \"Fresh_\")\n\nprint(df)", "k_create": "df = pd.DataFrame({\"City\": [\"New York\", \"London\", \"New Delhi\", \"Paris\"]})\n\nprint(df)", "k_start": "# Cities starting with \"New\"\ndf[\"StartsWith_New\"] = df[\"City\"].str.startswith(\"New\")\n\nprint(df)", "k_cont": "# Cities containing \"on\"\ndf[\"Contains_on\"] = df[\"City\"].str.contains(\"on\")\n\nprint(df)", "k_end": "df[\"EndsWith_s\"] = df[\"City\"].str.endswith(\"s\")\n\nprint(df)", "k_filter": "print(df[df[\"City\"].str.startswith(\"New\")])", "l_create": "df = pd.DataFrame({\"Product\": [\"Apple\", \"Mango\", \"Banana\"]})\n\nprint(df)", "l_len": "df[\"Length\"] = df[\"Product\"].str.len()\n\nprint(df)", "n_create": "df = pd.DataFrame({\"First\": [\"John\", \"Alice\"], \"Last\": [\"Smith\", \"Brown\"]})\n\nprint(df)", "n_plus": "df[\"FullName\"] = df[\"First\"] + \" \" + df[\"Last\"]\n\nprint(df)", "n_cat": "df[\"FullName2\"] = df[\"First\"].str.cat(df[\"Last\"], sep=\"_\")\n\nprint(df)", "h_create": "df = pd.DataFrame({\"Region\": [\"  east\", \"WEST \", \" North  \", \"south\"]})\n\nprint(df)", "h_chain": "df[\"Region\"] = df[\"Region\"].str.strip().str.title()\n\nprint(df)"};
  const SM_OUT = {"c_create": "  Product\n0   apple\n1  Banana\n2   MANGO", "c_all": "  Product   lower   upper   title\n0   apple   apple   APPLE   Apple\n1  Banana  banana  BANANA  Banana\n2   MANGO   mango   MANGO   Mango", "s_create": "     Name\n0    John\n1   Alice\n2    Bob ", "s_strip": "     Name Cleaned\n0    John    John\n1   Alice   Alice\n2    Bob      Bob", "s_variants": "['John', 'Alice', 'Bob ']\n[' John', ' Alice', 'Bob']", "r_create": "      Product\n0   Pro_apple\n1   Pro_mango\n2  Pro_banana", "r_rep": "      Product       Updated\n0   Pro_apple   Fresh_apple\n1   Pro_mango   Fresh_mango\n2  Pro_banana  Fresh_banana", "k_create": "        City\n0   New York\n1     London\n2  New Delhi\n3      Paris", "k_start": "        City  StartsWith_New\n0   New York            True\n1     London           False\n2  New Delhi            True\n3      Paris           False", "k_cont": "        City  StartsWith_New  Contains_on\n0   New York            True        False\n1     London           False         True\n2  New Delhi            True        False\n3      Paris           False        False", "k_end": "        City  StartsWith_New  Contains_on  EndsWith_s\n0   New York            True        False       False\n1     London           False         True       False\n2  New Delhi            True        False       False\n3      Paris           False        False        True", "k_filter": "        City  StartsWith_New  Contains_on  EndsWith_s\n0   New York            True        False       False\n2  New Delhi            True        False       False", "l_create": "  Product\n0   Apple\n1   Mango\n2  Banana", "l_len": "  Product  Length\n0   Apple       5\n1   Mango       5\n2  Banana       6", "n_create": "   First   Last\n0   John  Smith\n1  Alice  Brown", "n_plus": "   First   Last     FullName\n0   John  Smith   John Smith\n1  Alice  Brown  Alice Brown", "n_cat": "   First   Last     FullName    FullName2\n0   John  Smith   John Smith   John_Smith\n1  Alice  Brown  Alice Brown  Alice_Brown", "h_create": "     Region\n0      east\n1     WEST \n2   North  \n3     south", "h_chain": "  Region\n0   East\n1   West\n2  North\n3  South"};
  const SM_GRID = {"c_create": {"idx": ["0", "1", "2"], "cols": ["Product"], "rows": [["apple"], ["Banana"], ["MANGO"]]}, "c_all": {"idx": ["0", "1", "2"], "cols": ["Product", "lower", "upper", "title"], "rows": [["apple", "apple", "APPLE", "Apple"], ["Banana", "banana", "BANANA", "Banana"], ["MANGO", "mango", "MANGO", "Mango"]]}, "s_create": {"idx": ["0", "1", "2"], "cols": ["Name"], "rows": [[" John"], [" Alice"], ["Bob "]]}, "s_strip": {"idx": ["0", "1", "2"], "cols": ["Name", "Cleaned"], "rows": [[" John", "John"], [" Alice", "Alice"], ["Bob ", "Bob"]]}, "s_variants": {"idx": ["0", "1", "2"], "cols": ["Name", "Cleaned"], "rows": [[" John", "John"], [" Alice", "Alice"], ["Bob ", "Bob"]]}, "r_create": {"idx": ["0", "1", "2"], "cols": ["Product"], "rows": [["Pro_apple"], ["Pro_mango"], ["Pro_banana"]]}, "r_rep": {"idx": ["0", "1", "2"], "cols": ["Product", "Updated"], "rows": [["Pro_apple", "Fresh_apple"], ["Pro_mango", "Fresh_mango"], ["Pro_banana", "Fresh_banana"]]}, "k_create": {"idx": ["0", "1", "2", "3"], "cols": ["City"], "rows": [["New York"], ["London"], ["New Delhi"], ["Paris"]]}, "k_start": {"idx": ["0", "1", "2", "3"], "cols": ["City", "StartsWith_New"], "rows": [["New York", "True"], ["London", "False"], ["New Delhi", "True"], ["Paris", "False"]]}, "k_cont": {"idx": ["0", "1", "2", "3"], "cols": ["City", "StartsWith_New", "Contains_on"], "rows": [["New York", "True", "False"], ["London", "False", "True"], ["New Delhi", "True", "False"], ["Paris", "False", "False"]]}, "k_end": {"idx": ["0", "1", "2", "3"], "cols": ["City", "StartsWith_New", "Contains_on", "EndsWith_s"], "rows": [["New York", "True", "False", "False"], ["London", "False", "True", "False"], ["New Delhi", "True", "False", "False"], ["Paris", "False", "False", "True"]]}, "k_filter": {"idx": ["0", "1", "2", "3"], "cols": ["City", "StartsWith_New", "Contains_on", "EndsWith_s"], "rows": [["New York", "True", "False", "False"], ["London", "False", "True", "False"], ["New Delhi", "True", "False", "False"], ["Paris", "False", "False", "True"]]}, "l_create": {"idx": ["0", "1", "2"], "cols": ["Product"], "rows": [["Apple"], ["Mango"], ["Banana"]]}, "l_len": {"idx": ["0", "1", "2"], "cols": ["Product", "Length"], "rows": [["Apple", "5"], ["Mango", "5"], ["Banana", "6"]]}, "n_create": {"idx": ["0", "1"], "cols": ["First", "Last"], "rows": [["John", "Smith"], ["Alice", "Brown"]]}, "n_plus": {"idx": ["0", "1"], "cols": ["First", "Last", "FullName"], "rows": [["John", "Smith", "John Smith"], ["Alice", "Brown", "Alice Brown"]]}, "n_cat": {"idx": ["0", "1"], "cols": ["First", "Last", "FullName", "FullName2"], "rows": [["John", "Smith", "John Smith", "John_Smith"], ["Alice", "Brown", "Alice Brown", "Alice_Brown"]]}, "h_create": {"idx": ["0", "1", "2", "3"], "cols": ["Region"], "rows": [["  east"], ["WEST "], [" North  "], ["south"]]}, "h_chain": {"idx": ["0", "1", "2", "3"], "cols": ["Region"], "rows": [["East"], ["West"], ["North"], ["South"]]}};

  const smEx = (key, label) => codeBlock(label || "Code", SM_CODE[key]) + codeBlock("Output", SM_OUT[key]);

  // Spaces at the start or end of a value are invisible in a table, so show them as faint dots.
  const smVis = (v) => v.replace(/^ +| +$/g, (m) => `<span style="opacity:.45">${"·".repeat(m.length)}</span>`);

  // Diagram: a small table. hlCols tag the columns that were created or changed (green tag, no extra CSS).
  const smGrid = (key, o) => {
    o = o || {};
    const g = SM_GRID[key], hc = o.hlCols || [], tag = o.tag || "new column";
    let n = 0;
    const head = g.cols.map((c, j) => `<th>${c}${hc.includes(j) ? `<small class="idx-tag i">${tag}</small>` : ""}</th>`).join("");
    const body = g.rows.map((row, i) => `<tr><th>${g.idx[i]}</th>` + row.map((v, j) => {
      const on = hc.includes(j);
      return `<td class="${on ? "is-sel" : ""}"${on ? ` style="--i:${n++}"` : ""}>${smVis(v)}</td>`;
    }).join("") + "</tr>").join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner"></th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
      (o.caption ? `<p class="idx-cap">${o.caption}</p>` : "");
  };

  registerTopic({
    library: "pandas",
    id: "string-operations",
    title: "String Operations on Categorical Data",
    difficulty: "Beginner",
    summary: "Clean and format text columns with the .str accessor: change case, strip spaces, replace, check start/end/contains, measure length and join strings.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-font", "String Operations on Categorical Data", "Cleaning, standardizing and combining text columns with the .str accessor")}

        ${section("", "Introduction",
          p("In many datasets, columns contain <strong>categorical (text/string) data</strong>, such as:") +
          bullets([
            "Product names",
            "City or region names",
            "Customer types (for example, \"Regular\", \"Premium\")",
          ]) +
          p("Before analysis or modeling, we often need to clean and format these string values. For example:") +
          bullets([
            "Converting all text to lowercase.",
            "Removing extra spaces.",
            "Replacing or extracting parts of a string.",
          ]) +
          p("In Pandas, string operations are done using the <code>.str</code> accessor, which allows <strong>vectorized</strong> (fast) operations on entire columns of text.")
        )}

        ${section("", "Why perform string operations?",
          srWrap(table(["Purpose", "Example"], [
            ["Clean messy text", "Removing extra spaces, correcting cases"],
            ["Standardize format", "\"east\" → \"East\""],
            ["Extract information", "Finding values starting with \"Pro\""],
            ["Prepare for analysis", "Creating new columns, combining strings"],
          ]))
        )}

        ${section("", "Basic syntax",
          codeBlock("Syntax", "DataFrame['column_name'].str.function_name()") +
          p("Example:") +
          codeBlock("Example", "df['Product'].str.lower()") +
          callout("fa-solid fa-circle-info", `<p><strong>Remember:</strong> a string method returns a <em>new</em> Series. The original column does not change unless you assign the result back, for example <code>df["Product"] = df["Product"].str.lower()</code>. The <code>.str</code> accessor works only on text columns; on a numeric column Pandas raises an <code>AttributeError</code>.</p>`)
        )}

        ${section("1", "Case change operations",
          p("Used to convert text into uppercase, lowercase, or title case.") +
          bullets([
            "<code>.str.lower()</code> → all letters in small case.",
            "<code>.str.upper()</code> → all letters in capitals.",
            "<code>.str.title()</code> → first letter of every word in capitals.",
          ]) +
          sub("", "Example") +
          smEx("c_create", "Example dataset") +
          smGrid("c_create", { caption: "One text column, typed in three different styles: <code>apple</code>, <code>Banana</code>, <code>MANGO</code>." }) +
          smEx("c_all") +
          smGrid("c_all", { hlCols: [1, 2, 3], caption: "Each method created a new column (tagged). The original <code>Product</code> column is unchanged." })
        )}

        ${section("2", "Removing spaces (strip operations)",
          p("Sometimes strings contain unwanted spaces at the beginning or end. We can remove them using:") +
          bullets([
            "<code>.str.strip()</code> → removes spaces from <strong>both</strong> sides.",
            "<code>.str.lstrip()</code> → removes spaces from the <strong>left</strong>.",
            "<code>.str.rstrip()</code> → removes spaces from the <strong>right</strong>.",
          ]) +
          sub("", "Example") +
          smEx("s_create", "Example dataset") +
          smEx("s_strip") +
          smGrid("s_strip", { hlCols: [1], tag: "cleaned", caption: "The faint dots mark spaces. <code>Cleaned</code> has no space at either end." }) +
          sub("", "lstrip() and rstrip()") +
          smEx("s_variants") +
          p("<code>lstrip()</code> cleaned only the left side, so <code>'Bob '</code> kept its trailing space. <code>rstrip()</code> did the opposite.") +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Why this matters:</strong> <code>"Bob "</code> and <code>"Bob"</code> look the same on screen, but Pandas treats them as two different values. Grouping, counting and filtering silently go wrong until the spaces are stripped.</p>`)
        )}

        ${section("3", "Replacing substrings",
          p("Use <code>.str.replace(old, new)</code> to replace part of a string.") +
          smEx("r_create", "Example dataset") +
          smEx("r_rep") +
          smGrid("r_rep", { hlCols: [1], tag: "updated", caption: "<code>Pro_</code> became <code>Fresh_</code> inside every value. The rest of each string stayed the same." }) +
          callout("fa-solid fa-lightbulb", `<p><strong>Do not confuse the two:</strong> <code>Series.replace("East", "E")</code> (previous topic) changes a value only when the <em>whole value</em> matches. <code>.str.replace("Pro_", "Fresh_")</code> changes a <em>part</em> of every string.</p>`)
        )}

        ${section("4", "Condition-based string operations",
          p("We can check whether a string starts with, ends with, or contains a specific substring.") +
          srWrap(table(["Function", "Description", "Example"], [
            ["<code>str.startswith('sub')</code>", "Checks if the value starts with the substring", "<code>'Apple'</code> starts with <code>'A'</code> → True"],
            ["<code>str.endswith('sub')</code>", "Checks if the value ends with the substring", "<code>'Apple'</code> ends with <code>'e'</code> → True"],
            ["<code>str.contains('sub')</code>", "Checks if the substring exists anywhere in the value", "<code>'Apple'</code> contains <code>'pp'</code> → True"],
          ])) +
          sub("", "Example") +
          smEx("k_create", "Example dataset") +
          smEx("k_start") +
          smGrid("k_start", { hlCols: [1], caption: "<code>True</code> for <code>New York</code> and <code>New Delhi</code>. <code>London</code> and <code>Paris</code> do not start with <code>New</code>." }) +
          smEx("k_cont") +
          smGrid("k_cont", { hlCols: [2], caption: "Only <code>London</code> contains <code>on</code>." }) +
          sub("", "endswith()") +
          smEx("k_end") +
          smGrid("k_end", { hlCols: [3], caption: "Only <code>Paris</code> ends with <code>s</code>." }) +
          sub("", "Using the result to filter rows") +
          p("These methods return a column of True/False values. Put that inside <code>df[...]</code> to keep only the matching rows.") +
          smEx("k_filter") +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Note:</strong> these checks are <strong>case-sensitive</strong>. <code>"London"</code> does not contain <code>"lon"</code>. Use <code>str.contains("lon", case=False)</code> to ignore case. Also, <code>str.contains()</code> treats its text as a pattern by default; add <code>regex=False</code> when searching for symbols such as <code>.</code> or <code>+</code>.</p>`)
        )}

        ${section("5", "Length of a string",
          p("To find the number of characters in each string, use <code>.str.len()</code>.") +
          smEx("l_create", "Example dataset") +
          smEx("l_len") +
          smGrid("l_len", { hlCols: [1], tag: "characters", caption: "<code>Apple</code> and <code>Mango</code> have 5 characters, <code>Banana</code> has 6." })
        )}

        ${section("6", "Concatenating strings",
          p("You can combine (join) two or more string columns using <code>+</code> or <code>.str.cat()</code>.") +
          smEx("n_create", "Example dataset") +
          sub("Example 1:", "Using the + operator") +
          smEx("n_plus") +
          smGrid("n_plus", { hlCols: [2], caption: "The <code>\" \"</code> in the middle adds a space between the first and last name." }) +
          sub("Example 2:", "Using .str.cat()") +
          smEx("n_cat") +
          smGrid("n_cat", { hlCols: [3], caption: "<code>sep=\"_\"</code> is placed between the two values." }) +
          callout("fa-solid fa-lightbulb", `<p><strong>Tip:</strong> the <code>+</code> operator works only when every column being joined holds text. To join a number column, convert it first with <code>.astype(str)</code>.</p>`)
        )}

        ${section("", "Chaining string operations",
          p("String methods can be chained, one after another, to standardize a messy column in a single line. Here the values have extra spaces and inconsistent case.") +
          smEx("h_create", "Example dataset") +
          smGrid("h_create", { caption: "Faint dots mark the extra spaces. The same region is typed in different styles." }) +
          smEx("h_chain") +
          smGrid("h_chain", { hlCols: [0], tag: "standardized", caption: "<code>strip()</code> removed the spaces, then <code>title()</code> fixed the case. The result is a clean, consistent categorical column." })
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Convert to lowercase", "<code>df['col'].str.lower()</code>"],
            ["Convert to uppercase", "<code>df['col'].str.upper()</code>"],
            ["Convert to title case", "<code>df['col'].str.title()</code>"],
            ["Remove spaces from both sides", "<code>df['col'].str.strip()</code>"],
            ["Remove spaces from the left / right", "<code>df['col'].str.lstrip()</code> / <code>df['col'].str.rstrip()</code>"],
            ["Replace part of a string", "<code>df['col'].str.replace('old', 'new')</code>"],
            ["Starts with / ends with / contains", "<code>df['col'].str.startswith('x')</code>, <code>.str.endswith('x')</code>, <code>.str.contains('x')</code>"],
            ["Number of characters", "<code>df['col'].str.len()</code>"],
            ["Join two columns", "<code>df['A'] + ' ' + df['B']</code> or <code>df['A'].str.cat(df['B'], sep='_')</code>"],
          ]))
        )}
      `;
    },
  });

  /* ---- Encoding Categorical Variables for Future Modeling ------------------- */
  // Code, printed output and diagram data in EN_CODE / EN_OUT / EN_GRID were produced
  // by running the code in real pandas, so every picture matches what students see.
  const EN_CODE = {"lb_create": "import pandas as pd\n\ndf = pd.DataFrame({\"Color\": [\"Red\", \"Blue\", \"Green\"]})\n\nprint(df)", "lb_enc": "df[\"Color_Label\"] = pd.factorize(df[\"Color\"])[0]\n\nprint(df)", "oh_create": "df = pd.DataFrame({\"Color\": [\"Red\", \"Blue\", \"Green\"]})\n\nprint(df)", "oh_enc": "dummies = pd.get_dummies(df[\"Color\"], dtype=int)\n\ndf = pd.concat([df, dummies], axis=1)\n\nprint(df)", "oh_drop": "print(pd.get_dummies(df[\"Color\"], dtype=int, drop_first=True))", "or_create": "df = pd.DataFrame({\"Education\": [\"High School\", \"Graduate\", \"Postgraduate\"]})\n\nprint(df)", "or_enc": "order = {\"High School\": 1, \"Graduate\": 2, \"Postgraduate\": 3}\n\ndf[\"Education_Encoded\"] = df[\"Education\"].map(order)\n\nprint(df)", "tg_create": "df = pd.DataFrame({\n    \"City\": [\"Delhi\", \"Mumbai\", \"Chennai\", \"Delhi\", \"Mumbai\", \"Chennai\"],\n    \"Sales\": [4800, 7200, 4400, 5200, 6800, 4600]\n})\n\nprint(df)", "tg_mean": "print(df.groupby(\"City\")[\"Sales\"].mean())", "tg_enc": "df[\"City_Target\"] = df.groupby(\"City\")[\"Sales\"].transform(\"mean\")\n\nprint(df)", "bn_create": "df = pd.DataFrame({\"Category\": [\"A\", \"B\", \"C\"]})\n\n# Step 1: numeric code for every category (1, 2, 3)\ndf[\"Code\"] = pd.factorize(df[\"Category\"])[0] + 1\n\nprint(df)", "bn_enc": "# Step 2: write each code in binary; every bit becomes a column\nbits = int(df[\"Code\"].max()).bit_length()   # 3 needs 2 bits\n\nfor i in range(bits):\n    df[f\"Bit_{i + 1}\"] = (df[\"Code\"] // 2 ** (bits - 1 - i)) % 2\n\nprint(df)", "fq_create": "df = pd.DataFrame({\n    \"City\": [\"Delhi\", \"Mumbai\", \"Mumbai\", \"Chennai\", \"Delhi\",\n             \"Mumbai\", \"Mumbai\", \"Chennai\", \"Delhi\", \"Mumbai\"]\n})\n\nprint(df)", "fq_counts": "print(df[\"City\"].value_counts())", "fq_enc": "df[\"City_Count\"] = df[\"City\"].map(df[\"City\"].value_counts())\n\nprint(df)"};
  const EN_OUT = {"lb_create": "   Color\n0    Red\n1   Blue\n2  Green", "lb_enc": "   Color  Color_Label\n0    Red            0\n1   Blue            1\n2  Green            2", "oh_create": "   Color\n0    Red\n1   Blue\n2  Green", "oh_enc": "   Color  Blue  Green  Red\n0    Red     0      0    1\n1   Blue     1      0    0\n2  Green     0      1    0", "oh_drop": "   Green  Red\n0      0    1\n1      0    0\n2      1    0", "or_create": "      Education\n0   High School\n1      Graduate\n2  Postgraduate", "or_enc": "      Education  Education_Encoded\n0   High School                  1\n1      Graduate                  2\n2  Postgraduate                  3", "tg_create": "      City  Sales\n0    Delhi   4800\n1   Mumbai   7200\n2  Chennai   4400\n3    Delhi   5200\n4   Mumbai   6800\n5  Chennai   4600", "tg_mean": "City\nChennai    4500.0\nDelhi      5000.0\nMumbai     7000.0\nName: Sales, dtype: float64", "tg_enc": "      City  Sales  City_Target\n0    Delhi   4800       5000.0\n1   Mumbai   7200       7000.0\n2  Chennai   4400       4500.0\n3    Delhi   5200       5000.0\n4   Mumbai   6800       7000.0\n5  Chennai   4600       4500.0", "bn_create": "  Category  Code\n0        A     1\n1        B     2\n2        C     3", "bn_enc": "  Category  Code  Bit_1  Bit_2\n0        A     1      0      1\n1        B     2      1      0\n2        C     3      1      1", "fq_create": "      City\n0    Delhi\n1   Mumbai\n2   Mumbai\n3  Chennai\n4    Delhi\n5   Mumbai\n6   Mumbai\n7  Chennai\n8    Delhi\n9   Mumbai", "fq_counts": "City\nMumbai     5\nDelhi      3\nChennai    2\nName: count, dtype: int64", "fq_enc": "      City  City_Count\n0    Delhi           3\n1   Mumbai           5\n2   Mumbai           5\n3  Chennai           2\n4    Delhi           3\n5   Mumbai           5\n6   Mumbai           5\n7  Chennai           2\n8    Delhi           3\n9   Mumbai           5"};
  const EN_GRID = {"lb_create": {"idx": ["0", "1", "2"], "cols": ["Color"], "rows": [["Red"], ["Blue"], ["Green"]]}, "lb_enc": {"idx": ["0", "1", "2"], "cols": ["Color", "Color_Label"], "rows": [["Red", "0"], ["Blue", "1"], ["Green", "2"]]}, "oh_create": {"idx": ["0", "1", "2"], "cols": ["Color"], "rows": [["Red"], ["Blue"], ["Green"]]}, "oh_enc": {"idx": ["0", "1", "2"], "cols": ["Color", "Blue", "Green", "Red"], "rows": [["Red", "0", "0", "1"], ["Blue", "1", "0", "0"], ["Green", "0", "1", "0"]]}, "or_create": {"idx": ["0", "1", "2"], "cols": ["Education"], "rows": [["High School"], ["Graduate"], ["Postgraduate"]]}, "or_enc": {"idx": ["0", "1", "2"], "cols": ["Education", "Education_Encoded"], "rows": [["High School", "1"], ["Graduate", "2"], ["Postgraduate", "3"]]}, "tg_create": {"idx": ["0", "1", "2", "3", "4", "5"], "cols": ["City", "Sales"], "rows": [["Delhi", "4800"], ["Mumbai", "7200"], ["Chennai", "4400"], ["Delhi", "5200"], ["Mumbai", "6800"], ["Chennai", "4600"]]}, "tg_enc": {"idx": ["0", "1", "2", "3", "4", "5"], "cols": ["City", "Sales", "City_Target"], "rows": [["Delhi", "4800", "5000.0"], ["Mumbai", "7200", "7000.0"], ["Chennai", "4400", "4500.0"], ["Delhi", "5200", "5000.0"], ["Mumbai", "6800", "7000.0"], ["Chennai", "4600", "4500.0"]]}, "bn_create": {"idx": ["0", "1", "2"], "cols": ["Category", "Code"], "rows": [["A", "1"], ["B", "2"], ["C", "3"]]}, "bn_enc": {"idx": ["0", "1", "2"], "cols": ["Category", "Code", "Bit_1", "Bit_2"], "rows": [["A", "1", "0", "1"], ["B", "2", "1", "0"], ["C", "3", "1", "1"]]}, "fq_create": {"idx": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], "cols": ["City"], "rows": [["Delhi"], ["Mumbai"], ["Mumbai"], ["Chennai"], ["Delhi"], ["Mumbai"], ["Mumbai"], ["Chennai"], ["Delhi"], ["Mumbai"]]}, "fq_enc": {"idx": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], "cols": ["City", "City_Count"], "rows": [["Delhi", "3"], ["Mumbai", "5"], ["Mumbai", "5"], ["Chennai", "2"], ["Delhi", "3"], ["Mumbai", "5"], ["Mumbai", "5"], ["Chennai", "2"], ["Delhi", "3"], ["Mumbai", "5"]]}};

  const enEx = (key, label) => codeBlock(label || "Code", EN_CODE[key]) + codeBlock("Output", EN_OUT[key]);

  // Diagram: a small table. hlCols tag the columns that were created by the encoding (green tag).
  const enGrid = (key, o) => {
    o = o || {};
    const g = EN_GRID[key], hc = o.hlCols || [], tag = o.tag || "encoded";
    let n = 0;
    const head = g.cols.map((c, j) => `<th>${c}${hc.includes(j) ? `<small class="idx-tag i">${tag}</small>` : ""}</th>`).join("");
    const body = g.rows.map((row, i) => `<tr><th>${g.idx[i]}</th>` + row.map((v, j) => {
      const on = hc.includes(j);
      return `<td class="${on ? "is-sel" : ""}"${on ? ` style="--i:${n++}"` : ""}>${v}</td>`;
    }).join("") + "</tr>").join("");
    return `<div class="idx-grid-wrap"><table class="idx-grid"><thead><tr><th class="idx-corner"></th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
      (o.caption ? `<p class="idx-cap">${o.caption}</p>` : "");
  };

  registerTopic({
    library: "pandas",
    id: "encoding",
    title: "Encoding Categorical Variables for Future Modeling",
    difficulty: "Intermediate",
    summary: "Turn text labels into numbers before modeling: nominal vs ordinal data, and label, one-hot, ordinal, target, binary and frequency encoding in Pandas.",

    visual(panel) {
      panel.classList.add("intro-panel");
      panel.innerHTML = `
        ${srHero("fa-solid fa-hashtag", "Encoding Categorical Variables", "Converting labels and names into numbers, ready for future modeling")}

        ${section("", "Introduction",
          p("In real-world datasets, many features (columns) contain <strong>categorical data</strong>: data represented by labels or names instead of numbers. For example:") +
          srWrap(table(["Column", "Categories"], [
            ["Gender", "Male, Female"],
            ["City", "Delhi, Mumbai, Chennai"],
            ["Education", "High School, Graduate, Postgraduate"],
          ])) +
          p("However, machine learning models and most mathematical algorithms cannot work directly with text or labels. So we need to convert these categorical variables into numeric form. This process is called <strong>encoding</strong>.")
        )}

        ${section("1", "Why encoding is needed",
          srWrap(table(["Reason", "Explanation"], [
            ["Models understand only numbers", "Algorithms perform mathematical operations, not string comparison."],
            ["To maintain relationship / order", "For ordinal categories (like \"Low\", \"Medium\", \"High\"), numbers show ranking."],
            ["To improve accuracy", "Proper encoding helps the model learn meaningful patterns."],
          ]))
        )}

        ${section("2", "Types of categorical variables",
          p("Before encoding, it is important to understand the type of categorical data. The type decides which encoding method is suitable.") +
          sub("(a)", "Nominal variables") +
          p("<strong>Definition:</strong> categories without any order or ranking. Each value is just a name or label.") +
          bullets([
            "Gender → Male, Female",
            "City → Delhi, Mumbai, Kolkata",
            "Color → Red, Green, Blue",
          ]) +
          p("These are treated equally: no category is greater or smaller than another.") +
          sub("(b)", "Ordinal variables") +
          p("<strong>Definition:</strong> categories that have a specific order or ranking.") +
          bullets([
            "Size → Small &lt; Medium &lt; Large",
            "Education → High School &lt; Graduate &lt; Postgraduate",
            "Satisfaction → Poor &lt; Average &lt; Good &lt; Excellent",
          ]) +
          p("These show a natural hierarchy, so the encoding should reflect their order.") +
          srWrap(table(["", "Nominal", "Ordinal"], [
            ["Order between categories", "No", "Yes"],
            ["Example", "Color, City, Gender", "Size, Education, Satisfaction"],
            ["Suitable encodings", "One-hot, binary, frequency, target", "Ordinal (label for simple cases)"],
          ]))
        )}

        ${section("3", "Types of encoding methods",
          p("Different encoding techniques are used depending on whether the variable is nominal or ordinal. Each method below is shown with a small example that you can run in Pandas.")
        )}

        ${section("", "(1) Label encoding",
          p("<strong>Definition:</strong> assigns a unique numeric value (integer) to each category.") +
          enEx("lb_create", "Example dataset") +
          enGrid("lb_create") +
          enEx("lb_enc") +
          enGrid("lb_enc", { hlCols: [1], caption: "<code>Red</code> → 0, <code>Blue</code> → 1, <code>Green</code> → 2. Each category got its own integer (tagged column)." }) +
          p("<strong>Used for:</strong> ordinal or simple nominal data.") +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Not ideal for nominal data</strong> when there is no order, because a model might wrongly assume that 0 &lt; 1 &lt; 2 means a hierarchy (that <code>Green</code> is "bigger" than <code>Red</code>).</p>`) +
          callout("fa-solid fa-lightbulb", `<p><strong>Note:</strong> <code>pd.factorize()</code> numbers the categories in the order they first appear. <code>.astype("category").cat.codes</code> and scikit-learn's <code>LabelEncoder</code> number them in alphabetical order, so the integers would differ.</p>`)
        )}

        ${section("", "(2) One-hot encoding",
          p("<strong>Definition:</strong> creates a separate binary column (0 or 1) for each category.") +
          enEx("oh_create", "Example dataset") +
          enEx("oh_enc") +
          enGrid("oh_enc", { hlCols: [1, 2, 3], caption: "One new column per colour. In every row exactly one column is <code>1</code> (the row's colour); the others are <code>0</code>. Columns appear in alphabetical order." }) +
          bullets([
            "<strong>Used for:</strong> nominal data (no order).",
            "<strong>Advantage:</strong> no order is assumed between categories.",
            "<strong>Disadvantage:</strong> increases the number of columns when there are many categories.",
          ]) +
          sub("", "Dropping one column") +
          p("The columns are not independent: if <code>Green</code> and <code>Red</code> are both 0, the colour must be <code>Blue</code>. Many models only need <em>n − 1</em> columns, which <code>drop_first=True</code> gives.") +
          enEx("oh_drop")
        )}

        ${section("", "(3) Ordinal encoding",
          p("<strong>Definition:</strong> assigns integer values according to the order or ranking of the categories.") +
          enEx("or_create", "Example dataset") +
          enEx("or_enc") +
          enGrid("or_enc", { hlCols: [1], caption: "<code>High School</code> &lt; <code>Graduate</code> &lt; <code>Postgraduate</code> became 1 &lt; 2 &lt; 3, so the order is kept." }) +
          p("<strong>Used for:</strong> ordinal variables (where order matters). It maintains the relationship among categories.") +
          callout("fa-solid fa-lightbulb", `<p><strong>Label vs ordinal encoding:</strong> label encoding gives numbers in whatever order is convenient (first seen, or alphabetical). Ordinal encoding uses the order <em>you</em> define, here through the dictionary <code>order</code>.</p>`)
        )}

        ${section("", "(4) Target encoding",
          p("<strong>Definition:</strong> replaces each category with the average value of the target variable (like average sales, or average score for that category).") +
          enEx("tg_create", "Example dataset (City and Sales)") +
          enGrid("tg_create") +
          p("First, the average Sales of each city:") +
          enEx("tg_mean") +
          p("Now replace every city by its average:") +
          enEx("tg_enc") +
          enGrid("tg_enc", { hlCols: [2], caption: "Both <code>Delhi</code> rows now hold 5000, both <code>Mumbai</code> rows 7000 and both <code>Chennai</code> rows 4500." }) +
          bullets([
            "<strong>Used for:</strong> when the dataset is large and the number of categories is high.",
            "<strong>Disadvantage:</strong> can cause overfitting if not handled carefully.",
          ]) +
          callout("fa-solid fa-triangle-exclamation", `<p><strong>Be careful:</strong> the averages use the target (<code>Sales</code>). Calculate them on the training data only. If the test data is used, information about the answer leaks into the features.</p>`)
        )}

        ${section("", "(5) Binary encoding",
          p("<strong>Definition:</strong> each category is first converted to a numeric label, and then that label is converted to a binary number (0s and 1s). Each bit of the binary code becomes a separate column.") +
          enEx("bn_create", "Step 1: numeric code") +
          enEx("bn_enc", "Step 2: binary code") +
          enGrid("bn_enc", { hlCols: [2, 3], tag: "bit", caption: "<code>A</code> = 1 = <code>01</code>, <code>B</code> = 2 = <code>10</code>, <code>C</code> = 3 = <code>11</code>. The two bits of each code are the two new columns." }) +
          bullets([
            "<strong>Used for:</strong> nominal data with many categories.",
            "<strong>Advantage:</strong> needs far fewer columns than one-hot encoding. For example, 100 categories need only 7 binary columns (2<sup>7</sup> = 128), against 100 one-hot columns.",
          ]) +
          callout("fa-solid fa-circle-info", `<p>The loop above shows how binary encoding works. In larger projects the <code>category_encoders</code> package offers a ready-made <code>BinaryEncoder</code>.</p>`)
        )}

        ${section("", "(6) Frequency (count) encoding",
          p("<strong>Definition:</strong> each category is replaced with the frequency (count) of its appearance in the dataset.") +
          enEx("fq_create", "Example dataset") +
          p("Count how often each city appears:") +
          enEx("fq_counts") +
          p("Replace each city by its count:") +
          enEx("fq_enc") +
          enGrid("fq_enc", { hlCols: [1], tag: "count", caption: "<code>Delhi</code> appears 3 times, <code>Mumbai</code> 5 times and <code>Chennai</code> 2 times, so these numbers replace the names." }) +
          bullets([
            "<strong>Used for:</strong> large categorical features.",
            "<strong>Advantage:</strong> keeps the dataset size small (one column).",
            "<strong>Disadvantage:</strong> may give higher importance to frequent categories.",
          ])
        )}

        ${section("", "Comparison of encoding methods",
          srWrap(table(["Method", "Used for", "Advantage", "Disadvantage"], [
            ["Label", "Ordinal or simple nominal data", "Simple, one column", "May wrongly suggest an order for nominal data"],
            ["One-hot", "Nominal data (no order)", "No order assumed", "Many extra columns when there are many categories"],
            ["Ordinal", "Ordinal data", "Keeps the ranking of categories", "Not suitable for nominal data"],
            ["Target", "Large data with many categories", "One column, uses the target", "Can overfit if not handled carefully"],
            ["Binary", "Nominal data with many categories", "Fewer columns than one-hot", "Individual bits are not easy to interpret"],
            ["Frequency", "Large categorical features", "Keeps the dataset small", "Gives more importance to frequent categories"],
          ]))
        )}

        ${section("", "Summary",
          srWrap(table(["Goal", "Code"], [
            ["Label encoding (order of first appearance)", "<code>pd.factorize(df['col'])[0]</code>"],
            ["One-hot encoding", "<code>pd.get_dummies(df['col'], dtype=int)</code>"],
            ["Ordinal encoding with your own order", "<code>df['col'].map({'Low': 1, 'Medium': 2, 'High': 3})</code>"],
            ["Target encoding", "<code>df.groupby('col')['target'].transform('mean')</code>"],
            ["Frequency encoding", "<code>df['col'].map(df['col'].value_counts())</code>"],
          ]))
        )}
      `;
    },
  });

})();